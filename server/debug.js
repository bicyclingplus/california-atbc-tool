import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';

import lookups from './debug_helpers/lookups.js';
import constants from './debug_helpers/constants.js';
import reach from './debug_helpers/reach.js';
import demand from './debug_helpers/demand.js';
import safety from './debug_helpers/safety.js';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const debug = (project) => {
	reach(project);
	demand(project);
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
