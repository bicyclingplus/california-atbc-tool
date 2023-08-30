import { createRequire } from "module";
const require = createRequire(import.meta.url);

const schemas = [

	// reach
	require('./latlng.schema.json'),
	require('./linestring.schema.json'),
	require('./point.schema.json'),
	require('./feature.schema.json'),
	require('./way.schema.json'),
	require('./userway.schema.json'),
	require('./intersection.schema.json'),
	require('./userintersection.schema.json'),
	require('./reach.schema.json'),

	// safety inputs
	require('./safetylocation.schema.json'),
	require('./safety.schema.json'),

	// elements
	require('./element.schema.json'),
	require('./infrastructure.schema.json'),
	require('./noninfrastructure.schema.json'),

	// existing travel
	require('./meanonly.schema.json'),
	require('./travel.schema.json'),
	require('./existingtravel.schema.json'),

	// benefits/project
	require('./county.schema.json'),
	require('./safetyinputs.schema.json'),
	require('./subtype.schema.json'),
	require('./timeframe.schema.json'),
	require('./transit.schema.json'),
	require('./type.schema.json'),
	require('./year.schema.json'),

	// benefits
	require('./benefits.schema.json'),

	require('./estimate.schema.json'),

	require('./emissionscolumn.schema.json'),
	require('./emissions.schema.json'),

	require('./healthcolumn.schema.json'),
	require('./health.schema.json'),

	require('./projectqualitative.schema.json'),

	require('./qualitativebenefit.schema.json'),
	require('./qualitative.schema.json'),

	require('./quantitativeoutcomesingle.schema.json'),
	require('./quantitativeoutcometriple.schema.json'),

	require('./quantitativesectionsingle.schema.json'),
	require('./quantitativesectiontriple.schema.json'),

	require('./quantitativecolumn.schema.json'),
	require('./quantitative.schema.json'),

	require('./projectedtravelmode.schema.json'),
	require('./projectedtravelcolumn.schema.json'),
	require('./projectedtravel.schema.json'),

	require('./vmt.schema.json'),
	
	// project
	require('./project.schema.json'),
];

export default schemas;

