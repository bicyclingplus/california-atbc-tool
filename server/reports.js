import { open } from 'node:fs/promises';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

import c from './helpers/collector.js';
import general from './helpers/reports/general.js';
import reachType from './helpers/reports/reachType.js';
import reachLjvf from './helpers/reports/reachLjvf.js';
import infrastructure from './helpers/reports/infrastructure.js';
import ways from './helpers/reports/ways.js';
import intersections from './helpers/reports/intersections.js';

const client = new MongoClient(process.env.MONGO_URI);

c.off(); // disable debugging

// reports as specified in:
// https://docs.google.com/document/d/1fEByERdU3FYx4nHLPD-fbzJ3HvL6ZmUaqPqVynhaNHA/edit
const reports = (ids) => {
	// general/overall
	general(ids);
	reachType(ids);
	reachLjvf(ids);
	infrastructure(ids);
	ways(ids);
	intersections(ids);

	// safety

}

const fileProjects = async () => {
	if(process.argv.length !== 4) {
		usage();
		return;
	}

	const infilepath = process.argv[3];

	let infile;

	try {
		infile = await open(infilepath);

		console.log(`Getting projects ids from: ${infilepath}`);

		const lines = [];

		for await(const l of infile.readLines()) {
			lines.push(l);
		}

		if(lines.length < 2) {
			console.log('No project ids found');
			return;
		}

		reports(lines.slice(1));
	}
	catch (e) {
		if(e.code === 'ENOENT') {
			console.log('File not found');
		}
		else {
			throw e;
		}

	}
	finally {
		await infile?.close();
	}
}

const allProjects = async () => {
	console.log(`Getting project ids from db`);

	try {
		const db = client.db('bctool');
		const projects = db.collection('projects');
		const opts = {
			projection: {
				'_id': 1,
			},
		};
		const cursor = await projects.find({}, opts);
		const ids = [];

		for await (const project of cursor) {
			ids.push(project._id.toString());
		}

		reports(ids);
	}
	finally {
		await client.close();
	}
}

const oneProject = () => {
	if(process.argv.length !== 4) {
		usage();
		return;
	}

	reports([process.argv[3]]);
}

const usage = () => {
	console.log(`usage: reports [--help, -h] [--file, -f filename] [--all, -a] [--project, -p id]\n`)
	console.log(`-h, --help\t display this message and exit`)
	console.log(`-f, --file\t generate reports for projects from file of ids (one per line, skip first line for header)`)
	console.log(`-a, --all\t generate reports for all projects`)
	console.log(`-p, --project\t generate reports for a project by id`)
}

if(process.argv.length > 2) {
	switch(process.argv[2]) {
		case '-f':
		case '--file':
			fileProjects();
		break;
		case '-a':
		case '--all':
			allProjects();
		break;
		case '-p':
		case '--project':
			oneProject()
		break;
		default:
			usage();
	}
}
else {
	usage();
}
