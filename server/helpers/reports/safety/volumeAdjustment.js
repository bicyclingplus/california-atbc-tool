import { MongoClient, ObjectId } from 'mongodb';
import { BSONError } from 'bson';

import c from '../../collector.js';
import { writeCSV } from '../../writeCSV.js';

import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcSafetyQuantitative from '../../benefits/calcSafetyQuantitative.js';

const volumeAdjustment = async (ids) => {
	console.log('Starting safety volume adjustments report');

	const headers = [
		'Project ID',
		'M Mode',
		'J Location type',
		'I Infrastructure type',
		'F Improvement type',
		'K Estimate',
		'Volume increase',
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

				const {
					safety,
					timeframe,
				} = project.details;

				const project_length = calcProjectLength(segments, userSegments);
				const num_intersections = intersections.length + userIntersections.length;

				calcSafetyQuantitative(
					segments,
					intersections,
					infrastructure,
					project_length,
					num_intersections,
					safety,
					timeframe
				);

				// gen rows
				const adjustments = c.get('safety', 'vmj_adjustments').filter(r => r[5] === 'safety');

				for(const a of adjustments) {

					rows.push([
						project._id.toString(),
						a[6],
						a[7],
						a[0],
						a[3],
						a[8],
						a[13],
					])
				}
			}
			catch (e) {
			  if(BSONError.isBSONError(e)) {
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

	writeCSV('reports', 'safety-5-volume-b-adjustments', headers, rows);
}

export default volumeAdjustment;
