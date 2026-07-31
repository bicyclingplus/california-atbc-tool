import React, {useRef, useEffect} from 'react';

import Increase from './Increase';
import SafetyQuantitative from './SafetyQuantitative';
import Emissions from './Emissions';
import Health from './Health';

import "./Quantitative.css";

const Quantitative = (props) => {
  const {
    timeframe,
    benefits,
    hasOnlyUserMapSelections,
    subtype,
  } = props;

  return (
    <>
    <div className="section-bar">
      Section 3: <strong>Project-Level Quantitative Benefits</strong>
    </div>

    <Increase
      benefits={benefits.population}
      subtype={subtype}
    />

    { benefits.health && !hasOnlyUserMapSelections ?
    <Health
      benefits={benefits.health}
      subtype={subtype}
    />
    : null }

    { benefits.safetyQuantitative && !hasOnlyUserMapSelections ?
    <SafetyQuantitative
      benefits={benefits.safetyQuantitative}
      subtype={subtype}
    />
    : null }

    { benefits.emissions && !hasOnlyUserMapSelections ?
    <Emissions
      emissions={benefits.emissions}
      vmt={benefits.vmt}
    />
    : null }

    </>
  );
};

export default Quantitative;
