import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import {
	LOCATION_TYPES,
	VOLUMES,
	FUNCTIONAL_CLASSES,
} from '../../benefits/constants.js';

import writeCSV from '../../debug/writeCSV.js';
import calcLjvf from '../../benefits/safety/calcLjvf.js';

const reachLjvf = async (ids) => {

	console.log('Starting reach by Ljvf report');

	const headers = [
		'Project ID',
		'J location type',
		'V volume class',
		'F functional class',
		'Count or length',
	];

	const rows = [];

	let client;

	try {

		client = new MongoClient(process.env.MONGO_URI);
	    const db = client.db('bctool');
		const projects = db.collection('projects');

		for(const projectId of ids) {

			try {
				const project = await projects.findOne({
					'_id': new ObjectId(projectId),
				});

				if(project === null) {
					console.log(`Couldn't find project with id: ${projectId}`);
					continue;
				}

				const {
					segments,
					intersections,
				} = project.scope;

				const L = calcLjvf(segments, intersections);

				for(let j of LOCATION_TYPES) {
					for(let v of VOLUMES) {
						for(let f of FUNCTIONAL_CLASSES) {
							rows.push([
								project._id.toString(),
								j,
								v,
								f,
								L[j][v][f],
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
	}
	finally {
		await client?.close();
	}

	writeCSV('reports', 'overall-3-reach-Ljvf', headers, rows);
}

export default reachLjvf;
