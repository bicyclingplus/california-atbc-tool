import React from 'react';

class CountInput extends React.Component {

    render() {
        let { shortname, value, onChange } = this.props;

        const inputId = `${shortname}-count`

        return (
            <div className="row">
                <div className="col-sm-2">
                    <label htmlFor={inputId} className="col-form-label">Count:</label>
                </div>
                <div className="col-sm-4">
                    <input className="form-control" type="number" id={inputId} value={value} onChange={onChange} />
                </div>
            </div>
        );
    }

}

export default CountInput;