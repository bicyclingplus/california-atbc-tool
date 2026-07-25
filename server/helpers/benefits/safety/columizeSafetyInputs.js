import {
	MODES,
	OUTCOMES,
	LOCATION_TYPES,
} from '../constants.js';
import avgProp from '../avgProp.js';

const _divideOrNull = (n, d) => {
	return d !== null && d !== 0 ? n / d : null;
};

const columizeSafetyInputs = (inputs, ways, intersections) => {

	const capita = {};
	const jobs = {};

	for(let m of MODES) {

		capita[m] = {};
		jobs[m] = {};

		capita[m].years = inputs[m].years;
		jobs[m].years = inputs[m].years;

		for(let o of OUTCOMES) {
			capita[m][o] = {};
			jobs[m][o] = {};

			capita[m][o].roadway = 0
			capita[m][o].intersection = 0

			jobs[m][o].roadway = 0
			jobs[m][o].intersection = 0
		}
	}

	return {
		safety: inputs,
		capita: capita,
		jobs: jobs,
	};
};

export default columizeSafetyInputs;
