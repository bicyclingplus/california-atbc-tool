import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

dotenv.config();

const outdir = 'output'
const folder = 'dumps';
const folderdir = path.join(outdir, folder);

const dumpProject = async (projectId) => {

	const outfilename = path.join(folderdir, `${projectId}.json`);

	let client;

	try {

		client = new MongoClient(process.env.MONGO_URI);
	    const db = client.db('bctool');
		const projects = db.collection('projects');

		const project = await projects.findOne({
			'_id': new ObjectId(projectId),
		});

		if(project === null) {
			console.log(`Couldn't find project with id: ${projectId}`);
			process.exit();
		}

		if(!fs.existsSync(outdir)) {
			fs.mkdirSync(outdir)
		}

		if(!fs.existsSync(folderdir)) {
			fs.mkdirSync(folderdir)
		}

		fs.writeFileSync(outfilename, JSON.stringify(project));

		console.log(`Created ${outfilename}`);

	}
	finally {
		await client.close();
	}
}

const usage = () => {
	console.log(`Dumps project with specified id from mongo as JSON`);
	console.log(`usage: dump id\n`)
	console.log(`-h, --help\t display this message and exit`)

	process.exit();
}


if(process.argv.length === 3) {

	switch(process.argv[2]) {
		case '-h':
		case '--help':
			usage();
		break;
	}

	await dumpProject(process.argv[2]);
}
else {
	usage();
}