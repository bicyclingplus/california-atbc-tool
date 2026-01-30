import { createRequire } from "module";

import calcEmissionsMonetary from './calcEmissionsMonetary.js';
import calcHealthMonetary from './calcHealthMonetary.js';
import calcSafetyMonetary from './calcSafetyMonetary.js';
import calcTracts from './calcTracts.js';
import calcPopFactors from './calcPopFactors.js';

import util from 'util';

const require = createRequire(import.meta.url);
const life_expectancy = require('../../data/life_expectancy.json');

const calcMonetary = async (
  year,
  timeframe,
  county,
  userWays,
  userIntersections,
  reach,
  benefits,
) => {

  const monetary = {};

  monetary.emissions = calcEmissionsMonetary(
    year,
    timeframe,
    benefits.emissions,
  );

  const county_life_expectancy = life_expectancy[county];
  const tracts = await calcTracts(userWays, userIntersections, reach);
  const bike_pop_factors = calcPopFactors(tracts.bike);
  const walk_pop_factors = calcPopFactors(tracts.walk);

  monetary.health = calcHealthMonetary(
    timeframe,
    county_life_expectancy,
    benefits,
    bike_pop_factors,
    walk_pop_factors,
  );

  monetary.safety = calcSafetyMonetary(
    timeframe,
    county_life_expectancy,
    benefits.safety,
    bike_pop_factors,
    walk_pop_factors,
  );

  // console.log(util.inspect(monetary.safety, { depth: null, colors: true }));

  return monetary;
};

export default calcMonetary;
