import {
  ESTIMATES,
  AVG_BIKE_DIST,
  AVG_WALK_DIST,
} from './constants.js';

const calcPopulation = (travel_benefits) => {

  const population = {
    bike: {},
    walk: {},
    total: {},
  };

  for(const estimate of ESTIMATES) {
    const bike_pop = travel_benefits.bike.total[estimate] / AVG_BIKE_DIST;
    const walk_pop = travel_benefits.pedestrian.total[estimate] / AVG_WALK_DIST;

    population.bike[estimate] = bike_pop;
    population.walk[estimate] = walk_pop;
    population.total[estimate] = bike_pop + walk_pop;
  }

  return population;
};

export default calcPopulation;
