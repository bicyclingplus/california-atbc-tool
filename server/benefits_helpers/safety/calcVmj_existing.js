import {
	COLUMNS,
	MODES,
	LOCATION_TYPES,
} from '../constants.js';

import avgProp from '../avgProp.js';
import c from '../../collector.js';

const calcVmj_existing = (selectedWays, selectedIntersections) => {

	const Vmj_existing = {};

	for(let column of COLUMNS) {
		Vmj_existing[column] = {};

		for(let mode of MODES) {
			Vmj_existing[column][mode] = {};

			for(let location_type of LOCATION_TYPES) {
				Vmj_existing[column][mode][location_type] = 0;
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
			Vmj_existing.safety.bicycling.roadway += bikeExp;
			Vmj_existing.capita.bicycling.roadway += bikeExp / population;
			Vmj_existing.jobs.bicycling.roadway += bikeExp / jobs;
		}

		if(pedExp) {
			Vmj_existing.safety.walking.roadway += pedExp;
			Vmj_existing.capita.walking.roadway += pedExp / population;
			Vmj_existing.jobs.walking.roadway += pedExp / jobs;
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
			Vmj_existing.safety.bicycling.intersection += bikeExp;
			Vmj_existing.capita.bicycling.intersection += bikeExp / population;
			Vmj_existing.jobs.bicycling.intersection += bikeExp / jobs;
		}

		if(pedExp) {
			Vmj_existing.safety.walking.intersection += pedExp;
			Vmj_existing.capita.walking.intersection += pedExp / population;
			Vmj_existing.jobs.walking.intersection += pedExp / jobs;
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
	for(let column of COLUMNS) {
		for(let location_type of LOCATION_TYPES) {

			Vmj_existing[column].combined[location_type] = (
				Vmj_existing[column].walking[location_type] +
				Vmj_existing[column].bicycling[location_type]
			);
		}
	}

	// debug
	for(let column of COLUMNS) {
		for(let mode of MODES) {
			for(let location_type of LOCATION_TYPES) {
				c.put('safety', 'vmj_existing', [
					column,
					mode,
					location_type,
					Vmj_existing[column][mode][location_type],
				]);
			}
		}
	}

	return Vmj_existing;
}

export default calcVmj_existing;
