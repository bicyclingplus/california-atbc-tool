import React from 'react';

class SafetyQualitative extends React.Component {

	firstRow = (element, idx) => {

		if(element.benefits.length > 1) {
			if(idx === 0) {
				return <td rowSpan={element.benefits.length}>{element.element}</td>;
			}
		}
		else {
			return <td>{element.element}</td>
		}

	}

	render = () => {

		let { benefits } = this.props;

		return (
			<>
			<h4 className="mt-4 section-sub-header">Element Specific General Benefits</h4>
			<table className="table table-striped" id="element-specific">
				<thead>
					<tr>
						<th>Infrastructure Element</th>
						<th>Benefits</th>
						<th>Sources</th>
					</tr>
				</thead>
				<tbody>
				{
					benefits.map((element) => (
						element.benefits.map((benefit, idx) => (
							<tr key={benefit.key}>
								{this.firstRow(element, idx)}
								<td>{benefit.description}</td>
								<td>{benefit.sources}</td>
							</tr>
						))
					))
				}
				</tbody>
			</table>
			</>
		);
	};
}

export default SafetyQualitative;
