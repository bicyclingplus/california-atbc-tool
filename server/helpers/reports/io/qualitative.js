import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, elements) => {

  const headers = [
    'project_id',
    'element',
    'benefit',
    'sources',
  ];

  const data = [];

  for(let element of elements) {
    for(let benefit of element.benefits) {
      data.push([
        project_id,
        element.shortname,
        benefit.description,
        benefit.sources,
      ]);
   }
  }

  writeOrAppendCSV('io', 'output_qualitative', headers, data);
};
