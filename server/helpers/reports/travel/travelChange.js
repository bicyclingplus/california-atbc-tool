import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import {
	ESTIMATES
} from '../../benefits/constants.js';

import c from '../../collector.js';
import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcDemand from '../../benefits/calcDemand.js';
import calcTravel from '../../benefits/calcTravel.js';

import { writeCSV } from '../../writeCSV.js';

const travelChange = async (ids) => {
	console.log('Starting travel change report');

	const headers = [
		'Project ID',
		'M Mode',
		'I Infrastructure',
		'F Improvement Type',
		'K Estimate',
		'Increase in travel'
	];

	const rows = [];

	let client;

	try {

		client = new MongoClient(process.env.MONGO_URI);
	    const db = client.db('bctool');
		const projects = db.collection('projects');

		c.on();

		for(const projectId of ids) {

			try {
				const project = await projects.findOne({
					'_id': new ObjectId(projectId),
				});

				if(project === null) {
					console.log(`Couldn't find project with id: ${projectId}`);
					continue;
				}

				// gen rows
				c.reset();

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

				const adjustments = c.get('travel', 'adjustments');
				const travelAdjustments = adjustments.filter(a => a[0] === 'travel');

				const modeIdx = 1;
				const elementIdx = 2;
				const improvementIdx = 5;
				const estimateIdx = 9;
				const adjustmentIdx = 14;

				for(const a of travelAdjustments) {
					rows.push([
						project._id.toString(),
						a[modeIdx],
						a[elementIdx],
						a[improvementIdx],
						a[estimateIdx],
						a[adjustmentIdx],
					]);
				}
			}
			catch (e) {
				if(e instanceof BSONTypeError) {
					console.log(`Invalid project id: ${projectId}`);
				}
				else {
					throw e;
				}
			}
		}

		c.off();
	}
	finally {
		await client?.close();
	}

	writeCSV('reports', 'travel-2-change', headers, rows);
}

export default travelChange;
