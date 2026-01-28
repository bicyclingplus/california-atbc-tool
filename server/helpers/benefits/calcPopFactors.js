import { createRequire } from "module";

const require = createRequire(import.meta.url);
const population = require('../../data/population.json');

const calc_pop_factors = (tracts) => {

  // TODO population lookup needs to be attached to the network
  // so when the tracts are passed in, the population data
  // will already be attached to them

  // lookup the population for each tract
  const tracts_pop = tracts.map(el => population[el]);

  // total up the population of tracts in the
  // project's buffer zone by age/sex as well
  // as the overall total
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

  // calculate fraction of total
  // population for each age/sex
  const pop_factors = {};

  for(const age in pop_counts) {
    pop_factors[age] = {}
    for(const sex in pop_counts[age]) {
      pop_factors[age][sex] = pop_counts[age][sex] / pop_total;
    }
  }

  return pop_factors;
};

export default calc_pop_factors;
