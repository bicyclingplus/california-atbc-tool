import {
  MongoClient,
  ObjectId
} from 'mongodb';
import Ajv from 'ajv';

import schemas from '../schemas/schemas.js';

const getProject = async (req, res) => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    const database = client.db('bctool');
    const collection = database.collection('projects');

    const project = await collection.findOne({
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
  const ajv = new Ajv({
    schemas: schemas,
  });
  const validate = ajv.getSchema("schemas/project.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const project = req.body;

  // remove everything sent from client that the server
  // should calculate

  // details.date
  // scope.totalLength
  // scope.totalIntersections
  // existingTravel
  // benefits

  // calculate all those things, add to project

  // then save

  // const project = {
  //   details: {
  //     name: this.state.name,
  //     date: date,
  //     developer: this.state.developer,
  //     county: this.state.county,
  //     cost: this.state.cost,
  //     timeframe: this.state.timeframe,
  //     type: this.state.type,
  //     subtype: this.state.subtype,
  //     year: this.state.year,
  //     transit: this.state.transit,
  //     safety: this.state.safety,
  //   },
  //   scope: {
  //     intersections: this.state.selectedIntersections,
  //     segments: this.state.selectedWays,
  //     userIntersections: this.state.userIntersections,
  //     userSegments: this.state.userWays,
  //     totalLength: this.state.totalLength,
  //     totalIntersections: this.state.totalIntersections,
  //     bounds: this.state.projectBounds,
  //   },
  //   elements: {
  //     infrastructure: this.state.selectedInfrastructure,
  //     nonInfrastructure: this.state.selectedNonInfrastructure,
  //   },
  //   existingTravel: this.state.existingTravel,
  //   benefits: this.state.benefits,
  // };

  // const project = {
  //   details: {
  //     name: this.state.name,
  //     developer: this.state.developer,
  //     county: this.state.county,
  //     cost: this.state.cost,
  //     timeframe: this.state.timeframe,
  //     type: this.state.type,
  //     subtype: this.state.subtype,
  //     year: this.state.year,
  //     transit: this.state.transit,
  //     safety: this.state.safety,
  //   },
  //   scope: {
  //     intersections: this.state.selectedIntersections,
  //     segments: this.state.selectedWays,
  //     userIntersections: this.state.userIntersections,
  //     userSegments: this.state.userWays,
  //     bounds: this.state.projectBounds,
  //   },
  //   elements: {
  //     infrastructure: this.state.selectedInfrastructure,
  //     nonInfrastructure: this.state.selectedNonInfrastructure,
  //   },
  // };


  const client = new MongoClient(process.env.MONGO_URI);

  try {

    const database = client.db('bctool');
    const collection = database.collection('projects');

    const project = await collection.insertOne(req.body);

    return res.json({
      'message': 'Project added successfully',
      'id': project.insertedId,
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