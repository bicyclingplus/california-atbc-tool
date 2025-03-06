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

const _ECC_partial = (
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

	// avg props for fallback
	const avgWayBikeExp = avgProp(ways, 'bicyclist_link_exposure');
	const avgWayPedExp = avgProp(ways, 'pedestrian_link_exposure');
	const avgWayPop = avgProp(ways, 'population');
	const avgWayJobs = avgProp(ways, 'jobs');

	for(let way of ways) {

	  const {
	    bicycle_exposure_class,
	    bicyclist_link_exposure,
	    pedestrian_link_exposure_class,
	    pedestrian_link_exposure,
	    functional,
	    population,
	    jobs,
	  } = way.properties;

	  const length = turf.length(way) * FEET_PER_KM; // feet

	  if(functional === null) {
	  	continue;
	  }

	  // use avg if null
	  const e_b = bicyclist_link_exposure !== null ? bicyclist_link_exposure : avgWayBikeExp;
	  const e_p = pedestrian_link_exposure !== null ? pedestrian_link_exposure : avgWayPedExp;
	  const p = population !== null ? population : avgWayPop;
	  const j = jobs !== null ? jobs : avgWayJobs;

	  // bike
	  if(bicycle_exposure_class !== null) {
		  _ECC_partial(
		    ECCcmoj,
		    'bicycling',
		    'roadway',
		    bicycle_exposure_class.toLowerCase(),
		    functional.toLowerCase(),
		    length / FEET_PER_MI, // mi
		    e_b,
		    p,
		    j,
		  );
		 }

	  // ped
		if(pedestrian_link_exposure_class !== null) {
		  _ECC_partial(
		    ECCcmoj,
		    'walking',
		    'roadway',
		    pedestrian_link_exposure_class.toLowerCase(),
		    functional.toLowerCase(),
		    length / FEET_PER_MI, // mi
		    e_p,
		    p,
		    j,
		  );
		}
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

	  if(functional === null) {
	  	continue;
	  }

	  // use avg if null
	  const e_b = bicycle_node_exposure !== null ? bicycle_node_exposure : avgIntBikeExp;
	  const e_p = pedestrian_node_exposure !== null ? pedestrian_node_exposure : avgIntPedExp;
	  const p = population !== null ? population : avgIntPop;
	  const j = jobs !== null ? jobs : avgIntJobs;

	  // bike
	  if(bicycle_exposure_class !== null) {
		  _ECC_partial(
		    ECCcmoj,
		    'bicycling',
		    'intersection',
		    bicycle_exposure_class.toLowerCase(),
		    functional.toLowerCase(),
		    1,
		    e_b,
		    p,
		    j,
		  );
		}

	  // ped
	  if(pedestrian_exposure_class !== null) {
		  _ECC_partial(
		    ECCcmoj,
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
	}

	// calc combined mode
	for(let c of COLUMNS) {
	  for(let o of OUTCOMES) {
	    for(let j of LOCATION_TYPES) {
	      ECCcmoj[c].combined[o][j] = (
	        ECCcmoj[c].bicycling[o][j] +
	        ECCcmoj[c].walking[o][j]
	      );
	    }
	  }
	}

	return ECCcmoj;
}

export default calcECCcmoj;
