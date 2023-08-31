import { createRequire } from "module";

import {
	MODES,
	OUTCOMES,
	LOCATION_TYPES,
	VOLUMES,
	FUNCTIONAL_CLASSES,
} from '../benefits/constants.js';

import writeCSV from './writeCSV.js';

const require = createRequire(import.meta.url);
const miles = require('../../data/volume_to_miles.json');
const alpha = require('../../data/alpha_lookup.json');
const travel = require('../../data/travel_volume.json');
const safety = require('../../data/quantitative.json');

const lookups = () => {

	// alpha
	const alpha_rows = [];

	for(let m of MODES) {
		for(let o of OUTCOMES) {
			for(let j of LOCATION_TYPES) {
				for(let v of VOLUMES) {
					for(let f of FUNCTIONAL_CLASSES) {
						alpha_rows.push([
							m,
							o,
							j,
							v,
							f,
							alpha[m][o][j][v][f],
						]);
					}
				}
			}
		}
	}

	writeCSV('lookups', 'alpha', [
		'mode',
		'outcome',
		'location type',
		'volume',
		'functional class',
		'alpha',
	], alpha_rows);

	// travel
	const travel_rows = [];
	for(let el in travel) {
		for(let m of MODES) {

			if(!(m in travel[el])) {
				continue;
			}

			travel_rows.push([
				el,
				m,
				travel[el][m].lower,
				travel[el][m].mean,
				travel[el][m].upper,
			]);
		}
	}

	writeCSV('lookups', 'per_element_travel_adjustments', [
		'element',
		'mode',
		'lower adjustment (%)',
		'mean adjustment (%)',
		'upper adjustment (%)',
	], travel_rows);

	// safety
	const safety_rows = [];
	for(let el in safety) {
		for(let effect of safety[el]) {
			safety_rows.push([
				el,
				effect.mode,
				effect.outcome,
				effect.location_type,
				effect.lower,
				effect.mean,
				effect.upper,
			]);
		}
	}

	writeCSV('lookups', 'per_element_safety_adjustments', [
		'element',
		'mode',
		'outcome',
		'location type',
		'lower adjustment (%)',
		'mean adjustment (%)',
		'upper adjustment (%)',
	], safety_rows);

	const miles_rows = [];

	for(let m in miles) {
		for(let d in miles[m]) {
			miles_rows.push([
				m === 'bike' ? 'bicycling' : 'walking',
				d,
				miles[m][d],
			]);
		}
	}

	writeCSV('lookups', 'miles_traveled', [
		'mode',
		'distance (mi)',
		'value',
	], miles_rows);

}

export default lookups;
