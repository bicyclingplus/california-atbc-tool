import React, {useRef, useEffect} from 'react';
import Tooltip from 'bootstrap/js/dist/tooltip';

import { readableNumber } from '../helpers/formatting';

import 'bootstrap-icons/font/bootstrap-icons.css';
import './Travel.css';

const Travel = (props) => {

  const {
    benefits,
    subtype,
  } = props;

  const tooltipRef = useRef(null);

  useEffect(() => {
    let tooltip = null;
    if(!tooltipRef.current) return;
    tooltip = new Tooltip(tooltipRef.current);

    return () => {
      if(!tooltip) return;
      tooltip.dispose();
    };
  }, [])

  return (
    <>

    <div className="section-bar">
      Section 2: <strong>Project-level Active Travel</strong>

      <i id={`project-travel-tooltip`}
        className="bi bi-info-circle ms-2"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-html="true"
        title='This tool provides estimates of existing active travel from regression models of permanent and temporary count data based on accessibility metrics, infrastructure, demographics, and crowd sourced data. For details about the models see the Technical Guide.'
        ref={tooltipRef}
      ></i>
    </div>

    { subtype !== "pedestrian-only" ?
    <div className="travel-block">
      <div>
        <div className="travel-head">
          <div className="travel-icon-box biking">
            <svg viewBox="0 0 24 24" fill="#ffffff">
              <circle cx="5.5" cy="17.5" r="3.5" fill="none" stroke="#ffffff" strokeWidth="1.7"></circle>
              <circle cx="18.5" cy="17.5" r="3.5" fill="none" stroke="#ffffff" strokeWidth="1.7"></circle>
              <path d="M15 4l-1 3h-3l-2 5 4 2 2-4 3 4" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path>
              <circle cx="16" cy="3.5" r="1.2"></circle>
            </svg>
          </div>
          <div>
            <div className="travel-title">Biking Miles Traveled</div>
            <div className="travel-sub">Estimated Average Daily Bike Miles Traveled (BMT)</div>
          </div>
          <div className="pct-badge">↑ {readableNumber(benefits.percent_increase.bike.mean)}% Daily BMT</div>
        </div>

        <div className="exist-row">
          <div className="exist-card"><strong>Existing:</strong> {readableNumber(benefits.miles.bike.existing.mean)} Daily BMT</div>
          <div className="exist-card"><strong>Existing + Increase:</strong> {readableNumber(benefits.miles.bike.projected.mean)} Daily BMT</div>
        </div>

        <table className="bmt-tbl">
          <thead>
            <tr>
              <th></th>
              <th>Daily BMT</th>
              <th>Daily BMT per person</th>
            </tr>
          </thead>
          <tbody>
            <tr className="increase-row bike">
              <td>Increase in Biking</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Car Shift</td>
              <td>{readableNumber(benefits.miles.bike.carShift.mean)}</td>
              <td>{benefits.capita.bike.carShift.mean.toFixed(3)}</td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Route Shift</td>
              <td>{readableNumber(benefits.miles.bike.routeShift.mean)}</td>
              <td>{benefits.capita.bike.routeShift.mean.toFixed(3)}</td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Induced Travel</td>
              <td>{readableNumber(benefits.miles.bike.inducedTravel.mean)}</td>
              <td>{benefits.capita.bike.inducedTravel.mean.toFixed(3)}</td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Shift from Other Modes</td>
              <td>{readableNumber(benefits.miles.bike.otherShift.mean)}</td>
              <td>{benefits.capita.bike.otherShift.mean.toFixed(3)}</td>
            </tr>
            <tr className="total-row">
              <td>Total</td>
              <td>{readableNumber(benefits.miles.bike.total.mean)}</td>
              <td>{benefits.capita.bike.total.mean.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div className="chart-legend">
          <span className="legend-item"><span className="legend-dot" style={{background: "#cfd6df"}}></span>Existing</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#1b4d2b"}}></span>Car Shift</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#2d7a47"}}></span>Route Shift</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#52a86d"}}></span>Induced Travel</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#52a86d"}}></span>Shift from Other Modes</span>
        </div>
        <div className="chart-area">
          <div className="chart-yaxis">
            <span>0</span>
            <span>200</span>
            <span>400</span>
            <span>600</span>
            <span>800</span>
          </div>
          <div className="chart-body">
            <div className="bar-wrap">
              <div className="stack-seg top" style={{height: "36.6%", background: "#cfd6df"}}>{readableNumber(benefits.miles.bike.existing.mean)}</div>
              <div className="bar-label">Existing</div>
            </div>
            <div className="bar-wrap">
              <div className="stack-seg top white-text" style={{height: "5.7%", background: "#85d49f"}}>{readableNumber(benefits.miles.bike.otherShift.mean)}</div>
              <div className="stack-seg white-text" style={{height: "5.7%", background: "#52a86d"}}>{readableNumber(benefits.miles.bike.inducedTravel.mean)}</div>
              <div className="stack-seg white-text" style={{height: "28.7%", background: "#2d7a47"}}>{readableNumber(benefits.miles.bike.routeShift.mean)}</div>
              <div className="stack-seg white-text" style={{height: "8.7%", background: "#1b4d2b"}}>{readableNumber(benefits.miles.bike.carShift.mean)}</div>
              <div className="stack-seg" style={{height: "36.6%", background: "#cfd6df"}}>{readableNumber(benefits.miles.bike.existing.mean)}</div>
              <div className="bar-label">Existing + Increase</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    : null }

    { subtype !== "bike-only" ?
    <div className="travel-block">
      <div>
        <div className="travel-head">
          <div className="travel-icon-box walking">
            <svg viewBox="0 0 24 24" fill="#ffffff">
              <circle cx="13" cy="4" r="2"></circle>
              <path d="M9.5 22l1.5-7 -2 -3 v -4 l 3 -2 3 4 3 1 v 2 l -3 -1 -1.5 -1 -1 1 2 3 1 7" stroke="#ffffff" strokeWidth="0.8" fill="#ffffff"></path>
            </svg>
          </div>
          <div>
            <div className="travel-title">Walking Miles Traveled</div>
            <div className="travel-sub">Estimated Average Daily Walk Miles Traveled (WMT)</div>
          </div>
          <div className="pct-badge walk">↑ {readableNumber(benefits.percent_increase.pedestrian.mean)}% Daily WMT</div>
        </div>

        <div className="exist-row">
          <div className="exist-card"><strong>Existing:</strong> {readableNumber(benefits.miles.pedestrian.existing.mean)} Daily WMT</div>
          <div className="exist-card"><strong>Existing + Increase:</strong> {readableNumber(benefits.miles.pedestrian.projected.mean)} Daily WMT</div>
        </div>

        <table className="bmt-tbl">
          <thead>
            <tr>
              <th></th>
              <th>Daily WMT</th>
              <th>Daily WMT per person</th>
            </tr>
          </thead>
          <tbody>
            <tr className="increase-row walk"><td>Increase in Walking</td><td></td><td></td></tr>
            <tr>
              <td>&nbsp;&nbsp;Car Shift</td>
              <td>{readableNumber(benefits.miles.pedestrian.carShift.mean)}</td>
              <td>{benefits.capita.pedestrian.carShift.mean.toFixed(3)}</td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Route Shift</td>
              <td>{readableNumber(benefits.miles.pedestrian.routeShift.mean)}</td>
              <td>{benefits.capita.pedestrian.routeShift.mean.toFixed(3)}</td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Induced Travel</td>
              <td>{readableNumber(benefits.miles.pedestrian.inducedTravel.mean)}</td>
              <td>{benefits.capita.pedestrian.inducedTravel.mean.toFixed(3)}</td>
            </tr>
            <tr>
              <td>&nbsp;&nbsp;Shift from Other Modes</td>
              <td>{readableNumber(benefits.miles.pedestrian.otherShift.mean)}</td>
              <td>{benefits.capita.pedestrian.otherShift.mean.toFixed(3)}</td>
            </tr>
            <tr className="total-row">
              <td></td>
              <td>{readableNumber(benefits.miles.pedestrian.total.mean)}</td>
              <td>{benefits.capita.pedestrian.total.mean.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div className="chart-legend">
          <span className="legend-item"><span className="legend-dot" style={{background: "#cfd6df"}}></span>Existing</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#3b1762"}}></span>Car Shift</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#6a319a"}}></span>Route Shift</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#a460d4"}}></span>Induced Travel</span>
          <span className="legend-item"><span className="legend-dot" style={{background: "#d196f3"}}></span>Shift from Other Modes</span>
        </div>
        <div className="chart-area">
          <div className="chart-yaxis">
            <span>0</span>
            <span>1000</span>
            <span>2000</span>
            <span>3000</span>
            <span>4000</span>
          </div>
          <div className="chart-body">
            <div className="bar-wrap">
              <div className="stack-seg top" style={{height: "91.7%", background: "#cfd6df"}}>{readableNumber(benefits.miles.pedestrian.existing.mean)}</div>
              <div className="bar-label">Existing</div>
            </div>
            <div className="bar-wrap">
              <div className="stack-seg top" style={{height: "3.2%", background: "#d196f3"}}></div>
              <div className="stack-seg" style={{height: "0.7%", background: "#a460d4"}}></div>
              <div className="stack-seg" style={{height: "0.5%", background: "#6a319a"}}></div>
              <div className="stack-seg" style={{height: "2.2%", background: "#3b1762"}}></div>
              <div className="stack-seg" style={{height: "91.7%", background: "#cfd6df"}}>{readableNumber(benefits.miles.pedestrian.existing.mean)}</div>
              <div className="bar-label">Existing + Increase</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    : null }

    </>
  );
};

export default Travel;
