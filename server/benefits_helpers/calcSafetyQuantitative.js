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
  column,
  Ljvf,
  Vmj_existing,
  Vmj_projected,
  selectedInfrastructure,
  user_input,
  project_time_frame) => {

  // calculate crash change by mode and outcome
  // calculate new crashes by mode, outcome, and location type
  // calculate existing crashes by mode, outcome, and location type
  const change = {};
  const NCmoj = {};
  const ECmoj = {};

  for(let mode of MODES) {

    change[mode] = {};
    NCmoj[mode] = {};
    ECmoj[mode] = {};

    for(let outcome of OUTCOMES) {

      change[mode][outcome] = {};
      NCmoj[mode][outcome] = {};
      ECmoj[mode][outcome] = {};

      for(let estimate of ESTIMATES) {
        change[mode][outcome][estimate] = 0;
      }

      for(let location_type of LOCATION_TYPES) {

        let EC = calcECmoj(
          user_input,
          Ljvf,
          Vmj_existing,
          mode,
          outcome,
          location_type
        );

        if(c.enabled) {

          const ec_debug = calcECmoj_debug(
            user_input,
            Ljvf,
            Vmj_existing,
            mode,
            outcome,
            location_type
          );

          c.put('safety', 'ECmoj', [
            column,
            mode,
            outcome,
            location_type,
            ec_debug.user,
            ec_debug.split,
            ec_debug.model,
            ec_debug.used,
          ]);
        }

        ECmoj[mode][outcome][location_type] = EC;


        NCmoj[mode][outcome][location_type] = {};

        // by estimate
        for(let estimate of ESTIMATES) {
          let NC = calcNCmoj(
            Ljvf,
            Vmj_projected,
            mode,
            outcome,
            location_type,
            estimate,
            selectedInfrastructure
          );

          NCmoj[mode][outcome][location_type][estimate] = NC;

          c.put('safety', 'NCmoj', [
            column,
            mode,
            outcome,
            location_type,
            estimate,
            NC,
          ])

          change[mode][outcome][estimate] += NC - EC;
        }
      }
    }
  }

  // calculate discount over project timespan
  // this is opposite of all the other benefits
  for(let mode of MODES) {
    for(let outcome of OUTCOMES) {
      for(let estimate of ESTIMATES) {
        let current = change[mode][outcome][estimate];
        let discounted = calcDiscount(current, project_time_frame);

        change[mode][outcome][estimate] = discounted;
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

  console.log('change');
  console.log(change);
  console.log('ECmoj');
  console.log(ECmoj);
  console.log('NCmoj');
  console.log(NCmoj);

  // calc before crash outcomes per 1000 volume by mode and outcome
  // calc after crash outcomes per 1000 volume by mode and outcome
  let before = {};
  let after = {};

  for(let mode of MODES) {

    before[mode] = {};
    after[mode] = {};

    for(let outcome of OUTCOMES) {

      before[mode][outcome] = 0;
      after[mode][outcome] = {};

      for(let estimate of ESTIMATES) {
        after[mode][outcome][estimate] = 0;
      }

      for(let location_type of LOCATION_TYPES) {

        // existing travel lookup for Vmj
        before[mode][outcome] += (
          ECmoj[mode][outcome][location_type] / Vmj_existing[mode][location_type]);

        for(let estimate of ESTIMATES) {

          // projected travel lookup for Vmj
          after[mode][outcome][estimate] += (
            NCmoj[mode][outcome][location_type][estimate] /
            Vmj_projected[mode][location_type][estimate]
          );
        }
      }
    }
  }

  for(let mode of MODES) {
    for(let outcome of OUTCOMES) {
      before[mode][outcome] *= 1000;

      for(let estimate of ESTIMATES) {
        after[mode][outcome][estimate] *= 1000;
      }
    }
  }

  console.log('before');
  console.log(before);
  console.log('after');
  console.log(after);

  return {
    change: change,
    before: before,
    after: after,
  };
};


const calcSafetyQuantitative = (
  selectedWays,
  selectedIntersections,
  selectedInfrastructure,
  project_length,
  num_intersections,
  user_input,
  project_time_frame) => {

  // need a lookup for length/count by volume and functional class and location type
  const Ljvf = calcLjvf(selectedWays, selectedIntersections);

  // need a lookup for existing volume by mode and location type
  const Vmj_existing = calcVmj_existing(
    selectedWays, selectedIntersections);

  // need a lookup for projected volume by mode and location type
  const Vmj_projected = calcVmj_projected(
    Vmj_existing,
    selectedInfrastructure,
    project_length,
    num_intersections);

  // generate output for each set of columns in the safety benefits table
  const benefits = {};

  for(let column of COLUMNS) {
    benefits[column] = _calc(
      column,
      Ljvf,
      Vmj_existing[column],
      Vmj_projected[column],
      selectedInfrastructure,
      user_input,
      project_time_frame
    );
  }

  return benefits;
}

export default calcSafetyQuantitative;
