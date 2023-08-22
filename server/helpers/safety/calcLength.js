import {
	SCALING_FACTORS,
} from '../constants.js';

import c from '../../collector.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const infrastructure = require('../../data/infrastructure.json');

const calcLength = (selectedInfrastructure, project_length) => {

	let max_length = 0;

	// if any of the selected infrastructure elements have a length
	// greater than the project length, use that greater length
	// to weight element length against rather than the project length
	for(let category of infrastructure.categories) {

		for(let item of category.items) {

			if(item.shortname in selectedInfrastructure &&
				item.calc_units === 'length') {

				for(let type in SCALING_FACTORS) {

					let value = selectedInfrastructure[item.shortname][type];

					max_length = value > max_length ? value : max_length;

					// debug
					c.put('safety', 'length', ['item', item.shortname, type, value]);
				}
			}
		}
	}

	const length_to_use = Math.max(project_length, max_length);

	// debug
	c.put('safety', 'length', ['project', '', '' , project_length]);
	c.put('safety', 'length', ['safety', '', ''  , length_to_use]);

	return length_to_use;
}

export default calcLength;
