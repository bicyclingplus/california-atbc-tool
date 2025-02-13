import { createRequire } from "module";
import { MongoClient, ObjectId } from 'mongodb';

import avgProp from './avgProp.js';
import c from '../collector.js';

import {
  BIKE_WEIGHT,
  PED_WEIGHT,
} from './constants.js';

import * as turf from "@turf/turf";

const FEET_PER_KM = 3280.84;

const require = createRequire(import.meta.url);
const distribution = require('../../data/volume_to_miles.json');

const _weight = (mode_distribution, mode_constant, project_length, total_miles) => {
  let mode_average = 0;
  let average_in_proj = 0;

  for(let dist in mode_distribution) {
    mode_average += mode_distribution[dist] * parseFloat(dist);
    const in_project = parseFloat(dist) * mode_constant;
    average_in_proj += mode_distribution[dist] * Math.min(in_project, project_length);
  }

  return average_in_proj > 0 ? mode_average * total_miles / average_in_proj : 0;
};

const _weightBike = (project_length, total_miles) => {
  return _weight(
    distribution.bike,
    BIKE_WEIGHT,
    project_length,
    total_miles
  );
};

const _weightPed = (project_length, total_miles) => {
  return _weight(
    distribution.pedestrian,
    PED_WEIGHT,
    project_length,
    total_miles
  );
};

const _adj_selected_segments_avg_length = async (intersection, selectedWays) => {

  // need to get ways adjacent to selected intersections
  // and intersections adjacent to selected ways
  const client = new MongoClient(process.env.MONGO_URI);

  try {

    const database = client.db('bctool');
    const collection = database.collection('ways');
    const query = {
      "$and": [
        {
          "properties.edge_uid": {
            "$in": selectedWays.map(el => el.properties.edge_uid),
          },
        },
        {
          "$or": [
            {
              "properties.source": intersection.properties.node_id,
            },
            {
              "properties.target": intersection.properties.node_id,
            },
          ],
        },
      ],
    };

    const adjacentSelectedWays = await collection.find(query).toArray();

    const totalLength = adjacentSelectedWays.reduce((a, b) => {
      return a + turf.length(b);
    }, 0); // km

    // return average length
    return adjacentSelectedWays.length > 0 ? (totalLength * FEET_PER_KM) / adjacentSelectedWays.length : 0; // ft

  }
  finally {
    await client.close();
  }
};

