import React from 'react';

class LengthInput extends React.Component {

    render() {
        let { shortname, value, onChange } = this.props;

        const inputId = `${shortname}-length`

        return (
            <div className="row">
                <div className="col-sm-2">
                    <label htmlFor={inputId} className="col-form-label">Length:</label>
                </div>
                <div className="col-sm-4">
                    <div className="input-group">
                        <input className="form-control" type="number" id={inputId} value={value} onChange={onChange} />
                        <span className="input-group-text">ft</span>
                    </div>
                </div>
            </div>
        );
    }

}

export default LengthInput;