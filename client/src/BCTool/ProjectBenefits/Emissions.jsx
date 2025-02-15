import React from 'react';

import { readableNumber } from '../helpers/formatting';

class Emissions extends React.Component {

  render() {

    let { emissions, vmtReductions, timeframe } = this.props;

    return (
      <>
      <h5 className="mt-4">VMT and Emissions</h5>

      <table className="table table-bordered mb-4" id="vmt-simple">
        <thead>
          <tr>
            <th className="text-center">{timeframe} Year Vehicle Miles Traveled (VMT) Reductions</th>
            <th className="text-center">{timeframe} Year VMT Reductions / Capita</th>
            <th className="text-center">{timeframe} Year VMT Reductions / Jobs</th>
          </tr>
        </thead>
        <tbody>
          <tr className="striped-row">
            <td className="text-end">{readableNumber(vmtReductions.miles.mean)}</td>
            <td className="text-end">{readableNumber(vmtReductions.capita.mean)}</td>
            <td className="text-end">{readableNumber(vmtReductions.jobs.mean)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mb-4"  id="emissions-simple">
        <thead>
          <tr>
            <th><br /></th>
            <th className="text-center">{timeframe} Year Emission Reductions (Grams)</th>
            <th className="text-center">{timeframe} Year Emission Reductions (Grams) / Capita</th>
            <th className="text-center">{timeframe} Year Emission Reductions (Grams) / Jobs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan="4">Greenhouse Gasses</th>
          </tr>
          <tr className="striped-row">
            <td>CO2</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO2'].mean)}</td>
          </tr>
          <tr>
            <td>CH4</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CH4'].mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>N2O</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['N2O'].mean)}</td>
          </tr>
          <tr>
            <td>Total C02 Equivalent</td>
            <td className="text-end">{readableNumber(emissions.miles.equivalent.mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.equivalent.mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.equivalent.mean)}</td>
          </tr>
          <tr>
            <th colSpan="4">Air Toxins</th>
          </tr>
          <tr className="striped-row">
            <td>NOx</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['NOx'].mean)}</td>
          </tr>
          <tr>
            <td>PM 2.5</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM2.5'].mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>PM 10</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM10'].mean)}</td>
          </tr>
          <tr>
            <td>NH3</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['NH3'].mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>CO</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO'].mean)}</td>
          </tr>
          <tr>
            <td>SOx</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['SOx'].mean)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mb-4 d-none" id="vmt">
        <thead>
          <tr>
            <th colSpan="3" className="text-center">{timeframe} Year Vehicle Miles Traveled (VMT) Reductions</th>
            <th colSpan="3" className="text-center">{timeframe} Year VMT Reductions / Capita</th>
            <th colSpan="3" className="text-center">{timeframe} Year VMT Reductions / Jobs</th>
          </tr>
          <tr>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
        </thead>
        <tbody>
          <tr className="striped-row">
            <td className="text-end">{readableNumber(vmtReductions.miles.lower)}</td>
            <td className="text-end">{readableNumber(vmtReductions.miles.mean)}</td>
            <td className="text-end">{readableNumber(vmtReductions.miles.upper)}</td>

            <td className="text-end">{readableNumber(vmtReductions.capita.lower)}</td>
            <td className="text-end">{readableNumber(vmtReductions.capita.mean)}</td>
            <td className="text-end">{readableNumber(vmtReductions.capita.upper)}</td>

            <td className="text-end">{readableNumber(vmtReductions.jobs.lower)}</td>
            <td className="text-end">{readableNumber(vmtReductions.jobs.mean)}</td>
            <td className="text-end">{readableNumber(vmtReductions.jobs.upper)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered mb-4 d-none" id="emissions">
        <thead>
          <tr>
            <th><br /></th>
            <th colSpan="3" className="text-center">{timeframe} Year Emission Reductions (Grams)</th>
            <th colSpan="3" className="text-center">{timeframe} Year Emission Reductions (Grams) / Capita</th>
            <th colSpan="3" className="text-center">{timeframe} Year Emission Reductions (Grams) / Jobs</th>
          </tr>
          <tr>
            <th><br /></th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
            <th className="text-center">Lower</th>
            <th className="text-center">Mean</th>
            <th className="text-center">Upper</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan="7">Greenhouse Gasses</th>
          </tr>
          <tr className="striped-row">
            <td>CO2</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO2'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO2'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['CO2'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CO2'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO2'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO2'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO2'].upper)}</td>
          </tr>
          <tr>
            <td>CH4</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CH4'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CH4'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['CH4'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CH4'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['CH4'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CH4'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CH4'].upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>N2O</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['N2O'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['N2O'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['N2O'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['N2O'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['N2O'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['N2O'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['N2O'].upper)}</td>
          </tr>
          <tr>
            <td>Total C02 Equivalent</td>
            <td className="text-end">{readableNumber(emissions.miles.equivalent.lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.equivalent.mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.equivalent.upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.equivalent.lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.equivalent.mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.equivalent.upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.equivalent.lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.equivalent.mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.equivalent.upper)}</td>
          </tr>
          <tr>
            <th colSpan="7">Air Toxins</th>
          </tr>
          <tr className="striped-row">
            <td>NOx</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NOx'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['NOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['NOx'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['NOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['NOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['NOx'].upper)}</td>
          </tr>
          <tr>
            <td>PM 2.5</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM2.5'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM2.5'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['PM2.5'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['PM2.5'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM2.5'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM2.5'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM2.5'].upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>PM 10</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM10'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['PM10'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['PM10'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['PM10'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM10'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM10'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['PM10'].upper)}</td>
          </tr>
          <tr>
            <td>NH3</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NH3'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['NH3'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['NH3'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['NH3'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['NH3'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['NH3'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['NH3'].upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>CO</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['CO'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['CO'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['CO'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['CO'].upper)}</td>
          </tr>
          <tr>
            <td>SOx</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['SOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.miles.reductions['SOx'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.capita.reductions['SOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.capita.reductions['SOx'].upper)}</td>

            <td className="text-end">{readableNumber(emissions.jobs.reductions['SOx'].lower)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['SOx'].mean)}</td>
            <td className="text-end">{readableNumber(emissions.jobs.reductions['SOx'].upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
    );
  }

}

export default Emissions;


