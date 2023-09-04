import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import c from '../../collector.js';
import { writeCSV } from '../../writeCSV.js';

import {
	MODES,
	OUTCOMES,
	LOCATION_TYPES,
	VOLUMES,
	FUNCTIONAL_CLASSES,
	ESTIMATES,
} from '../../benefits/constants.js';

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

				// existing and projected are calculated
				// in a different order
				// we'll use projected for the report and build
				// a lookup for the correct existing value
				const existingLookup = {};

				for(let r of existing) {
					const m = r[1]
					const o = r[2];
					const j = r[3];
					const v = r[4];
					const f = r[5];
					const EC = r[9];

					if(!(m in existingLookup)) {
						existingLookup[m] = {};
					}

					if(!(o in existingLookup[m])) {
						existingLookup[m][o] = {};
					}

					if(!(j in existingLookup[m][o])) {
						existingLookup[m][o][j] = {};
					}

					if(!(v in existingLookup[m][o][j])) {
						existingLookup[m][o][j][v] = {};
					}

					existingLookup[m][o][j][v][f] = EC;
				}

				const fRowCnt = ESTIMATES.length;
				const vRowCnt = fRowCnt * FUNCTIONAL_CLASSES.length;
				const jRowCnt = vRowCnt * VOLUMES.length;
				const oRowCnt = jRowCnt * LOCATION_TYPES.length;
				const mRowCnt = oRowCnt * OUTCOMES.length;

				for(let m = 0; m < MODES.length; m++) {
					for(let o = 0; o < OUTCOMES.length; o++) {
						for(let j = 0; j < LOCATION_TYPES.length; j++) {
							for(let v = 0; v < VOLUMES.length; v++) {
								for(let f = 0; f < FUNCTIONAL_CLASSES.length; f++) {
									for(let k = 0; k < ESTIMATES.length; k++) {

										const pIdx =
											m*mRowCnt+
											o*oRowCnt+
											j*jRowCnt+
											v*vRowCnt+
											f*fRowCnt+
											k;

										const mode = projected[pIdx][1];
										const outcome = projected[pIdx][2];
										const location = projected[pIdx][3];
										const volume = projected[pIdx][4];
										const functional = projected[pIdx][5];


										rows.push([
											project._id.toString(),
											mode,
											outcome,
											location,
											volume,
											functional,
											projected[pIdx][7],
											existingLookup[mode][outcome][location][volume][functional],
											projected[pIdx][6],
											projected[pIdx][10],
										]);
									}
								}
							}
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

	writeCSV('reports', 'safety-4-combined-a-crashes-model', headers, rows);
}

export default crashesModel;
