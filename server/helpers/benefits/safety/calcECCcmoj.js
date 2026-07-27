import { createRequire } from "module";

import {
  COLUMNS,
  MODES,
  LOCATION_TYPES,
  OUTCOMES,
} from '../constants.js';
import { calcCC } from './calcCCmojvf.js';
import avgProp from '../avgProp.js';

import * as turf from "@turf/turf";

const FEET_PER_KM = 3280.84;
const FEET_PER_MI = 5280;

const require = createRequire(import.meta.url);
const Amojvf = require('../../../data/alpha_lookup.json');

const map_functional = {
	"local road": "local",
	"minor road": "minor_road",
	"major road": "major_road",
};

const _ECC_partial = (
  ECC,
  m,
  j,
  v,
  f,
  L,
  exposure,
) => {

  if(exposure === null) {
    return;
  }

  for(let o of OUTCOMES) {
    const A = Amojvf[m][o][j][v][map_functional[f]];

    if(!A) {
    	console.log(m)
    	console.log(o)
    	console.log(j)
    	console.log(v)
    	console.log(f)
    	console.log("ALPHA LOOKUP FAILED")
    }

    const V = exposure;

    ECC.safety[m][o][j] += calcCC(A, L, V);
  }
};

const calcECCcmoj = (ways, intersections) => {
	// init object with zeroes
	const ECCcmoj = {};

	for(let c of COLUMNS) {
	  ECCcmoj[c] = {};

	  for(let m of MODES) {
	    ECCcmoj[c][m] = {};

	    for(let o of OUTCOMES) {
	      ECCcmoj[c][m][o] = {};

	      for(let j of LOCATION_TYPES) {
	        ECCcmoj[c][m][o][j] = 0;
	      }
	    }
	  }
	}

	for(let way of ways) {

	  const {
	    bicycle_exposure_class,
	    pred_bike_vol,
	    pedestrian_exposure_class,
	    pred_ped_vol,
	    functional,
	  } = way.properties;

	  const length = turf.length(way) * FEET_PER_KM; // feet

	  // bike
	  _ECC_partial(
	    ECCcmoj,
	    'bicycling',
	    'roadway',
	    bicycle_exposure_class.toLowerCase(),
	    functional.toLowerCase(),
	    length / FEET_PER_MI, // mi
	    pred_bike_vol,
	  );

	  // ped
	  _ECC_partial(
	    ECCcmoj,
	    'walking',
	    'roadway',
	    pedestrian_exposure_class.toLowerCase(),
	    functional.toLowerCase(),
	    length / FEET_PER_MI, // mi
	    pred_ped_vol,
	  );
	}

	for(let intersection of intersections) {

	  const {
	    bicycle_exposure_class,
	    pred_bike_vol,
	    pedestrian_exposure_class,
	    pred_ped_vol,
	    functional,
	  } = intersection.properties;

	  // bike
	  _ECC_partial(
	    ECCcmoj,
	    'bicycling',
	    'intersection',
	    bicycle_exposure_class.toLowerCase(),
	    functional.toLowerCase(),
	    1,
	    pred_bike_vol,
	  );

	  // ped
	  _ECC_partial(
	    ECCcmoj,
	    'walking',
	    'intersection',
	    pedestrian_exposure_class.toLowerCase(),
	    functional.toLowerCase(),
	    1,
	    pred_ped_vol,
	  );
	}

	return ECCcmoj;
}

export default calcECCcmoj;
