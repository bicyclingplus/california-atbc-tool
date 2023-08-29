import { createRequire } from "module";
const require = createRequire(import.meta.url);

const schemas = [
	require('./latlng.schema.json'),
	require('./linestring.schema.json'),
	require('./point.schema.json'),
	require('./feature.schema.json'),
	require('./way.schema.json'),
	require('./userway.schema.json'),
	require('./intersection.schema.json'),
	require('./userintersection.schema.json'),
	require('./reach.schema.json'),

	require('./meanonly.schema.json'),
	require('./travel.schema.json'),
	require('./existingtravel.schema.json'),
	require('./element.schema.json'),
	require('./infrastructure.schema.json'),
	require('./noninfrastructure.schema.json'),
	require('./safetylocation.schema.json'),
	require('./safety.schema.json'),
	require('./benefits.schema.json'),

	require('./project.schema.json'),
];

export default schemas;
