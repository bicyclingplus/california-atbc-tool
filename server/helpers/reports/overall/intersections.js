import { MongoClient, ObjectId } from 'mongodb';
import { BSONError } from 'bson';

import { writeCSV } from '../../writeCSV.js';

const intersections = async (ids) => {
	console.log('Starting intersections report');

	const headers = [
		'Project ID',
		'Node ID',
		'Type',
		'Population',
		'Jobs',
		'Bicycle volume class',
		'Pedestrian volume class',
		'Functional class',
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
					intersections,
					userIntersections,
				} = project.scope;

				for(let i of intersections) {
					rows.push([
						project._id.toString(),
						i.properties.node_id,
						'network',
						i.properties.population ? i.properties.population : 'Not available',
						i.properties.jobs ? i.properties.jobs : 'Not available',
						i.properties.bicycle_exposure_class ? i.properties.bicycle_exposure_class : 'Not available',
						i.properties.pedestrian_exposure_class ? i.properties.pedestrian_exposure_class : 'Not available',
						i.properties.functional ? i.properties.functional : 'Not available',
						i.properties.bicycle_node_exposure ? i.properties.bicycle_node_exposure : 'Not available',
						i.properties.pedestrian_node_exposure ? i.properties.pedestrian_node_exposure : 'Not available',
						'Not applicable',
						i.properties.ped_demand ? i.properties.ped_demand : 'Not available',
					])
				}

				for(let i of userIntersections) {
					rows.push([
						project._id.toString(),
						i.properties.id,
						'user defined',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
						'Not applicable',
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
	}
	finally {
		await client?.close();
	}

	writeCSV('reports', 'overall-6-intersections', headers, rows);
}

export default intersections;
