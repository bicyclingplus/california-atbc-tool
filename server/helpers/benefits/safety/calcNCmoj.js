import { createRequire } from "module";

import {
	FUNCTIONAL_CLASSES,
	VOLUMES,
	POWER_SAFETY_IN_NUMBERS,
  SCALING_FACTORS,
} from '../constants.js';

import calcLength from './calcLength.js';
import calcShare from '../calcShare.js';
import c from '../../collector.js';
import getElement from '../getElement.js';

const require = createRequire(import.meta.url);
const quantitative = require('../../../data/quantitative.json');
const travel_volume = require('../../../data/travel_volume.json');

const calcNCmojk = (
  ECmoj,
  m,
  o,
  j,
  k,
  selectedInfrastructure,
  project_length,
  num_intersections) => {

  // we used to sum all the reductions for each element
  // now we calculate a combined crash reduction factor
  // by multiplying all the factors for each element
  // together and use that combined factor to calculate
  // the total reduction

  // example
  // lets say we have 3 elements that reduce crashes
  // by 10%, 20%, and 30% with 20 new crashes. we used to
  // add these together to get 60%, which would be a
  // reduction of 12, so 8 new crashes
  // now we do 10% x 20% x 30% = 0.6%, which would be
  // a reduction of 0.12, so 19.88 new crashes

  // i'm still not sure if this is right, but can't find
  // much documentation on how this is supposed to work
  // i think the technical docs are scant on details for
  // a reason

  // crash reduction factor default to 1 (no reduction)
  let CRFmojk = 1;

  // selected elements
  for(let i in selectedInfrastructure) {

    // does this element have safety benefits
    if(i in quantitative) {

      for(let benefit of quantitative[i]) {

        // does this benefit apply to this mode?
        // combined mode receives all benefits
        if(m !== 'combined' && benefit.mode !== m) {
          continue;
        }

        // does this benefit apply to this outcome?
        if(benefit.outcome !== o) {
          continue;
        }

        // does this benefit apply to this location type
        if(benefit.location_type !== j) {
          continue;
        }

        // example
        // conventional bike lane
        // mode = combined
        // outcome = crash
        // location_type = roadway
        // mean benefit is 36
        //
        // numbers given are percents
        //
        // this means conventional bike lanes
        // will cause a 36% reduction in crashes
        // on roadways for bicycling and walking
        //
        // lets pretend we've calculated 20 for
        // new crashes for this m, o, v, j, f, e
        // 20 * (36 / 100) = 7.2
        // so the number of new crashes should be
        // reduced by 7.2, ie 12.8
        //
        // so we just do 20 * (1 - (36 / 100)) = 12.8
        // CRFmojk *= benefit[k] / 100;
        CRFmojk *= (1 - (benefit[k] / 100));

        c.put('safety', 'reductions', [
          m,
          o,
          j,
          k,
          i,
          benefit[k],
        ]);
      }
    }
  }

  // CRFmojk = (1 - CRFmojk) > 0 ? (1 - CRFmojk) : 1;

  c.put('safety', 'CRFmoje', [
    m,
    o,
    j,
    k,
    CRFmojk,
  ]);

  // calc total adjustments
  // crash reduction factor CRFmojk is based on elements
  // that have safety benefits
  // here we need to calculate the total adjustment
  // based on travel benefits
  // loop over selected infrastructure elements
  // similar logic to CRFmojk above,
  // but summation rather than product
  // loop over improvement types
  // similar to PVmjk calculation
  // TODO fix PVmjk combined mode to be similar to CRFmojk
  const L = calcLength(selectedInfrastructure, project_length);

  let total = 0;

  // selected elements
  for(let i in selectedInfrastructure) {

    // does this element have safety benefits
    if(i in travel_volume) {

      for(let mode in travel_volume[i]) {

        // does this benefit apply to this mode?
        // combined mode receives all benefits
        if(m !== 'combined' && m !== mode) {
          continue;
        }

        // benefit amount
        // for this infrastructure element, i
        // for this mode
        // for this estimate, k
        // percentage
        // positive is an increase (eg. 77% -> 1.77)
        // negative is a decrease (eg. -20% -> 0.80)
        const E_sub_ik = (1 + (travel_volume[i][mode][k] / 100));

        // each type of improvment scales the effect
        // by a different factor
        for(let F in SCALING_FACTORS) {

          // the amount of this type of improvement (length or count)
          const N_sub_i = selectedInfrastructure[i][F];

          // no improvement of this type
          if(N_sub_i === 0) {
            continue;
          }

          // the factor to scale the effect by
          const I_sub_F = SCALING_FACTORS[F];

          // the share of this infrastructure element of
          // the entire project (length or count)
          const { share: N_sub_i_over_L } = calcShare(
            getElement(i), N_sub_i, L, num_intersections);

          // accumulate the total change due to infrastructure elements
          total += E_sub_ik * N_sub_i_over_L * I_sub_F;
        }
      }
    }
  }

  const NCmojk = ECmoj * total * CRFmojk;

  return NCmojk;
}

export default calcNCmojk;
