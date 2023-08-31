import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';

import c from './helpers/collector.js';

import lookups from './helpers/debug/lookups.js';
import constants from './helpers/debug/constants.js';
import inputs from './helpers/debug/inputs.js';
import reach from './helpers/debug/reach.js';
import travel from './helpers/debug/travel.js';
import safety from './helpers/debug/safety.js';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const debug = (project) => {
	c.reset();
	inputs(project);
	reach(project);
	travel(project);
	safety(project);
};

fs.rmSync('debug_output', {recursive: true, force: true });

lookups();
constants();

if(process.argv.length === 3) {

	const projectId = process.argv[2]

	try {

	    const db = client.db('bctool');
		const projects = db.collection('projects');
		const project = await projects.findOne({
			'_id': new ObjectId(projectId),
		});

		if(project === null) {
			console.log(`Couldn't find project with id ${projectId}`);
			process.exit()
		}

		debug(project);
	}
	finally {
		await client.close();
	}
}
else {
	try {

	    const db = client.db('bctool');
		const projects = db.collection('projects');
		const cursor = await projects.find({});

		for await (const project of cursor) {
			console.log(`Debugging ${project._id.toString()}`);
			debug(project);
		}
	}
	finally {
		await client.close();
	}
}
