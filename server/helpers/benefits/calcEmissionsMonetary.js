import { createRequire } from "module";
import {
  DISCOUNT_RATE,
  VALUE_STATISTICAL_LIFE,
  SCC_GROWTH_RATE,
  ESTIMATES,
} from './constants.js';

const require = createRequire(import.meta.url);
const air_quality_monetary = require('../../data/air_quality_monetary.json');
const ghg_monetary = require('../../data/ghg_monetary.json');

const _calc_monetary = (
  project_year,
  project_time_frame,
  reduction_grams,
  lookup,
) => {
  const reduction_tons = reduction_grams / 1E6;

  // independent of outer sum, so precalculate it
  let denominator = 0;

  for(let t = 1; t <= project_time_frame; t++) {
    denominator += Math.pow(1 + DISCOUNT_RATE, -t);
  }

  let total = 0;

  for(let t = 1; t <= project_time_frame; t++) {
    const numerator = reduction_tons * Math.pow(1 + DISCOUNT_RATE, -t);
    const current_year = project_year + t - 1;
    const factor = lookup[current_year];

    total += (numerator / denominator) * factor;
  }

  return total;
}

const _calc_air_quality_monetary = (
  project_year,
  project_time_frame,
  pm25_reduction_grams,
) => {

  const result = _calc_monetary(
    project_year,
    project_time_frame,
    pm25_reduction_grams,
    air_quality_monetary,
  );

  return VALUE_STATISTICAL_LIFE * result;
};

const _calc_GHG_monetary = (
  project_year,
  project_time_frame,
  co2_reduction_grams,
) => {

  return _calc_monetary(
    project_year,
    project_time_frame,
    co2_reduction_grams,
    ghg_monetary,
  );
};

// what output columns? just one for dollars?
const calc = (
  project_year,
  project_time_frame,
  benefits,
) => {

  const air_quality = {};
  const ghg = {}

  const {
    "PM2.5": pm25_reduction_grams,
  } = benefits.raw.reductions;

  const {
    equivalent: co2_reduction_grams
  } = benefits.raw;

  for(const estimate of ESTIMATES) {
    air_quality[estimate] = _calc_air_quality_monetary(
      project_year,
      project_time_frame,
      pm25_reduction_grams[estimate],
    );

    ghg[estimate] = _calc_GHG_monetary(
      project_year,
      project_time_frame,
      co2_reduction_grams[estimate],
    );
  }

  return {
    air_quality,
    ghg,
  };
}

export {
  calc as default,
  _calc_air_quality_monetary,
  _calc_GHG_monetary,
};
