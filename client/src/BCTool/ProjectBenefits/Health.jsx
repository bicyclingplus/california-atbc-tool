import React from 'react';

import { readableNumber } from '../helpers/formatting';

class HealthBenefits extends React.Component {

  render() {

    const {
      benefits,
      subtype,
      timeframe,
    } = this.props;

    return (
      <>
      <h5 className="mt-4">Physical Activity</h5>

      <table className="table table-bordered" id="health-simple">
        <thead>
          <tr>
            <th><br /></th>
            <th className="text-center">{timeframe} Year Marginal Metabolic Equivalent of Task (MMET) Increase</th>
            <th className="text-center">{timeframe} Year MMET Increase / Capita</th>
            <th className="text-center">{timeframe} Year MMET Increase / Jobs</th>
          </tr>
        </thead>
        <tbody>
          { subtype !== 'pedestrian-only' ?
          <tr className="striped-row">
            <th>Bicyling</th>
            <td className="text-end">{readableNumber(benefits.miles.bike.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.mean)}</td>
          </tr>
          : null }
          { subtype !== 'bike-only' ?
          <tr>
            <th>Walking</th>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.mean)}</td>
          </tr>
          : null }
          <tr className="striped-row">
            <th>TOTAL</th>
            <td className="text-end">{readableNumber(benefits.miles.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.total.mean)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered d-none" id="health">
        <thead>
          <tr>
            <th></th>
            <th colSpan="3" className="text-center">Marginal Metabolic Equivalent of Task (MMET) Increase</th>
            <th colSpan="3" className="text-center">MMET Increase / Capita</th>
            <th colSpan="3" className="text-center">MMET Increase / Jobs</th>
          </tr>
          <tr>
            <th></th>
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
          { subtype !== 'pedestrian-only' ?
          <tr className="striped-row">
            <th>Bicyling</th>
            <td className="text-end">{readableNumber(benefits.miles.bike.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.upper)}</td>
          </tr>
          : null }
          { subtype !== 'bike-only' ?
          <tr>
            <th>Walking</th>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.upper)}</td>
          </tr>
          : null }
          <tr className="striped-row">
            <th>TOTAL</th>
            <td className="text-end">{readableNumber(benefits.miles.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.total.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.total.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.total.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
    );
  }

}

export default HealthBenefits;

