import writeCSV from '../writeCSV.js';

const inputs = (project) => {

	const projectId = project._id.toString();

	const elements_infrastructure_rows = [];

	for(let el in project.elements.infrastructure) {
		elements_infrastructure_rows.push([
			el,
			project.elements.infrastructure[el].new,
			project.elements.infrastructure[el].upgrade,
			project.elements.infrastructure[el].retrofit,
		])
	}

	writeCSV(projectId, 'inputs_elements_infrastructure', [
		'element',
			'new (length or count)',
			'upgrade (length or count)',
			'retrofit (length or count)',
	], elements_infrastructure_rows);

}

export default inputs;
