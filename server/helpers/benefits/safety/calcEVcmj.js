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

		const bikeExp = way.properties.bicyclist_link_exposure || avgWayBikeExp;
		const pedExp = way.properties.pedestrian_link_exposure || avgWayPedExp;
		const population = way.properties.population || avgWayPop;
		const jobs = way.properties.jobs || avgWayJobs;

		if(bikeExp) {
			EVcmj.safety.bicycling.roadway += bikeExp;
			EVcmj.capita.bicycling.roadway += bikeExp / population;
			EVcmj.jobs.bicycling.roadway += bikeExp / jobs;
		}

		if(pedExp) {
			EVcmj.safety.walking.roadway += pedExp;
			EVcmj.capita.walking.roadway += pedExp / population;
			EVcmj.jobs.walking.roadway += pedExp / jobs;
		}

		// debug
		z.put('safety', 'exp_ways', [
			way.properties.bicyclist_link_exposure,
			way.properties.pedestrian_link_exposure,
			way.properties.population,
			way.properties.jobs,
			way.properties.functional,
			way.properties.bicycle_exposure_class,
			way.properties.length,
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

		const bikeExp = intersection.properties.bicycle_node_exposure || avgIntBikeExp;
		const pedExp = intersection.properties.pedestrian_node_exposure || avgIntPedExp;
		const population = intersection.properties.population || avgIntPop;
		const jobs = intersection.properties.jobs || avgIntJobs;

		if(bikeExp) {
			EVcmj.safety.bicycling.intersection += bikeExp;
			EVcmj.capita.bicycling.intersection += bikeExp / population;
			EVcmj.jobs.bicycling.intersection += bikeExp / jobs;
		}

		if(pedExp) {
			EVcmj.safety.walking.intersection += pedExp;
			EVcmj.capita.walking.intersection += pedExp / population;
			EVcmj.jobs.walking.intersection += pedExp / jobs;
		}

		// debug
		z.put('safety', 'exp_intersections', [
			intersection.properties.bicycle_node_exposure,
			intersection.properties.pedestrian_node_exposure,
			intersection.properties.population,
			intersection.properties.jobs,
			intersection.properties.functional,
			intersection.properties.pedestrian_exposure_class,
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
