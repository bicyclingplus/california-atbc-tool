import fs from 'fs';

const writeCSV = (folder, filename, headers, data) => {

	const outdir = './debug_output';
	const folderdir = `${outdir}/${folder}`;
	const outfilename = `${folderdir}/${filename}.csv`;
	let content = '';

	// debugging output folder
	if(!fs.existsSync(outdir)) {
		fs.mkdirSync(outdir)
	}

	if(!fs.existsSync(folderdir)) {
		fs.mkdirSync(folderdir)
	}

	content += headers.join(',') + '\n';

	for(let row of data) {
		content += row.join(',') + '\n';
	}

	fs.writeFileSync(outfilename, content);
};

export default writeCSV;
