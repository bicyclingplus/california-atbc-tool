import { createRequire } from "module";
import { expect, test } from 'vitest';

import calc_pop_factors from './calcPopFactors.js';
import calc from './calcHealthMonetary.js';

const require = createRequire(import.meta.url);
const life_expectancy = require('../../data/life_expectancy.json');

test('health output matches R script', () => {

	// inputs
	const project_time_frame = 20; // project details
	const project_county = "Shasta";
	const daily_bmt = 434; // tool output
	const daily_wmt = 265; // tool output
	const bike_mmet = 442390; // tool output
	const walk_mmet = 1051377; // tool output

	// hardcoded for now, need to get a list of GEO_IDs
	// using a buffer and a geospatial query
	// bike uses a 1.00 mile buffer
	// walk uses a 0.25 mile buffer
	const bike_tracts = [
	  "06089010300",
	  "06089010900",
	  "06089011300",
	  "06089010200",
	  "06089010703",
	  "06089010803",
	  "06089011401",
	  "06089011209",
	  "06089010804",
	  "06089010805",
	  "06089011403",
	];

	const walk_tracts = [
	  "06089010300",
	  "06089011300",
	  "06089010803",
	];

	const bike_pop_factors = calc_pop_factors(bike_tracts);
	const walk_pop_factors = calc_pop_factors(walk_tracts);

	const result = calc(
		project_time_frame,
		life_expectancy[project_county],
		daily_bmt,
		daily_wmt,
		bike_mmet,
		walk_mmet,
		bike_pop_factors,
		walk_pop_factors,
	);

	expect(result.bicycling).toBe(4322425.966358626);
	expect(result.walking).toBe(8163438.995877898);
	expect(result.total).toBe(12485864.962236524);
});
