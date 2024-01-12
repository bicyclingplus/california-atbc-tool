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
import calcEVmj from './safety/calcEVmj.js';
import calcPVmj from './safety/calcPVmj.js';
import calcNCmojk from './safety/calcNCmoj.js';
import {
  calcECmoj,
  calcECmoj_debug
} from './safety/calcECmoj.js';

// NEW
import { calcCC } from './safety/calcCCmojvf.js';
import avgProp from './avgProp.js';
import { createRequire } from "module";
import util from 'util';
const require = createRequire(import.meta.url);
const Amojvf = require('../../data/alpha_lookup.json');

const _calc = (
  ECCmoj,
  EVmj,
  PVmj,
  infrastructure,
  UI,
  project_time_frame,
  project_length,
  num_intersections) => {

  // calculate crash change by mode and outcome
  // calculate new crashes by mode, outcome, and location type
  // calculate existing crashes by mode, outcome, and location type
  const ECmoj = {};
  const NCmoj = {};
  const change = {};
  const projected = {};

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
    projected[m] = {};

    for(let o of OUTCOMES) {

      ECmoj[m][o] = {};
      NCmoj[m][o] = {};
      change[m][o] = {};
      projected[m][o] = {};

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
          UI,
          ECCmoj,
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

          NCmoj[m][o][j][k] = NC;

          c.put('safety', 'NCmoj', [m, o, j, k, NC]);

          // running total of the changes for each split
          change[m][o][k] += (
            NCmoj[m][o][j][k] - ECmoj[m][o][j]);
        }
      }
    }
  }

  if(c.enabled) {
    for(let m of MODES) {
      for(let o of OUTCOMES) {
        for(let e of ESTIMATES) {
          c.put('safety', 'change', [
            m,
            o,
            e,
            NCmoj[m][o].roadway[e],
            ECmoj[m][o].roadway,
            NCmoj[m][o].intersection[e],
            ECmoj[m][o].intersection,
            change[m][o][e]]);
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
          ECmoj[m][o][j] / EVmj[m][j]);

        for(let e of ESTIMATES) {

          // projected travel lookup for Vmj
          after[m][o][e] += (
            NCmoj[m][o][j][e] /
            PVmj[m][j][e]
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

        c.put('safety', 'before', [
          m,
          o,
          ECmoj[m][o].roadway,
          EVmj[m].roadway,
          ECmoj[m][o].intersection,
          EVmj[m].intersection,
          before[m][o],
        ]);

        for(let e of ESTIMATES) {

          c.put('safety', 'after', [
            m,
            o,
            e,
            NCmoj[m][o].roadway[e],
            PVmj[m].roadway[e],
            NCmoj[m][o].intersection[e],
            PVmj[m].intersection[e],
            after[m][o][e],
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

  const ECmoj_NEW = {};

  for(let c of COLUMNS) {
    ECmoj_NEW[c] = {};

    for(let m of MODES) {
      ECmoj_NEW[c][m] = {};

      for(let o of OUTCOMES) {
        ECmoj_NEW[c][m][o] = {};

        for(let j of LOCATION_TYPES) {
          ECmoj_NEW[c][m][o][j] = 0;
        }
      }
    }
  }

  const avgWayBikeExp = avgProp(ways, 'bicyclist_link_exposure');
  const avgWayPedExp = avgProp(ways, 'pedestrian_link_exposure');
  const avgWayPop = avgProp(ways, 'population');
  const avgWayJobs = avgProp(ways, 'jobs');

  for(let way of ways) {

    let m;
    const j = 'roadway';

    const L = way.properties.length / 5280;
    const v = way.properties.bicycle_exposure_class.toLowerCase();
    const f = way.properties.functional.toLowerCase();
    const bikeExp = way.properties.bicyclist_link_exposure || avgWayBikeExp;
    const pedExp = way.properties.pedestrian_link_exposure || avgWayPedExp;
    const population = way.properties.population || avgWayPop;
    const jobs = way.properties.jobs || avgWayJobs;

    if(bikeExp) {
      m = 'bicycling';
      const V = bikeExp;
      const V_pop = bikeExp / population;
      const V_jobs = bikeExp / jobs;

      for(let o of OUTCOMES) {

        const A = Amojvf[m][o][j][v][f];

        ECmoj_NEW.safety[m][o][j] += calcCC(A, L, V);
        ECmoj_NEW.capita[m][o][j] += calcCC(A, L, V_pop);
        ECmoj_NEW.jobs[m][o][j] += calcCC(A, L, V_jobs);
      }
    }

    if(pedExp) {
      m = 'walking';
      const V = pedExp;
      const V_pop = pedExp / population;
      const V_jobs = pedExp / jobs;

      for(let o of OUTCOMES) {

        const A = Amojvf[m][o][j][v][f];

        ECmoj_NEW.safety[m][o][j] += calcCC(A, L, V);
        ECmoj_NEW.capita[m][o][j] += calcCC(A, L, V_pop);
        ECmoj_NEW.jobs[m][o][j] += calcCC(A, L, V_jobs);
      }
    }
  }

  const avgIntBikeExp = avgProp(intersections, 'bicycle_node_exposure');
  const avgIntPedExp = avgProp(intersections, 'pedestrian_node_exposure');
  const avgIntPop = avgProp(intersections, 'population');
  const avgIntJobs = avgProp(intersections, 'jobs');

  for(let intersection of intersections) {

    let m;
    const j = 'intersection';

    const L = 1;
    const v = intersection.properties.bicycle_exposure_class.toLowerCase();
    const f = intersection.properties.functional.toLowerCase();
    const bikeExp = intersection.properties.bicycle_node_exposure || avgIntBikeExp;
    const pedExp = intersection.properties.pedestrian_node_exposure || avgIntPedExp;
    const population = intersection.properties.population || avgIntPop;
    const jobs = intersection.properties.jobs || avgIntJobs;

    if(bikeExp) {
      m = 'bicycling';
      const V = bikeExp;
      const V_pop = bikeExp / population;
      const V_jobs = bikeExp / jobs;

      for(let o of OUTCOMES) {

        const A = Amojvf[m][o][j][v][f];

        ECmoj_NEW.safety[m][o][j] += calcCC(A, L, V);
        ECmoj_NEW.capita[m][o][j] += calcCC(A, L, V_pop);
        ECmoj_NEW.jobs[m][o][j] += calcCC(A, L, V_jobs);
      }
    }

    if(pedExp) {
      m = 'walking';
      const V = pedExp;
      const V_pop = pedExp / population;
      const V_jobs = pedExp / jobs;

      for(let o of OUTCOMES) {

        const A = Amojvf[m][o][j][v][f];

        ECmoj_NEW.safety[m][o][j] += calcCC(A, L, V);
        ECmoj_NEW.capita[m][o][j] += calcCC(A, L, V_pop);
        ECmoj_NEW.jobs[m][o][j] += calcCC(A, L, V_jobs);
      }
    }
  }

  for(let c of COLUMNS) {
    for(let o of OUTCOMES) {
      for(let j of LOCATION_TYPES) {
        ECmoj_NEW[c].combined[o][j] = (
          ECmoj_NEW[c].bicycling[o][j] +
          ECmoj_NEW[c].walking[o][j]
        );
      }
    }
  }

  // const ECCmoj = calcECCmoj(ways, intersections);

  // need a lookup for existing volume by mode and location type
  const EVmj = calcEVmj(ways, intersections);

  // need a lookup for projected volume by mode and location type
  const PVmj = calcPVmj(
    EVmj,
    infrastructure,
    project_length,
    num_intersections);

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
      ECmoj_NEW[column],
      EVmj[column],
      PVmj[column],
      infrastructure,
      safety_inputs,
      project_time_frame,
      project_length,
      num_intersections
    );
  }

  return benefits;
}

export default calcSafetyQuantitative;
