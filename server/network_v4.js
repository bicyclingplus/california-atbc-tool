import fs from 'fs';
import path from 'path';
import tqdm from 'tqdm';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { MongoClient } from 'mongodb';
import c from './helpers/collector.js';
import calcProjectLength from './helpers/benefits/calcProjectLength.js';
import calcDemand from './helpers/benefits/calcDemand.js';
import calcTravel, { _calc } from './helpers/benefits/calcTravel.js';
import calcSafetyQuantitative from './helpers/benefits/calcSafetyQuantitative.js';
import {
  MODES,
  OUTCOMES,
  LOCATION_TYPES,
  ESTIMATES,
  COLUMNS,
} from './helpers/benefits/constants.js';
import 'dotenv/config';

c.off(); // disable debugging
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('bctool');

const emptySafety = {};

for(let mode of MODES) {
  emptySafety[mode] = {};

  for(let item of [...OUTCOMES, 'years']) {

    emptySafety[mode][item] = {}

    for(let location_type of LOCATION_TYPES) {
      emptySafety[mode][item][location_type] = 0;
    }
  }
}

const MIN_YEAR = 2019;
const MAX_YEAR = 2023;

const base_path = path.join(
  '/',
  'home',
  'matthew',
  'repos',
  'caltrans-bc-tool',
  'data_transform',
  'network_v4',
);

const current = '2024_12_11';
const input_path = path.join(base_path, 'input', current);
const output_path = path.join(base_path, 'output', current);

const lookup_segment = async (segmentId) => {
  const segments = db.collection('ways');
  const query  = {
    'properties.edge_uid': segmentId,
  };
  return await segments.findOne(query);
}

const lookup_segments = async (segmentIds) => {
  const segments = [];
  for(const segmentId of segmentIds) {
    segments.push(await lookup_segment(segmentId));
  }
  return segments;
};

const lookup_intersection = async (intersectionId) => {
  const intersections = db.collection('intersections');
  const query  = {
    'properties.node_id': intersectionId,
  };
  return await intersections.findOne(query);
}

const lookup_intersections = async (intersectionIds) => {
  const intersections = [];
  for(const intersectionId of intersectionIds) {
    intersections.push(await lookup_intersection(intersectionId));
  }
  return intersections;
};

const load_project_data = () => {
  const projectData = {};

  const projectPath = path.join(input_path, 'projects.csv');
  const projects = parse(fs.readFileSync(projectPath).toString()).slice(1);

  for(const project of projects) {
    projectData[project[1]] = {
      segments: [],
      intersections: [],
      infrastructure: {},
    };
  }

  const segmentPath = path.join(input_path, 'segments.csv');
  const segments = parse(fs.readFileSync(segmentPath).toString()).slice(1);

  for(const segment of segments) {
    projectData[segment[0]].segments.push(parseInt(segment[1]));
  }

  const intersectionsPath = path.join(input_path, 'intersections.csv');
  const intersections = parse(fs.readFileSync(intersectionsPath).toString()).slice(1);

  for(const intersection of intersections) {
    projectData[intersection[0]].intersections.push(parseInt(intersection[1]));
  }

  const infrastructurePath = path.join(output_path, 'infrastructure.csv');
  const infrastructure = parse(fs.readFileSync(infrastructurePath).toString()).slice(1);

  for(const element of infrastructure) {
    projectData[element[0]].infrastructure[element[1]] = {
      new: parseFloat(element[2]),
      upgrade: parseFloat(element[3]),
      retrofit: parseFloat(element[4]),
    }
  }
  return projectData;
}

const projectData = load_project_data();

// headers
const travelOutput = [[
  'project_id',
  'project_year',

  'bike_demand_existing',

  'bike_demand_projected_lower',
  'bike_demand_projected_mean',
  'bike_demand_projected_upper',

  'bike_miles_traveled_existing',

  'bike_miles_traveled_projected_lower',
  'bike_miles_traveled_projected_mean',
  'bike_miles_traveled_projected_upper',

  'ped_demand_existing',

  'ped_demand_projected_lower',
  'ped_demand_projected_mean',
  'ped_demand_projected_upper',

  'ped_miles_traveled_existing',

  'ped_miles_traveled_projected_lower',
  'ped_miles_traveled_projected_mean',
  'ped_miles_traveled_projected_upper',
]];

const safetyHeaders = [
  'project_id',
  'project_year',
];

for(let column of COLUMNS) {
  for(let mode of MODES) {
    for(let outcome of OUTCOMES) {
      safetyHeaders.push([
        column,
        'before',
        mode,
        outcome,
      ].join('_'))
    }
  }
}

