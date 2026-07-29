import React from 'react';

import Summary from './Summary';
import Monetary from './Monetary';
import Travel from './Travel';
import Quantitative from './Quantitative';
import ProjectQualitative from './ProjectQualitative';
import SafetyQualitative from './SafetyQualitative';

import './ProjectBenefits.css';

const ProjectBenefits = (props) => {

  const {
    benefits,
    name,
    cost,
    type,
    timeframe,
    subtype,
    hasOnlyUserMapSelections,
  } = props;

  return (
    <div className="project-benefits">
      <div className="section-bar first">Project Benefits</div>

      <Summary
        name={name}
        cost={cost}
        type={type}
        subtype={subtype}
        timeframe={timeframe}
      />

      { benefits.monetary ?
      <Monetary
        benefits={benefits.monetary}
        timeframe={timeframe}
        cost={cost}
      />
      : null }

      { benefits.travel && !hasOnlyUserMapSelections ?
      <Travel benefits={benefits.travel} subtype={subtype} />
      : null }

      { (benefits.safetyQuantitative || benefits.emissions || benefits.health) && !hasOnlyUserMapSelections ?
      <Quantitative
        timeframe={timeframe}
        benefits={benefits}
        hasOnlyUserMapSelections={hasOnlyUserMapSelections}
        subtype={subtype}
      />
      : null }

      { benefits.projectQualitative ?
      <ProjectQualitative benefits={benefits.projectQualitative} />
      : null }

      { benefits.safetyQualitative ?
      <SafetyQualitative benefits={benefits.safetyQualitative} />
      : null }
    </div>
  );
}

export default ProjectBenefits;
