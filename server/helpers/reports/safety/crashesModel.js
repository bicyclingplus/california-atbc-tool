import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import c from '../../collector.js';
import writeCSV from '../../debug/writeCSV.js';

import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcSafetyQuantitative from '../../benefits/calcSafetyQuantitative.js';

const crashesModel = async (ids) => {
	console.log('Starting safety model crashes report');

	const headers = [
		'Project ID',
		'M Mode',
		'O Outcome',
		'J Location',
		'V Volume Class',
		'F Functional Class',
		'Alpha constant',
		'ECCmojvf',
		'K Estimate',
		'NCCmojvfk',
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
				const existing = c.get('safety', 'CCmojvf').filter(r => r[0] === 'safety');
				const projected = c.get('safety', 'CCmojvfe').filter(r => r[0] === 'safety');

				// console.log(projected);
				// console.log(existing.length);
				// console.log(projected.length);
				// process.exit();

				const numModes = 3;
				const numOutcomes = 3;
				const numLocations = 2;
				const numVolumes = 3;
				const numFunctionals = 3;
				const numEstimates = 3;


				for(let m = 0; m < numModes; m++) {
					for(let o = 0; o < numOutcomes; o++) {
						for(let j = 0; j < numLocations; j++) {
							for(let v = 0; v < numVolumes; v++) {
								for(let f = 0; f < numFunctionals; f++) {

									const existingIdx =
									m*numOutcomes*numLocations*numVolumes*numFunctionals+
									o*numLocations*numVolumes*numFunctionals+
									j*numVolumes*numFunctionals+
									v*numFunctionals+
									f;

									// console.log(`e-${existingIdx}`)

									for(let k = 0; k < numEstimates; k++) {

										const projectedIdx =
										m*numOutcomes*numLocations*numVolumes*numFunctionals*numEstimates+
										o*numLocations*numVolumes*numFunctionals*numEstimates+
										j*numVolumes*numFunctionals*numEstimates+
										v*numFunctionals*numEstimates+
										f*numEstimates+
										k;

										// console.log(`p-${projectedIdx}`)

										rows.push([
											project._id.toString(),
											projected[projectedIdx][1],
											projected[projectedIdx][2],
											projected[projectedIdx][3],
											projected[projectedIdx][4],
											projected[projectedIdx][5],
											projected[projectedIdx][7],
											existing[existingIdx][9],
											projected[projectedIdx][6],
											projected[projectedIdx][10],
										]);
									}
								}
							}
						}
					}
				}

				// process.exit();

				// 'Project ID',
				// 'M Mode',
				// 'O Outcome',
				// 'J Location',
				// 'V Volume Class',
				// 'F Functional Class',
				// 'Alpha constant',
				// 'ECCmojvf',
				// 'K Estimate',
				// 'NCCmojvf',
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

	writeCSV('reports', 'safety-4-combined-a-crashes-model', headers, rows);
}

export default crashesModel;
