import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, benefits) => {

  const headers = [
    'id',
    'name',
    'description',
  ];

  const data = [];

  for(let benefit of benefits) {
  	data.push([
  		id,
  		benefit.name,
  		benefit.description,
  	]);
  }

  writeOrAppendCSV('io', 'output_general', headers, data);
};
