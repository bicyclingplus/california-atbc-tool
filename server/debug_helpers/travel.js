import c from '../collector.js';
import writeCSV from './writeCSV.js';

import calcProjectLength from '../benefits_helpers/calcProjectLength.js';
import calcDemand from '../benefits_helpers/calcDemand.js';
import calcTravel from '../benefits_helpers/calcTravel.js';

const travel = (project) => {

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

	const weighted_existing_travel = calcDemand(
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
		'travel_existing_bicycling_ways',
		[
			'type',
			'demand',
			'population',
			'jobs',
			'length (mi)',
			'travel',
			'travel per capita',
			'travel per jobs',
		],
		c.get('demand', 'bike_ways')
	);

	writeCSV(
		projectId,
		'travel_existing_bicycling',
		[
			'type',
			'travel',
			'travel per capita',
			'travel per jobs',
		],
		c.get('demand', 'bike')
	);

	writeCSV(
		projectId,
		'travel_existing_walking_intersections',
		[
			'type',
			'demand',
			'population',
			'jobs',
			'travel',
			'travel per capita',
			'travel per jobs',
		],
		c.get('demand', 'ped_intersections')
	);

	writeCSV(
		projectId,
		'travel_existing_walking',
		[
			'type',
			'travel',
			'travel per capita',
			'travel per jobs',
		],
		c.get('demand', 'ped')
	);

}

export default travel;
