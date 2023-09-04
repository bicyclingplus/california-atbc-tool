import fs from 'fs';
import path from 'path';

const outdir = 'output';

const clean  = (folder) => {
	fs.rmSync(path.join(outdir, folder), {recursive: true, force: true });
};

const writeCSV = (folder, filename, headers, data) => {

	const folderdir = path.join(outdir, folder);
	const outfilename = path.join(folderdir, `${filename}.csv`);
	let content = '';

	// debugging output folder
	if(!fs.existsSync(outdir)) {
		fs.mkdirSync(outdir)
	}

	if(!fs.existsSync(folderdir)) {
		fs.mkdirSync(folderdir)
	}

	for(let row of data) {
		if(row.length !== headers.length) {
			console.log('Bad csv number of columns!');
			console.log(filename)
			console.log(headers)
			console.log(row)
			process.exit();
		}
	}

	content += headers.join(',') + '\n';

	for(let row of data) {
		content += row.join(',') + '\n';
	}

	fs.writeFileSync(outfilename, content);
};

const writeDebugCSV = (folder, filename, headers, data) => {
	const debugdir = path.join(outdir, 'debug');

	if(!fs.existsSync(outdir)) {
		fs.mkdirSync(outdir)
	}

	if(!fs.existsSync(debugdir)) {
		fs.mkdirSync(debugdir)
	}

	writeCSV(path.join('debug', folder), filename, headers, data);
};

export default writeDebugCSV;

export {
	clean,
	writeCSV
};
