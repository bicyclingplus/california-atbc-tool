import c from '../collector.js';
import writeCSV from './writeCSV.js';

import calcProjectLength from '../helpers/calcProjectLength.js';

const scope = (project) => {
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
		'scope_ways',
		['type', 'length (ft)'],
		c.get('scope', 'ways')
	);

	c.put('scope', 'intersections', ['network', intersections.length]);
	c.put('scope', 'intersections', ['user', userIntersections.length]);
	c.put('scope', 'intersections', [
		'project',
		intersections.length + userIntersections.length
	]);

	writeCSV(
		projectId,
		'scope_intersections',
		['type', 'count'],
		c.get('scope', 'intersections')
	);
}

export default scope;
