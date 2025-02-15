import { MongoClient, ObjectId } from 'mongodb';
import { BSONError } from 'bson';
import { createRequire } from "module";

import {
	SCALING_FACTORS,
} from '../../benefits/constants.js';

import calcShare from '../../benefits/calcShare.js';
import getElement from '../../benefits/getElement.js';
import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcLength from '../../benefits/safety/calcLength.js';
import { writeCSV } from '../../writeCSV.js';

const require = createRequire(import.meta.url);
const travel = require('../../../data/travel_volume.json');
const safety = require('../../../data/quantitative.json');

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

	const trows = [];
	const srows = [];

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

				const projectLength = calcProjectLength(segments, userSegments);
				const numIntersections = intersections.length + userIntersections.length;
				const safetyLength = calcLength(project.elements.infrastructure, projectLength);

				for(let selected in project.elements.infrastructure) {

					const element = getElement(selected);

					// unknown (probably removed) element
					if(element === null) {
						continue;
					}

					if(selected in travel) {

						for(let scalingFactor in SCALING_FACTORS) {

							const value = project.elements.infrastructure[selected][scalingFactor];

							if(! (value > 0)) {
								continue;
							}

							const share = calcShare(
								element,
								value,
								projectLength,
								numIntersections
							);

							trows.push([
								project._id.toString(),
								element.shortname,
								scalingFactor,
								element.units,
								value,
								share.share,
							]);
						}
					}

					if(selected in safety) {

						for(let scalingFactor in SCALING_FACTORS) {

							const value = project.elements.infrastructure[selected][scalingFactor];

							if(! (value > 0)) {
								continue;
							}

							const share = calcShare(
								element,
								value,
								safetyLength,
								numIntersections
							);

							srows.push([
								project._id,
								element.shortname,
								scalingFactor,
								element.units,
								value,
								share.share,
							]);
						}
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
	}
	finally {
		await client?.close();
	}

	writeCSV('reports', 'overall-4-infrastructure-travel', headers, trows);
	writeCSV('reports', 'overall-4-infrastructure-safety', headers, srows);
}

export default infrastructure;
