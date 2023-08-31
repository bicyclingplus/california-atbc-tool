import {
	COLUMNS,
	MODES,
	LOCATION_TYPES,
} from '../constants.js';

import avgProp from '../avgProp.js';
import c from '../../collector.js';

const calcEVmj = (selectedWays, selectedIntersections) => {

	const EVmj = {};

	for(let c of COLUMNS) {
		EVmj[c] = {};

		for(let m of MODES) {
			EVmj[c][m] = {};

			for(let j of LOCATION_TYPES) {
				EVmj[c][m][j] = 0;
			}
		}
	}

	const avgWayBikeExp = avgProp(selectedWays, 'bicyclist_link_exposure');
	const avgWayPedExp = avgProp(selectedWays, 'pedestrian_link_exposure');
	const avgWayPop = avgProp(selectedWays, 'population');
	const avgWayJobs = avgProp(selectedWays, 'jobs');

	// debug
	c.put('safety', 'exp_avg', [
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
			EVmj.safety.bicycling.roadway += bikeExp;
			EVmj.capita.bicycling.roadway += bikeExp / population;
			EVmj.jobs.bicycling.roadway += bikeExp / jobs;
		}

		if(pedExp) {
			EVmj.safety.walking.roadway += pedExp;
			EVmj.capita.walking.roadway += pedExp / population;
			EVmj.jobs.walking.roadway += pedExp / jobs;
		}

		// debug
		c.put('safety', 'exp_ways', [
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
	c.put('safety', 'exp_avg', [
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
			EVmj.safety.bicycling.intersection += bikeExp;
			EVmj.capita.bicycling.intersection += bikeExp / population;
			EVmj.jobs.bicycling.intersection += bikeExp / jobs;
		}

		if(pedExp) {
			EVmj.safety.walking.intersection += pedExp;
			EVmj.capita.walking.intersection += pedExp / population;
			EVmj.jobs.walking.intersection += pedExp / jobs;
		}

		// debug
		c.put('safety', 'exp_intersections', [
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
			EVmj[c].combined[j] = EVmj[c].walking[j] + EVmj[c].bicycling[j];
		}
	}

	// debug
	for(let column of COLUMNS) {
		for(let m of MODES) {
			for(let j of LOCATION_TYPES) {
				c.put('safety', 'vmj_existing', [
					column,
					m,
					j,
					EVmj[column][m][j],
				]);
			}
		}
	}

	return EVmj;
}

export default calcEVmj;