for(let column of COLUMNS) {
  for(let calcType of ['after', 'change']) {
    for(let mode of MODES) {
      for(let outcome of OUTCOMES) {
        for(let estimate of ESTIMATES) {
          safetyHeaders.push([
            column,
            calcType,
            mode,
            outcome,
            estimate,
          ].join('_'))
        }
      }
    }
  }
}

const safetyOutput = [safetyHeaders];

for(const projectId of tqdm(Object.keys(projectData))) {
  const project = projectData[projectId];

  // NOTE
  // originally the length for segments was calculated by the frontend
  // in FEET and added to the properties
  //
  // at some point the length was added directly to the segments but
  // was in MILES
  //
  // normally, the segments saved in the project would have had the frontend
  // generated numbers, however we're looking the segments up directly
  // here, so they will be in miles. we need to convert to FEET as that's
  // what the benefits calculations expect
  //
  // NOTE
  // we filter here because one of the projects has an invalid
  // segment edge_uid
  // 2e17d626-3e34-4372-8fba-fd1974c369e1
  // 52933049
  // so it's either drop this project, or ignore the invalid segment

  // const segments = (await lookup_segments(project.segments))
  //   .filter(el => el)
  //   .map(el => {
  //     el.properties.length = el.properties.length * 5280;
  //     return el;
  //   });

  const segments = (await lookup_segments(project.segments))
    .filter(el => el);

  const intersections = await lookup_intersections(project.intersections);

  const userSegments = [];
  const userIntersections = [];

  const projectLength = calcProjectLength(segments, userSegments);
  const numIntersections = intersections.length + userIntersections.length;

  for(let projectYear = MIN_YEAR; projectYear <= MAX_YEAR; projectYear++) {
    const existingTravel = await calcDemand(
      segments,
      userSegments,
      intersections,
      userIntersections,
      projectLength,
      projectYear,
    );

    const projectedDemand = _calc(
      project.infrastructure,
      existingTravel.demand,
      projectLength,
      numIntersections
    );

    const projectedTravel = calcTravel(
      project.infrastructure,
      existingTravel,
      projectLength,
      numIntersections
    );

    const safetyQuantitative = calcSafetyQuantitative(
      segments,
      intersections,
      project.infrastructure,
      projectLength,
      numIntersections,
      emptySafety, // not provided, passing empty object
      20, // not provided, assuming the default
    );

    travelOutput.push([
      projectId,
      projectYear,

      existingTravel.demand.bike.mean,

      projectedDemand.bike.projected.lower,
      projectedDemand.bike.projected.mean,
      projectedDemand.bike.projected.upper,

      projectedTravel.miles.bike.existing.mean,

      projectedTravel.miles.bike.projected.lower,
      projectedTravel.miles.bike.projected.mean,
      projectedTravel.miles.bike.projected.upper,

      existingTravel.demand.pedestrian.mean,

      projectedDemand.pedestrian.projected.lower,
      projectedDemand.pedestrian.projected.mean,
      projectedDemand.pedestrian.projected.upper,

      projectedTravel.miles.pedestrian.existing.mean,

      projectedTravel.miles.pedestrian.projected.lower,
      projectedTravel.miles.pedestrian.projected.mean,
      projectedTravel.miles.pedestrian.projected.upper,
    ]);

    const currentSafetyOutput = [
      projectId,
      projectYear,
    ];

    // safety, capita, jobs
    // change, before, after
    // mode
    // outcome - before
    // estimate - after, change

    for(let column of COLUMNS) {
      for(let mode of MODES) {
        for(let outcome of OUTCOMES) {
          currentSafetyOutput.push(safetyQuantitative[column]['before'][mode][outcome])
        }
      }
    }

    for(let column of COLUMNS) {
      for(let calcType of ['after', 'change']) {
        for(let mode of MODES) {
          for(let outcome of OUTCOMES) {
            for(let estimate of ESTIMATES) {
              currentSafetyOutput.push(safetyQuantitative[column][calcType][mode][outcome][estimate])
            }
          }
        }
      }
    }

    safetyOutput.push(currentSafetyOutput);
  }
}

const travelOutputPath = path.join(output_path, 'network_v4_projects_travel.csv');
fs.writeFileSync(travelOutputPath, stringify(travelOutput));

const safetyOutputPath = path.join(output_path, 'network_v4_projects_safety.csv');
fs.writeFileSync(safetyOutputPath, stringify(safetyOutput));

await client.close();
