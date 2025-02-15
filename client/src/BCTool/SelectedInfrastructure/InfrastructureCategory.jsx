import React from 'react';

import 'bootstrap-icons/font/bootstrap-icons.css';

import InfrastructureItem from './InfrastructureItem';

// const Tooltip = require('bootstrap/js/dist/tooltip');
import Tooltip from 'bootstrap/js/dist/tooltip';

class InfrastructureCategory extends React.Component {

    componentDidMount() {

      let { category } = this.props;

      this.tooltips = [
        new Tooltip(document.getElementById(`infrastructure-category-${category.label}`)),
      ];
    }

    componentWillUnmount() {
      if(this.tooltips && this.tooltips.length) {
        for(let tooltip of this.tooltips) {
          tooltip.dispose();
        }
      }
    }

    render() {
        let { category, onChange, selections } = this.props;

        let shortnames = Object.keys(selections);

        return (
            <>
            <div className="mb-5">
            <h5>{category.label}</h5>
            <table className="table">
                <thead>
                    <tr>
                        <th width="33%"></th>
                        <th width="33%">Type</th>
                        <th>
                            Length or Count of Element
                            <i id={`infrastructure-category-${category.label}`}
                                className="bi bi-info-circle ms-2"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                data-bs-html="true"
                                title='For discrete elements that are often installed with many units (e.g., rapid flashing beacons), consider each intervention location a discrete count. For example, a new crossing with three rectangular rapid flashing beacons installed (one on each side of a road and one on a center median) should have a count of one.'>
                            </i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        category.items
                            .filter((item) => (shortnames.includes(item.shortname)))
                            .map((item) => (
                                <InfrastructureItem
                                    key={item.shortname}
                                    shortname={item.shortname}
                                    label={item.label}
                                    newValue={selections[item.shortname].new}
                                    upgradeValue={selections[item.shortname].upgrade}
                                    retrofitValue={selections[item.shortname].retrofit}
                                    units={item.units}
                                    onChange={onChange}
                                />
                            ))
                    }
                </tbody>
            </table>
            </div>
            </>
        );
    }

}

export default InfrastructureCategory;