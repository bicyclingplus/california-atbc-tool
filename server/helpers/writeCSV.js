import fs from 'fs';
import path from 'path';

const outdir = 'output';

const clean  = (folder) => {
	fs.rmSync(path.join(outdir, folder), {recursive: true, force: true });
};

const sanity = (data, headers) => {
	for(let row of data) {
		if(row.length !== headers.length) {
			console.log('Bad csv number of columns!');
			console.log(headers)
			console.log(row)
			process.exit();
		}
	}
};

const transform = (input) => {
	return input.join(',') + '\n'
}

const transformAll = (input) => {
	let content = '';
	for(let row of input) {
		content += transform(row.map(el => `"${el}"`));
	}
	return content;
};

const appendCSV = (outfilename, headers, data) => {
	sanity(data, headers);
	fs.appendFileSync(outfilename, transformAll(data));
};

const writeCSV = (folder, filename, headers, data) => {

	const folderdir = path.join(outdir, folder);
	const outfilename = path.join(folderdir, `${filename}.csv`);

	// debugging output folder
	if(!fs.existsSync(outdir)) {
		fs.mkdirSync(outdir)
	}

	if(!fs.existsSync(folderdir)) {
		fs.mkdirSync(folderdir)
	}

	sanity(data, headers);

	let content = '';
	content += transform(headers);
	content += transformAll(data);

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

const writeOrAppendCSV = (folder, filename, headers, data) => {
	const filenameWithExt = `${filename}.csv`;
	const dir = path.join(outdir, folder, filenameWithExt);

	if(!fs.existsSync(dir)) {
		writeCSV(folder, filename, headers, data);
	}
	else {
		appendCSV(dir, headers, data);
	}
};

export default writeDebugCSV;

export {
	clean,
	writeCSV,
	writeOrAppendCSV,
};
