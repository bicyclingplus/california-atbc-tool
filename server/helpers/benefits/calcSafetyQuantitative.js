import {
  ESTIMATES,
  COLUMNS,
  MODES,
  LOCATION_TYPES,
  OUTCOMES,
  POWER_SAFETY_IN_NUMBERS
} from './constants.js';

import c from '../collector.js';

// helpers
import calcDiscount from './calcDiscount.js';

// safety helpers
import calcEVcmj from './safety/calcEVcmj.js';
import calcPVcmjk from './safety/calcPVcmjk.js';
import calcNCmojk from './safety/calcNCmojk.js';
import {
  calcECmoj,
  calcECmoj_debug
} from './safety/calcECmoj.js';

// NEW
import { calcCC } from './safety/calcCCmojvf.js';
import avgProp from './avgProp.js';
import { createRequire } from "module";
import util from 'util';
import columizeSafetyInputs from './safety/columizeSafetyInputs.js';
const require = createRequire(import.meta.url);
const Amojvf = require('../../data/alpha_lookup.json');

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
  num_intersections) => {

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
        c.off();
        ECmoj[m][o][j] = calcECmoj(
          UI,
          ECCmoj,
          m,
          o,
          j
        );
        c.on();

        // do separate debugging for ECmoj / CCmojvf
        // to return numbers for all possibilities
        // as well as which number was used
        // also sends a single stream for CCmojvf
        if(c.enabled) {
          const d = calcECmoj_debug(
            UI,
            ECCmoj,
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

          c.put('safety', 'NCmoj', [m, o, j, k, NC]);

          // running total of the changes for each split
          change[m][o][k] += (
            NCmojk[m][o][j][k] - ECmoj[m][o][j]);
        }
      }
    }
  }

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let k of ESTIMATES) {
          c.put('safety', 'change', [
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
        projected[m][o][k] = calcDiscount(change[m][o][k], project_time_frame);
      }
    }
  }

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let k of ESTIMATES) {
          c.put('safety', 'projected', [m, o, k, projected[m][o][k]]);
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

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {

        c.put('safety', 'before', [
          m,
          o,
          ECmoj[m][o].roadway,
          EVmj[m].roadway,
          ECmoj[m][o].intersection,
          EVmj[m].intersection,
          before[m][o],
        ]);

        for(let k of ESTIMATES) {

          c.put('safety', 'after', [
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

const ECC_partial = (
  ECC,
  m,
  j,
  v,
  f,
  L,
  exposure,
  population,
  jobs,
) => {

  // console.log(`m: ${m}`);
  // console.log(`j: ${j}`);
  // console.log(`v: ${v}`);
  // console.log(`f: ${f}`);
  // console.log(`L: ${L}`);
  // console.log(`exposure: ${exposure}`);
  // console.log(`population: ${population}`);
  // console.log(`jobs: ${jobs}`);

  if(exposure === null) {
    return;
  }

  for(let o of OUTCOMES) {
    const A = Amojvf[m][o][j][v][f];
    const V = exposure;

    ECC.safety[m][o][j] += calcCC(A, L, V);

    // no div by zero
    if(population !== null && population !== 0) {
      const V_pop = exposure / population;
      ECC.capita[m][o][j] += calcCC(A, L, V_pop);
    }

    // no div by zero
    if(jobs !== null && jobs !== 0) {
      const V_jobs = exposure / jobs;
      ECC.jobs[m][o][j] += calcCC(A, L, V_jobs);
    }
  }
};

const calcSafetyQuantitative = (
  ways,
  intersections,
  infrastructure,
  project_length,
  num_intersections,
  safety_inputs,
  project_time_frame) => {

  // TODO REFACTOR
  // for each way in ways
  // build a corresponding array of objects
  // containing existing crashes by outcome and column
  // (crash/injury/death and safety/jobs/capita)

  // lookup alpha based on way props for mode/outcome/location type/
  // exposure class(volume)/functional class mojvf

  // get ped/bike exposure, pop, jobs, length from props like we used to
  // fall back on avg like we used to

  // equation is e^alpha * length of way * exposure^safety in numbers constant

  // for each intersection
  // similar to way
  // but equation is e^alpha * 1???? * exposure^safety in numbers constant

  // init object to zeroes by column/mode/outcome/location type
  // then loop through and add to approprate count by column/mode/outcome/location type

  // check how this compares to existing numbers

  // don't need the Ljvf lookup anymore
  // don't need EVmj lookup anymore
  // don't need PVmj lookup anymore (projected crashes based on existing crahses now)

  // use this new lookup for model, y = 0
  // split between this new lookup and user inputs for split, 0 < y < 5
  // unused for EC user, y >= 5

  // init object with zeroes
  const ECCmoj = {};

  for(let c of COLUMNS) {
    ECCmoj[c] = {};

    for(let m of MODES) {
      ECCmoj[c][m] = {};

      for(let o of OUTCOMES) {
        ECCmoj[c][m][o] = {};

        for(let j of LOCATION_TYPES) {
          ECCmoj[c][m][o][j] = 0;
        }
      }
    }
  }

  // avg props for fallback
  const avgWayBikeExp = avgProp(ways, 'bicyclist_link_exposure');
  const avgWayPedExp = avgProp(ways, 'pedestrian_link_exposure');
  const avgWayPop = avgProp(ways, 'population');
  const avgWayJobs = avgProp(ways, 'jobs');

  for(let way of ways) {

    const {
      length,
      bicycle_exposure_class,
      bicyclist_link_exposure,
      pedestrian_link_exposure_class,
      pedestrian_link_exposure,
      functional,
      population,
      jobs,
    } = way.properties;

    // use avg if null
    const e_b = bicyclist_link_exposure !== null ? bicyclist_link_exposure : avgWayBikeExp;
    const e_p = pedestrian_link_exposure !== null ? pedestrian_link_exposure : avgWayPedExp;
    const p = population !== null ? population : avgWayPop;
    const j = jobs !== null ? jobs : avgWayJobs;

    // bike
    ECC_partial(
      ECCmoj,
      'bicycling',
      'roadway',
      bicycle_exposure_class.toLowerCase(),
      functional.toLowerCase(),
      length / 5280,
      e_b,
      p,
      j,
    );

    // ped
    ECC_partial(
      ECCmoj,
      'walking',
      'roadway',
      pedestrian_link_exposure_class.toLowerCase(),
      functional.toLowerCase(),
      length / 5280,
      e_p,
      p,
      j,
    );
  }

  // avg props for fallback
  const avgIntBikeExp = avgProp(intersections, 'bicycle_node_exposure');
  const avgIntPedExp = avgProp(intersections, 'pedestrian_node_exposure');
  const avgIntPop = avgProp(intersections, 'population');
  const avgIntJobs = avgProp(intersections, 'jobs');

  for(let intersection of intersections) {

    const {
      bicycle_exposure_class,
      bicycle_node_exposure,
      pedestrian_exposure_class,
      pedestrian_node_exposure,
      functional,
      population,
      jobs,
    } = intersection.properties;

    // use avg if null
    const e_b = bicycle_node_exposure !== null ? bicycle_node_exposure : avgIntBikeExp;
    const e_p = pedestrian_node_exposure !== null ? pedestrian_node_exposure : avgIntPedExp;
    const p = population !== null ? population : avgIntPop;
    const j = jobs !== null ? jobs : avgIntJobs;

    // bike
    ECC_partial(
      ECCmoj,
      'bicycling',
      'intersection',
      bicycle_exposure_class.toLowerCase(),
      functional.toLowerCase(),
      1,
      e_b,
      p,
      j,
    );

    // ped
    ECC_partial(
      ECCmoj,
      'walking',
      'intersection',
      pedestrian_exposure_class.toLowerCase(),
      functional.toLowerCase(),
      1,
      e_p,
      p,
      j,
    );
  }

  // calc combined mode
  for(let c of COLUMNS) {
    for(let o of OUTCOMES) {
      for(let j of LOCATION_TYPES) {
        ECCmoj[c].combined[o][j] = (
          ECCmoj[c].bicycling[o][j] +
          ECCmoj[c].walking[o][j]
        );
      }
    }
  }

  // need a lookup for existing volume by mode and location type
  const EVcmj = calcEVcmj(ways, intersections);

  // need a lookup for projected volume by mode and location type
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

  for(let column of COLUMNS) {

    c.setPrepends('safety', 'ECmoj', [column]);
    c.setPrepends('safety', 'NCmoj', [column]);
    c.setPrepends('safety', 'CCmojvf', [column]);
    c.setPrepends('safety', 'CCmojvfe', [column]);
    c.setPrepends('safety', 'reductions', [column]);
    c.setPrepends('safety', 'CRFmoje', [column]);
    c.setPrepends('safety', 'change', [column]);
    c.setPrepends('safety', 'projected', [column]);
    c.setPrepends('safety', 'before', [column]);
    c.setPrepends('safety', 'after', [column]);

    benefits[column] = _calc(
      ECCmoj[column],
      EVcmj[column],
      PVcmjk[column],
      UI[column],
      infrastructure,
      project_time_frame,
      project_length,
      num_intersections
    );
  }

  return benefits;
}

export default calcSafetyQuantitative;
