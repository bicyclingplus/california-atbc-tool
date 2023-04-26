import React from 'react';

const Tooltip = require('bootstrap/js/dist/tooltip');

class Checkbox extends React.Component {

    componentDidMount() {

        let { description, shortname } = this.props;

        if(description !== '') {
            this.tooltip = new Tooltip(document.getElementById(`element-tooltip-${shortname}`));
        }
    }

    componentWillUnmount() {
        if(this.tooltip) {
            this.tooltip.dispose();
        }
    }

    onChange = (e) => {

        let { onChange, shortname } = this.props;

        onChange(shortname, e.target.checked);
    }

    render() {

        let { checked, label, shortname, description } = this.props;

        return (
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={"check-"+shortname}
                    checked={checked}
                    onChange={this.onChange} />
                <label
                    className="form-check-label"
                    htmlFor={"check-"+shortname}>
                    {label}
                </label>
                { description !== '' ?
                    <i id={`element-tooltip-${shortname}`}
                      className="bi bi-info-circle ms-2"
                      data-bs-toggle="tooltip"
                      title={description}>
                    </i>
                : null }
            </div>
        )
    }
}

export default Checkbox;
