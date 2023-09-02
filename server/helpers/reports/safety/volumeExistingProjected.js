import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import c from '../../collector.js';
import writeCSV from '../../debug/writeCSV.js';

import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcSafetyQuantitative from '../../benefits/calcSafetyQuantitative.js';

const volumeExistingProjected = async (ids) => {
	console.log('Starting safety volume existing/projected report');

	const headers = [
		'Project ID',
		'M Mode',
		'J Location type',
		'Existing Volume Vmj',
		'K Estimate',
		'Projected Volume PVmjk',
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
				const existing = c.get('safety', 'vmj_existing').filter(r => r[0] === 'safety');
				const projected = c.get('safety', 'vmj_projected').filter(r => r[0] === 'safety');

				// 'Project ID',
				// 'M Mode',
				// 'J Location type',
				// 'Existing Volume Vmj',
				// 'K Estimate',
				// 'Projected Volume PVmjk',

				const existingVolumeIdx = 3;

				const projectedModeIdx = 1;
				const projectedLocationIdx = 2;
				const projectedEstimateIdx = 3;
				const projectedVolumeIdx = 4;

				const numModes = 3;
				const numLocations = 2;
				const numEstimates = 3;

				for(let m = 0; m < numModes; m++) {

					for(let j = 0; j < numLocations; j++) {

						const existingRow = m*numLocations+j;

						for(let k = 0; k < numEstimates; k++) {

							const projectedRow = m*numLocations*numEstimates+j*numEstimates+k;

							rows.push([
								project._id.toString(),
								projected[projectedRow][projectedModeIdx],
								projected[projectedRow][projectedLocationIdx],
								existing[existingRow][existingVolumeIdx],
								projected[projectedRow][projectedEstimateIdx],
								projected[projectedRow][projectedVolumeIdx],
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

	writeCSV('reports', 'safety-5-volume-d-combined', headers, rows);
}

export default volumeExistingProjected;
