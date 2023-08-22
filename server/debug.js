import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

import scope from './debug_helpers/scope.js';
import demand from './debug_helpers/demand.js';
import safety from './debug_helpers/safety.js';

if(process.argv.length < 3) {
	console.log('Usage: node debug.js [projectId]');
}

dotenv.config();

const projectId = process.argv[2]
const client = new MongoClient(process.env.MONGO_URI);

try {

    const db = client.db('bctool');
	const projects = db.collection('projects');
	const project = await projects.findOne({
		'_id': new ObjectId(projectId),
	});

	scope(project);
	demand(project);
	safety(project);
}
finally {
	await client.close();
}
