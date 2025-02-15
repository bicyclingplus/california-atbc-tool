import React from 'react';

class ProjectQualitative extends React.Component {

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h4 className="mt-4 section-sub-header">General Benefits</h4>
            <table className="table table-striped" id="project-qualitative">
            	<thead>
            		<tr>
            			<th>Theme</th>
            			<th>Description</th>
            		</tr>
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
	};
}

export default ProjectQualitative;
