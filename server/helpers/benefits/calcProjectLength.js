import c from '../collector.js';
import * as turf from "@turf/turf";

const FEET_PER_KM = 3280.84;

const calcProjectLength = (selectedWays, userWays) => {

	let network_length = 0;
	let user_length = 0;

	for(let way of selectedWays) {
		let l = turf.length(way); // km

		// currently no doubling for two way roads,
    	// see client/src/BCTool/ProjectMap/ProjectMap.js:L210
		// if(way.properties.one_way_ca === '0') {
		// 	l *= 2; // km
		// }

		c.put('reach', 'ways', ['network', l * FEET_PER_KM]); // feet
		network_length += l; // km
	}

	c.put('reach', 'ways', ['network total', network_length * FEET_PER_KM]); // feet

	for(let way of userWays) {
		let l = turf.length(way); // km

		if(way.properties.one_way_ca) {
			l *= 2; // km
		}

		c.put('reach', 'ways', ['user', l * FEET_PER_KM]); // feet
		user_length += l; // km
	}

	c.put('reach', 'ways', ['user total', user_length * FEET_PER_KM]); // feet
	c.put('reach', 'ways', ['project total', (network_length + user_length) * FEET_PER_KM]); // feet

	return (network_length + user_length) * FEET_PER_KM; // feet

}

export default calcProjectLength;
