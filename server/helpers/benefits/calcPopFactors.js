const calc_pop_factors = (tracts) => {

  // total up the population of tracts in the
  // project's buffer zone by age/sex as well
  // as the overall total
  const pop_counts = {};
  let pop_total = 0;

  for(const tract of tracts) {

    const { population } = tract.properties;

    for(const age in population) {

      if(!(age in pop_counts)) {
        pop_counts[age] = {};
      }

      for(const sex in population[age]) {

        if(!(sex in pop_counts[age])) {
          pop_counts[age][sex] = 0;
        }

        pop_counts[age][sex] += population[age][sex];
        pop_total += population[age][sex];
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
