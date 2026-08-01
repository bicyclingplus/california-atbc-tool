import React from 'react';

import { readableNumber } from '../helpers/formatting';

import './Health.css';

const HealthBenefits = (props) => {

  const {
    benefits,
    subtype,
  } = props;

  return (
    <>
    <div className="colored-header teal">
      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h3l2-5 4 10 2-5h2"></path>
        <circle cx="18" cy="12" r="1.6" fill="#ffffff"></circle>
      </svg>
      Physical Activity Benefits
    </div>

    <div className="info-bar">
      <span className="info-i">i</span>
      A Marginal Metabolic Equivalent of Task (MMET) measures the extra physical effort from walking or biking beyond just sitting still.
    </div>

    <div className="mmet-row">
      <div className="mmet-card">
        <div className="lbl">Annual MMET increase</div>
        <div className="val">{readableNumber(benefits.mmet.total.mean)}</div>
      </div>
      <div className="mmet-card">
        <div className="lbl">Annual MMET increase per person</div>
        <div className="val">{readableNumber(benefits.capita.total.mean, 1)}</div>
      </div>
      <table className="mmet-tbl">
        <thead>
          <tr>
            <th></th>
            <th>Annual MMET increase</th>
            <th>Annual MMET increase per person</th>
          </tr>
        </thead>
        <tbody>
          { subtype !== "pedestrian-only" ?
          <tr>
            <td>
              <svg viewBox="0 0 24 24" fill="#3aa9a3">
                <circle cx="5.5" cy="17.5" r="3.5" fill="none" stroke="#3aa9a3" strokeWidth="1.7"></circle>
                <circle cx="18.5" cy="17.5" r="3.5" fill="none" stroke="#3aa9a3" strokeWidth="1.7"></circle>
                <path d="M15 4l-1 3h-3l-2 5 4 2 2-4 3 4" fill="none" stroke="#3aa9a3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path>
                <circle cx="16" cy="3.5" r="1.2"></circle>
              </svg>
            </td>
            <td>{readableNumber(benefits.mmet.bike.mean)}</td>
            <td>{readableNumber(benefits.capita.bike.mean, 1)}</td>
          </tr>
          : null }

          { subtype !== "bike-only" ?
          <tr>
            <td>
              <svg viewBox="0 0 24 24" fill="#3aa9a3">
                <circle cx="13" cy="4" r="2"></circle>
                <path d="M11 22l1-7-2-3v-4l3-2 3 4 2 1v 2l-2-1-2-1-1 1 2 3 1 7" fill="#3aa9a3"></path>
              </svg>
            </td>
            <td>{readableNumber(benefits.mmet.pedestrian.mean)}</td>
            <td>{readableNumber(benefits.capita.pedestrian.mean, 1)}</td>
          </tr>
          : null }

        </tbody>
      </table>
    </div>
    </>
  );
}

export default HealthBenefits;
