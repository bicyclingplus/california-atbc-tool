// id
// element
// benefits
// sources

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (id, elements) => {

  const headers = [
    'id',
    'element',
    'benefit',
    'sources',
  ];

  const data = [];

  for(let element of elements) {
    for(let benefit of element.benefits) {
      data.push([
        id,
        element.element,
        benefit.description,
        benefit.sources,
      ]);
   }
  }

  writeOrAppendCSV('io', 'output_qualitative', headers, data);

};