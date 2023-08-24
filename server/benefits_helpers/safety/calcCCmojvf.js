import { createRequire } from "module";

import {
  POWER_SAFETY_IN_NUMBERS
} from '../constants.js';

import c from '../../collector.js';

const require = createRequire(import.meta.url);
const Amojvf = require('../../data/alpha_lookup.json');

// CRASHES BY SYSTEM CLASS
// INPUTS:
// Ljvf reach lookup
// Vmj volume lookup
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
// v volume index (low/medium/high)
// f functional class index (major/minor/local)
const calcCCmojvf = (Ljvf, Vmj, m, o, j, v, f) => {

  const A = Amojvf[m][o][j][v][f];
  const L = Ljvf[j][v][f];
  const V = Vmj[m][j];

  return Math.exp(A) * L * Math.pow(V, POWER_SAFETY_IN_NUMBERS);
}

export default calcCCmojvf;
