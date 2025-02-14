import { writeOrAppendCSV } from '../../writeCSV.js';

export default (project_id, details) => {

  const headers = [
    'project_id',
    'name',
    'date',
    'developer',
    'county',
    'cost ($)',
    'timeframe (years)',
    'type',
    'subtype',
    'year',
    'transit',
  ];

  const data = [
    project_id,
    details.name,
    details.date,
    details.developer,
    details.county,
    details.cost,
    details.timeframe,
    details.type,
    details.subtype,
    details.year,
    details.transit,
  ];

  writeOrAppendCSV('io', 'input_project', headers, [data]);
};
