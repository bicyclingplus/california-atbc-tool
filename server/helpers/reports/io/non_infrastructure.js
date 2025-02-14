import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, elements) => {

  const headers = [
    'project_id',
    'element',
  ];

  const data = []

  for(let element of elements) {
  	data.push([
  		project_id,
  		element,
  	]);
  }

  writeOrAppendCSV('io', 'input_non_infrastructure', headers, data);
};
