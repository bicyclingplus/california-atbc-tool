import c from '../collector.js';
import writeCSV from './writeCSV.js';

import calcProjectLength from '../benefits_helpers/calcProjectLength.js';
import calcDemand from '../benefits_helpers/calcDemand.js';

const demand = (project) => {

	const projectId = project._id.toString();

	const {
		segments,
		userSegments,
		intersections,
		userIntersections,
	} = project.scope;

	const project_length = calcProjectLength(segments, userSegments);

	calcDemand(
		segments,
		userSegments,
		intersections,
		userIntersections,
		project_length
	);

	writeCSV(
		projectId,
		'demand_bike_ways',
		[
			'type',
			'demand',
			'population',
			'jobs',
			'length (mi)',
			'bmt',
			'bmt per capita',
			'bmt per jobs',
		],
		c.get('demand', 'bike_ways')
	);

	writeCSV(
		projectId,
		'demand_bike',
		[
			'type',
			'bmt',
			'bmt per capita',
			'bmt per jobs',
		],
		c.get('demand', 'bike')
	);

	writeCSV(
		projectId,
		'demand_ped_intersections',
		[
			'type',
			'demand',
			'population',
			'jobs',
			'wmt',
			'wmt per capita',
			'wmt per jobs',
		],
		c.get('demand', 'ped_intersections')
	);

	writeCSV(
		projectId,
		'demand_ped',
		[
			'type',
			'wmt',
			'wmt per capita',
			'wmt per jobs',
		],
		c.get('demand', 'ped')
	);

}

export default demand;
