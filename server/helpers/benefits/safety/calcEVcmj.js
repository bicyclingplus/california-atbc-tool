import {
	COLUMNS,
	MODES,
	LOCATION_TYPES,
} from '../constants.js';
import avgProp from '../avgProp.js';
import z from '../../collector.js';

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

	const avgWayBikeExp = avgProp(selectedWays, 'bicyclist_link_exposure');
	const avgWayPedExp = avgProp(selectedWays, 'pedestrian_link_exposure');
	const avgWayPop = avgProp(selectedWays, 'population');
	const avgWayJobs = avgProp(selectedWays, 'jobs');

	// debug
	z.put('safety', 'exp_avg', [
		'way',
		avgWayBikeExp,
		avgWayPedExp,
		avgWayPop,
		avgWayJobs,
	]);

	// for each selected way, selected intersection
	// add appropriate properties to corresponding Vmj_existing
	for(let way of selectedWays) {

		const {
			bicyclist_link_exposure: bikeExp,
			pedestrian_link_exposure: pedExp,
			population,
			jobs,
			functional,
			bicycle_exposure_class,
			length,
		} = way.properties;

		const e_b = bikeExp !== null ? bikeExp : avgWayBikeExp;
		const e_p = pedExp !== null ? pedExp : avgWayPedExp;
		const p = population !== null ? population : avgWayPop;
		const j = jobs !== null ? jobs : avgWayJobs;

		if(e_b !== null) {
			EVcmj.safety.bicycling.roadway += e_b;

			// handle potential div by zero
			if(p !== null && p !== 0) {
				EVcmj.capita.bicycling.roadway += e_b / p;
			}

			// handle potential div by zero
			if(j !== null && j !== 0) {
				EVcmj.jobs.bicycling.roadway += e_b / j;
			}
		}

		if(e_p !== null) {
			EVcmj.safety.walking.roadway += e_p;

			// handle potential div by zero
			if(p !== null && p !== 0) {
				EVcmj.capita.walking.roadway += e_p / p;
			}

			// handle potential div by zero
			if(j !== null && j !== 0) {
				EVcmj.jobs.walking.roadway += e_p / j;
			}
		}

		// debug
		z.put('safety', 'exp_ways', [
			bikeExp,
			pedExp,
			population,
			jobs,
			functional,
			bicycle_exposure_class,
			length,
		]);
	}

	const avgIntBikeExp = avgProp(selectedIntersections, 'bicycle_node_exposure');
	const avgIntPedExp = avgProp(selectedIntersections, 'pedestrian_node_exposure');
	const avgIntPop = avgProp(selectedIntersections, 'population');
	const avgIntJobs = avgProp(selectedIntersections, 'jobs');

	// debug
	z.put('safety', 'exp_avg', [
		'intersection',
		avgIntBikeExp,
		avgIntPedExp,
		avgIntPop,
		avgIntJobs,
	]);

	for(let intersection of selectedIntersections) {

		const {
			bicycle_node_exposure: bikeExp,
			pedestrian_node_exposure: pedExp,
			population,
			jobs,
			functional,
			pedestrian_exposure_class,
		} = intersection.properties;

		const e_b = bikeExp !== null ? bikeExp : avgIntBikeExp;
		const e_p = pedExp !== null ? pedExp : avgIntPedExp;
		const p = population !== null ? population : avgIntPop;
		const j = jobs !== null ? jobs : avgIntJobs;

		if(e_b !== null) {
			EVcmj.safety.bicycling.intersection += e_b;

			// handle potential div by zero
			if(p !== null && p !== 0) {
				EVcmj.capita.bicycling.intersection += e_b / p;
			}

			// handle potential div by zero
			if(j !== null && j !== 0) {
				EVcmj.jobs.bicycling.intersection += e_b / j;
			}
		}

		if(e_p !== null) {
			EVcmj.safety.walking.intersection += e_p;

			// handle potential div by zero
			if(p !== null && p !== 0) {
				EVcmj.capita.walking.intersection += e_p / p;
			}

			// handle potential div by zero
			if(j !== null && j !== 0) {
				EVcmj.jobs.walking.intersection += e_p / j;
			}
		}

		// debug
		z.put('safety', 'exp_intersections', [
			bikeExp,
			pedExp,
			population,
			jobs,
			functional,
			pedestrian_exposure_class,
		]);
	}

	// calc combined for Vmj_existing
	for(let c of COLUMNS) {
		for(let j of LOCATION_TYPES) {
			EVcmj[c].combined[j] = EVcmj[c].walking[j] + EVcmj[c].bicycling[j];
		}
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
