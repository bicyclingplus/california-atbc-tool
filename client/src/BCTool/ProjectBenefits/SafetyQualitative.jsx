import React from 'react';

const firstRow = (element, idx) => {
  if(element.benefits.length > 1) {
    if(idx === 0) {
      return <td className="first" rowSpan={element.benefits.length}>{element.element}</td>;
    }
  }
  else {
    return <td className="first">{element.element}</td>
  }
}

const SafetyQualitative = (props) => {

  const { benefits } = props;

  return (
    <>
    <div className="section-bar">Section 5: <strong>Element Specific General Benefits</strong></div>

    <table className="general-tbl">
      <thead>
        <tr>
          <th>Infrastructure Element</th>
          <th>Description</th>
          <th>Sources</th>
        </tr>
      </thead>
      <tbody>
      {
        benefits.map((element) => (
          element.benefits.map((benefit, idx) => (
            <tr key={benefit.key}>
              {firstRow(element, idx)}
              <td>{benefit.description}</td>
              <td className="source-cell">{benefit.sources}</td>
            </tr>
          ))
        ))
      }
      </tbody>
    </table>
    </>
  );
}

export default SafetyQualitative;
