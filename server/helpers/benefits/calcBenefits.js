import calcProjectQualitative from './calcProjectQualitative.js';
import calcTravel from './calcTravel.js';
import calcVMTReductions from './calcVMTReductions.js';
import calcEmissions from './calcEmissions.js';
import calcHealth from './calcHealth.js';
import calcSafetyQualitative from './calcSafetyQualitative.js';
import calcSafetyQuantitative from './calcSafetyQuantitative.js';

const calcBenefits = (
	project_type,
	project_subtype,
	project_county,
	project_year,
	project_time_frame,
	project_transit,
	project_length,
	num_intersections,
	existingTravel,
	selectedInfrastructure,
	selectedNonInfrastructure,
	hasOnlyUserMapSelections,
	selectedWays,
	selectedIntersections,
	safety) => {

	const benefits = {};

	benefits.projectQualitative = calcProjectQualitative(
		selectedInfrastructure, selectedNonInfrastructure);

	if(project_type === 'infrastructure' || project_type === 'both') {

		if(!hasOnlyUserMapSelections) {

      benefits.travel = calcTravel(
      	selectedInfrastructure,
      	existingTravel,
      	project_length,
      	num_intersections);

      benefits.vmtReductions = calcVMTReductions(
      	benefits.travel, project_time_frame, project_transit);

      benefits.emissions = calcEmissions(
        project_county, project_year, benefits.vmtReductions);

      benefits.health = calcHealth(benefits.travel, project_time_frame);

      benefits.safetyQuantitative = calcSafetyQuantitative(
      	selectedWays,
      	selectedIntersections,
      	selectedInfrastructure,
      	project_length,
      	num_intersections,
      	safety,
      	project_time_frame
      );
	  }

	  benefits.safetyQualitative = calcSafetyQualitative(
	  	selectedInfrastructure);

  }

  return benefits;
}

export default calcBenefits;
