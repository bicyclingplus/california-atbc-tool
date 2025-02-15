import React from 'react';
import { Link } from "react-router-dom";
import img from '../assets/pseudo_longexp_roundabout.png';
import './About.css';

function About(props) {


	return(
		<>
		<div className="container">
			<div className="row mt-3">
				<h1>About</h1>
			</div>
			<div className="row mt-3">
				<div className="col-sm-12">
					<img src={img} className="rounded float-end about-img m-3" alt="Overhead view of bicycle roundabout on the UCDavis campus" />
					<p>This tool has been developed by the UC Davis <a href="https://bicyclingplus.ucdavis.edu/" target="_blank" rel="noreferrer">Bicycling<span className="fst-italic">Plus</span> Research Collaborative</a> to estimate expected benefits of proposed active transportation projects. It can help government agencies, practitioners, and community members understand project-specific cost effectiveness and explore options for improving project design.</p>
					<p>The tool was designed in partnership with the Caltrans Active Transportation Resource Center (<a href="https://caatpresources.org/" target="_blank" rel="noreferrer">ATRC</a>) and guided by a technical advisory committee made up of members of local, regional, and state government agencies, community groups, and academics.</p>
					<p>The tool development began with outreach and collaboration in 2020 through surveys and focus groups with members of the <a href="https://catc.ca.gov/programs/active-transportation-program" target="_blank" rel="noreferrer">California ATP</a> Technical Advisory Committee and other state agencies and communities. From 2020 through 2021, UC Davis held numerous workshops with the technical advisory committee for the project to design the scope and structure of the tool. Following outreach, UC Davis conducted a <Link to="/litreview">literature review</Link>. to further guide the tool development. The workshops and literature review led to a tool framework designed to:</p>
					<ul className="ms-5">
						<li>Enable calculation of the estimated benefits from proposed active transportation projects (infrastructure and programs).</li>
						<li>Provide uniform calculation methods to be applied statewide that are accessible for all active transportation project implementors and funders.</li>
						<li>Provide estimates that are context sensitive.</li>
						<li>Communicate all the benefits that active transportation projects produce given the available evidence. Where evidence is uncertain or missing, qualitative evidence should be provided.</li>
						<li>Allow users to learn about how to design more benefit-producing and cost-effective projects by using the tool in the design phase of a project.</li>
					</ul>
					<p>The tool is a project-level benefit calculator, not a traditional benefit-cost tool. Costs are provided by the user, and intervention benefit quantities are calculated when quantitative evidence is available. Where evidence on the impacts of interventions is suggestive of benefits but quantitative evidence is lacking, the tool reports qualitative outcomes. The current version of the tool calculates benefits in units specific to benefit categories (e.g., emissions, physical activity); it does not monetize benefits. Future versions of the tool could incorporate economic value assumptions and calculate traditional cost to benefit ratios.</p>
					<p>This tool (version 0.1.0) is a first attempt at quantifying the benefits of active transportation projects. It has several limitations, which are described throughout the <Link to="/technicaldocs">technical documentation</Link>. Each of these limitations offer opportunities for continued improvement of the tool.</p>
					<p>The source code for this tool can be found at <a href="https://github.com/bicyclingplus/caltrans-bc-tool/" target="_blank" rel="noreferrer">https://github.com/bicyclingplus/caltrans-bc-tool/</a></p>
				</div>
			</div>
		</div>
		</>
	);
}

export default About;
