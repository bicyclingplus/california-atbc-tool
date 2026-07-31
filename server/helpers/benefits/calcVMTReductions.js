import {
    ESTIMATES,
    CARPOOL_FACTOR,
    TRANSIT_FACTOR,
    TRANSIT_WALK_FRACTION,
} from './constants.js';

const _calcBike = (travel) => {
  return (
    travel *
    CARPOOL_FACTOR
  );
};

const _calcPed = (travel, transit) => {
  return ((
    travel *
    CARPOOL_FACTOR *
    (1 - TRANSIT_WALK_FRACTION[transit])
  ) + (
    travel *
    TRANSIT_WALK_FRACTION[transit] *
    TRANSIT_FACTOR
  ));
};

const calcVMTReductions = (travel, transit, population) => {

  const results = {
    reduction: {},
    capita: {},
  };

  for(const estimate of ESTIMATES) {
    const combined = (
      _calcBike(travel.bike.carShift[estimate]) +
      _calcPed(travel.pedestrian.carShift[estimate], transit)
    );

    const reduction = combined * 365;
    const pop = population.total[estimate];
    const capita = reduction / pop;

    results.reduction[estimate] = reduction;
    results.capita[estimate] = capita;
  }

  return results;
};

export default calcVMTReductions;
