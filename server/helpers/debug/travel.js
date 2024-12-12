import c from '../collector.js';
import writeCSV from '../writeCSV.js';

import calcProjectLength from '../benefits/calcProjectLength.js';
import calcDemand from '../benefits/calcDemand.js';
import calcTravel from '../benefits/calcTravel.js';

const travel = async (project) => {

	const projectId = project._id.toString();

	const {
		segments,
		userSegments,
		intersections,
		userIntersections,
	} = project.scope;

	const {
		infrastructure
	} = project.elements;

	const project_length = calcProjectLength(segments, userSegments);
	const num_intersections = intersections.length + userIntersections.length;

	const weighted_existing_travel = await calcDemand(
		segments,
		userSegments,
		intersections,
		userIntersections,
		project_length
	);

	calcTravel(
		infrastructure,
		weighted_existing_travel,
		project_length,
		num_intersections
	);

	writeCSV(
		projectId,
		'travel_ways',
		[
			'source',
			'bicyclist_demand',
			'population',
			'jobs',
			'used demand',
			'used population',
			'used jobs',
			'length (mi)',
			'travel',
			'travel per capita',
			'travel per jobs',
		],
		c.get('travel', 'ways')
	);

	writeCSV(
		projectId,
		'travel_intersections',
		[
			'source',
			'ped_demand',
			'population',
			'jobs',
			'used demand',
			'used population',
			'used jobs',
			'count',
			'travel',
			'travel per capita',
			'travel per jobs',
		],
		c.get('travel', 'intersections')
	);

	writeCSV(
		projectId,
		'travel_existing',
		[
			'mode',
			'total existing travel',
			'total existing travel per capita',
			'total existing travel per jobs',
			'weighted existing travel',
			'weighted existing travel per capita',
			'weighted existing travel per jobs',
		],
		c.get('travel', 'existing')
	);

	writeCSV(
		projectId,
		'travel_projected',
		[
			'column - c',
			'mode - m',
			'estimate - k',
			'weighted existing travel - WETcm',
			'total change in travel - deltaTTcmk',
			'induced travel - ITcmk',
			'route shift - RScmk',
			'car shift - CScmk',
			'other shift - OScmk',
			'projected travel - PTcmk',
		],
		c.get('travel', 'projected')
	);

	writeCSV(
		projectId,
		'travel_adjustments',
		[
			'column - c',
			'mode - m',
			'element - i',
			'element calc units',
			'element units',
			'improvement type - F',
			'element value',
			'element length or count - Ni',
			'project length or count - L',
			'estimate - k',
			'weighted existing travel - WETcm',
			'element adjustment - Eik',
			'element share - (Ni/L)',
			'scaling factor - If',
			'change in travel - deltaTcmikF',
		],
		c.get('travel', 'adjustments')
	);

}

export default travel;
