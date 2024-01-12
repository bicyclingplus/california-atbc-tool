// Code below taken from https://github.com/gautama-bharadwaj/volume_to_miles/blob/master/miles.py#L4
// and ported to JS by me
// JSON file required below also taken from the same repo
// Input of 1.8, 10, 1234 should yield output of 258.42, verified

// Fixes to uncomment (left to compare with old numbers)
// remove floors in gautama's function
// remove parseint in way/int props
// mispelled prop Jobs -> jobs in bike selected ways
// change bike weighting to not just double?

import avgProp from './avgProp.js';
import c from '../collector.js';
import { MongoClient, ObjectId } from 'mongodb';
import util from 'util';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require('../../data/volume_to_miles.json');

const _weightDemand = (
  proj_distance,
  proj_units,
  proj_unselected_units,
  proj_volume,
  miles_distribution) => {

	// Calculating the average distance per intersection for the project
	const proj_distance_per_unit = proj_distance/proj_units;

	// Convert miles into intersections
  const unit_distribution = {};
  let distribution_den = 0;

  for(let dist in miles_distribution) {

    unit_distribution[dist] = parseFloat(dist)/proj_distance_per_unit;

  	// If on average people walk more than the number of intersections in the project,
  	// then consider they have walked through all of the project intersections
  	if(unit_distribution[dist] > proj_units) {
  		unit_distribution[dist] = proj_units;
  	}

  	// Distribution of people walking through intersections
  	distribution_den += unit_distribution[dist]*miles_distribution[dist];
  }

  // adjust based on percentage of adjacent intersections/ways selected
  const in_project = proj_units / (proj_units + proj_unselected_units);
  console.log(in_project);
  distribution_den = (distribution_den * in_project) + (1 - in_project);

  const people = proj_volume/distribution_den;

  // Calculating the distance walked in the project
  let distance = 0;

  for(let dist in miles_distribution) {
  	if(parseFloat(dist)>proj_distance) {
  		distance += proj_distance*miles_distribution[dist]*people;
  	}
  	else {
  		distance += parseFloat(dist)*miles_distribution[dist]*people;
  	}
  }

  return distance;
};

