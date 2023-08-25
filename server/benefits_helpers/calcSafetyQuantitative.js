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
  const discount = {};

  // init objects
  // existing crashes split by m, o, j
  // new crashes split by m, o, j, e
  // change split by m, o, e (rolls up j)
  // discount split by m, o, e (discounted version of change)
  // start each change at zero as they are running totals
  for(let m of MODES) {

    ECmoj[m] = {};
    NCmoj[m] = {};
    change[m] = {};
    discount[m] = {};

    for(let o of OUTCOMES) {

      ECmoj[m][o] = {};
      NCmoj[m][o] = {};
      change[m][o] = {};
      discount[m][o] = {};

      for(let j of LOCATION_TYPES) {
        NCmoj[m][o][j] = {};
      }

      for(let e of ESTIMATES) {
        change[m][o][e] = 0;
      }
    }
  }

  // calc existing crashes
  // calc new crashes
  // calc change in crashes
  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let j of LOCATION_TYPES) {

        // don't collect anything on this call
        // we'll use the separate debug call below
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

        ECmoj[m][o][j] = EC;

        // do separate debugging for ECmoj / CCmojvf
        // to return numbers for all possibilities
        // as well as which number was used
        // also sends a single stream for CCmojvf
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

          NCmoj[m][o][j][e] = NC;

          c.put('safety', 'NCmoj', [m, o, j, e, NC]);

          // running total of the changes for each split
          change[m][o][e] += (
            NCmoj[m][o][j][e] - ECmoj[m][o][j]);
        }
      }
    }
  }

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let e of ESTIMATES) {
          c.put('safety', 'change', [m, o, e, change[m][o][e]]);
        }
      }
    }
  }

  // calculate discount over project timespan
  // this is opposite of all the other benefits
  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let e of ESTIMATES) {
        discount[m][o][e] = calcDiscount(change[m][o][e], project_time_frame);
      }
    }
  }

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let e of ESTIMATES) {
          c.put('safety', 'discount', [m, o, e, discount[m][o][e]]);
        }
      }
    }
  }

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

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        c.put('safety', 'before', [m, o, before[m][o]]);

        c.put('safety', 'before_exploded', [
          m,
          o,
          ECmoj[m][o].roadway,
          Vmj_existing[m].roadway,
          ECmoj[m][o].intersection,
          Vmj_existing[m].intersection,
          before[m][o],
        ]);

        for(let e of ESTIMATES) {
          c.put('safety', 'after', [m, o, e, after[m][o][e]]);

          c.put('safety', 'after_exploded', [
            m,
            o,
            e,
            NCmoj[m][o].roadway[e],
            Vmj_projected[m].roadway[e],
            NCmoj[m][o].intersection[e],
            Vmj_projected[m].intersection[e],
            after[m][o][e],
          ]);
        }
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
    c.setPrepends('safety', 'discount', [column]);
    c.setPrepends('safety', 'before', [column]);
    c.setPrepends('safety', 'before_exploded', [column]);
    c.setPrepends('safety', 'after', [column]);
    c.setPrepends('safety', 'after_exploded', [column]);

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
