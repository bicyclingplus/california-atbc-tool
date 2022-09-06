import calcProjectQualitative from './calcProjectQualitative';
import calcTravel from './calcTravel';
import calcVMTReductions from './calcVMTReductions';
import calcEmissions from './calcEmissions';
import calcHealth from './calcHealth';
import calcSafetyQualitative from './calcSafetyQualitative';
import calcSafetyQuantitative from './calcSafetyQuantitative';

const calcBenefits = (
	project_type,
	project_subtype,

	project_county,
	project_year,

	project_time_frame,

	project_transit,

	project_length,
	num_intersections,

	infrastructure,

	existingTravel,

	selectedInfrastructure,
	selectedNonInfrastructure,

	hasOnlyUserMapSelections,

	selectedWays,
	selectedIntersections,

	safety
	) => {

	let benefits = {};

	benefits.projectQualitative = calcProjectQualitative(
		selectedInfrastructure, selectedNonInfrastructure);

	if(project_type === 'infrastructure' || project_type === 'both') {

		if(!hasOnlyUserMapSelections) {

      benefits.travel = calcTravel(
      	infrastructure,
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
      	infrastructure,
      	selectedInfrastructure,
      	project_length,
      	num_intersections,
      	safety,
      	project_time_frame
      );
	  }

	  benefits.safetyQualitative = calcSafetyQualitative(
      	infrastructure, selectedInfrastructure);

  }

  return benefits;
}

export default calcBenefits;
