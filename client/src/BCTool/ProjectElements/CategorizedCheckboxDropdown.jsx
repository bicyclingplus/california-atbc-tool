import React from 'react';

import CategorizedCheckboxList from './CategorizedCheckboxList';

class CategorizedCheckboxDropdown extends React.Component {

    buildButtonText = () => {

        let selectedText = [];
        let { categories, buttonText, selected } = this.props;

        for(let category of categories) {

            for(let item of category.items) {
                if(selected.includes(item.shortname)) {
                    selectedText.push(item['label']);
                }
            }
        }

        if(selectedText.length) {
            return selectedText.join(", ");
        }

        return buttonText;
    }

    checkIsAddingUserWay = (e) => {
        if(this.props.isAddingUserWay) {
            this.props.showUserWayWarning();
        }
    }

    render() {

        const buttonText = this.buildButtonText();
        let { categories, onChange, name, selected } = this.props;

        let categorizedCheckboxLists = categories.map((category) => (
            <CategorizedCheckboxList
                key={category.shortname}
                category={category}
                onChange={onChange}
                selected={selected}
            />
        ));

        return (
            <div className="dropdown d-grid gap-2">
              <button className="btn btn-secondary btn-lg dropdown-toggle"
                data-bs-auto-close="outside"
                type="button" id={"dropdown-"+name}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={this.checkIsAddingUserWay}>
                {buttonText}
              </button>
              <div className="dropdown-menu" aria-labelledby={"dropdown-"+name}>
                <form>
                    <div className="row ms-4 me-4">
                        <div className="col-sm-4">
                            {
                                categorizedCheckboxLists.slice(0,2)
                            }
                        </div>
                        <div className="col-sm-4">
                            {
                                categorizedCheckboxLists.slice(2,3)
                            }
                        </div>
                        <div className="col-sm-4">
                            {
                                categorizedCheckboxLists.slice(3,4)
                            }
                        </div>
                    </div>
                </form>
              </div>
            </div>
        );
    }
}

export default CategorizedCheckboxDropdown;