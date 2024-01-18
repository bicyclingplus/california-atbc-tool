import {
    ESTIMATES,
    CARPOOL_FACTOR,
    TRANSIT_FACTOR,
    TRANSIT_WALK_FRACTION,
} from './constants.js';

import calcDiscount from './calcDiscount.js';

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

const _calc = (travel, time_frame, transit) => {

  const benefits = {};

  for(let k of ESTIMATES) {

    // daily bike and ped vmt benefits
    const combined = (
      _calcBike(travel.bike.carShift[k]) +
      _calcPed(travel.pedestrian.carShift[k], transit)
    );

    // annualize and calc benefits over project time frame
    benefits[k] = calcDiscount(combined * 365, time_frame);
  }

  return benefits;
};

const calcVMTReductions = (travel, time_frame, transit) => {

  return {
    miles: _calc(travel.miles, time_frame, transit),
    capita: _calc(travel.capita, time_frame, transit),
    jobs: _calc(travel.jobs, time_frame, transit),
  };
};

export default calcVMTReductions;
