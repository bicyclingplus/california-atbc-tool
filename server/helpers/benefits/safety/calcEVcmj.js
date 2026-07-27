import {
	COLUMNS,
	MODES,
	LOCATION_TYPES,
} from '../constants.js';
import avgProp from '../avgProp.js';
import z from '../../collector.js';

import * as turf from "@turf/turf";

const FEET_PER_KM = 3280.84;

const calcEVcmj = (selectedWays, selectedIntersections) => {

	const EVcmj = {};

	for(let c of COLUMNS) {
		EVcmj[c] = {};

		for(let m of MODES) {
			EVcmj[c][m] = {};

			for(let j of LOCATION_TYPES) {
				EVcmj[c][m][j] = 0;
			}
		}
	}

	// debug
	z.put('safety', 'exp_avg', [
		'way',
		'removed',
		'removed',
		'removed',
		'removed',
	]);

	// for each selected way, selected intersection
	// add appropriate properties to corresponding Vmj_existing
	for(let way of selectedWays) {

		const {
			pred_bike_vol,
			pred_ped_vol,
		} = way.properties;

		EVcmj.safety.bicycling.roadway += pred_bike_vol;
		EVcmj.safety.walking.roadway += pred_ped_vol;

		// debug
		z.put('safety', 'exp_ways', [
			pred_bike_vol,
			pred_ped_vol,
			'removed',
			'removed',
			'removed',
			'removed',
			'removed',
		]);
	}

	// debug
	z.put('safety', 'exp_avg', [
		'intersection',
		'removed',
		'removed',
		'removed',
		'removed',
	]);

	for(let intersection of selectedIntersections) {

		const {
			pred_bike_vol,
			pred_ped_vol,
		} = intersection.properties;

		EVcmj.safety.bicycling.intersection += pred_bike_vol;
		EVcmj.safety.walking.intersection += pred_ped_vol;

		// debug
		z.put('safety', 'exp_intersections', [
			pred_bike_vol,
			pred_ped_vol,
			'removed',
			'removed',
			'removed',
			'removed',
		]);
	}

	// debug
	for(let c of COLUMNS) {
		for(let m of MODES) {
			for(let j of LOCATION_TYPES) {
				z.put('safety', 'vmj_existing', [
					c,
					m,
					j,
					EVcmj[c][m][j],
				]);
			}
		}
	}

	return EVcmj;
}

export default calcEVcmj;
