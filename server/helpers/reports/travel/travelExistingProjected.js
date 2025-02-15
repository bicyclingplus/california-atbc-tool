import { MongoClient, ObjectId } from 'mongodb';
import { BSONError } from 'bson';

import c from '../../collector.js';
import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcDemand from '../../benefits/calcDemand.js';
import calcTravel from '../../benefits/calcTravel.js';
import { writeCSV } from '../../writeCSV.js';

const travelExistingProjected = async (ids) => {
	console.log('Starting travel existing/projected report');

	const headers = [
		'Project ID',
		'M Mode',
		'Existing Travel',
		'Weighted Existing Travel',
		'K Estimate',
		'Total Increase in Travel',
		'Projected Travel',
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

				const project_length = calcProjectLength(segments, userSegments);
				const num_intersections = intersections.length + userIntersections.length;

				const weighted_existing_travel = await calcDemand(
					segments,
					userSegments,
					intersections,
					userIntersections,
					project_length
				);

				calcTravel(
					infrastructure,
					weighted_existing_travel,
					project_length,
					num_intersections
				);

				const existing = c.get('travel', 'existing');
				const projected = c.get('travel', 'projected');

				// indexes from existing
				const existingTotalIdx = 1;
				const existingWeightedIdx = 4;

				// indexes from projected
				const projectedModeIdx = 1;
				const projectedEstimateIdx = 2;
				const projectedIncreaseIdx = 4;
				const projectedTotalIdx = 9;

				for(let i = 0; i < 2; i++) {

					const projectedIdx = i * 3;

					for(let j = 0; j < 3; j++) {
						rows.push([
							project._id.toString(),
							projected[projectedIdx+j][projectedModeIdx],
							existing[i][existingTotalIdx],
							existing[i][existingWeightedIdx],
							projected[projectedIdx+j][projectedEstimateIdx],
							projected[projectedIdx+j][projectedIncreaseIdx],
							projected[projectedIdx+j][projectedTotalIdx],
						]);
					}
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

		c.off();
	}
	finally {
		await client?.close();
	}

	writeCSV('reports', 'travel-4-combined', headers, rows);
}

export default travelExistingProjected;
