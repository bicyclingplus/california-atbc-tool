import {
  ESTIMATES,
  COLUMNS,
  MODES,
  LOCATION_TYPES,
  OUTCOMES,
} from './constants.js';

import c from '../collector.js';

// helpers
import calcDiscount from './calcDiscount.js';

// safety helpers
import calcVmj_existing from './safety/calcVmj_existing.js';
import calcVmj_projected from './safety/calcVmj_projected.js';
import calcLjvf from './safety/calcLjvf.js';
import calcNCmoj from './safety/calcNCmoj.js';
import {
  calcECmoj,
  calcECmoj_debug
} from './safety/calcECmoj.js';

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
  const ECmoj = {};
  const NCmoj = {};
  const change = {};

  // init objects
  // EC split by m, o, j
  // NC and change split by m, o, j e
  // change init to zero as it is a running total
  for(let m of MODES) {

    ECmoj[m] = {};
    NCmoj[m] = {};
    change[m] = {};

    for(let o of OUTCOMES) {

      ECmoj[m][o] = {};
      NCmoj[m][o] = {};
      change[m][o] = {};

      for(let j of LOCATION_TYPES) {
        NCmoj[m][o][j] = {};
        change[m][o][j] = {};

        for(let e of ESTIMATES) {
          change[m][o][j][e] = 0;
        }
      }
    }
  }

  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let j of LOCATION_TYPES) {

        // we only want to observe one stream of CCmojvf
        // we'll use the separate debug calc below
        c.off();
        const EC = calcECmoj(
          safety_inputs,
          Ljvf,
          Vmj_existing,
          m,
          o,
          j
        );
        c.on();

        // do separate debugging for ECmoj / CCmojvf
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

        // by estimate
        for(let e of ESTIMATES) {
          const NC = calcNCmoj(
            Ljvf,
            Vmj_projected,
            m,
            o,
            j,
            e,
            infrastructure
          );

          c.put('safety', 'NCmoj', [m, o, j, e, NC]);

          NCmoj[m][o][j][e] = NC;
          change[m][o][j][e] += NC - EC;
        }
      }
    }
  }

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let j of LOCATION_TYPES) {
          for(let e of ESTIMATES) {
            c.put('safety', 'change', [m, o, j, e, change[m][o][j][e]]);
          }
        }
      }
    }
  }

  // calculate discount over project timespan
  // this is opposite of all the other benefits
  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let e of ESTIMATES) {
        const current = change[m][o][e];
        const discounted = calcDiscount(current, project_time_frame);

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

  for(let column of COLUMNS) {

    c.setPrepends('safety', 'ECmoj', [column]);
    c.setPrepends('safety', 'NCmoj', [column]);
    c.setPrepends('safety', 'CCmojvf', [column]);
    c.setPrepends('safety', 'change', [column]);

    benefits[column] = _calc(
      Ljvf,
      Vmj_existing[column],
      Vmj_projected[column],
      infrastructure,
      safety_inputs,
      project_time_frame
    );
  }

  return benefits;
}

export default calcSafetyQuantitative;
