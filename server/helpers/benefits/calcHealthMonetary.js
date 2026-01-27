import { createRequire } from "module";
import util from 'util';

// acronyms
// GBD Global Burden of Disease
// DALY Disability Adjusted Life Year
// PAF Population Attributable Fraction

const utilConfig = { depth: null, colors: true, compact: false };

const require = createRequire(import.meta.url);
const relative_risk = require('../../data/relative_risk.json');
const disease_burden = require('../../data/disease_burden.json');
const population = require('../../data/population.json');

const _calc_cases_avoided = (years, PAF, baseline) => {

  const cases_avoided = {};

  for(const cause in baseline) {

    cases_avoided[cause] = {}

    for(const age in baseline[cause]) {

      cases_avoided[cause][age] = {};

      for(const sex in baseline[cause][age]) {

        const cases = baseline[cause][age][sex];
        const avoided = cases * PAF[cause] * years;

        cases_avoided[cause][age][sex] = avoided;
      }
    }
  }

  return cases_avoided;
};

const _calc_cases_baseline = (pop_factors, pop) => {
  const cases_baseline = {};

  for(const cause in disease_burden) {

    cases_baseline[cause] = {}

    for(const age in disease_burden[cause]) {

      cases_baseline[cause][age] = {}


      for(const sex in disease_burden[cause][age]) {

        const incidence = disease_burden[cause][age][sex]['incidence'];
        const pop_factor = pop_factors[age][sex];
        const baseline = (incidence / 1e5) * pop_factor * pop;

        cases_baseline[cause][age][sex] = baseline;
      }
    }
  }

  return cases_baseline;
};

const _calc_pop_factors = (tracts) => {
  const tracts_pop = tracts.map(el => population[el]);
  const pop_counts = {};
  let pop_total = 0;

  for(const tract of tracts_pop) {
    for(const age in tract) {

      if(!(age in pop_counts)) {
        pop_counts[age] = {};
      }

      for(const sex in tract[age]) {

        if(!(sex in pop_counts[age])) {
          pop_counts[age][sex] = 0;
        }

        pop_counts[age][sex] += tract[age][sex];
        pop_total += tract[age][sex];
      }
    }
  }

  const pop_factors = {};

  for(const age in pop_counts) {
    pop_factors[age] = {}
    for(const sex of ["Male", "Female"]) {
      pop_factors[age][sex] = pop_counts[age][sex] / pop_total;
    }
  }

  return pop_factors;
};

// initial pass
const test = () => {

  // inputs
  const project_time_frame = 20; // project details
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

  // dist by mode
  const bike_dist = 1.9;
  const walk_dist = 0.55;

  // pop by mode
  const bike_pop = daily_bmt / (bike_dist * 2);
  const walk_pop = daily_wmt / (walk_dist * 2);

  // mmet per capita by mode
  const bike_mmet_cap = (bike_mmet / (project_time_frame * 365 * bike_pop)) * 7;
  const walk_mmet_cap = (walk_mmet / (project_time_frame * 365 * walk_pop)) * 7;

  // PAF
  const PAF_bike = {};
  const PAF_walk = {};

  for(const cause in relative_risk) {
    PAF_bike[cause] = 1 - Math.pow(relative_risk[cause], bike_mmet_cap);
    PAF_walk[cause] = 1 - Math.pow(relative_risk[cause], walk_mmet_cap);
  }

  // population factors
  const bike_pop_factors = _calc_pop_factors(bike_tracts);
  const walk_pop_factors = _calc_pop_factors(walk_tracts);

  // baseline cases
  const bike_cases_baseline = _calc_cases_baseline(bike_pop_factors, bike_pop);
  const walk_cases_baseline = _calc_cases_baseline(walk_pop_factors, walk_pop);

  // cases avoided
  const bike_cases_avoided = _calc_cases_avoided(project_time_frame, PAF_bike, bike_cases_baseline);
  const walk_cases_avoided = _calc_cases_avoided(project_time_frame, PAF_walk, walk_cases_baseline);

  console.log(util.inspect(bike_cases_avoided, utilConfig));

  let testM = 0;
  let testF = 0;

  for(const cause in bike_cases_avoided) {
    for(const age in bike_cases_avoided[cause]) {
      testM =+ bike_cases_avoided[cause][age].Male;
      testF =+ bike_cases_avoided[cause][age].Female;
    }
  }

  console.log(testM);
  console.log(testF);

};


test();