const _calcPedDemand = async (
  existingTravel,
  selectedIntersections,
  userIntersections,
  selectedWays,
  userWays,
  projectLength,
  projectYear) => {

    // Grab the averages
    // null if all were null

    const avgDemand = avgProp(selectedIntersections, 'ped_demand', projectYear);
    const avgPop = avgProp(selectedIntersections, 'population');
    const avgJobs = avgProp(selectedIntersections, 'jobs');

    // CALCULATE PEDESTRIAN DEMAND FOR USER SELECTED INTERSECTIONS
    // each selected intersection has some prediction of pedestrian demand,
    // we add these to the total here
    for(let intersection of selectedIntersections) {

      // each could be null or number
      // number could be zero
      const {
        ped_demand,
        population,
        jobs,
      } = intersection.properties;

      // fall back to averages if null
      let d;

      if(projectYear) {
        d = ped_demand[projectYear] !== null ? ped_demand[projectYear] : avgDemand;
      }
      else {
        d = ped_demand !== null ? ped_demand : avgDemand;
      }

      const p = population !== null ? population : avgPop;
      const j = jobs !== null ? jobs : avgJobs;

      const adjacentSelectedWaysAvgLength = await _adj_selected_segments_avg_length(
        intersection, selectedWays);

      // demand calcs all based on miles so convert feet -> miles here
      const travel = d * (adjacentSelectedWaysAvgLength / 5280);

      // could still be null if avg was null
      if(d !== null) {
        existingTravel.demand.pedestrian.mean += d;
        existingTravel.miles.pedestrian.mean += travel;

        // no div by zero
        if(p !== null && p !== 0) {
          existingTravel.capita.pedestrian.mean += travel / p;
        }

        if(j !== null && j !== 0) {
          existingTravel.jobs.pedestrian.mean += travel / j;
        }
      }

      c.put('travel', 'intersections', [
        'network',
        ped_demand,
        population,
        jobs,
        d,
        p,
        j,
        1,
        d,
        d !== null && p !== null && p !== 0 ? d / p : null,
        d !== null && j !== null && j !== 0 ? d / j : null,
      ]);
    }

    // CALCULATE PEDESTRIAN DEMAND FOR USER DEFINED INTERSECTIONS
    // user defined intersections won't have the necessary properties, so we use averages
    // since they're all the same no need to loop through, just multiply by the
    // number of user defined intersections

    for(let userInt of userIntersections) {
      const adjUserWay = userWays.find(w => w.properties.id === userInt.properties.parent);

      if(!adjUserWay) {
        continue;
      }

      let length = turf.length(adjUserWay) * FEET_PER_KM; // ft

      if(!adjUserWay.properties.one_way_ca) {
        length *= 2;
      }

      const travel = avgDemand * (length / 5280); // mi

      if(avgDemand !== null) {

        existingTravel.miles.pedestrian.mean += travel;

        if(avgPop !== null && avgPop !== 0) {
          existingTravel.capita.pedestrian.mean += travel / avgPop;
        }

        if(avgJobs !== null && avgJobs !== 0) {
          existingTravel.capita.pedestrian.mean += travel / avgJobs;
        }
      }
    }

    // c.put('travel', 'intersections', [
    //   'user',
    //   '',
    //   '',
    //   '',
    //   avgDemand,
    //   avgPop,
    //   avgJobs,
    //   userIntersections.length,
    //   avgDemand !== null ? userIntDemand : null,
    //   avgDemand !== null && avgPop !== null && avgPop !== 0 ? userIntDemandCapita : null,
    //   avgDemand !== null && avgJobs !== null && avgJobs !== 0 ? userIntDemandJobs : null,
    // ]);

    c.put('travel', 'existing', [
      'walking',
      existingTravel.miles.pedestrian.mean,
      existingTravel.capita.pedestrian.mean,
      existingTravel.jobs.pedestrian.mean,
    ])

    // then the pedestrian demand is weighted by the project length and
    // number of intersections
    const projectLengthMiles = projectLength / 5280;
    const numIntersections = selectedIntersections.length + userIntersections.length;

    if(numIntersections > 0) {

      existingTravel.miles.pedestrian.mean = _weightPed(
        projectLengthMiles, existingTravel.miles.pedestrian.mean);

      existingTravel.capita.pedestrian.mean = _weightPed(
        projectLengthMiles, existingTravel.capita.pedestrian.mean);

      existingTravel.jobs.pedestrian.mean = _weightPed(
        projectLengthMiles, existingTravel.jobs.pedestrian.mean);
    }

    c.append('travel', 'existing', [
      existingTravel.miles.pedestrian.mean,
      existingTravel.capita.pedestrian.mean,
      existingTravel.jobs.pedestrian.mean,
    ])

    return existingTravel;
}

