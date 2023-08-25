import {
  INDUCED_TRAVEL,
  ROUTE_SHIFT,
  CAR_SHIFT,
  OTHER_SHIFT,
  SCALING_FACTORS,
  POWER_SAFETY_IN_NUMBERS,
  DISCOUNT_RATE,
} from '../benefits_helpers/constants.js';

import writeCSV from './writeCSV.js';


const constants = () => {

  const rows = [
    ['travel', 'INDUCED_TRAVEL_BICYCLING', INDUCED_TRAVEL.bicycling],
    ['travel', 'INDUCED_TRAVEL_WALKING', INDUCED_TRAVEL.walking],
    ['travel', 'ROUTE_SHIFT_BICYCLING', ROUTE_SHIFT.bicycling],
    ['travel', 'ROUTE_SHIFT_WALKING', ROUTE_SHIFT.walking],
    ['travel', 'CAR_SHIFT_BICYCLING', CAR_SHIFT.bicycling],
    ['travel', 'CAR_SHIFT_WALKING', CAR_SHIFT.walking],
    ['travel', 'OTHER_SHIFT_BICYCLING', OTHER_SHIFT.bicycling],
    ['travel', 'OTHER_SHIFT_WALKING', OTHER_SHIFT.walking],

    ['safety', 'SCALING_FACTOR_NEW', SCALING_FACTORS.new],
    ['safety', 'SCALING_FACTOR_UPGRADE', SCALING_FACTORS.upgrade],
    ['safety', 'SCALING_FACTOR_RETROFIT', SCALING_FACTORS.retrofit],
    ['safety', 'POWER_SAFETY_IN_NUMBERS', POWER_SAFETY_IN_NUMBERS],

    ['multiple', 'DISCOUNT_RATE', DISCOUNT_RATE],
  ];

  writeCSV('lookups', 'constants', [
    'output',
    'constant',
    'value',
  ], rows);

}

export default constants;
