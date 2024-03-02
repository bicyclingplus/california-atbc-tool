import { MongoClient, ObjectId } from 'mongodb';
import { BSONTypeError } from 'bson';

import { writeCSV } from '../../writeCSV.js';

import calcDemand from '../../benefits/calcDemand.js';
import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcBenefits from '../../benefits/calcBenefits.js';
import util from 'util';

const peter = async (ids) => {

	console.log('Starting peter report');

	const headers = [
		// 'id',
		'Project Name',
		'BMT (Total)',
		'BMT (Capita/Total)',
		'BMT (Projected+Increase)',
		'BMT (Per Capita/ Projected+Increase)',
		'WMT (Total)',
		'WMT (Capita/Total)',
		'WMT (Projected+Increase)',
		'WMT (Per Capita/ Projected+Increase)',
		'BIKE Saftey: combined Crashes',
		'BIKE saftey: combined injuries',
		'BIKE saftey:combined deaths',
		'Walk Saftey: combined Crashes',
		'WALK saftey: combined injuries',
		'WALK saftey:combined deaths',
		'20 year VMT reductions',
		'20 year VMT reductions per capita',
		'CO2',
		'CH4',
		'N20',
		'Total CO2 Equivalent',
		'NOx',
		'PM 2.5',
		'PM 10',
		'NH3',
		'CO',
		'SOx',
		'MMET Increase',
	];

	const rows = [];

	let client;

	try {

		client = new MongoClient(process.env.MONGO_URI);
	    const db = client.db('bctool');
		const projects = db.collection('projects');

		for(const projectId of ids) {

			try {
				const project = await projects.findOne({
					'_id': new ObjectId(projectId),
				});

				if(project === null) {
					console.log(`Couldn't find project with id: ${projectId}`);
					continue;
				}

				const {
				  segments: selectedWays,
				  userSegments: userWays,
				  intersections: selectedIntersections,
				  userIntersections: userIntersections,
				} = project.scope;

				const hasOnlyUserMapSelections = Boolean(
				  !selectedIntersections.length &&
				  !selectedWays.length &&
				  (userWays.length ||
				  userIntersections.length)
				);

				const totalLength = calcProjectLength(selectedWays, userWays);

				const totalIntersections = (
					selectedIntersections.length +
					userIntersections.length
				);

				const existingTravel = await calcDemand(
				  selectedWays,
				  userWays,
				  selectedIntersections,
				  userIntersections,
				  totalLength
				);

				const {
					name,
					type,
					subtype,
					county,
					year,
					timeframe,
					transit,
					safety,
				} = project.details;

				const {
					infrastructure: selectedInfrastructure,
					nonInfrastructure: selectedNonInfrastructure,
				} = project.elements;

				const benefits = calcBenefits(
					type,
					subtype,
					county,
					year,
					timeframe,
					transit,
					totalLength,
					totalIntersections,
					existingTravel,
					selectedInfrastructure,
					selectedNonInfrastructure,
					hasOnlyUserMapSelections,
					selectedWays,
					selectedIntersections,
					safety
				);

				if(hasOnlyUserMapSelections || type === 'non-infrastructure') {
					rows.push([
						// projectId,
						name,
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
						'N/A',
					]);
				}
				else {
					rows.push([
						// projectId,
						name,
						subtype === "pedestrian-only" ? "N/A" : benefits.travel.miles.bike.total.mean,
						subtype === "pedestrian-only" ? "N/A" : benefits.travel.capita.bike.total.mean,
						subtype === "pedestrian-only" ? "N/A" : benefits.travel.miles.bike.projected.mean,
						subtype === "pedestrian-only" ? "N/A" : benefits.travel.capita.bike.projected.mean,
						subtype === "bike-only" ? "N/A" : benefits.travel.miles.pedestrian.total.mean,
						subtype === "bike-only" ? "N/A" : benefits.travel.capita.pedestrian.total.mean,
						subtype === "bike-only" ? "N/A" : benefits.travel.miles.pedestrian.projected.mean,
						subtype === "bike-only" ? "N/A" : benefits.travel.capita.pedestrian.projected.mean,
						subtype === "pedestrian-only" ? "N/A" : benefits.safetyQuantitative.safety.change.bicycling.crash.mean, // safety
						subtype === "pedestrian-only" ? "N/A" : benefits.safetyQuantitative.safety.change.bicycling.injury.mean,
						subtype === "pedestrian-only" ? "N/A" : benefits.safetyQuantitative.safety.change.bicycling.death.mean,
						subtype === "bike-only" ? "N/A" : benefits.safetyQuantitative.safety.change.walking.crash.mean,
						subtype === "bike-only" ? "N/A" : benefits.safetyQuantitative.safety.change.walking.injury.mean,
						subtype === "bike-only" ? "N/A" : benefits.safetyQuantitative.safety.change.walking.death.mean,
						benefits.vmtReductions.miles.mean, // vmt
						benefits.vmtReductions.capita.mean,
						benefits.emissions.miles.reductions.CO2.mean,
						benefits.emissions.miles.reductions.CH4.mean,
						benefits.emissions.miles.reductions.N2O.mean,
						benefits.emissions.miles.equivalent.mean, // total co2 equiv
						benefits.emissions.miles.reductions.NOx.mean,
						benefits.emissions.miles.reductions['PM2.5'].mean,
						benefits.emissions.miles.reductions.PM10.mean,
						benefits.emissions.miles.reductions.NH3.mean,
						benefits.emissions.miles.reductions.CO.mean,
						benefits.emissions.miles.reductions.SOx.mean,
						benefits.health.miles.total.mean, // MMET
					]);
				}
			}
			catch (e) {
				if(e instanceof BSONTypeError) {
					console.log(`Invalid project id: ${projectId}`);
				}
				else {
					throw e;
				}
			}
		}
	}
	finally {
		await client?.close();
	}

	writeCSV('reports', 'peter', headers, rows);
}

export default peter;
