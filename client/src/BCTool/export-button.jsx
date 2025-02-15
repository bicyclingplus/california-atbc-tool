import React from 'react';

const ExportBenefitsEnabledButton = (props) => {

	const { exportBenefits } = props;

	return (
		<button
          type="button"
          className="btn btn-lg ms-4 benefits-button"
          onClick={exportBenefits}>Save Benefits (Export to PDF)</button>
	)
};

const ExportBenefitsDisabledButton = () => (
	<button
      type="button"
      className="btn btn-lg ms-4 benefits-button"
      disabled>Save Benefits (Export to PDF)</button>
);

const ExportBenefitsButton = (props) => {

	const { exportBenefits, inputsChanged } = props;

	return (
		<>
		{ inputsChanged ?
		<ExportBenefitsDisabledButton />
		:
		<ExportBenefitsEnabledButton exportBenefits={exportBenefits} />
		}
		</>
	);

};

const ExportButton = (props) => {

	const {
		showBenefits,
		exportBenefits,
		inputsChanged,
	} = props;

	return (
		<>
		{ showBenefits ?
		<ExportBenefitsButton exportBenefits={exportBenefits} inputsChanged={inputsChanged} />
		:
		null }
		</>
	);

};

export default ExportButton;