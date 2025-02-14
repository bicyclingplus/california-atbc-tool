import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, elements) => {

  const headers = [
    'project_id',
    'element',
    'new (ft/count)',
    'upgrade (ft/count)',
    'retrofit (ft/count)',
  ];

  const data = []

  for(let element in elements) {
  	data.push([
  		project_id,
  		element,
  		elements[element].new,
  		elements[element].upgrade,
  		elements[element].retrofit,
  	]);
  }

  writeOrAppendCSV('io', 'input_infrastructure', headers, data);
};
