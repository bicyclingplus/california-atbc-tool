import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import CheckboxList from './CheckboxList';

// const Tooltip = require('bootstrap/js/dist/tooltip');
import Tooltip from 'bootstrap/js/dist/tooltip';

class CategorizedCheckboxList extends React.Component {

    componentDidMount() {
        const { category } = this.props;
        if(category.tooltip) {
            this.tooltip = new Tooltip(document.getElementById(`${category.shortname}-tooltip`));
        }
    }

    componentWillUnmount() {
        const { category } = this.props;
        if(category.tooltip) {
            this.tooltip.dispose();
        }
    }

    render() {

        let { category, selected, onChange } = this.props;

        return (
            <>
            <div className="mb-3">
                <h6 className="dropdown-header">
                    {category.label}
                    { category.tooltip ?
                    <i id={`${category.shortname}-tooltip`}
                        className="bi bi-info-circle ms-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        data-bs-html="true"
                        title={category.tooltip}></i>
                    : null }
                </h6>
                <CheckboxList
                    items={category.items}
                    onChange={onChange}
                    selected={selected}
                />
            </div>
            </>
        );
    }
}

export default CategorizedCheckboxList;
