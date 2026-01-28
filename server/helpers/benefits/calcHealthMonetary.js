import { createRequire } from "module";

import {
  VALUE_STATISTICAL_LIFE,
  AVG_BIKE_DIST,
  AVG_WALK_DIST,
} from './constants.js';

import calc_pop_factors from './calcPopFactors.js';

const require = createRequire(import.meta.url);
const relative_risk = require('../../data/relative_risk.json');
const disease_burden = require('../../data/disease_burden.json');
const life_expectancy = require('../../data/life_expectancy.json');

const _calc_DALYs_recovered = (
  years,
  pop_factors,
  pop,
  PAF,
) => {

  const DALYs_recovered = {}

  for(const cause in disease_burden) {

    DALYs_recovered[cause] = {};

    for(const age in disease_burden[cause]) {

      DALYs_recovered[cause][age] = {};

      for(const sex in disease_burden[cause][age]) {

        const {
          incidence,
          daly_per_case,
        } = disease_burden[cause][age][sex];

        const pop_factor = pop_factors[age][sex];

        // I'm guessing incidence is per 100,000 people
        const baseline = (incidence / 1e5) * pop_factor * pop;
        const avoided = baseline * PAF[cause] * years;
        const recovered = avoided * daly_per_case;

        DALYs_recovered[cause][age][sex] = recovered;
      }
    }
  }

  return DALYs_recovered;
};

// acronyms
// GBD Global Burden of Disease
// DALY Disability Adjusted Life Year
// PAF Population Attributable Fraction
// MMET Marginal Metabolic Equivalent of Task
const calc = (
  project_time_frame,
  project_county,
  daily_bmt,
  daily_wmt,
  bike_mmet,
  walk_mmet,
  bike_tracts,
  walk_tracts,
) => {

  // value of a DALY for the project county
  const county_life_expectancy = life_expectancy[project_county];
  const DALY_value = VALUE_STATISTICAL_LIFE / county_life_expectancy;

  // project population by mode
  const bike_pop = daily_bmt / (AVG_BIKE_DIST * 2);
  const walk_pop = daily_wmt / (AVG_WALK_DIST * 2);

  // project weekly mmet per capita by mode
  const bike_mmet_cap = (bike_mmet / (project_time_frame * 365 * bike_pop)) * 7;
  const walk_mmet_cap = (walk_mmet / (project_time_frame * 365 * walk_pop)) * 7;

  // PAF
  const bike_PAF = {};
  const walk_PAF = {};

  for(const cause in relative_risk) {
    bike_PAF[cause] = 1 - Math.pow(relative_risk[cause], bike_mmet_cap);
    walk_PAF[cause] = 1 - Math.pow(relative_risk[cause], walk_mmet_cap);
  }

  // population factors
  // TODO pass this in so it's only calc'd once
  const bike_pop_factors = calc_pop_factors(bike_tracts);
  const walk_pop_factors = calc_pop_factors(walk_tracts);

  // DALYs recovered
  const bike_DALYs_recovered = _calc_DALYs_recovered(
    project_time_frame,
    bike_pop_factors,
    bike_pop,
    bike_PAF,
  );

  const walk_DALYs_recovered = _calc_DALYs_recovered(
    project_time_frame,
    walk_pop_factors,
    walk_pop,
    walk_PAF,
  );

  // DALY totals
  let bike_DALYs = 0
  let walk_DALYs = 0

  for(const cause in bike_DALYs_recovered) {
    for(const age in bike_DALYs_recovered[cause]) {
      for(const sex in bike_DALYs_recovered[cause][age]) {
        bike_DALYs += bike_DALYs_recovered[cause][age][sex];
        walk_DALYs += walk_DALYs_recovered[cause][age][sex];
      }
    }
  }

  // DALY benefit
  // this is USD
  const bike_DALY_benefit = bike_DALYs * DALY_value;
  const walk_DALY_benefit = walk_DALYs * DALY_value;

  // project total
  const project_DALY_benefit = bike_DALY_benefit + walk_DALY_benefit;

  return {
    bicycling: bike_DALY_benefit,
    walking: walk_DALY_benefit,
    total: project_DALY_benefit,
  };
};

export {
  calc as default,
};
