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

const crashesAll = async (ids) => {
	console.log('Starting safety all crashes report');

	const headers = [
		'Project ID',
		'M Mode',
		'O Outcome',
		'J Location',
		'User inputted crashes UImoj',
		'ECmoj with user input',
		'ECmoj split',
		'ECmoj model',
		'K estimate',
		'CRFmojk',
		'NCmojk',
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
				const existing = c.get('safety', 'ECmoj').filter(r => r[0] === 'safety');
				const projected = c.get('safety', 'NCmoj').filter(r => r[0] === 'safety');
				const factors = c.get('safety', 'CRFmoje').filter(r => r[0] === 'safety');

				const e_oRowCnt = LOCATION_TYPES.length;
				const e_mRowCnt = e_oRowCnt * OUTCOMES.length;

				const p_jRowCnt = ESTIMATES.length
				const p_oRowCnt = p_jRowCnt * LOCATION_TYPES.length;
				const p_mRowCnt = p_oRowCnt * OUTCOMES.length;

				for(let m = 0; m < MODES.length; m++) {
					for(let o = 0; o < OUTCOMES.length; o++) {
						for(let j = 0; j < LOCATION_TYPES.length; j++) {
								const eIdx =
									m*e_mRowCnt+
									o*e_oRowCnt+
									j;

							for(let k = 0; k < ESTIMATES.length; k++) {
								const pIdx =
									m*p_mRowCnt+
									o*p_oRowCnt+
									j*p_jRowCnt+
									k;

								const UImoj = safety[MODES[m]][OUTCOMES[o]][LOCATION_TYPES[j]];
								const UIy = safety[MODES[m]].years[LOCATION_TYPES[j]];

								rows.push([
									project._id.toString(),
									projected[pIdx][1],
									projected[pIdx][2],
									projected[pIdx][3],
									UIy > 0 ? UImoj : 'N/A',
									UIy > 0 ? existing[eIdx][4] : 'N/A',
									UIy > 0 ? existing[eIdx][5] : 'N/A',
									existing[eIdx][6],
									projected[pIdx][4],
									factors[pIdx][5],
									projected[pIdx][5],
								]);
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

	writeCSV('reports', 'safety-4-combined-b-crashes-all', headers, rows);
}

export default crashesAll;
