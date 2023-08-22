import c from '../collector.js';
import writeCSV from './writeCSV.js';

import calcProjectLength from '../helpers/calcProjectLength.js';
import calcSafetyQuantitative from '../helpers/calcSafetyQuantitative.js';

const safety = (project) => {

	const projectId = project._id.toString();

	const {
		segments,
		userSegments,
		intersections,
		userIntersections,
	} = project.scope;

	const project_length = calcProjectLength(segments, userSegments);
	const num_intersections = intersections.length + userIntersections.length;

	calcSafetyQuantitative(
		segments,
		intersections,
		project.elements.infrastructure,
		project_length,
		num_intersections,
		project.details.safety,
		project.details.timeframe
	);

	writeCSV(
		projectId,
		'safety_length',
		[
			'type',
			'item',
			'class',
			'length (ft)',
		],
		c.get('safety', 'length')
	);

	writeCSV(
		projectId,
		'safety_exp_ways',
		[
			'bike exp',
			'ped exp',
			'population',
			'jobs',
			'functional class',
			'bike volume',
			'length (ft)',
		],
		c.get('safety', 'exp_ways')
	);

	writeCSV(
		projectId,
		'safety_exp_intersections',
		[
			'bike exp',
			'ped exp',
			'population',
			'jobs',
			'functional class',
			'ped volume',
		],
		c.get('safety', 'exp_intersections')
	);

	writeCSV(
		projectId,
		'safety_exp_avg',
		[
			'type',
			'avg bike exp',
			'avg ped exp',
			'avg population',
			'avg jobs',
		],
		c.get('safety', 'exp_avg')
	);

	writeCSV(
		projectId,
		'safety_vmj_existing',
		[
			'column',
			'travel mode',
			'location type',
			'Vmj (existing)',
		],
		c.get('safety', 'vmj_existing')
	);

	writeCSV(
		projectId,
		'safety_ljvf',
		[
			'location type',
			'volume',
			'functional class',
			'Lvjf (miles or count)',
		],
		c.get('safety', 'ljvf')
	);

	writeCSV(
		projectId,
		'safety_vmj_adjustments',
		[
			'infrastructure item',
			'calculation units',
			'units',

			'improvement type',
			'length or count',

			'column',
			'mode',
			'location type',
			'estimate',

			'Vmj (existing)',
			'benefit',
			'share of project',
			'scaling factor',
			'adjustment',
		],
		c.get('safety', 'vmj_adjustments')
	);

	writeCSV(
		projectId,
		'safety_vmj_projected',
		[
			'column',
			'mode',
			'type',
			'estimate',
			'Vmj (projected)',
		],
		c.get('safety', 'vmj_projected')
	);

}

export default safety;
