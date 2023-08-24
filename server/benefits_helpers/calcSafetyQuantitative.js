import { createRequire } from "module";
import {
  ESTIMATES,
  FUNCTIONAL_CLASSES,
  COLUMNS,
  MODES,
  LOCATION_TYPES,
  VOLUMES,
  OUTCOMES,
} from './constants.js';

import c from '../collector.js';
import calcDiscount from './calcDiscount.js';

import calcVmj_existing from './safety/calcVmj_existing.js';
import calcVmj_projected from './safety/calcVmj_projected.js';
import calcLjvf from './safety/calcLjvf.js';
import { calcECmoj, calcECmoj_debug } from './safety/calcECmoj.js';
import calcNCmoj from './safety/calcNCmoj.js';

const _calc = (
  Ljvf,
  Vmj_existing,
  Vmj_projected,
  infrastructure,
  safety_inputs,
  project_time_frame) => {

  // calculate crash change by mode and outcome
  // calculate new crashes by mode, outcome, and location type
  // calculate existing crashes by mode, outcome, and location type
  const change = {};
  const NCmoj = {};
  const ECmoj = {};

  for(let m of MODES) {

    change[m] = {};
    NCmoj[m] = {};
    ECmoj[m] = {};

    for(let o of OUTCOMES) {

      change[m][o] = {};
      NCmoj[m][o] = {};
      ECmoj[m][o] = {};

      for(let e of ESTIMATES) {
        change[m][o][e] = 0;
      }

      for(let j of LOCATION_TYPES) {

        let EC = calcECmoj(
          safety_inputs,
          Ljvf,
          Vmj_existing,
          m,
          o,
          j
        );

        // do separate debugging for ECmoj
        // to return numbers for all possibilities
        // as well as which number was used
        if(c.enabled) {
          const d = calcECmoj_debug(
            safety_inputs,
            Ljvf,
            Vmj_existing,
            m,
            o,
            j
          );

          c.put('safety', 'ECmoj', [
            m,
            o,
            j,
            d.user,
            d.split,
            d.model,
            d.used,
          ]);
        }

        ECmoj[m][o][j] = EC;
        NCmoj[m][o][j] = {};

        // by estimate
        for(let e of ESTIMATES) {
          let NC = calcNCmoj(
            Ljvf,
            Vmj_projected,
            m,
            o,
            j,
            e,
            infrastructure
          );

          NCmoj[m][o][j][e] = NC;

          c.put('safety', 'NCmoj', [m, o, j, e, NC]);

          change[m][o][j] += NC - EC;
        }
      }
    }
  }

  // calculate discount over project timespan
  // this is opposite of all the other benefits
  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let e of ESTIMATES) {
        let current = change[m][o][e];
        let discounted = calcDiscount(current, project_time_frame);

        change[m][o][e] = discounted;
      }
    }
  }

  // add bicycling and walking to combined total
  // for(let outcome of OUTCOMES) {
  //   for(let location_type of LOCATION_TYPES) {

  //     ECmoj.combined[outcome][location_type] += (
  //       ECmoj.walking[outcome][location_type] +
  //       ECmoj.bicycling[outcome][location_type]
  //     );

  //     for(let estimate of ESTIMATES) {

  //       NCmoj.combined[outcome][location_type][estimate] += (
  //         NCmoj.walking[outcome][location_type][estimate] +
  //         NCmoj.bicycling[outcome][location_type][estimate]
  //       )
  //     }
  //   }
  // }

  // for(let outcome of OUTCOMES) {

  //   for(let estimate of ESTIMATES) {

  //     change.combined[outcome][estimate] += (
  //       change.walking[outcome][estimate] +
  //       change.bicycling[outcome][estimate]
  //     );
  //   }
  // }

  // calc before crash outcomes per 1000 volume by mode and outcome
  // calc after crash outcomes per 1000 volume by mode and outcome
  let before = {};
  let after = {};

  for(let m of MODES) {

    before[m] = {};
    after[m] = {};

    for(let o of OUTCOMES) {

      before[m][o] = 0;
      after[m][o] = {};

      for(let e of ESTIMATES) {
        after[m][o][e] = 0;
      }

      for(let j of LOCATION_TYPES) {

        // existing travel lookup for Vmj
        before[m][o] += (
          ECmoj[m][o][j] / Vmj_existing[m][j]);

        for(let e of ESTIMATES) {

          // projected travel lookup for Vmj
          after[m][o][e] += (
            NCmoj[m][o][j][e] /
            Vmj_projected[m][j][e]
          );
        }
      }
    }
  }

  for(let m of MODES) {
    for(let o of OUTCOMES) {
      before[m][o] *= 1000;

      for(let e of ESTIMATES) {
        after[m][o][e] *= 1000;
      }
    }
  }

  return {
    change: change,
    before: before,
    after: after,
  };
};

const calcSafetyQuantitative = (
  ways,
  intersections,
  infrastructure,
  project_length,
  num_intersections,
  safety_inputs,
  project_time_frame) => {

  // need a lookup for length/count by volume and functional class and location type
  const Ljvf = calcLjvf(ways, intersections);

  // need a lookup for existing volume by mode and location type
  const Vmj_existing = calcVmj_existing(
    ways, intersections);

  // need a lookup for projected volume by mode and location type
  const Vmj_projected = calcVmj_projected(
    Vmj_existing,
    infrastructure,
    project_length,
    num_intersections);

  // generate output for each set of columns in the safety benefits table
  const benefits = {};

  for(let c of COLUMNS) {

    c.setPrepends('safety', 'ECmoj', [c]);
    c.setPrepends('safety', 'NCmoj', [c]);

    benefits[c] = _calc(
      Ljvf,
      Vmj_existing[c],
      Vmj_projected[c],
      infrastructure,
      safety_inputs,
      project_time_frame
    );
  }

  return benefits;
}

export default calcSafetyQuantitative;
