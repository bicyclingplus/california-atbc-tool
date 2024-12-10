// compare output of old network with output of new network
// difference is the new network has bike/ped demand values broken down by project year
// for initial analysis, the new network only covers two regions rather than the entire state
// see debug/travel

// need project_id
// need to lookup all segments by id
// need to lookup all intersections by id
// seems no project has user segments/intersections so those can be empty array
// need infrastructure in same format

// then we should be able to use the same code

// just need to modify the run for the new network to use
// different collections in mongo and do the project year lookup
// what is the project year? is it the same for all projects?

// load project data from CSVs
// for each project
// get array of segments from mongo by id
// usersegments empty array
// get array of intersections from mongo by id
// userintersections empty array
// need to build infrastructure object

// turn off debugging
// capture return value of calcTravel
// add rows to output array

// update calcDemand to have a year argument
// update calcTravel to have a year argument
// loop over these two calls for year 2019 to 2023

// write out CSV

/*

const project_length = calcProjectLength(segments, userSegments);
const num_intersections = intersections.length + userIntersections.length;

const weighted_existing_travel = await calcDemand(
  segments,
  userSegments,
  intersections,
  userIntersections,
  project_length
);

calcTravel(
  infrastructure,
  weighted_existing_travel,
  project_length,
  num_intersections
);

*/
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { MongoClient } from 'mongodb';
import c from './helpers/collector.js';
import calcProjectLength from './helpers/benefits/calcProjectLength.js';
import 'dotenv/config';

c.off(); // disable debugging
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('bctool');

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

  const base_path = path.join(
    '/',
    'home',
    'matthew',
    'repos',
    'caltrans-bc-tool',
    'data_transform',
    'network_v4',
  );

  const input_path = path.join(base_path, 'input');
  const output_path = path.join(base_path, 'output');

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


///////////////////////////////////////////////////////////////////////////////////////////////////


const projectData = load_project_data();

for(const projectId in projectData) {
  const project = projectData[projectId];
  const segments = await lookup_segments(project.segments);
  const intersections = await lookup_intersections(project.intersections);

  const userSegments = [];
  const userIntersections = [];

  const project_length = calcProjectLength(segments, userSegments);
  const num_intersections = intersections.length + userIntersections.length;

  console.log(project_length);
  process.exit();
}
