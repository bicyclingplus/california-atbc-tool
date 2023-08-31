import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import writeCSV from '../debug/writeCSV.js';


const infrastructure = async (ids) => {

	console.log('Starting infrastructure report');

	const headers = [
		'Project ID',
		'Infrastructure type',
		'Improvement type',
		'Measurement type',
		'Count or length',
		'Project share',
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
				} = project.scope;

				const { infrastructure } = project.elements;

				rows.push([
					project._id,
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

	writeCSV('reports', '4-infrastructure', headers, rows);
}

export default infrastructure;
