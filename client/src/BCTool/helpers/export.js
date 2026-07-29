import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { readableNumber } from '../helpers/formatting';
import {
  PROJECT_TYPES,
  PROJECT_SUBTYPES,
  TRANSIT_TYPES,
} from '../helpers/constants';

const ExportPDF = (state, project_id, date) => {

	let {
		name,
		developer,
		cost,
		timeframe,
		type,
		subtype,
		transit,
		totalIntersections,
		totalLength,
	} = state;

	const doc = new jsPDF();

	let name_text = name || 'Not Provided';
	let developer_text = developer || 'Not Provided';
	let cost_text = cost > 0 ? `$${readableNumber(cost)}` : 'Not Provided';
	let timeframe_years = timeframe > 1 ? 'years' : 'year';

	// project info
	doc.text([
		'Project Details',
		'',
		`Project ID: ${project_id}`,
		`Project Created: ${date}`,
		`Project Name: ${name_text}`,
		`Project Developer: ${developer_text}`,
		`Project Cost: ${cost_text}`,
		`Project Time Frame: ${timeframe} ${timeframe_years}`,
		`Project Type: ${PROJECT_TYPES[type]}`,
		`Active Travel Type: ${PROJECT_SUBTYPES[subtype]}`,
		`Transit Type: ${TRANSIT_TYPES[transit]}`,
		'',
		'',
		'Project Reach:',
		'',
		`Number of Intersections: ${totalIntersections}`,
		`Length: ${readableNumber(totalLength)} ft (${readableNumber(totalLength/5280, 2)} mi)`,
	], 10, 10);

	/*

	// travel benefits
	doc.addPage();
	doc.text([
		'Project-Level Active Travel',
		'Estimated Average Daily Bike Miles Traveled (BMT)'
	], 10, 10);
	doc.autoTable({ html: '#travel-bike-simple', startY: 30});

	doc.text(['Estimated Average Daily Walk Miles Traveled (WMT)'], 10, doc.autoTable.previous.finalY+20);
	doc.autoTable({ html: '#travel-pedestrian-simple', startY: doc.autoTable.previous.finalY+30});

	// quantitative benefits
	doc.addPage();
	doc.text([
		'Project-Level Quantitative Benefits',
		'Safety'
	], 10, 10);
	doc.autoTable({ html: '#safety-simple-change', startY: 30});

	doc.addPage();
	doc.autoTable({ html: '#safety-simple-rates'});

	doc.addPage();
	doc.text(['VMT and Emissions'], 10, 10);
	doc.autoTable({ html: '#vmt-simple', startY: 20});
	doc.autoTable({ html: '#emissions-simple'});

	doc.addPage();
	doc.text(['Physical Activity'], 10, 10);
	doc.autoTable({ html: '#health-simple', startY: 20});

	// project qualitative benefits
	doc.addPage();
	doc.text(['General Benefits'], 10, 10);
	doc.autoTable({ html: '#project-qualitative', startY: 20});

	// element qualitative benefits
	doc.addPage();
	doc.text(['Element Specific General Benefits'], 10, 10);
	doc.autoTable({ html: '#element-specific', startY: 20});

	doc.addPage();
	doc.text([
		'Project Level Benefit Uncertainty',
		'Project-Level Active Travel',
		'Estimated Average Daily Bike Miles Traveled (BMT)',
	], 10, 10);
	doc.autoTable({ html: '#travel-bike', startY: 30});

	doc.text(['Estimated Average Daily Walk Miles Traveled (WMT)'], 10, doc.autoTable.previous.finalY+20);
	doc.autoTable({ html: '#travel-pedestrian', startY: doc.autoTable.previous.finalY+30});

	// quantitative benefits
	doc.addPage();
	doc.text([
		'Project-Level Quantitative Benefits',
		'Safety'
	], 10, 10);
	doc.autoTable({ html: '#safety', startY: 30});

	doc.addPage();
	doc.text(['VMT and Emissions'], 10, 10);
	doc.autoTable({ html: '#vmt', startY: 20});
	doc.autoTable({ html: '#emissions'});

	doc.addPage();
	doc.text(['Physical Activity'], 10, 10);
	doc.autoTable({ html: '#health', startY: 20});

	*/

	doc.save("caltrans-bc-tool-export.pdf");
};

export default ExportPDF;