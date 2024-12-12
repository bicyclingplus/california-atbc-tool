import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import c from '../../collector.js';
import { writeCSV } from '../../writeCSV.js';

import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcSafetyQuantitative from '../../benefits/calcSafetyQuantitative.js';

const volumeAdjustment = async (ids) => {
	console.log('Starting safety crashes by volume report');

	const headers = [
		'Project ID',
		'M Mode',
		'O Outcome',
		'Before crashes per 1000 volume',
		'K Estimate',
		'After crashes per 1000 volume',
		'Change in crashes',
		'Change in crashes over project time frame',
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
				const before = c.get('safety', 'before').filter(r => r[0] === 'safety');
				const after = c.get('safety', 'after').filter(r => r[0] === 'safety');
				const change = c.get('safety', 'change').filter(r => r[0] === 'safety');
				const projected = c.get('safety', 'projected').filter(r => r[0] === 'safety');

				const numModes = 3;
				const numOutcomes = 3;
				const numEstimates = 3;

				for(let m = 0; m < numModes; m++) {
					for(let o = 0; o < numOutcomes; o++) {

						const beforeIdx = m*numOutcomes+o;

						for(let k = 0; k < numEstimates; k++) {

							const afterIdx = m*numOutcomes*numEstimates+o*numEstimates+k;

							rows.push([
								project._id.toString(),
								after[afterIdx][1],
								after[afterIdx][2],
								before[beforeIdx][7],
								after[afterIdx][3],
								after[afterIdx][8],
								change[afterIdx][8],
								projected[afterIdx][4],
							]);
						}
					}
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

	writeCSV('reports', 'safety-4-combined-c-crashes-volume', headers, rows);
}

export default volumeAdjustment;
