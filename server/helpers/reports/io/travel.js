import {
  ESTIMATES,
} from '../../benefits/constants.js';

import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, benefits) => {

  const headers = [
    'project_id',
    'column',
    'mode',
    'item',
    'estimate',
    'value',
  ];

  const items = [
  'existing',
  'carShift',
  'routeShift',
  'inducedTravel',
  'otherShift',
  'total',
  'projected'
];

  const data = []

  for(let column of ['miles', 'capita', 'jobs']) {
    for(let mode of ['pedestrian', 'bike']) {
      for(let item of items) {
        for(let estimate of ESTIMATES) {
          data.push([
            project_id,
            column,
            mode,
            item,
            estimate,
            benefits[column][mode][item][estimate],
          ]);
        }
      }
    }
  }

  writeOrAppendCSV('io', 'output_travel', headers, data);
};