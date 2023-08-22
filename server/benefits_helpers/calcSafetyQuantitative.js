import { createRequire } from "module";

import {
  ESTIMATES,
  POWER_SAFETY_IN_NUMBERS,
  FUNCTIONAL_CLASSES,
  COLUMNS,
  MODES,
  LOCATION_TYPES,
  VOLUMES,
  OUTCOMES,
} from './constants.js';

import c from '../collector.js';
import calcDiscount from './calcDiscount.js';

import calcLjvf from './safety/calcLjvf.js';
import calcVmj_existing from './safety/calcVmj_existing.js';
import calcVmj_projected from './safety/calcVmj_projected.js';

const require = createRequire(import.meta.url);
const alpha_lookup = require('../data/alpha_lookup.json');
const quantitative = require('../data/quantitative.json');

const _calc = (
  Vmj_existing,
  Vmj_projected,
  Ljvf,
  selectedInfrastructure,
  user_input,
  project_time_frame) => {

  const internalCalc = () => {

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

          let EC = _ECmoj(mode, outcome, location_type);
          ECmoj[mode][outcome][location_type] = EC;


          NCmoj[mode][outcome][location_type] = {};

          // by estimate
          for(let estimate of ESTIMATES) {
            let NC = _NCmoj(mode, outcome, location_type, estimate);
            NCmoj[mode][outcome][location_type][estimate] = NC;

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

  // EXISTING CRASHES
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _ECmoj = (m, o, j) => {

    // User input number of years of data for this m, j
    let UIy = user_input[m].years[j];

    // not null and greater than 0
    if(UIy && UIy > 0) {

      // 5 or more years, use user input directly
      if(UIy >= 5) {
        return user_input[m][o][j] / UIy;
      }
      // more than 0 but less than 5, split between
      // model and user input
      else {
        return _ECmoj_split(m, o, j);
      }
    }
    // 0 or null, use model only
    else {
      return _ECmoj_model_only(m, o, j);
    }
  };

  // EXISTING CRASHES SPLIT
  // Part user input and part model
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _ECmoj_split = (m, o, j) => {

    const UImoj = user_input[m][o][j];
    const UIy = user_input[m].years[j];

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        total += ((UImoj / UIy) * (UIy / 5)) +
          ((1 - (UIy / 5)) * _CCmojvf(m, o, j, volume, functional_class));
      }
    }

    return total;
  }

  // EXISTING CRASHES MODEL ONLY
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _ECmoj_model_only = (m, o, j) => {

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        total += _CCmojvf(m, o, j, volume, functional_class);
      }
    }

    return total;

  };

  // CRASHES BY SYSTEM CLASS
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  // v volume index (low/medium/high)
  // f functional class index (major/minor/local)
  const _CCmojvf = (m, o, j, v, f) => {

    const alpha = alpha_lookup[m][o][j][v][f];
    const _Ljvf = Ljvf[j][v][f];
    const Vmj = Vmj_existing[m][j];

    return Math.exp(alpha) * _Ljvf * Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS);
  };

  // NEW CRASHES
  // INPUTS:
  // m mode index (bicycling/walking)
  // o outcome index (crash/injury/death)
  // j location type index (intersection/roadway)
  const _NCmoj = (m, o, j, estimate) => {

    let total = 0;

    for(let functional_class of FUNCTIONAL_CLASSES) {
      for(let volume of VOLUMES) {

        let alpha = alpha_lookup[m][o][j][volume][functional_class];
        let _Ljvf = Ljvf[j][volume][functional_class];
        let Vmj = Vmj_projected[m][j][estimate];

        // crash reduction factor default to 1 (no reduction)
        let CRFmoji = 1;

        // loop over elements that have safety benefits
        for(let element in quantitative) {

          // only consider selected elements
          if(element in selectedInfrastructure) {

            // go through the safety benefits for this element
            for(let benefit of quantitative[element]) {


              // only apply benefits meant for this m/o/j
              if((benefit.mode === m || m === 'combined') &&
                benefit.outcome === o &&
                benefit.location_type === j) {

                let reduction = (benefit[estimate]) / 100;
                let factor = 1 - reduction;

                CRFmoji *= factor;
              }
            }
          }
        }

        total += (
          Math.exp(alpha) *
          _Ljvf *
          Math.pow(Vmj, POWER_SAFETY_IN_NUMBERS) *
          CRFmoji
        );
      }
    }

    return total;
  };

  return internalCalc();
};


const calcSafetyQuantitative = (
  selectedWays,
  selectedIntersections,
  selectedInfrastructure,
  project_length,
  num_intersections,
  user_input,
  project_time_frame) => {

  // need a lookup for existing volume by mode and location type
  const Vmj_existing = calcVmj_existing(
    selectedWays, selectedIntersections);

  // need a lookup for projected volume by mode and location type
  const Vmj_projected = calcVmj_projected(
    Vmj_existing,
    selectedInfrastructure,
    project_length,
    num_intersections);

  // need a lookup for length/count by volume and functional class and location type
  const Ljvf = calcLjvf(selectedWays, selectedIntersections);

  // generate output for each set of columns in the safety benefits table
  const benefits = {};

  for(let column of COLUMNS) {
    benefits[column] = _calc(
      Vmj_existing[column],
      Vmj_projected[column],
      Ljvf,
      selectedInfrastructure,
      user_input,
      project_time_frame
    );
  }

  return benefits;
}

export default calcSafetyQuantitative;
