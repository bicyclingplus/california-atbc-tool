import { createRequire } from "module";
import {
  DISCOUNT_RATE,
  VALUE_STATISTICAL_LIFE,
  SCC_GROWTH_RATE,
} from './constants.js';

const require = createRequire(import.meta.url);
const air_quality_monetary = require('../../data/air_quality_monetary.json');
const ghg_monetary = require('../../data/ghg_monetary.json');

const _calc_air_quality_monetary = (
  project_year,
  project_time_frame,
  pm25_reduction_grams,
) => {

  // grams -> metric tons
  const pm25_reduction_tons = pm25_reduction_grams / 1E6;

  // independent of outer sum, so precalculate it
  let denominator = 0;

  for(let t = 1; t <= project_time_frame; t++) {
    denominator += Math.pow(1 + DISCOUNT_RATE, -t);
  }

  let total = 0;

  for(let t = 1; t <= project_time_frame; t++) {
    const numerator = pm25_reduction_tons * Math.pow(1 + DISCOUNT_RATE, -t);
    const current_year = project_year + t - 1;
    const pm25_mortality_factor = air_quality_monetary[current_year];

    total += (numerator / denominator) * pm25_mortality_factor;
  }

  return VALUE_STATISTICAL_LIFE * total;
};

const _calc_GHG_monetary = (
  project_year,
  project_time_frame,
  co2_reduction_grams,
) => {
  const co2_reduction_tons = co2_reduction_grams / 1E6;
  const SCC = ghg_monetary[project_year];

  // independent of outer sum, so precalculate it
  let denominator = 0;

  for(let t = 1; t <= project_time_frame; t++) {
    denominator += Math.pow(1 + DISCOUNT_RATE, -t);
  }

  let total = 0;

  for(let t = 1; t <= project_time_frame; t++) {
    const numerator = co2_reduction_tons * Math.pow(1 + DISCOUNT_RATE, -t);
    const current_year = project_year + t - 1;
    const SCC = ghg_monetary[current_year];

    total += (numerator / denominator) * SCC;
  }

  return total;

};

// what output columns? just one for dollars?
const calc = () => {}

export {
  calc as default,
  _calc_air_quality_monetary,
  _calc_GHG_monetary,
};
