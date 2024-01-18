import {
	MODES,
	OUTCOMES,
} from '../constants.js';

import avgProp from '../avgProp.js';

const divideOrNull = (n, d) => {
	return d !== 0 ? n / d : null;
};

const columizeSafetyInputs = (inputs, ways, intersections) => {

	// grab avg pop/jobs for ways/intersection
	const avgWayPop = avgProp(ways, 'population');
	const avgWayJobs = avgProp(ways, 'jobs');
	const avgIntPop = avgProp(intersections, 'population');
	const avgIntJobs = avgProp(intersections, 'jobs');

	// for capita and jobs properties, start with direct user inputs
	// and divide by relevant project average
	const capita = { ...inputs };
	const jobs = { ...inputs };

	// direct user inputs used for safety column
	for(let m of MODES) {
		for(let o of OUTCOMES) {
			capita[m][o].roadway = divideOrNull(capita[m][o].roadway, avgWayPop);
			capita[m][o].intersection = divideOrNull(capita[m][o].intersection, avgIntPop);

			jobs[m][o].roadway = divideOrNull(jobs[m][o].roadway, avgWayJobs);
			jobs[m][o].intersection = divideOrNull(jobs[m][o].intersection, avgIntJobs);
		}
	}

	return {
		safety: inputs,
		capita: capita,
		jobs: jobs,
	};
};

export default columizeSafetyInputs;
