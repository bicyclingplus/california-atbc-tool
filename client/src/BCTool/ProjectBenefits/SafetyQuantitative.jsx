import React from 'react';

import { readableNumber } from '../helpers/formatting';

class SafetyQuantitative extends React.Component {

	render = () => {

		const {
			benefits,
			timeframe,
		} = this.props;

		return (
			<>
			<h5 className="mt-4">Safety</h5>

			<table className="table table-bordered table-striped d-none" id="safety">
				<thead>
					<tr>
						<th></th>
						<th></th>
						<th></th>
						<th colSpan="3" className="text-center">Benefit</th>
						<th colSpan="3" className="text-center">Benefit / Capita</th>
						<th colSpan="3" className="text-center">Benefit / Jobs</th>
					</tr>
					<tr>
						<th className="text-center">Mode</th>
						<th className="text-center">Outcome</th>
						<th></th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
						<th className="text-center">Lower</th>
						<th className="text-center">Mean</th>
						<th className="text-center">Upper</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th rowSpan="9" className="align-middle">Bike</th>
						<th rowSpan="3" className="align-middle">Crashes</th>
						<th>Change in Crashes</th>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.crash.upper)}</td>
					</tr>
					<tr>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.crash)}</td>

						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.crash)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.crash)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.crash.upper)}</td>
					</tr>
					<tr>
						<th rowSpan="3" className="align-middle">Injuries</th>
						<th>Change in Injuries</th>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.injury.upper)}</td>
					</tr>
					<tr>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.injury)}</td>

						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.injury)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.injury)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.injury.upper)}</td>
					</tr>
					<tr>
						<th rowSpan="3" className="align-middle">Deaths</th>
						<th>Change in Deaths</th>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.death.upper)}</td>
					</tr>
					<tr>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.death)}</td>

						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.death)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.death)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.death.upper)}</td>
					</tr>
					<tr>
						<th rowSpan="9" className="align-middle">Pedestrian</th>
						<th rowSpan="3" className="align-middle">Crashes</th>
						<th>Change in Crashes</th>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.change.walking.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.change.walking.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.crash.upper)}</td>
					</tr>
					<tr>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.crash)}</td>

						<td className="text-end">{readableNumber(benefits.capita.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.crash)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.crash)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.after.walking.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.crash.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.after.walking.crash.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.crash.upper)}</td>
					</tr>
					<tr>
						<th rowSpan="3" className="align-middle">Injuries</th>
						<th>Change in Injuries</th>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.change.walking.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.change.walking.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.injury.upper)}</td>
					</tr>
					<tr>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.injury)}</td>

						<td className="text-end">{readableNumber(benefits.capita.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.injury)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.injury)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.after.walking.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.injury.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.after.walking.injury.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.injury.upper)}</td>
					</tr>
					<tr>
						<th rowSpan="3" className="align-middle">Deaths</th>
						<th>Change in Deaths</th>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.change.walking.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.change.walking.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.death.upper)}</td>
					</tr>
					<tr>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.death)}</td>

						<td className="text-end">{readableNumber(benefits.capita.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.death)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.death)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.capita.after.walking.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.death.upper)}</td>

						<td className="text-end">{readableNumber(benefits.jobs.after.walking.death.lower)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.death.upper)}</td>
					</tr>
				</tbody>
			</table>

			<table className="table table-bordered table-striped" id="safety-simple-change">
				<thead>
					<tr>
						<th className="text-center">Mode</th>
						<th className="text-center">Outcome</th>
						<th className="text-center">{timeframe} Year Benefit</th>
						<th className="text-center">{timeframe} Year Benefit / Capita</th>
						<th className="text-center">{timeframe} Year Benefit / Jobs</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th rowSpan="3" className="align-middle">Bike</th>
						<th className="align-middle">Crashes</th>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.crash.mean)}</td>
					</tr>
					<tr>
						<th className="align-middle">Injuries</th>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.injury.mean)}</td>
					</tr>
					<tr>
						<th className="align-middle">Deaths</th>
						<td className="text-end">{readableNumber(benefits.safety.change.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.bicycling.death.mean)}</td>
					</tr>
					<tr>
						<th rowSpan="3" className="align-middle">Pedestrian</th>
						<th className="align-middle">Crashes</th>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.crash.mean)}</td>
					</tr>
					<tr>
						<th className="align-middle">Injuries</th>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.injury.mean)}</td>
					</tr>
					<tr>
						<th className="align-middle">Deaths</th>
						<td className="text-end">{readableNumber(benefits.safety.change.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.change.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.change.walking.death.mean)}</td>
					</tr>
				</tbody>
			</table>

			<table className="table table-bordered table-striped d-none" id="safety-simple-rates">
				<thead>
					<tr>
						<th className="text-center">Mode</th>
						<th className="text-center">Outcome</th>
						<th className="text-center"></th>
						<th className="text-center">Benefit</th>
						<th className="text-center">Benefit / Capita</th>
						<th className="text-center">Benefit / Jobs</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th rowSpan="6" className="align-middle">Bike</th>
						<th rowSpan="2" className="align-middle">Crashes</th>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.crash)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.crash)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.crash.mean)}</td>
					</tr>
					<tr>
						<th rowSpan="2" className="align-middle">Injuries</th>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.injury)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.injury)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.injury.mean)}</td>
					</tr>
					<tr>
						<th rowSpan="2" className="align-middle">Deaths</th>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.bicycling.death)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.bicycling.death)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.bicycling.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.bicycling.death.mean)}</td>
					</tr>
					<tr>
						<th rowSpan="6" className="align-middle">Pedestrian</th>
						<th rowSpan="2" className="align-middle">Crashes</th>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.crash)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.crash)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.crash.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.crash.mean)}</td>
					</tr>
					<tr>
						<th rowSpan="2" className="align-middle">Injuries</th>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.injury)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.injury)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.injury.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.injury.mean)}</td>
					</tr>
					<tr>
						<th rowSpan="2" className="align-middle">Deaths</th>
						<th>Current Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.capita.before.walking.death)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.before.walking.death)}</td>
					</tr>
					<tr>
						<th>Estimated After-project Rate per 1000 volume</th>
						<td className="text-end">{readableNumber(benefits.safety.after.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.capita.after.walking.death.mean)}</td>
						<td className="text-end">{readableNumber(benefits.jobs.after.walking.death.mean)}</td>
					</tr>
				</tbody>
			</table>
			</>
		);
	};
}

export default SafetyQuantitative;
