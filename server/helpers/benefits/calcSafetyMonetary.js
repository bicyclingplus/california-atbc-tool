import { createRequire } from "module";

import {
  DISCOUNT_RATE,
  VALUE_STATISTICAL_LIFE,
} from './constants.js';

const require = createRequire(import.meta.url);
const bike_ped_burden = require('../../data/bike_ped_burden.json');
const bike_burden = bike_ped_burden['Cyclist road injuries'];
const walk_burden = bike_ped_burden['Pedestrian road injuries'];

const _calc = (
  project_time_frame,
  county_life_expectancy,
  bike_injuries,
  walk_injuries,
  bike_fatalities,
  walk_fatalities,
  bike_pop_factors,
  walk_pop_factors,
) => {

  const total_fatalities = bike_fatalities + walk_fatalities;

  let injury_DALYs_avoided = 0;

  for(const age in bike_pop_factors) {
    for(const sex in bike_pop_factors[age]) {

      const { daly_per_case: bike_daly_per_case  } = bike_burden[age][sex];
      const bike_pop_factor = bike_pop_factors[age][sex];
      const bike_avoided = bike_injuries * bike_pop_factor * bike_daly_per_case;

      injury_DALYs_avoided += bike_avoided;

      const { daly_per_case: walk_daly_per_case  } = walk_burden[age][sex];
      const walk_pop_factor = walk_pop_factors[age][sex];
      const walk_avoided = walk_injuries * walk_pop_factor * walk_daly_per_case;

      injury_DALYs_avoided += walk_avoided;
    }
  }

  // this summation is the same for every iteration
  // of the outer summation, so precompute
  let denominator = 0;

  for(let i = 1; i <= project_time_frame; i++) {
    denominator += Math.pow(1 + DISCOUNT_RATE, -i);
  }

  // discount the benefits over the project time span
  let discounted_injuries = 0;
  let discounted_fatalities = 0;

  for(let i = 1; i <= project_time_frame; i++) {
    const disc_weight = Math.pow(1 + DISCOUNT_RATE, -i);
    const injuries_current = (injury_DALYs_avoided * disc_weight) / denominator;
    const fatalities_current = (total_fatalities * disc_weight) / denominator;
    discounted_injuries += injuries_current;
    discounted_fatalities += fatalities_current;
  }

  // convert to USD
  const benefit_injuries = (discounted_injuries / county_life_expectancy) * VALUE_STATISTICAL_LIFE;
  const benefit_fatalities = discounted_fatalities * VALUE_STATISTICAL_LIFE;

  return benefit_injuries + benefit_fatalities;

};

const calc = (
  project_time_frame,
  county_life_expectancy,
  benefits,
  bike_pop_factors,
  walk_pop_factors,
) => {
  const monetary = {}

  // YOU LEFT OFF HERE
  // NEED TO FIGURE OUT HOW TO GET UNDISCOUNTED SAFETY BENEFITS
  // TO PASS INTO THE MONETARY CALCULATION

  return monetary;
};

export {
  calc as default,
  _calc,
}
