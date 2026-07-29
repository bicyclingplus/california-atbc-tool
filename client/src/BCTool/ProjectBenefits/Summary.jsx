import {
  PROJECT_TYPES,
  PROJECT_SUBTYPES,
  TIMEFRAMES,
} from '../helpers/constants';

import { moneyFmt } from '../helpers/formatting';

import './SafetyQuantitative.css';

const Summary = (props) => {
  const {
    name,
    cost,
    type,
    subtype,
    timeframe,
  } = props;

  return (
    <>
    <div className="meta-row">
      <div className="meta-card bl-navy">
        <div className="label">Project</div>
        <div className="value">{name}</div>
      </div>
      <div className="meta-card bl-green">
        <div className="label">Project cost</div>
        <div className="value">{moneyFmt(cost)}</div>
      </div>
      <div className="meta-card">
        <div className="label">Type</div>
        <div className="value">{PROJECT_TYPES[type]}</div>
      </div>
      <div className="meta-card">
        <div className="label">Active travel</div>
        <div className="value">{PROJECT_SUBTYPES[subtype]}</div>
      </div>
      <div className="meta-card">
        <div className="label">Estimates timeframe</div>
        <div className="value">{TIMEFRAMES[timeframe]}</div>
      </div>
    </div>
    </>
  );
};

export default Summary;
