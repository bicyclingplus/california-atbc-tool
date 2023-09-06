import { open } from 'node:fs/promises';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

import c from './helpers/collector.js';
import { clean } from './helpers/writeCSV.js';

import lookups from './helpers/debug/lookups.js';
import constants from './helpers/debug/constants.js';
import inputs from './helpers/debug/inputs.js';
import reach from './helpers/debug/reach.js';
import travel from './helpers/debug/travel.js';
import safety from './helpers/debug/safety.js';

const client = new MongoClient(process.env.MONGO_URI);

const debug = (project) => {
	console.log(`Debugging ${project._id.toString()}`);
	c.reset();
	inputs(project);
	reach(project);
	travel(project);
	safety(project);
};

const allProjects = async () => {

	console.log(`Debugging all projects in db`);

	clean('debug');
	clean('lookups');

	try {

	    const db = client.db('bctool');
		const projects = db.collection('projects');
		const cursor = await projects.find({});

		for await (const project of cursor) {
			debug(project);
		}

		lookups();
		constants();
	}
	finally {
		await client.close();
	}
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

		try {

			clean('debug');
			clean('lookups');

		    const db = client.db('bctool');
			const projects = db.collection('projects');

			for(let projectId of lines.slice(1)) {

				const project = await projects.findOne({
					'_id': new ObjectId(projectId),
				});

				if(project === null) {
					console.log(`Couldn't find project with id ${projectId}`);
					continue;
				}

				debug(project);
			}

			lookups();
			constants();
		}
		finally {
			await client.close();
		}
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
};

const oneProject = async () => {

	if(process.argv.length !== 4) {
		usage();
		return;
	}

	const projectId = process.argv[3];

	try {

	    const db = client.db('bctool');
		const projects = db.collection('projects');
		const project = await projects.findOne({
			'_id': new ObjectId(projectId),
		});

		if(project === null) {
			console.log(`Couldn't find project with id ${projectId}`);
			process.exit();
		}

		clean('debug');
		clean('lookups');
		debug(project);
		lookups();
		constants();
	}
	finally {
		await client.close();
	}
}

const usage = () => {
	console.log(`usage: debug [--help, -h] [--file, -f filename] [--all, -a] [--project, -p id]\n`)
	console.log(`-h, --help\t display this message and exit`)
	console.log(`-f, --file\t generate debugging output for projects from file of ids (one per line, skip first line for header)`)
	console.log(`-a, --all\t generate debugging output for all projects`)
	console.log(`-p, --project\t generate debugging output for a project by id`)
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