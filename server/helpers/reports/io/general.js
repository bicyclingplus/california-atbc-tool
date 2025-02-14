import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, benefits) => {

  const headers = [
    'project_id',
    'name',
    'description',
  ];

  const data = [];

  for(let benefit of benefits) {
  	data.push([
  		project_id,
  		benefit.name,
  		benefit.description,
  	]);
  }

  writeOrAppendCSV('io', 'output_general', headers, data);
};
