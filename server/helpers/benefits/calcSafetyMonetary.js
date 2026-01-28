import { createRequire } from "module";

import {
  DISCOUNT_RATE,
  VALUE_STATISTICAL_LIFE,
} from './constants.js';

import calc_pop_factors from './calcPopFactors.js';

const require = createRequire(import.meta.url);
const life_expectancy = require('../../data/life_expectancy.json');
const bike_ped_burden = require('../../data/bike_ped_burden.json');

const _calc_injuries_monetary = () => {};

const _calc_fatalities_monetary = () => {

};

const calc = (
  project_time_frame,
  project_county,
  bike_injuries,
  walk_injuries,
  bike_fatalities,
  walk_fatalities,
  bike_tracts,
  walk_tracts,
) => {

  const county_life_expectancy = life_expectancy[project_county];

  const disc_factor = 0;

  // population factors
  // TODO pass this in so it's only calc'd once
  const bike_pop_factors = calc_pop_factors(bike_tracts);
  const walk_pop_factors = calc_pop_factors(walk_tracts);

  return true;

};

// export {
//   calc as default,
//   _calc_injuries_monetary,
//   _calc_fatalities_monetary,
// };

export default calc;
