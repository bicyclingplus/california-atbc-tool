import {
  FUNCTIONAL_CLASSES,
  VOLUMES,
} from '../constants.js';

import { calcCCmojvf } from './calcCCmojvf.js';
import c from '../../collector.js';

// EXISTING CRASHES SPLIT
// Part user input and part model
// UI user inputs for safety
// Ljvf reach lookup
// Vmj volume lookup
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj_split = (UI, Ljvf, Vmj, m, o, j) => {
  const UImoj = UI[m][o][j];
  const UIy = UI[m].years[j];

  let total = 0;

  for(let f of FUNCTIONAL_CLASSES) {
    for(let v of VOLUMES) {

      const CC = calcCCmojvf(Ljvf, Vmj, m, o, j, v, f);

      total += ((UImoj / UIy) * (UIy / 5)) +
        ((1 - (UIy / 5)) * CC);
    }
  }

  return total;
};

// EXISTING CRASHES MODEL ONLY
// Ljvf reach lookup
// Vmj volume lookup
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj_model = (Ljvf, Vmj, m, o, j) => {
  let total = 0;

  for(let f of FUNCTIONAL_CLASSES) {
    for(let v of VOLUMES) {
      total += calcCCmojvf(Ljvf, Vmj, m, o, j, v, f);
    }
  }

  return total;
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
// Ljvf reach lookup
// Vmj volume lookup
// UI user inputs for safety
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
const calcECmoj = (UI, Ljvf, Vmj, m, o, j) => {
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
      return calcECmoj_split(UI, Ljvf, Vmj, m, o, j);
    }
  }
  // 0 or null, use model only
  else {
    return calcECmoj_model(Ljvf, Vmj, m, o, j);
  }
};

const calcECmoj_debug = (UI, Ljvf, Vmj, m, o, j) => {
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
  const split = UIy && UIy > 0 ? calcECmoj_split(UI, Ljvf, Vmj, m, o, j) : null;
  c.on();

  return {
    user: UIy && UIy > 0 ? calcECmoj_user(UI, m, o, j) : null,
    split: split,
    model: calcECmoj_model(Ljvf, Vmj, m, o, j),
    used: used,
  }
}

export {
  calcECmoj,
  calcECmoj_debug,
};
