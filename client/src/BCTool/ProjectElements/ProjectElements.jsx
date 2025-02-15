import React from 'react';

import CategorizedCheckboxDropdown from './CategorizedCheckboxDropdown';
import CheckboxDropdown from './CheckboxDropdown';

class ProjectElements extends React.Component {

  render() {

    let type = this.props.type;
    let selectedInfrastructure = Object.keys(this.props.selectedInfrastructure);

    return (
      <div>
          <h4 className="text-center section-header">Define Project Elements</h4>

          { type === 'infrastructure' || type === 'both' ?
          <div className="row mb-3 mt-4">
            <div className="col-sm-4"><h5 className="form-label">Infrastructure Elements</h5></div>
            <div className="col-sm-8">
              <CategorizedCheckboxDropdown
                id="infrastructure-dropdown"
                className="col-sm-10"
                buttonText="Click to select"
                maxLength="75"
                name="infrastructure"
                categories={this.props.infrastructure.categories}
                onChange={this.props.onInfrastructureChange}
                isAddingUserWay={this.props.isAddingUserWay}
                showUserWayWarning={this.props.showUserWayWarning}
                selected={selectedInfrastructure}
                />
            </div>
          </div>
          : null }

          { type === 'non-infrastructure' || type === 'both' ?
          <div className="row mb-3 mt-4">
            <div className="col-sm-4"><h5 className="form-label">Non-Infrastructure Elements</h5></div>
            <div className="col-sm-8">
              <CheckboxDropdown
                id="non-infrastructure-dropdown"
                className="col-sm-10"
                buttonText="Click to select"
                maxLength="75"
                name="non-infrastructure"
                items={this.props.nonInfrastructure.items}
                onChange={this.props.onNonInfrastructureChange}
                selected={this.props.selectedNonInfrastructure}
                />
            </div>
          </div>
          : null }
      </div>
    );
  }

}

export default ProjectElements;
