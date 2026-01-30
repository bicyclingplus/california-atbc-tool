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

const _calc = (travel, time_frame, discount=true) => {

  let benefits = {};

  benefits.pedestrian = {};

  for(let k of ESTIMATES) {

    const mmet = _calcMMET(travel.pedestrian, k, WALK_SPEED, WALK_MMET);

    benefits.pedestrian[k] = discount ? calcDiscount(mmet, time_frame) : mmet;
  }

  benefits.bike = {};

  for(let k of ESTIMATES) {

    const mmet = _calcMMET(travel.bike, k, BIKE_SPEED, BIKE_MMET);

    benefits.bike[k] = discount ? calcDiscount(mmet, time_frame) : mmet;
  }

  benefits.total = {};

  for(let k of ESTIMATES) {
    benefits.total[k] = (
      benefits.bike[k] +
      benefits.pedestrian[k]
    );
  }

  return benefits;
};

const calcHealth = (travel, time_frame) => {

  return {
    miles: _calc(travel.miles, time_frame),
    capita: _calc(travel.capita, time_frame),
    jobs: _calc(travel.jobs, time_frame),
    raw: _calc(travel.miles, time_frame, false),
  }
}

export default calcHealth;
