import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import writeCSV from '../debug/writeCSV.js';
import calcProjectLength from '../benefits/calcProjectLength.js';
import calcLength from '../benefits/safety/calcLength.js';
import avgProp from '../benefits/avgProp.js';

const general = async (ids) => {

	console.log('Starting general report');

	console.log(`Looking up ${ids.length} projects`);

	const headers = [
		'Project ID',
		'Average bicycle exposure (ways)',
		'Average bicycle exposure (intersections)',
		'Average pedestrian exposure (ways)',
		'Average pedestrian exposure (intersections)',
		'Average bicycle demand',
		'Average pedestrian demand',
		'Total project length',
		'Total project length used for safety calculations',
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

				const projectLength = calcProjectLength(
					project.scope.segments,
					project.scope.userSegments
				);

				const safetyLength = calcLength(
					project.elements.infrastructure,
					projectLength
				);

				let avgBikeExpWay = avgProp(
					project.scope.segments,
					'bicyclist_link_exposure'
				);

				let avgBikeExpInt = avgProp(
					project.scope.intersections,
					'bicycle_node_exposure'
				);

				let avgPedExpWay = avgProp(
					project.scope.segments,
					'pedestrian_link_exposure'
				);

				let avgPedExpInt = avgProp(
					project.scope.intersections,
					'pedestrian_node_exposure'
				);

				let avgBikeDemand = avgProp(
					project.scope.segments,
					'bicyclist_demand'
				);

				let avgPedDemand = avgProp(
					project.scope.intersections,
					'ped_demand'
				);

				avgBikeExpWay = avgBikeExpWay === null ? 'No network exposure available' : avgBikeExpWay;
				avgBikeExpInt = avgBikeExpInt === null ? 'No network exposure available' : avgBikeExpInt;

				avgPedExpWay = avgPedExpWay === null ? 'No network exposure available' : avgPedExpWay;
				avgPedExpInt = avgPedExpInt === null ? 'No network exposure available' : avgPedExpInt;

				avgBikeDemand = avgBikeDemand === null ? 'No network demand available' : avgBikeDemand;
				avgPedDemand = avgPedDemand === null ? 'No network demand available' : avgPedDemand;

				rows.push([
					project._id,
					avgBikeExpWay,
					avgBikeExpInt,
					avgPedExpWay,
					avgPedExpInt,
					project.scope.segments.length ? avgBikeDemand : 'No network ways selected',
					project.scope.intersections.length ? avgPedDemand : 'No network intersections selected',
					projectLength,
					safetyLength,
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

	writeCSV('reports', 'general', headers, rows);
}

export default general;
