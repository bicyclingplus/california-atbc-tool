import {
  FUNCTIONAL_CLASSES,
  VOLUMES,
} from '../constants.js';

import { calcCCmojvf } from './calcCCmojvf.js';
import c from '../../collector.js';

// EXISTING CRASHES SPLIT
// Part user input and part model
// UI user inputs for safety
// ECCmoj existing crashes from model split by m/o/j
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj_split = (UI, ECCmoj, m, o, j) => {
  const UImoj = UI[m][o][j];
  const UIy = UI[m].years[j];
  const CC = ECCmoj[m][o][j];

  return (UImoj + ((5 - UIy) * CC));
};

// EXISTING CRASHES MODEL ONLY
// ECCmoj existing crashes from model split by m/o/j
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj_model = (ECCmoj, m, o, j) => {
  return ECCmoj[m][o][j];
};

// EXISTING CRASHES MODEL ONLY
// UI user inputs for safety
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj_user = (UI, m, o, j) => {
  const UImoj = UI[m][o][j];
  const UIy = UI[m].years[j];

  return UImoj / UIy;
};

// EXISTING CRASHES
// INPUTS:
// UI user inputs for safety
// ECCmoj existing crashes from model split by m/o/j
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj = (UI, ECCmoj, m, o, j) => {
  // User input number of years of data for this m, j
  const UIy = UI[m].years[j];

  // not null and greater than 0
  if(UIy && UIy > 0) {

    // 5 or more years, use user input directly
    if(UIy >= 5) {
      return calcECmoj_user(UI, m, o, j);
    }
    // more than 0 but less than 5, split between
    // model and user input
    else {
      return calcECmoj_split(UI, ECCmoj, m, o, j);
    }
  }
  // 0 or null, use model only
  else {
    return calcECmoj_model(ECCmoj, m, o, j);
  }
};

const calcECmoj_debug = (UI, ECCmoj, m, o, j) => {
  let used = '';
  const UIy = UI[m].years[j];

  if(UIy && UIy > 0) {
    if(UIy >= 5) {
      used = 'user';
    }
    else {
      used = 'split';
    }
  }
  else {
    used = 'model';
  }

  // we only want to observe one stream of CCmojvf
  // we'll take the one from the model only calc
  // so we turn off the collector to ignore the
  // CCmojvf calls from calcECmoj_split
  c.off();
  const split = UIy && UIy > 0 ? calcECmoj_split(UI, ECCmoj, m, o, j) : null;
  c.on();

  return {
    user: UIy && UIy > 0 ? calcECmoj_user(UI, m, o, j) : null,
    split: split,
    model: calcECmoj_model(ECCmoj, m, o, j),
    used: used,
  }
}

export {
  calcECmoj,
  calcECmoj_debug,
};