const _calcBikeDemand = (
  existingTravel,
  selectedWays,
  userWays,
  projectLength,
  projectYear) => {

    // AVERAGE NEEDED PROPERTIES FOR USER SELECTED WAYS
    // Avg lower/mean/upper used for user defined ways
    // Avg pops/jobs used for user selected ways that are missing
    // these properties as well as user defined ways
    const avgDemand = avgProp(selectedWays, 'bicyclist_demand', projectYear);
    const avgPop = avgProp(selectedWays, 'population');
    const avgJobs = avgProp(selectedWays, 'jobs');

    // CALCULATE BIKE DEMAND PER USER SELECTED WAY
    for(let way of selectedWays) {

      const {
        bicyclist_demand,
        population,
        jobs,
      } = way.properties;

      const length = turf.length(way) * FEET_PER_KM; // ft

      let d;

      if(projectYear) {
        d = bicyclist_demand[projectYear] !== null ? bicyclist_demand[projectYear] : avgDemand;
      }
      else {
        d = bicyclist_demand !== null ? bicyclist_demand : avgDemand;
      }

      const p = population !== null ? population : avgPop;
      const j = jobs !== null ? jobs : avgJobs;

      // demand calcs all based on miles so convert feet -> miles here
      const travel = d * (length / 5280);

      if(d !== null) {

        existingTravel.demand.bike.mean += d;
        existingTravel.miles.bike.mean += travel;

        // no div by zero
        if(p !== null && p !== 0) {
          existingTravel.capita.bike.mean += travel / p;
        }

        if(j !== null && j !== 0) {
          existingTravel.jobs.bike.mean += travel / j;
        }
      }

      c.put('travel', 'ways', [
        'network',
        way.properties.bicyclist_demand,
        way.properties.population,
        way.properties.jobs,
        d,
        p,
        j,
        length / 5280,
        d !== null ? travel : null,
        d !== null && p !== null && p !== 0 ? travel / p : null,
        d !== null && j !== null && j !== 0 ? travel / j : null,
      ]);
    }

    // CALCULATE BIKE DEMAND PER USER DEFINED WAY
    for(let way of userWays) {

      let length = turf.length(way) * FEET_PER_KM; // feet

      if(!way.properties.one_way_ca) {
        length *= 2;
      }

      // demand calcs all based on miles so convert feet -> miles here
      const travel = avgDemand * (length / 5280);

      // use averages for everything here because user defined ways
      // won't have any of these properties
      if(avgDemand !== null) {

        existingTravel.miles.bike.mean += travel;

        // no div by zero
        if(avgPop !== null && avgPop !== 0) {
          existingTravel.capita.bike.mean += travel / avgPop;
        }

        if(avgJobs !== null && avgJobs !== 0) {
          existingTravel.jobs.bike.mean += travel / avgJobs;
        }
      }

      c.put('travel', 'ways', [
        'user',
        '',
        '',
        '',
        avgDemand,
        avgPop,
        avgJobs,
        length / 5280,
        avgDemand !== null ? travel : null,
        avgDemand !== null && avgPop !== null && avgPop !== 0 ? travel / avgPop : null,
        avgDemand !== null && avgJobs !== null && avgJobs !== 0 ? travel / avgJobs : null,
      ])
    }

    c.put('travel', 'existing', [
      'bicycling',
      existingTravel.miles.bike.mean,
      existingTravel.capita.bike.mean,
      existingTravel.jobs.bike.mean,
    ])

    // then the bike demand is weighted by the project length and
    // number of ways
    const projectLengthMiles = projectLength / 5280;
    const numWays = selectedWays.length + userWays.length;

    if(numWays > 0) {

      existingTravel.miles.bike.mean = _weightBike(
        projectLengthMiles, existingTravel.miles.bike.mean);

      existingTravel.capita.bike.mean = _weightBike(
        projectLengthMiles, existingTravel.capita.bike.mean);

      existingTravel.jobs.bike.mean = _weightBike(
        projectLengthMiles, existingTravel.jobs.bike.mean);
    }

    c.append('travel', 'existing', [
      existingTravel.miles.bike.mean,
      existingTravel.capita.bike.mean,
      existingTravel.jobs.bike.mean,
    ])

    return existingTravel;

}

const calcDemand = async (
  selectedWays,
  userWays,
  selectedIntersections,
  userIntersections,
  projectLength,
  projectYear=null) => {

  const existingTravel = {};

  const columns = [
    'demand',
    'miles',
    'capita',
    'jobs',
  ];

  const modes = [
    'bike',
    'pedestrian',
  ];

  for(let column of columns) {
    existingTravel[column] = {};
    for(let mode of modes) {
      existingTravel[column][mode] = {
        mean: 0,
      }
    }
  }

  _calcBikeDemand(
    existingTravel,
    selectedWays,
    userWays,
    projectLength,
    projectYear
  );

  await _calcPedDemand(
    existingTravel,
    selectedIntersections,
    userIntersections,
    selectedWays,
    userWays,
    projectLength,
    projectYear
  );

  return existingTravel;
}

export {
  calcDemand as default,
};
