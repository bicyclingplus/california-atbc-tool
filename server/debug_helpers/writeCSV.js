import fs from 'fs';

const writeCSV = (projectId, filename, headers, data) => {

	const outdir = './debug_output';
	const projectdir = `${outdir}/${projectId}`;
	const outfilename = `${projectdir}/${filename}.csv`;
	let content = '';

	// debugging output folder
	if(!fs.existsSync(outdir)) {
		fs.mkdirSync(outdir)
	}

	if(!fs.existsSync(projectdir)) {
		fs.mkdirSync(projectdir)
	}

	content += headers.join(',') + '\n';

	for(let row of data) {
		content += row.join(',') + '\n';
	}

	fs.writeFileSync(outfilename, content);
};

export default writeCSV;
