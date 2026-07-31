import {
  ESTIMATES,
  WALK_SPEED,
  WALK_MMET,
  BIKE_SPEED,
  BIKE_MMET,
} from './constants.js';

// Calculate health benefits
// (travel increase in miles / speed in mph)
//    * Marginal Metabolic Equivalent of Task (MMET) per hour
// yields MMET

const _calcMMET = (travel, estimate, speed, mmet) => {

  const combined_travel = (
    travel.inducedTravel[estimate] +
    travel.carShift[estimate] +
    travel.otherShift[estimate]
  );

  return ((combined_travel * 365) / speed[estimate]) * mmet[estimate];
};

const calcHealth = (travel, population) => {

  const modes = ['bike', 'pedestrian', 'total'];
  const result = {};

  result.mmet = {};

  for(const mode of modes) {
    result.mmet[mode] = {};
  }

  for(const estimate of ESTIMATES) {
    const bike = _calcMMET(travel.bike, estimate, BIKE_SPEED, BIKE_MMET);
    const walk = _calcMMET(travel.pedestrian, estimate, WALK_SPEED, WALK_MMET);
    const total = bike + walk;

    result.mmet.bike[estimate] = bike;
    result.mmet.pedestrian[estimate] = walk;
    result.mmet.total[estimate] = total;
  }

  result.capita = {};

  for(const mode of modes) {
    result.capita[mode] = {};

    for(const estimate of ESTIMATES) {
      const mmet = result.mmet[mode][estimate];
      const pop = population[mode][estimate];
      const capita = mmet / pop;

      result.capita[mode][estimate] = capita;
    }
  }

  return result;
}

export default calcHealth;
