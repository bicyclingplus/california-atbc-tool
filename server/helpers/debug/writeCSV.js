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

export default writeCSV;
