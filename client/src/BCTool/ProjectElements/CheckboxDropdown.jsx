import React from 'react';

import CheckboxList from './CheckboxList';

class CheckboxDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.buildButtonText = this.buildButtonText.bind(this);
    }

    buildButtonText() {

        let { buttonText, items, selected } = this.props;

        let selectedText = [];

        for(let item of items) {
            if(selected.includes(item.shortname)) {
                selectedText.push(item.label);
            }
        }

        if(selectedText.length) {
            return selectedText.join(", ");
        }

        return buttonText;
    }

    render() {

        let { items, onChange, name, selected } = this.props;

        return (
            <div className="dropdown d-grid gap-2">
              <button className="btn btn-secondary btn-lg dropdown-toggle"
                data-bs-auto-close="outside"
                type="button"
                id={"dropdown-"+name}
                data-bs-toggle="dropdown"
                aria-expanded="false">
                {this.buildButtonText()}
              </button>
              <div className="dropdown-menu" aria-labelledby={"dropdown-"+name}>
                <form className="px-4 py-3">
                    <CheckboxList
                        items={items}
                        onChange={onChange}
                        selected={selected}
                    />
                </form>
              </div>
            </div>
        );
    }
}

export default CheckboxDropdown;