import React from 'react';

import { readableNumber } from '../helpers/formatting';

const SafetyQuantitative = (props) => {

  const {
    benefits,
    subtype,
  } = props;

  return (
    <>

    <div className="colored-header orange">
      <svg viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"></path>
      </svg>
      Safety Benefits
    </div>

    <div className="safety-row">

      { subtype !== "pedestrian-only" ?
      <div className="crash-block">
        <div className="crash-title">Crash Rate: TODO</div>
        <div className="crash-block-wrap">
          <div className="crash-icon-side">
            <svg viewBox="0 0 24 24" fill="#f59f3a">
              <circle cx="5.5" cy="17.5" r="3.5" fill="none" stroke="#f59f3a" strokeWidth="1.7"></circle>
              <circle cx="18.5" cy="17.5" r="3.5" fill="none" stroke="#f59f3a" strokeWidth="1.7"></circle>
              <path d="M15 4l-1 3h-3l-2 5 4 2 2-4 3 4" fill="none" stroke="#f59f3a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <circle cx="16" cy="3.5" r="1.2"></circle>
            </svg>
          </div>
          <div style={{flex: 1}}>
            <table className="crash-tbl">
              <thead>
                <tr>
                  <th></th>
                  <th>Annual benefit</th>
                  <th>Annual benefit per person</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crashes</td>
                  <td className="bold">{readableNumber(benefits.raw.change.bicycling.crash.mean)}</td>
                  <td className="bold">TODO</td>
                </tr>
                <tr>
                  <td>Injuries</td>
                  <td>{readableNumber(benefits.raw.change.bicycling.injury.mean)}</td>
                  <td>TODO</td>
                </tr>
                <tr>
                  <td>Deaths</td>
                  <td>{readableNumber(benefits.raw.change.bicycling.death.mean)}</td>
                  <td>TODO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      : null }

      { subtype !== "bike-only" ?
      <div className="crash-block">
        <div className="crash-title">Crash Rate: TODO</div>
        <div className="crash-block-wrap">
          <div className="crash-icon-side">
            <svg viewBox="0 0 24 24" fill="#f59f3a">
              <circle cx="13" cy="4" r="2"></circle>
              <path d="M11 22l1-7-2-3v-4l3-2 3 4 2 1v 2l-2-1-2-1-1 1 2 3 1 7" fill="#f59f3a"></path>
            </svg>
          </div>
          <div style={{flex: 1}}>
            <table className="crash-tbl">
              <thead>
                <tr>
                  <th></th>
                  <th>Annual benefit</th>
                  <th>Annual benefit per person</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crashes</td>
                  <td className="bold">{readableNumber(benefits.raw.change.walking.crash.mean)}</td>
                  <td className="bold">TODO</td>
                </tr>
                <tr>
                  <td>Injuries</td>
                  <td>{readableNumber(benefits.raw.change.walking.injury.mean)}</td>
                  <td>TODO</td>
                </tr>
                <tr>
                  <td>Deaths</td>
                  <td>{readableNumber(benefits.raw.change.walking.death.mean)}</td>
                  <td>TODO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      : null }

    </div>
    </>
  );
}

export default SafetyQuantitative;
