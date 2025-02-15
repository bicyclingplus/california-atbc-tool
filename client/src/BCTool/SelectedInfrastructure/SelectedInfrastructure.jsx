import React from 'react';

import InfrastructureCategory from './InfrastructureCategory';

class SelectedInfrastructure extends React.Component {

    render() {

        let {
          categories,
          onChange,
          multi,
          selections
        } = this.props;

        let infrastructureCategories = [];
        let shortnames = Object.keys(selections);

        for(let category of categories) {

          let hasSelectedItems = false;

          for(let item of category.items) {
            if(shortnames.includes(item.shortname)) {
              hasSelectedItems = true;
              break;
            }
          }

          if(hasSelectedItems) {
            infrastructureCategories.push(
                <InfrastructureCategory
                    key={category.shortname}
                    category={category}
                    onChange={onChange}
                    selections={selections}
                />
            )
          }
        }

        return (
          <div>
            <h4 className="text-center section-header">Selected Infrastructure Elements</h4>

            { multi ?
            <h4 className="mt-5 mb-5 text-primary">
              You selected a multi element intervention. Make sure to not double count infrastructure that is a part of that intervention if it is in the multi element definition above.
            </h4>
            : null }

            {infrastructureCategories}
          </div>
        );
    }

}

export default SelectedInfrastructure;