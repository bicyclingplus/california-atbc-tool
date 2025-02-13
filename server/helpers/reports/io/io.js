import { MongoClient, ObjectId } from 'mongodb';
import { BSONError } from 'bson';

import calcDemand from '../../benefits/calcDemand.js';
import calcProjectLength from '../../benefits/calcProjectLength.js';
import calcBenefits from '../../benefits/calcBenefits.js';
// import util from 'util';

import IO_Project from './project.js';
import IO_Safety from './safety.js';

import IO_Segments from './segments.js';
import IO_Intersections from './intersections.js';
import IO_User_Segments from './user_segments.js';
import IO_User_Intersections from './user_intersections.js';

import IO_Infrastructure from './infrastructure.js';
import IO_Non_Infrastructure from './non_infrastructure.js';

import IO_Emissions from './emissions.js';
import IO_VMT from './vmt.js';
import IO_Physical from './physical.js';
import IO_General from './general.js';
import IO_Qualitative from './qualitative.js';

const io = async (ids) => {

  console.log('Starting I/O report');

  let client;

  try {

    client = new MongoClient(process.env.MONGO_URI);
    const db = client.db('bctool');
    const projects = db.collection('projects');
    const ways = db.collection('ways');
    const intersections = db.collection('intersections');

    for(const projectId of ids) {

      console.log(`starting project ${projectId}`);

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

        // const freshSegments = [];

        // for(let way of selectedWays) {
        //   const fresh = await ways.findOne({
        //     '_id': new ObjectId(way._id),
        //   });
        //   freshSegments.push(fresh);
        // }

        // const freshIntersections = [];

        // for(let intersection of selectedIntersections) {
        //   const fresh = await intersections.findOne({
        //     '_id': new ObjectId(intersection._id),
        //   });
        //   freshIntersections.push(fresh);
        // }

        const freshSegments = selectedWays;
        const freshIntersections = selectedIntersections;

        const hasOnlyUserMapSelections = Boolean(
          !freshIntersections.length &&
          !freshSegments.length &&
          (userWays.length ||
          userIntersections.length)
        );

        const totalLength = calcProjectLength(freshSegments, userWays);

        const totalIntersections = (
          freshIntersections.length +
          userIntersections.length
        );

        const existingTravel = await calcDemand(
          freshSegments,
          userWays,
          freshIntersections,
          userIntersections,
          totalLength
        );

        const {
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

        // console.log(benefits)
        // process.exit();

        // INPUTS
        IO_Project(
          projectId,
          project.details,
          totalLength,
          totalIntersections,
        );

        IO_Safety(
          projectId,
          project.details.safety,
        );

        IO_Segments(
          projectId,
          freshSegments,
        );

        IO_Intersections(
          projectId,
          freshIntersections,
        );

        IO_User_Segments(
          projectId,
          userWays,
        );

        IO_User_Intersections(
          projectId,
          userIntersections.length
        );

        IO_Infrastructure(
          projectId,
          selectedInfrastructure,
        );

        IO_Non_Infrastructure(
          projectId,
          selectedNonInfrastructure,
        );

        // OUTPUTS
        if(!hasOnlyUserMapSelections) {
          // travel
          // quantitative
          IO_VMT(
            projectId,
            benefits.vmtReductions,
          );
          IO_Emissions(
            projectId,
            benefits.emissions,
          );
          IO_Physical(
            projectId,
            benefits.health,
          );
        }
        IO_General(
          projectId,
          benefits.projectQualitative,
        );
        IO_Qualitative(
          projectId,
          benefits.safetyQualitative,
        );

      }
      catch (e) {
        if(BSONError.isBSONError(e)) {
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
}

export default io;
