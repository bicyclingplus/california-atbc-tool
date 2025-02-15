import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { readableNumber } from '../helpers/formatting';

// const Tooltip = require('bootstrap/js/dist/tooltip');
import Tooltip from 'bootstrap/js/dist/tooltip';

class Travel extends React.Component {

    componentDidMount() {
      this.tooltips = [
        new Tooltip(document.getElementById(`project-travel-tooltip`)),
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

    let benefits = this.props.benefits;
    let subtype = this.props.subtype;

    return (
      <>
      <h4 className="mt-4 section-sub-header">
        Project-Level Active Travel
        <i id={`project-travel-tooltip`}
          className="bi bi-info-circle ms-2"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-html="true"
          title='This tool provides estimates of existing active travel from regression models of permanent and temporary count data based on accessibility metrics, infrastructure, demographics, and crowd sourced data. For details about the models see the Technical Guide.'>
        </i>
      </h4>

      { subtype !== 'pedestrian-only' ?
      <>
      <h5 className="mt-4">Estimated Average Daily Bike Miles Traveled (BMT)</h5>

      <table className="table table-bordered" id="travel-bike-simple">
        <thead>
          <tr>
            <th colSpan="2"></th>
            <th className="text-center">Daily Bike Miles Travelled (BMT)</th>
            <th className="text-center">Daily BMT / Capita</th>
            <th className="text-center">Daily BMT / Jobs</th>
          </tr>
        </thead>
        <tbody>
          <tr className="striped-row">
            <th colSpan="2">Existing</th>
            <td className="text-end">{readableNumber(benefits.miles.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.existing.mean)}</td>
          </tr>
          <tr>
            <th rowSpan="5" className="align-middle">Increase in Active Travel</th>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.carShift.mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.routeShift.mean)}</td>
          </tr>
          <tr>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.inducedTravel.mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>Shift from Other Modes</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.otherShift.mean)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.miles.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.total.mean)}</td>
          </tr>
          <tr className="striped-row">
            <th colSpan="2">Projected (Existing + Increase)</th>
            <td className="text-end">{readableNumber(benefits.miles.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.projected.mean)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered d-none" id="travel-bike">
        <thead>
          <tr>
            <th colSpan="2"></th>
            <th colSpan="3" className="text-center">Daily Bike Miles Travelled (BMT)</th>
            <th colSpan="3" className="text-center">Daily BMT / Capita</th>
            <th colSpan="3" className="text-center">Daily BMT / Jobs</th>
          </tr>
          <tr>
            <th colSpan="2"></th>
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
            <th colSpan="2">Existing</th>
            <td className="text-end">{readableNumber(benefits.miles.bike.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.existing.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.existing.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.existing.upper)}</td>
          </tr>
          <tr>
            <th rowSpan="5" className="align-middle">Increase in Active Travel</th>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.carShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.carShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.carShift.upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.routeShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.routeShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.routeShift.upper)}</td>
          </tr>
          <tr>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.inducedTravel.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.inducedTravel.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.inducedTravel.upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>Shift from Other Modes</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.otherShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.otherShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.otherShift.upper)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.miles.bike.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.total.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.total.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.total.upper)}</td>
          </tr>
          <tr className="striped-row">
            <th colSpan="2">Projected (Existing + Increase)</th>
            <td className="text-end">{readableNumber(benefits.miles.bike.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.bike.projected.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.bike.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.bike.projected.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.bike.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.bike.projected.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
      : null }

      { subtype !== 'bike-only' ?
      <>
      <h5 className="mt-4">Estimated Average Daily Walk Miles Traveled (WMT)</h5>

      <table className="table table-bordered" id="travel-pedestrian-simple">
        <thead>
          <tr>
            <th colSpan="2"></th>
            <th className="text-center">Daily Walk Miles Traveled (WMT)</th>
            <th className="text-center">Daily WMT / Capita</th>
            <th className="text-center">Daily WMT / Jobs</th>
          </tr>
        </thead>
        <tbody>
          <tr className="striped-row">
            <th colSpan="2">Existing</th>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.existing.mean)}</td>
          </tr>
          <tr>
            <th rowSpan="5" className="align-middle">Increase in Active Travel</th>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.carShift.mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.routeShift.mean)}</td>
          </tr>
          <tr>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.inducedTravel.mean)}</td>
          </tr>
          <tr className="striped-row">
            <td>Shift from Other Modes</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.otherShift.mean)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.total.mean)}</td>
          </tr>
          <tr className="striped-row">
            <th colSpan="2">Projected (Existing + Increase)</th>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.projected.mean)}</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered d-none" id="travel-pedestrian">
        <thead>
          <tr>
            <th colSpan="2"></th>
            <th colSpan="3" className="text-center">Daily Walk Miles Traveled (WMT)</th>
            <th colSpan="3" className="text-center">Daily WMT / Capita</th>
            <th colSpan="3" className="text-center">Daily WMT / Jobs</th>
          </tr>
          <tr>
            <th colSpan="2"></th>
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
            <th colSpan="2">Existing</th>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.existing.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.existing.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.existing.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.existing.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.existing.upper)}</td>
          </tr>
          <tr>
            <th rowSpan="5" className="align-middle">Increase in Active Travel</th>
            <td>Car Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.carShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.carShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.carShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.carShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.carShift.upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>Route Shift</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.routeShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.routeShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.routeShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.routeShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.routeShift.upper)}</td>
          </tr>
          <tr>
            <td>Induced Travel</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.inducedTravel.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.inducedTravel.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.inducedTravel.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.inducedTravel.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.inducedTravel.upper)}</td>
          </tr>
          <tr className="striped-row">
            <td>Shift from Other Modes</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.otherShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.otherShift.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.otherShift.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.otherShift.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.otherShift.upper)}</td>
          </tr>
          <tr>
            <td><b>Total</b></td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.total.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.total.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.total.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.total.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.total.upper)}</td>
          </tr>
          <tr className="striped-row">
            <th colSpan="2">Projected (Existing + Increase)</th>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.miles.pedestrian.projected.upper)}</td>

            <td className="text-end">{readableNumber(benefits.capita.pedestrian.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.capita.pedestrian.projected.upper)}</td>

            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.projected.lower)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.projected.mean)}</td>
            <td className="text-end">{readableNumber(benefits.jobs.pedestrian.projected.upper)}</td>
          </tr>
        </tbody>
      </table>
      </>
      : null }
      </>
    );
  }

}

export default Travel;
