import React from 'react';

const ProjectQualitative = (props) => {

  const { benefits } = props;

  return (
    <>
    <div className="section-bar">Section 4: <strong>General Benefits</strong></div>
    <table className="general-tbl">
      <thead>
        <tr><th>Theme</th><th>Description</th></tr>
      </thead>
      <tbody>
        {
          benefits.map((benefit, idx) => (
            <tr key={idx}>
              <td>{benefit.name}</td>
              <td>{benefit.description}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
    </>
  );
}

export default ProjectQualitative;
