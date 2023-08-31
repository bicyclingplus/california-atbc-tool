import { createRequire } from "module";

import {
	FUNCTIONAL_CLASSES,
	VOLUMES,
	POWER_SAFETY_IN_NUMBERS,

} from '../constants.js';

import { calcCCmojvfe } from './calcCCmojvf.js';
import c from '../../collector.js';

const require = createRequire(import.meta.url);
const Amojvf = require('../../../data/alpha_lookup.json');
const quantitative = require('../../../data/quantitative.json');

// INPUTS:
// Ljvf reach lookup
// Vmj volume lookup
// m mode index (bicycling/walking)
// o outcome index (crash/injury/death)
// j location type index (intersection/roadway)
// e estimate (lower/mean/upper)
// selectedInfrastructure
const calcNCmoj = (Ljvf, Vmj, m, o, j, e, selectedInfrastructure) => {

	let total = 0;

    for(let f of FUNCTIONAL_CLASSES) {
      for(let v of VOLUMES) {

        const A = Amojvf[m][o][j][v][f];
        const L = Ljvf[j][v][f];
        const V = Vmj[m][j][e];

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

                const reduction = (benefit[e]) / 100;
                const factor = 1 - reduction;

                CRFmoji *= factor;
              }
            }
          }
        }

        total += (
          Math.exp(A) *
          L *
          Math.pow(V, POWER_SAFETY_IN_NUMBERS) *
          CRFmoji
        );
      }
    }

    return total;
}

const calcNCmoj2 = (Ljvf, Vmj, m, o, j, e, selectedInfrastructure) => {

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
  let CRFmoje = 1;

  // selected elements
  for(let el in selectedInfrastructure) {

    // does this element have safety benefits
    if(el in quantitative) {

      for(let benefit of quantitative[el]) {

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
        CRFmoje *= benefit[e] / 100;

        c.put('safety', 'reductions', [
          m,
          o,
          j,
          e,
          el,
          benefit[e],
        ]);
      }
    }
  }

  CRFmoje = (1 - CRFmoje) > 0 ? (1 - CRFmoje) : 1;

  c.put('safety', 'CRFmoje', [
    m,
    o,
    j,
    e,
    CRFmoje,
  ]);

  let total = 0;

  for(let f of FUNCTIONAL_CLASSES) {
    for(let v of VOLUMES) {
      total += calcCCmojvfe(Ljvf, Vmj, m, o, j, v, f, e);
    }
  }

  return total * CRFmoje;
}

export default calcNCmoj2;
