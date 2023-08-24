import { createRequire } from "module";

import {
	FUNCTIONAL_CLASSES,
	VOLUMES,
	POWER_SAFETY_IN_NUMBERS,

} from '../constants.js';

import c from '../../collector.js';

const require = createRequire(import.meta.url);
const Amojvf = require('../../data/alpha_lookup.json');
const quantitative = require('../../data/quantitative.json');

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


export default calcNCmoj;
