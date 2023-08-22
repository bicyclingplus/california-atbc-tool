import {
	LOCATION_TYPES,
	VOLUMES,
	FUNCTIONAL_CLASSES,
} from '../constants.js';

import c from '../../collector.js';

const calcLjvf = (selectedWays, selectedIntersections) => {

	const Ljvf = {};

	for(let location_type of LOCATION_TYPES) {

		Ljvf[location_type] = {};

		for(let volume of VOLUMES) {

			Ljvf[location_type][volume] = {};

			for(let functional_class of FUNCTIONAL_CLASSES) {
				Ljvf[location_type][volume][functional_class] = 0;
			}
		}
	}

	// for each selected way, selected intersection
	// add length / increment count for Lvf
	for(let way of selectedWays) {

		// populate Ljvf
		const functional_class = way.properties.functional;
		const volume_bike = way.properties.bicycle_exposure_class;
		const length = way.properties.length / 5280;

		if(volume_bike) {
			Ljvf.roadway[volume_bike.toLowerCase()][functional_class] += length;
		}
	}

	for(let intersection of selectedIntersections) {

		// populate Ljvf
		const functional_class = intersection.properties.functional;
		const volume_ped = intersection.properties.pedestrian_exposure_class;

		if(volume_ped) {
			Ljvf.intersection[volume_ped.toLowerCase()][functional_class]++;
		}
	}

	// debug
	for(let location_type of LOCATION_TYPES) {
		for(let volume of VOLUMES) {
			for(let functional_class of FUNCTIONAL_CLASSES) {
				c.put('safety', 'ljvf', [
					location_type,
					volume,
					functional_class,
					Ljvf[location_type][volume][functional_class],
				]);
			}
		}
	}

	return Ljvf;
}


export default calcLjvf;