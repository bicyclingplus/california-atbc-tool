import React from 'react';

import { readableNumber } from '../helpers/formatting';

import './Emissions.css';

const Emissions = (props) => {

  const {
    emissions,
    vmtReductions,
  } = props;

  return (
    <>
    <div className="colored-header green">
      <svg viewBox="0 0 24 24" fill="#ffffff">
        <path d="M3 13l2-6h14l2 6v6h-2v-2H5v2H3v-6zm3-5l-1 3h14l-1-3H6zm.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"></path>
      </svg>
      VMT and Emissions
    </div>

    <div className="vmt-row">
      <div className="vmt-card">
        <div className="lbl">Annual Vehicle Miles Traveled (VMT) reductions</div>
        <div className="val">{readableNumber(vmtReductions.raw.mean)}</div>
      </div>
      <div className="vmt-card">
        <div className="lbl">Annual VMT reductions per person</div>
        <div className="val">TODO</div>
      </div>
    </div>

    <div className="emissions-row">
      <div>
        <div className="colored-header green" style={{marginTop: 0}}>
          <svg viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12 2c-1.5 3-3 4.5-5 6.5C5 11 4 13 4 15a8 8 0 0 0 16 0c0-2-1-4-3-6.5-2-2-3.5-3.5-5-6.5z"></path>
          </svg>
          Greenhouse Gasses
        </div>
        <table className="em-tbl">
          <thead>
            <tr>
              <th></th>
              <th>Annual reductions<span className="sub">(Grams)</span></th>
              <th>Annual reductions per person<span className="sub">(Grams)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CO<span className="sub-num">2</span></td>
              <td>{readableNumber(emissions.raw.reductions.CO2.mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>CH<span className="sub-num">4</span></td>
              <td>{readableNumber(emissions.raw.reductions.CH4.mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>N<span className="sub-num">2</span>O</td>
              <td>{readableNumber(emissions.raw.reductions.N2O.mean)}</td>
              <td>TODO</td>
            </tr>
          </tbody>
        </table>
        <div className="co2eq" style={{width: "auto"}}>
          <div className="lbl">Annual CO<span className="sub-num">2</span> equivalent</div>
          <div className="val">{readableNumber(emissions.raw.equivalent.mean)} <span className="units">grams</span></div>
        </div>
      </div>
      <div>
        <div className="colored-header green" style={{marginTop: 0}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.6">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 4 L13.5 7 L10.5 7 Z M12 20 L13.5 17 L10.5 17 Z M4 12 L7 13.5 L7 10.5 Z M20 12 L17 13.5 L17 10.5 Z" fill="#ffffff" stroke="none"></path>
          </svg>
          Air Toxins
        </div>
        <table className="em-tbl">
          <thead>
            <tr>
              <th></th>
              <th>Annual reductions<span className="sub">(Grams)</span></th>
              <th>Annual reductions per person<span className="sub">(Grams)</span></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NO<span className="sub-num">x</span></td>
              <td>{readableNumber(emissions.raw.reductions.NOx.mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>PM<span className="sub-num">2.5</span></td>
              <td>{readableNumber(emissions.raw.reductions["PM2.5"].mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>PM<span className="sub-num">10</span></td>
              <td>{readableNumber(emissions.raw.reductions.PM10.mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>NH<span className="sub-num">3</span></td>
              <td>{readableNumber(emissions.raw.reductions.NH3.mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>CO</td>
              <td>{readableNumber(emissions.raw.reductions.CO.mean)}</td>
              <td>TODO</td>
            </tr>
            <tr>
              <td>SO<span className="sub-num">x</span></td>
              <td>{readableNumber(emissions.raw.reductions.SOx.mean)}</td>
              <td>TODO</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Emissions;
