import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import writeCSV from '../debug/writeCSV.js';
import calcProjectLength from '../benefits/calcProjectLength.js';

const reachType = async (ids) => {

	console.log('Starting reach by type report');

	const headers = [
		'Project ID',
		'Type',
		'Intersections count',
		'Segments count',
		'Total length of segments',
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
					userSegments,
					intersections,
					userIntersections,
				} = project.scope;

				rows.push([
					project._id.toString(),
					'network',
					intersections.length,
					segments.length,
					calcProjectLength(segments, []),
				]);

				rows.push([
					project._id.toString(),
					'user defined',
					userIntersections.length,
					userSegments.length,
					calcProjectLength([], userSegments),
				]);

				rows.push([
					project._id.toString(),
					'project total',
					intersections.length + userIntersections.length,
					segments.length + userSegments.length,
					calcProjectLength(segments, userSegments),
				]);
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

	writeCSV('reports', 'overall-2-reach-type', headers, rows);
}

export default reachType;
