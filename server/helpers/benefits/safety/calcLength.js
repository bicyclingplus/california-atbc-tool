import {
	SCALING_FACTORS,
} from '../constants.js';
import c from '../../collector.js';
import getElement from '../getElement.js';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const infrastructure = require('../../../data/infrastructure.json');

const calcLength = (selectedInfrastructure, project_length) => {

	let max_length = 0;

	// if any of the selected infrastructure elements have a length
	// greater than the project length, use that greater length
	// to weight element length against rather than the project length
	for(let i in selectedInfrastructure) {

		const element = getElement(i);

		// unknown (probably removed) element
		if(element === null) {
			continue;
		}

		const { calc_units } = element;

		if(calc_units !== 'length') {
			continue;
		}

		for(let T in SCALING_FACTORS) {
			const value = selectedInfrastructure[i][T];

			max_length = value > max_length ? value : max_length;

			// debug
			c.put('safety', 'length', ['item', i, T, value]);
		}
	}

	const length_to_use = Math.max(project_length, max_length);

	// debug
	c.put('safety', 'length', ['project', '', '' , project_length]);
	c.put('safety', 'length', ['safety', '', ''  , length_to_use]);

	return length_to_use;
}

export default calcLength;
