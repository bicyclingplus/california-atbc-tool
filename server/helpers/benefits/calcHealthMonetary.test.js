import { createRequire } from "module";
import { expect, test } from 'vitest';

import calc_pop_factors from './calcPopFactors.js';
import { _calc } from './calcHealthMonetary.js';

import {
  MongoClient,
  ObjectId
} from 'mongodb';
import dotenv from 'dotenv';

import calcReach from './calcReach.js';
import calcTracts from './calcTracts.js';

dotenv.config();

const require = createRequire(import.meta.url);
const life_expectancy = require('../../data/life_expectancy.json');

test('health output matches R script', async () => {

  const project_id = '68f970810a24061d521af568';

  const client = new MongoClient(process.env.MONGO_URI);

  const project = await client
    .db('bctool')
    .collection('projects')
    .findOne({
      '_id': new ObjectId(project_id),
    });

  const {
    segments,
    intersections,
    userSegments,
    userIntersections,
  } = project.scope;

  const selectedWayIds = segments.map(el => el.properties.edge_uid);
  const selectedIntersectionIds = intersections.map(el => el.properties.node_id);

  const reach = await calcReach(
    selectedWayIds,
    selectedIntersectionIds,
    userSegments,
    userIntersections,
  );

  const tracts = await calcTracts(userSegments, userIntersections, reach);

  // inputs
  const project_time_frame = 1; // project details
  const project_county = "Shasta";
  const daily_bmt = 434; // tool output
  const daily_wmt = 265; // tool output
  const bike_mmet = 31300; // tool output
  const walk_mmet = 74387; // tool output

  const bike_pop_factors = calc_pop_factors(tracts.bike);
  const walk_pop_factors = calc_pop_factors(tracts.walk);

  const result = _calc(
    project_time_frame,
    life_expectancy[project_county],
    daily_bmt,
    daily_wmt,
    bike_mmet,
    walk_mmet,
    bike_pop_factors,
    walk_pop_factors,
  );

  // expect(result.bicycling).toBe(4322425.966358626);
  // expect(result.walking).toBe(8163438.995877898);
  expect(result.total).toBe(862686.6759550909);

}, 20000);
