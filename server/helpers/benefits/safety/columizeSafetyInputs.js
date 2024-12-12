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

	// grab avg pop/jobs for ways/intersection
	const avgWayPop = avgProp(ways, 'population');
	const avgWayJobs = avgProp(ways, 'jobs');
	const avgIntPop = avgProp(intersections, 'population');
	const avgIntJobs = avgProp(intersections, 'jobs');

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

			capita[m][o].roadway = _divideOrNull(inputs[m][o].roadway, avgWayPop);
			capita[m][o].intersection = _divideOrNull(inputs[m][o].intersection, avgIntPop);

			jobs[m][o].roadway = _divideOrNull(inputs[m][o].roadway, avgWayJobs)
			jobs[m][o].intersection = _divideOrNull(inputs[m][o].intersection, avgIntJobs)
		}
	}

	return {
		safety: inputs,
		capita: capita,
		jobs: jobs,
	};
};

export default columizeSafetyInputs;
