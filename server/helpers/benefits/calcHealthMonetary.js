import { createRequire } from "module";

import {
  VALUE_STATISTICAL_LIFE,
  ESTIMATES,
  MMET_BASE,
  MMET_CAP,
  PROP_INSUF_ACTIVE,
} from './constants.js';

import calc_pop_factors from './calcPopFactors.js';
import calcDiscount from './calcDiscount.js';

const require = createRequire(import.meta.url);
const relative_risk = require('../../data/relative_risk.json');
const disease_burden = require('../../data/disease_burden.json');

const _calc_DALYs_recovered = (
  pop_factors,
  pop,
  base_PAF,
  mode_PAF,
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
        const baseline = (incidence / 1e5) * pop_factor * pop * PROP_INSUF_ACTIVE;
        const avoided = baseline * (base_PAF[cause] - mode_PAF[cause]);
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
const _calc = (
  project_time_frame,
  county_life_expectancy,
  bike_pop,
  walk_pop,
  bike_mmet,
  walk_mmet,
  bike_pop_factors,
  walk_pop_factors,
) => {

  // value of a DALY for the project county
  const DALY_value = VALUE_STATISTICAL_LIFE / county_life_expectancy;

  // project weekly mmet per capita by mode
  let bike_mmet_cap = (bike_mmet / (365 * bike_pop)) * 7;
  let walk_mmet_cap = (walk_mmet / (365 * walk_pop)) * 7;

  bike_mmet_cap = Math.min(MMET_BASE + bike_mmet_cap, MMET_CAP);
  walk_mmet_cap = Math.min(MMET_BASE + walk_mmet_cap, MMET_CAP);

  // PAF
  const base_PAF = {};
  const bike_PAF = {};
  const walk_PAF = {};

  for(const cause in relative_risk) {
    base_PAF[cause] = Math.pow(relative_risk[cause], MMET_BASE);
    bike_PAF[cause] = Math.pow(relative_risk[cause], bike_mmet_cap);
    walk_PAF[cause] = Math.pow(relative_risk[cause], walk_mmet_cap);
  }

  // DALYs recovered
  const bike_DALYs_recovered = _calc_DALYs_recovered(
    bike_pop_factors,
    bike_pop,
    base_PAF,
    bike_PAF,
  );

  const walk_DALYs_recovered = _calc_DALYs_recovered(
    walk_pop_factors,
    walk_pop,
    base_PAF,
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
    bicycling: calcDiscount(bike_DALY_benefit, project_time_frame),
    walking: calcDiscount(walk_DALY_benefit, project_time_frame),
    total: calcDiscount(project_DALY_benefit, project_time_frame),
  };
};

const calc = (
  project_time_frame,
  county_life_expectancy,
  population,
  health_benefits,
  bike_pop_factors,
  walk_pop_factors,
) => {

  const monetary = {
    bike: {},
    pedestrian: {},
    total: {},
  }

  for(const estimate of ESTIMATES) {

    const result = _calc(
      project_time_frame,
      county_life_expectancy,
      population.bike[estimate],
      population.pedestrian[estimate],
      health_benefits.bike[estimate],
      health_benefits.pedestrian[estimate],
      bike_pop_factors,
      walk_pop_factors,
    )

    monetary.bike[estimate] = result.bicycling;
    monetary.pedestrian[estimate] = result.walking;
    monetary.total[estimate] = result.total;
  }

  return monetary;
};

export {
  calc as default,
  _calc
};
