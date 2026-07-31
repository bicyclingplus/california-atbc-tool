import React from 'react';

import { readableNumber } from '../helpers/formatting';

const Increase = (props) => {

  const {
    benefits,
    subtype,
  } = props;

  return (
    <>
    <div className="stat-row">
      <div className="stat-card plain">
        <div className="stat-text">
          <div className="lbl">Total daily increase in users</div>
          <div className="val">{readableNumber(benefits.total.mean)}</div>
        </div>
      </div>

      { subtype !== "pedestrian-only" ?
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="#ffffff">
            <circle cx="5.5" cy="17.5" r="3.5" fill="none" stroke="#ffffff" strokeWidth="1.7"></circle>
            <circle cx="18.5" cy="17.5" r="3.5" fill="none" stroke="#ffffff" strokeWidth="1.7"></circle>
            <path d="M15 4l-1 3h-3l-2 5 4 2 2-4 3 4" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path>
            <circle cx="16" cy="3.5" r="1.2"></circle>
          </svg>
        </div>
        <div className="stat-text">
          <div className="lbl">Average daily increase in bicycle users</div>
          <div className="val">{readableNumber(benefits.bike.mean)}</div>
        </div>
      </div>
      : null }

      { subtype !== "bike-only" ?
      <div className="stat-card">
        <div className="stat-icon">
          <svg viewBox="0 0 24 24" fill="#ffffff">
            <circle cx="13" cy="4" r="2"></circle>
            <path d="M11 22l1-7-2-3v-4l3-2 3 4 2 1v 2l-2-1-2-1-1 1 2 3 1 7" fill="#ffffff"></path>
          </svg>
        </div>
        <div className="stat-text">
          <div className="lbl">Average daily increase in pedestrians</div>
          <div className="val">{readableNumber(benefits.pedestrian.mean)}</div>
        </div>
      </div>
      : null }

    </div>
    </>
  );

};

export default Increase;