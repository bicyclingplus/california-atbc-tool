import {
  ESTIMATES,
  COLUMNS,
  MODES,
  LOCATION_TYPES,
  OUTCOMES,
} from './constants.js';

import z from '../collector.js';

// helpers
import calcDiscount from './calcDiscount.js';

// safety helpers
import calcEVcmj from './safety/calcEVcmj.js';
import calcPVcmjk from './safety/calcPVcmjk.js';
import calcNCmojk from './safety/calcNCmojk.js';
import { calcECmoj, calcECmoj_debug } from './safety/calcECmoj.js';
import calcECCcmoj from './safety/calcECCcmoj.js';
import columizeSafetyInputs from './safety/columizeSafetyInputs.js';

// per column safety benefits calculation
// columns are safety, capita, and jobs
// calculate existing crashes by mode, outcome, and location type
// calculate new crashes by mode, outcome, location type, and estimate
// calculate crash change by mode and outcome
// ECCmoj, existing crashes from model per m/o/j
// EVmj, existing volume from network per m/j
// PVmjk, projected volume per m/j/k
// (existing volume plus benefits due to selected
// infrastructure elements)
// UI, user provided safety inputs
// (split by m/o/j, with years split by m/j)
// infrastructure, selected infrastructure elements
// project_time_frame, number of years to project benefits over
// project_length, total length of segments contained in project
// num_intersections, number of intersections contained in project
const _calc = (
  ECCmoj,
  EVmj,
  PVmjk,
  UI,
  infrastructure,
  project_time_frame,
  project_length,
  num_intersections,
  discount=true
) => {

  // init objects
  // existing crashes split by m, o, j
  // new crashes split by m, o, j, k
  // change split by m, o, k (rolls up j)
  // discount split by m, o, k (discounted version of change)
  // start each change at zero as they are running totals
  const ECmoj = {};
  const NCmojk = {};
  const change = {};
  const projected = {};
  const before = {};
  const after = {};

  for(let m of MODES) {

    ECmoj[m] = {};
    NCmojk[m] = {};
    change[m] = {};
    projected[m] = {};
    before[m] = {};
    after[m] = {};

    for(let o of OUTCOMES) {

      ECmoj[m][o] = {};
      NCmojk[m][o] = {};
      change[m][o] = {};
      projected[m][o] = {};
      before[m][o] = 0;
      after[m][o] = {};

      for(let j of LOCATION_TYPES) {
        NCmojk[m][o][j] = {};
      }

      for(let k of ESTIMATES) {
        change[m][o][k] = 0;
        after[m][o][k] = 0;
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
        z.off();
        ECmoj[m][o][j] = calcECmoj(
          UI,
          ECCmoj,
          m,
          o,
          j
        );
        z.on();

        // do separate debugging for ECmoj / CCmojvf
        // to return numbers for all possibilities
        // as well as which number was used
        // also sends a single stream for CCmojvf
        if(z.enabled) {
          const d = calcECmoj_debug(
            UI,
            ECCmoj,
            m,
            o,
            j
          );

          z.put('safety', 'ECmoj', [
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
        for(let k of ESTIMATES) {
          const NC = calcNCmojk(
            ECmoj[m][o][j],
            m,
            o,
            j,
            k,
            infrastructure,
            project_length,
            num_intersections
          );

          NCmojk[m][o][j][k] = NC;

          z.put('safety', 'NCmoj', [m, o, j, k, NC]);

          // running total of the changes for each split
          change[m][o][k] += (
            NCmojk[m][o][j][k] - ECmoj[m][o][j]);
        }
      }
    }
  }

  if(z.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let k of ESTIMATES) {
          z.put('safety', 'change', [
            m,
            o,
            k,
            NCmojk[m][o].roadway[k],
            ECmoj[m][o].roadway,
            NCmojk[m][o].intersection[k],
            ECmoj[m][o].intersection,
            change[m][o][k]]);
        }
      }
    }
  }

  // calculate discount over project timespan
  // this is opposite of all the other benefits
  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let k of ESTIMATES) {
        if(discount) {
          projected[m][o][k] = calcDiscount(change[m][o][k], project_time_frame);
        }
        else {
          projected[m][o][k] = change[m][o][k];
        }
      }
    }
  }

  if(z.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let k of ESTIMATES) {
          z.put('safety', 'projected', [m, o, k, projected[m][o][k]]);
        }
      }
    }
  }

  // calc before crash outcomes per 1000 volume by mode and outcome
  // calc after crash outcomes per 1000 volume by mode and outcome
  for(let m of MODES) {
    for(let o of OUTCOMES) {
      for(let j of LOCATION_TYPES) {

        // existing travel lookup for Vmj
        if(EVmj[m][j] !== 0) {
          before[m][o] += (
            ECmoj[m][o][j] /
            EVmj[m][j]
          );
        }

        for(let k of ESTIMATES) {

          // projected travel lookup for Vmj
          if(PVmjk[m][j][k] !== 0) {
            after[m][o][k] += (
              NCmojk[m][o][j][k] /
              PVmjk[m][j][k]
            );
          }
        }
      }
    }
  }

  for(let m of MODES) {
    for(let o of OUTCOMES) {
      before[m][o] *= 1000;

      for(let k of ESTIMATES) {
        after[m][o][k] *= 1000;
      }
    }
  }

  if(z.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {

        z.put('safety', 'before', [
          m,
          o,
          ECmoj[m][o].roadway,
          EVmj[m].roadway,
          ECmoj[m][o].intersection,
          EVmj[m].intersection,
          before[m][o],
        ]);

        for(let k of ESTIMATES) {

          z.put('safety', 'after', [
            m,
            o,
            k,
            NCmojk[m][o].roadway[k],
            PVmjk[m].roadway[k],
            NCmojk[m][o].intersection[k],
            PVmjk[m].intersection[k],
            after[m][o][k],
          ]);
        }
      }
    }
  }

  return {
    change: projected,
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

  // need a lookup of model crashes by c/m/o/j
  // column, mode, outcome, and location type
  const ECCcmoj = calcECCcmoj(ways, intersections);

  // need a lookup for existing volume by c/m/j
  // column, mode, and location type
  const EVcmj = calcEVcmj(ways, intersections);

  // need a lookup for projected volume by c/m/j/k
  // column, mode, location type, and estimate
  const PVcmjk = calcPVcmjk(
    EVcmj,
    infrastructure,
    project_length,
    num_intersections);

  // user input does not have per capita and per jobs values so we
  // calculate them from project averages
  const UI = columizeSafetyInputs(safety_inputs, ways, intersections);

  // generate output for each set of columns in the safety benefits table
  const benefits = {};

  for(let c of COLUMNS) {

    z.setPrepends('safety', 'ECmoj', [c]);
    z.setPrepends('safety', 'NCmoj', [c]);
    z.setPrepends('safety', 'CCmojvf', [c]);
    z.setPrepends('safety', 'CCmojvfe', [c]);
    z.setPrepends('safety', 'reductions', [c]);
    z.setPrepends('safety', 'CRFmoje', [c]);
    z.setPrepends('safety', 'change', [c]);
    z.setPrepends('safety', 'projected', [c]);
    z.setPrepends('safety', 'before', [c]);
    z.setPrepends('safety', 'after', [c]);

    benefits[c] = _calc(
      ECCcmoj[c],
      EVcmj[c],
      PVcmjk[c],
      UI[c],
      infrastructure,
      project_time_frame,
      project_length,
      num_intersections
    );
  }

  benefits.raw = _calc(
    ECCcmoj.safety,
    EVcmj.safety,
    PVcmjk.safety,
    UI.safety,
    infrastructure,
    project_time_frame,
    project_length,
    num_intersections,
    false
  );

  return benefits;
}

export default calcSafetyQuantitative;
