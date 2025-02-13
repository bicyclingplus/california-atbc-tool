import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, elements) => {

  const headers = [
    'id',
    'element',
  ];

  const data = []

  for(let element of elements) {
  	data.push([
  		id,
  		element,
  	]);
  }

  writeOrAppendCSV('io', 'input_non_infrastructure', headers, data);
};
