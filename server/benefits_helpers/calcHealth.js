import {
  ESTIMATES,
  WALK_SPEED,
  WALK_MMET,
  BIKE_SPEED,
  BIKE_MMET,
} from './constants.js';

import calcDiscount from './calcDiscount.js';

// Calculate health benefits
// (travel increase in miles / speed in mph)
//    * Marginal Metabolic Equivalent of Task (MMET) per hour
// yields MMET

const _calcMMET = (travel, estimate, speed, mmet) => {

  let combined_travel = (
    travel.inducedTravel[estimate] +
    travel.carShift[estimate] +
    travel.otherShift[estimate]
  );

  return ((combined_travel * 365) / speed[estimate]) * mmet[estimate];
};

const _calc = (travel, time_frame) => {

  let benefits = {};

  benefits.pedestrian = {};

  for(let estimate of ESTIMATES) {
    benefits.pedestrian[estimate] = calcDiscount(
      _calcMMET(travel.pedestrian, estimate, WALK_SPEED, WALK_MMET),
      time_frame
    );
  }

  benefits.bike = {};

  for(let estimate of ESTIMATES) {
    benefits.bike[estimate] = calcDiscount(
      _calcMMET(travel.bike, estimate, BIKE_SPEED, BIKE_MMET),
      time_frame
    );
  }

  benefits.total = {};

  for(let estimate of ESTIMATES) {
    benefits.total[estimate] = (
      benefits.bike[estimate] +
      benefits.pedestrian[estimate]
    );
  }

  return benefits;
};

const calcHealth = (travel, time_frame) => {

  return {
    miles: _calc(travel.miles, time_frame),
    capita: _calc(travel.capita, time_frame),
    jobs: _calc(travel.jobs, time_frame),
  }
}

export default calcHealth;
