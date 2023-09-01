import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import writeCSV from '../debug/writeCSV.js';

const ways = async (ids) => {
	console.log('Starting ways report');

	const headers = [
		'Project ID',
		'Way ID',
		'Type',
		'Population',
		'Jobs',
		'Bicycle volume class',
		'Pedestrian volume class',
		'Functional class',
		'Length',
		'Bicycle exposure',
		'Pedestrian exposure',
		'Bicycle demand',
		'Pedestrian demand',
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
				} = project.scope;

				for(let s of segments) {
					rows.push([
						project._id.toString(),
						s.properties.edge_uid,
						'network',
						s.properties.population ? s.properties.population : 'Not available',
						s.properties.jobs ? s.properties.jobs : 'Not available',
						s.properties.bicycle_exposure_class ? s.properties.bicycle_exposure_class : 'Not available',
						s.properties.pedestrian_link_exposure_class ? s.properties.pedestrian_link_exposure_class : 'Not available',
						s.properties.functional ? s.properties.functional : 'Not available',
						s.properties.length,
						s.properties.bicyclist_link_exposure ? s.properties.bicyclist_link_exposure : 'Not available',
						s.properties.pedestrian_link_exposure ? s.properties.pedestrian_link_exposure : 'Not available',
						s.properties.bicyclist_demand ? s.properties.bicyclist_demand : 'Not available',
						'Not applicable',
					])
				}

				for(let s of userSegments) {
					rows.push([
						project._id.toString(),
						s.properties.id,
						'user defined',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						s.properties.length,
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
					])
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

	writeCSV('reports', 'overall-5-ways', headers, rows);
}

export default ways;
