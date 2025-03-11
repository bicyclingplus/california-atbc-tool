import {
  MongoClient,
  ObjectId
} from 'mongodb';
import Ajv from 'ajv';
import * as turf from "@turf/turf";

import schemas from '../schemas/schemas.js';
import calcProjectLength from '../helpers/benefits/calcProjectLength.js';
import calcDemand from '../helpers/benefits/calcDemand.js';
import calcBenefits from '../helpers/benefits/calcBenefits.js';

const getProject = async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {

    const project = await client
      .db('bctool')
      .collection('projects')
      .findOne({
        '_id': new ObjectId(req.params.projectId),
      });

    if(project) {
      return res.json(project);
    }

    return res.status(404).json({
      'message': 'Project not found',
    });
  }
  catch (e) {

    if(e.name === 'BSONError') {
      return res.status(400).json({
        'message': 'Invalid project id',
      });
    }

    throw(e);
  }
  finally {
    await client.close();
  }
};

const postProject = async (req, res) => {
  const ajv = new Ajv({schemas});
  const validate = ajv.getSchema("schemas/project.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const {
    // details
    county,
    year,
    name,
    developer,
    cost,
    timeframe,
    type,
    subtype,
    transit,
    safety,

    // reach
    selectedWayIds,
    selectedIntersectionIds,
    userWays,
    userIntersections,

    //elements
    selectedInfrastructure,
    selectedNonInfrastructure,
  } = req.body;

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    const db = client.db('bctool');

    const waysQuery = {
      'properties.edge_uid': {
        '$in': selectedWayIds,
      },
    };

    const selectedWays = await db
      .collection('ways')
      .find(waysQuery)
      .toArray();

    const intersectionsQuery = {
      'properties.node_id': {
        '$in': selectedIntersectionIds,
      },
    };

    const selectedIntersections = await db
      .collection('intersections')
      .find(intersectionsQuery)
      .toArray();

    const features = {
      type: 'FeatureCollection',
      features: [
        ...selectedWays,
        ...selectedIntersections,
        ...userWays,
        ...userIntersections,
      ]
    };
    const bbox = turf.bbox(features);
    const bounds = [
      [bbox[1], bbox[0]],
      [bbox[3], bbox[2]],
    ];

    const projectLength = calcProjectLength(selectedWays, userWays);

    const totalIntersections = (
      selectedIntersections.length +
      userIntersections.length
    );

    const hasOnlyUserMapSelections = Boolean(
      !selectedWays.length &&
      !selectedIntersections.length &&
      (userWays.length ||
      userIntersections.length)
    );

    const existingTravel = await calcDemand(
      selectedWays,
      userWays,
      selectedIntersections,
      userIntersections,
      projectLength,
    );

    const benefits = calcBenefits(
      type,
      subtype,
      county,
      year,
      timeframe,
      transit,
      projectLength,
      totalIntersections,
      existingTravel,
      selectedInfrastructure,
      selectedNonInfrastructure,
      hasOnlyUserMapSelections,
      selectedWays,
      selectedIntersections,
      safety,
    );

    const date = new Date().toISOString();

    const project = {
      details: {
        county,
        year,
        name,
        date,
        developer,
        cost,
        timeframe,
        type,
        subtype,
        transit,
        safety,
      },
      scope: {
        intersections: selectedIntersections,
        segments: selectedWays,
        userIntersections: userIntersections,
        userSegments: userWays,
        totalLength: projectLength,
        totalIntersections,
        bounds,
      },
      elements: {
        infrastructure: selectedInfrastructure,
        nonInfrastructure: selectedNonInfrastructure,
      },
      existingTravel,
      benefits,
    };

    const result = await db
      .collection('projects')
      .insertOne(project);

    return res.json({
      message: 'Project added successfully',
      id: result.insertedId,
      date,
    });

  }
  finally {
    await client.close();
  }
};

export {
  getProject,
  postProject,
};