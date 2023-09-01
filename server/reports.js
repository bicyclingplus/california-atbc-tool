import { open } from 'node:fs/promises';
import { MongoClient } from 'mongodb';
import 'dotenv/config';
import fs from 'fs';

import c from './helpers/collector.js';

import general from './helpers/reports/overall/general.js';
import reachType from './helpers/reports/overall/reachType.js';
import reachLjvf from './helpers/reports/overall/reachLjvf.js';
import infrastructure from './helpers/reports/overall/infrastructure.js';
import ways from './helpers/reports/overall/ways.js';
import intersections from './helpers/reports/overall/intersections.js';

import travelExistingProjected from './helpers/reports/travel/travelExistingProjected.js';
import travelChange from './helpers/reports/travel/travelChange.js';

const client = new MongoClient(process.env.MONGO_URI);

c.off(); // disable debugging

// reports as specified in:
// https://docs.google.com/document/d/1fEByERdU3FYx4nHLPD-fbzJ3HvL6ZmUaqPqVynhaNHA/edit
const reports = async (ids) => {

	fs.rmSync('debug_output/reports', {recursive: true, force: true });

	// general/overall
	await general(ids);
	await reachType(ids);
	await reachLjvf(ids);
	await infrastructure(ids);
	await ways(ids);
	await intersections(ids);

	// safety
	// crashesExisting(ids);
	// crashesNew(ids);
	// crashesChange(ids);

	// crashesExistingProjectedModel(ids);
	// crashesExistingProjectedAll(ids);
	// crashesExistingProjectedVolume(ids);

	// volumeExistingProjected(ids);
	// volumeChange(ids);

	// travel
	await travelExistingProjected(ids);
	await travelChange(ids);
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

		await reports(lines.slice(1));
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

		await reports(ids);
	}
	finally {
		await client.close();
	}
}

const oneProject = async () => {
	if(process.argv.length !== 4) {
		usage();
		return;
	}

	await reports([process.argv[3]]);
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