const _calcPedDemand = (
  existingTravel,
  selectedIntersections,
  userIntersections,
  adjacentUnselectedIntersections,
  projectLength) => {

    // Grab the averages
    const avgDemand = avgProp(selectedIntersections, 'ped_demand');
    const avgPop = avgProp(selectedIntersections, 'population');
    const avgJobs = avgProp(selectedIntersections, 'jobs');

    // CALCULATE PEDESTRIAN DEMAND FOR USER SELECTED INTERSECTIONS
    // each selected intersection has some prediction of pedestrian demand,
    // we add these to the total here
    for(let intersection of [...selectedIntersections, ...adjacentUnselectedIntersections]) {

      const ped_demand = parseInt(intersection.properties.ped_demand)

      const {
        // ped_demand,
        population,
        jobs,
      } = intersection.properties;

      const d = ped_demand ? ped_demand : avgDemand;
      const p = population ? population : avgPop;
      const j = jobs ? jobs : avgJobs;

      existingTravel.miles.pedestrian.mean += d;
      existingTravel.capita.pedestrian.mean += d / p;
      existingTravel.jobs.pedestrian.mean += d / j;

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
        d / p,
        d / j,
      ]);
    }

    // CALCULATE PEDESTRIAN DEMAND FOR USER DEFINED INTERSECTIONS
    // user defined intersections won't have the necessary properties, so we use averages
    // since they're all the same no need to loop through, just multiply by the
    // number of user defined intersections
    if(userIntersections.length) {
      const userIntDemand = avgDemand * userIntersections.length;
      const userIntDemandCapita = userIntDemand / avgPop;
      const userIntDemandJobs = userIntDemand / avgJobs;

      existingTravel.miles.pedestrian.mean += userIntDemand;
      existingTravel.capita.pedestrian.mean += userIntDemandCapita;
      existingTravel.jobs.pedestrian.mean += userIntDemandJobs;

      c.put('travel', 'intersections', [
        'user',
        '',
        '',
        '',
        avgDemand,
        avgPop,
        avgJobs,
        userIntersections.length,
        userIntDemand,
        userIntDemandCapita,
        userIntDemandJobs,
      ]);
    }

    c.put('travel', 'existing', [
      'walking',
      existingTravel.miles.pedestrian.mean,
      existingTravel.capita.pedestrian.mean,
      existingTravel.jobs.pedestrian.mean,
    ])

    // then the pedestrian demand is weighted by the project length and
    // number of intersections
    let projectLengthMiles = projectLength / 5280;
    let numIntersections = selectedIntersections.length + userIntersections.length;

    if(numIntersections > 0) {

      existingTravel.miles.pedestrian.mean = _weightDemand(
        projectLengthMiles,
        numIntersections,
        adjacentUnselectedIntersections.length,
        existingTravel.miles.pedestrian.mean,
        config.pedestrian
      );

      existingTravel.capita.pedestrian.mean = _weightDemand(
        projectLengthMiles,
        numIntersections,
        adjacentUnselectedIntersections.length,
        existingTravel.capita.pedestrian.mean,
        config.pedestrian
      );

      existingTravel.jobs.pedestrian.mean = _weightDemand(
        projectLengthMiles,
        numIntersections,
        adjacentUnselectedIntersections.length,
        existingTravel.jobs.pedestrian.mean,
        config.pedestrian);
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
  adjacentUnselectedWays,
  projectLength) => {

    // AVERAGE NEEDED PROPERTIES FOR USER SELECTED WAYS
    // Avg lower/mean/upper used for user defined ways
    // Avg pops/jobs used for user selected ways that are missing
    // these properties as well as user defined ways
    const avgDemand = avgProp(selectedWays, 'bicyclist_demand');
    const avgPop = avgProp(selectedWays, 'population');
    const avgJobs = avgProp(selectedWays, 'jobs');

    // CALCULATE BIKE DEMAND PER USER SELECTED WAY
    for(let way of [...selectedWays, ...adjacentUnselectedWays]) {

      const bicyclist_demand = parseInt(way.properties.bicyclist_demand);

      const {
        // bicyclist_demand,
        population,
        jobs,
        length,
      } = way.properties;

      const d = bicyclist_demand ? bicyclist_demand : avgDemand;
      const p = population ? population : avgPop;
      // const j = jobs ? jobs : avgJobs;
      const j = false ? jobs : avgJobs;

      // demand calcs all based on miles so convert feet -> miles here
      const travel = d * (length / 5280);

      existingTravel.miles.bike.mean += travel;
      existingTravel.capita.bike.mean += travel / p;
      existingTravel.jobs.bike.mean += travel / j;

      c.put('travel', 'ways', [
        'network',
        way.properties.bicyclist_demand,
        way.properties.population,
        way.properties.jobs,
        d,
        p,
        j,
        length / 5280,
        travel,
        travel / p,
        travel / j,
      ]);
    }

    // CALCULATE BIKE DEMAND PER USER DEFINED WAY
    for(let way of userWays) {

      const { length } = way.properties;

      // demand calcs all based on miles so convert feet -> miles here
      const travel = avgDemand * (length / 5280);

      // use averages for everything here because user defined ways
      // won't have any of these properties
      existingTravel.miles.bike.mean = travel;
      existingTravel.capita.bike.mean = travel / avgPop;
      existingTravel.jobs.bike.mean = travel / avgJobs;

      c.put('travel', 'ways', [
        'user',
        '',
        '',
        '',
        avgDemand,
        avgPop,
        avgJobs,
        length / 5280,
        travel,
        travel / avgPop,
        travel / avgJobs,
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
    let projectLengthMiles = projectLength / 5280;
    let numWays = selectedWays.length + userWays.length;

    if(numWays > 0) {

      existingTravel.miles.bike.mean = _weightDemand(
        projectLengthMiles,
        numWays,
        adjacentUnselectedWays.length,
        existingTravel.miles.bike.mean,
        config.bike
      );

      existingTravel.capita.bike.mean = _weightDemand(
        projectLengthMiles,
        numWays,
        adjacentUnselectedWays.length,
        existingTravel.capita.bike.mean,
        config.bike
      );

      existingTravel.jobs.bike.mean = _weightDemand(
        projectLengthMiles,
        numWays,
        adjacentUnselectedWays.length,
        existingTravel.jobs.bike.mean,
        config.bike);
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
  projectLength) => {

	let existingTravel = {
      "miles": {
        "bike": {
          'mean': 0,
        },
        "pedestrian": {
          'mean': 0,
        }
      },
      "capita":  {
        "bike": {
          'mean': 0,
        },
        "pedestrian": {
          'mean': 0,
        }
      },
      "jobs":  {
        "bike": {
          'mean': 0,
        },
        "pedestrian": {
          'mean': 0,
        }
      },
    };

    // need to get ways adjacent to selected intersections
    // and intersections adjacent to selected ways

    // demand calc functions then need to be refactored to
    // use selected AND adjacent ways/intersections

    // then the weighting function will need to use the fraction
    // of intersections selected out of intersections adjacent to
    // selected ways

    // or the fraction of ways selected out of ways adjacent to
    // selected intersections
    const client = new MongoClient(process.env.MONGO_URI);
    let adjacentUnselectedIntersections;
    let adjacentUnselectedWays;

    try {

      const database = client.db('bctool');

      let collection;
      let query;
      let node_ids;

      // lookup adjacent intersections and add to array
      collection = database.collection('intersections');
      node_ids = [];
      for(let way of selectedWays) {
        if(way.properties.source) {
          node_ids.push(way.properties.source);
        }
        if(way.properties.target) {
          node_ids.push(way.properties.target);
        }
      }

      query = {
        "$and": [
          {
            "properties.node_id": {
              "$in": [...new Set(node_ids)],
            },
          },
          {
            "properties.node_id": {
              "$nin": selectedIntersections.map(el => el.properties.node_id),
            },
          },
        ],
      };

      adjacentUnselectedIntersections = await collection.find(query).toArray();

      // lookup adjacent ways and add to array
      collection = database.collection('ways');

      node_ids = selectedIntersections.map(el => el.properties.node_id);

      query = {
        "$and": [
          {
            "properties.edge_uid": {
              "$nin": selectedWays.map(el => el.properties.edge_uid),
            },
          },
          {
            "$or": [
              {
                "properties.source": {
                  "$in": node_ids,
                },
              },
              {
                "properties.target": {
                  "$in": node_ids,
                },
              },
            ],
          },
        ],
      };

      adjacentUnselectedWays = await collection.find(query).toArray();
    }
    finally {
      await client.close();
    }

    _calcBikeDemand(
      existingTravel,
      selectedWays,
      userWays,
      adjacentUnselectedWays,
      projectLength);

    _calcPedDemand(
      existingTravel,
      selectedIntersections,
      userIntersections,
      adjacentUnselectedIntersections,
      projectLength);

    return existingTravel;
}

export default calcDemand;
