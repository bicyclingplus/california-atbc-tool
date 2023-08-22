import c from '../collector.js';
import writeCSV from './writeCSV.js';

import calcProjectLength from '../benefits_helpers/calcProjectLength.js';

const reach = (project) => {
	const projectId = project._id.toString();

	const {
		segments,
		userSegments,
		intersections,
		userIntersections,
	} = project.scope;

	calcProjectLength(segments, userSegments);

	writeCSV(
		projectId,
		'reach_ways',
		['type', 'length (ft)'],
		c.get('reach', 'ways')
	);

	c.put('reach', 'intersections', ['network', intersections.length]);
	c.put('reach', 'intersections', ['user', userIntersections.length]);
	c.put('reach', 'intersections', [
		'project',
		intersections.length + userIntersections.length
	]);

	writeCSV(
		projectId,
		'reach_intersections',
		['type', 'count'],
		c.get('reach', 'intersections')
	);
}

export default reach;
