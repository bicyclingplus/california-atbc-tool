import {
  MODES,
  LOCATION_TYPES,
  OUTCOMES,
} from '../benefits_helpers/constants.js';

import c from '../collector.js';
import writeCSV from './writeCSV.js';

import calcProjectLength from '../benefits_helpers/calcProjectLength.js';
import calcSafetyQuantitative from '../benefits_helpers/calcSafetyQuantitative.js';

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

	if(project.details.safety === undefined) {
		console.log("skipping -- old project before user safety inputs");
		return;
	}

	for(let m of MODES) {
		for(let o of OUTCOMES) {
			for(let l of LOCATION_TYPES) {
				c.put('safety', 'UI', [
					m,
					o,
					l,
					project.details.safety[m][o][l],
					project.details.safety[m].years[l],
				])
			}
		}
	}

	writeCSV(
		projectId,
		'safety_UI',
		[
			'mode',
			'outcome',
			'location',
			'input',
			'years',
		],
		c.get('safety', 'UI')
	);

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

	writeCSV(
		projectId,
		'safety_ECmoj',
		[
			'column',
			'mode',
			'outcome',
			'location type',
			'ECmoj_user',
			'ECmoj_split',
			'ECmoj_model',
			'used',
		],
		c.get('safety', 'ECmoj')
	);

	writeCSV(
		projectId,
		'safety_NCmoj',
		[
			'column',
			'mode',
			'outcome',
			'location type',
			'estimate',
			'NCmoj',
		],
		c.get('safety', 'NCmoj')
	);

	writeCSV(
		projectId,
		'safety_ECCmojvf',
		[
			'column',
			'mode',
			'outcome',
			'location type',
			'volume',
			'functional class',
			'Amojvf',
			'Ljvf',
			'EVmj',
			'ECCmojvf',
		],
		c.get('safety', 'CCmojvf')
	);

	writeCSV(
		projectId,
		'safety_NCCmojvfe',
		[
			'column',
			'mode',
			'outcome',
			'location type',
			'volume',
			'functional class',
			'estimate',
			'Amojvf',
			'Ljvf',
			'PVmje',
			'NCCmojvfe',
		],
		c.get('safety', 'CCmojvfe')
	);

	writeCSV(
		projectId,
		'safety_reductions',
		[
			'column',
			'mode',
			'outcome',
			'location type',
			'estimate',
			'element',
			'reduction %',
		],
		c.get('safety', 'reductions')
	);

	writeCSV(
		projectId,
		'safety_CRFmoje',
		[
			'column',
			'mode',
			'outcome',
			'location type',
			'estimate',
			'CRFmoje',
		],
		c.get('safety', 'CRFmoje')
	);

	writeCSV(
		projectId,
		'safety_change',
		[
			'column',
			'mode',
			'outcome',
			'estimate',
			'NCmoje roadway',
			'ECmoj roadway',
			'NCmoje intersection',
			'ECmoj intersection',
			'change',
		],
		c.get('safety', 'change')
	);

	writeCSV(
		projectId,
		'safety_projected',
		[
			'column',
			'mode',
			'outcome',
			'estimate',
			'change',
		],
		c.get('safety', 'projected')
	);

	writeCSV(
		projectId,
		'safety_before',
		[
			'column',
			'mode',
			'outcome',
			'ECmoj roadway',
			'EVmj roadway',
			'ECmoj intersection',
			'EVmj intersection',
			'before crash outcomes per 1000 volume',
		],
		c.get('safety', 'before')
	);

	writeCSV(
		projectId,
		'safety_after',
		[
			'column',
			'mode',
			'outcome',
			'estimate',
			'NCmoje roadway',
			'PVmje roadway',
			'NCmoje intersection',
			'PVmje intersection',
			'after crash outcomes per 1000 volume',
		],
		c.get('safety', 'after')
	);
}

export default safety;
