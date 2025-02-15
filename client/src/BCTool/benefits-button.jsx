import React from 'react';

const EstimateBenefitsButton = (props) => {

	const { updateBenefits } = props;

	return (
		<button
          type="button"
          className="btn btn-lg benefits-button"
          onClick={updateBenefits}>Estimate Benefits</button>
	);

};

const UpdateBenefitsEnabledButton = (props) => {

	const { updateBenefits } = props;

	return (
		<button
          type="button"
          className="btn btn-lg benefits-button"
          onClick={updateBenefits}>Update Benefits</button>
	)
};

const UpdateBenefitsDisabledButton = () => (
	<button
      type="button"
      className="btn btn-lg benefits-button"
      disabled>Update Benefits</button>
);

const UpdateBenefitsButton = (props) => {

	const { updateBenefits, inputsChanged } = props;

	return (
		<>
		{ inputsChanged ?
		<UpdateBenefitsEnabledButton updateBenefits={updateBenefits} />
		:
		<UpdateBenefitsDisabledButton />
		}
		</>
	);

};

const BenefitsButton = (props) => {

	const {
		showBenefits,
		updateBenefits,
		inputsChanged,
	} = props;

	return (
		<>
		{ showBenefits ?
		<UpdateBenefitsButton updateBenefits={updateBenefits} inputsChanged={inputsChanged} />
		:
		<EstimateBenefitsButton updateBenefits={updateBenefits} />
		}
		</>
	);

};

export default BenefitsButton;