import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import writeCSV from '../debug/writeCSV.js';
import calcProjectLength from '../benefits/calcProjectLength.js';
import calcLength from '../benefits/safety/calcLength.js';
import avgProp from '../benefits/avgProp.js';

const general = async (ids) => {

	console.log('Starting general report');

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

				const {
					segments,
					userSegments,
					intersections,
				} = project.scope;

				const { infrastructure } = project.elements;


				const projectLength = calcProjectLength(
					segments,
					userSegments
				);

				const safetyLength = calcLength(
					infrastructure,
					projectLength
				);

				let avgBikeExpWay = avgProp(
					segments,
					'bicyclist_link_exposure'
				);

				let avgBikeExpInt = avgProp(
					intersections,
					'bicycle_node_exposure'
				);

				let avgPedExpWay = avgProp(
					segments,
					'pedestrian_link_exposure'
				);

				let avgPedExpInt = avgProp(
					intersections,
					'pedestrian_node_exposure'
				);

				let avgBikeDemand = avgProp(
					segments,
					'bicyclist_demand'
				);

				let avgPedDemand = avgProp(
					intersections,
					'ped_demand'
				);

				avgBikeExpWay = avgBikeExpWay === null ? 'No network exposure available' : avgBikeExpWay;
				avgBikeExpInt = avgBikeExpInt === null ? 'No network exposure available' : avgBikeExpInt;

				avgPedExpWay = avgPedExpWay === null ? 'No network exposure available' : avgPedExpWay;
				avgPedExpInt = avgPedExpInt === null ? 'No network exposure available' : avgPedExpInt;

				avgBikeDemand = avgBikeDemand === null ? 'No network demand available' : avgBikeDemand;
				avgPedDemand = avgPedDemand === null ? 'No network demand available' : avgPedDemand;

				rows.push([
					project._id.toString(),
					segments.length ? avgBikeExpWay : 'No network ways selected',
					intersections.length ? avgBikeExpInt : 'No network intersections selected',
					segments.length ? avgPedExpWay : 'No network ways selected',
					intersections.length ? avgPedExpInt : 'No network intersections selected',
					segments.length ? avgBikeDemand : 'No network ways selected',
					intersections.length ? avgPedDemand : 'No network intersections selected',
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

	writeCSV('reports', 'overall-1-general', headers, rows);
}

export default general;
