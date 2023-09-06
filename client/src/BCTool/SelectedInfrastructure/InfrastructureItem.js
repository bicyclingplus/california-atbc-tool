import React from 'react';

import CountInput from './CountInput';
import LengthInput from './LengthInput';

import './selectedInfrastructure.css';

class infrastructureItem extends React.Component {

    constructor(props) {
        super(props);

        let {
            newValue,
            upgradeValue,
            retrofitValue,
        } = this.props;

        this.state = {
            'new': newValue > 0 ? true : false,
            'upgrade': upgradeValue > 0 ? true : false,
            'retrofit': retrofitValue > 0 ? true : false,
        };
    }

    onNewValueChange = (e) => {
        let { shortname, onChange } = this.props;

        onChange(shortname, 'new', parseInt(e.target.value));
    }

    onUpgradeValueChange = (e) => {
        let { shortname, onChange } = this.props;

        onChange(shortname, 'upgrade', parseInt(e.target.value));
    }

    onRetrofitValueChange = (e) => {
        let { shortname, onChange } = this.props;

        onChange(shortname, 'retrofit', parseInt(e.target.value));
    }

    updateNew = (e) => {
        let { shortname, onChange } = this.props;

        this.setState({
            'new': e.target.checked,
        }, () => {
            if(!e.target.checked) {
                onChange(shortname, 'new', 0);
            }
        })
    }

    updateUpgrade = (e) => {
        let { shortname, onChange } = this.props;

        this.setState({
            'upgrade': e.target.checked,
        }, () => {
            if(!e.target.checked) {
                onChange(shortname, 'upgrade', 0);
            }
        })
    }

    updateRetrofit = (e) => {
        let { shortname, onChange } = this.props;

        this.setState({
            'retrofit': e.target.checked,
        }, () => {
            if(!e.target.checked) {
                onChange(shortname, 'retrofit', 0);
            }
        })
    }

    render() {
        let {
            label,
            newValue,
            upgradeValue,
            retrofitValue,
            units,
            shortname,
        } = this.props;

        return (
            <tr>
                <td>{label}</td>

                <td>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-check">
                              <input className="form-check-input form-check-input-margin" type="checkbox" id={`${shortname}-new`} checked={this.state.new} onChange={this.updateNew} />
                              <label className="form-check-label col-form-label" htmlFor={`${shortname}-new`}>
                                New Construction
                              </label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-check">
                              <input className="form-check-input form-check-input-margin" type="checkbox" id={`${shortname}-upgrade`} checked={this.state.upgrade} onChange={this.updateUpgrade} />
                              <label className="form-check-label col-form-label" htmlFor={`${shortname}-upgrade`}>
                                Significant Upgrade
                              </label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-check">
                              <input className="form-check-input form-check-input-margin" type="checkbox" id={`${shortname}-retrofit`} checked={this.state.retrofit} onChange={this.updateRetrofit} />
                              <label className="form-check-label col-form-label" htmlFor={`${shortname}-retrofit`}>
                                Retrofit/Maintenance
                              </label>
                            </div>
                        </div>
                    </div>
                </td>

                <td>
                { this.state.new ?
                    <>
                    { units === 'length' ?
                    <LengthInput shortname={`${shortname}-new`} value={newValue} onChange={this.onNewValueChange} required/>
                    :
                    <CountInput shortname={`${shortname}-new`} value={newValue} onChange={this.onNewValueChange} required />
                    }
                    </>
                : <div className="row-empty-height"><br /></div> }
                { this.state.upgrade ?
                    <>
                    { units === 'length' ?
                    <LengthInput shortname={`${shortname}-upgrade`} value={upgradeValue} onChange={this.onUpgradeValueChange} required/>
                    :
                    <CountInput shortname={`${shortname}-upgrade`} value={upgradeValue} onChange={this.onUpgradeValueChange} required />
                    }
                    </>
                : <div className="row-empty-height"><br /></div> }
                { this.state.retrofit ?
                    <>
                    { units === 'length' ?
                    <LengthInput shortname={`${shortname}-retrofit`} value={retrofitValue} onChange={this.onRetrofitValueChange} required/>
                    :
                    <CountInput shortname={`${shortname}-retrofit`} value={retrofitValue} onChange={this.onRetrofitValueChange} required />
                    }
                    </>
                : <div className="row-empty-height"><br /></div> }
                </td>
            </tr>
        );
    }

}

export default infrastructureItem;