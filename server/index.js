import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { createRequire } from "module";
import Ajv from "ajv";

import calcDemand from './helpers/benefits/calcDemand.js';
import calcProjectLength from './helpers/benefits/calcProjectLength.js';
import calcBenefits from './helpers/benefits/calcBenefits.js';

import schemas from './schemas/schemas.js';

const require = createRequire(import.meta.url);

const infrastructure = require('./data/infrastructure.json');
const nonInfrastructure = require('./data/non_infrastructure.json');
const counties = require('./data/counties.json');

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const app = express();
const tool = express();
const ajv = new Ajv({
  schemas: schemas,
});

dotenv.config();

app.set('trust proxy', process.env.PROXY === "1");

app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.json({
  limit: '10mb',
}));

tool.use(express.static(path.resolve(__dirname, '../client/dist')));

// Handle GET requests to /api route


// this endpoint takes in the corners of a latlng bounding box
// the corners of the bounding box are then transformed into a geojson polygon
// and used to query for ways/intersections that intersect the polygon
// we need all four url paramters and the two latlngs must be different
//
// y1, x1 is the latlng for the south west corner of the bounding box
// y2, x2 is the latlng for north east corner of the bounding box
//
// y1 = South latitude
// x1 = West longitude
//
// y2 = North latitude
// x2 = East longitude
//
// The polygon is then defined with 5 points A, B, C, D, A
// A (x1, y1) South West corner
// B (x1, y2) North West corner
// C (x2, y2) North East corner
// D (y2, y1) South East corner
// A (x1, y1) Back to the SW corner to close the polygon
tool.get("/api/features", async (req, res) => {
  if(!req.query.x1 || !req.query.x2 || !req.query.y1 || !req.query.y2) {
    return res.status(400).send({ "error": "All four bounding box coordinates (x1, y1, x2, and y2) are required."});
  }

  let x1 = parseFloat(req.query.x1);
  let x2 = parseFloat(req.query.x2);
  let y1 = parseFloat(req.query.y1);
  let y2 = parseFloat(req.query.y2);

  if(isNaN(x1) || x1 > 180 || x1 < -180) {
    return res.status(400).send({ "error": "Parameter x1 is invalid longitude"});
  }

  if(isNaN(x2) || x2 > 180 || x2 < -180) {
    return res.status(400).send({ "error": "Parameter x2 is invalid longitude"});
  }

  if(isNaN(y1) || y1 > 90 || y1 < -90) {
    return res.status(400).send({ "error": "Parameter y1 is invalid latitude"});
  }

  if(isNaN(y2) || y2 > 90 || y2 < -90) {
    return res.status(400).send({ "error": "Parameter y2 is invalid latitude"});
  }

  if(x1 === x2 && y1 === y2) {
    return res.status(400).send({ "error": "SW and NE Bounding box corners must be different."});
  }

  let query = {
    "geometry": {
      "$geoIntersects": {
        "$geometry": {
          "type": "Polygon",
          "coordinates": [[
            [x1, y1],
            [x1, y2],
            [x2, y2],
            [x2, y1],
            [x1, y1],
          ]]
        },
      },
    }
  };

  const client = new MongoClient(process.env.MONGO_URI);

  try {

    // Connect the client to the server
    // await client.connect();

    const database = client.db('bctool');

    let collection = database.collection('ways');
    const ways = await collection.find(query).toArray();

    let node_ids = [];
    for(let way of ways) {
      if(!node_ids.includes(way.properties.source)) {
        node_ids.push(way.properties.source);
      }
      if(!node_ids.includes(way.properties.target)) {
        node_ids.push(way.properties.target);
      }
    }

    let query2 = {
      'properties.node_id': {
        '$in': node_ids,
      }
    };

    collection = database.collection('intersections');
    const intersections = await collection.find(query2).toArray();

    res.json({
      "ways": {
        "type": "FeatureCollection",
        "features": ways,
      },
      "intersections": {
        "type": "FeatureCollection",
        "features": intersections,
      }
    });
  }
  finally {
    await client.close();
  }

});

tool.get('/api/projects/:projectId', async (req, res) => {

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

});

tool.post('/api/projects', async (req, res) => {

  const validate = ajv.getSchema("schemas/project.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const client = new MongoClient(process.env.MONGO_URI);

  try {

    const database = client.db('bctool');
    const collection = database.collection('projects');

    let project = await collection.insertOne(req.body);

    return res.json({
      'message': 'Project added successfully',
      'id': project.insertedId,
    });
  }
  finally {
    await client.close();
  }

});

tool.post('/api/reach', async(req, res) => {

  const validate = ajv.getSchema("schemas/reach.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  const {
    selectedWays,
    selectedIntersections,
    userWays,
    userIntersections,
  } = req.body;

  const projectLength = calcProjectLength(selectedWays, userWays);

  const existingTravel = await calcDemand(
    selectedWays,
    userWays,
    selectedIntersections,
    userIntersections,
    projectLength
  );

  return res.json({
    projectLength: projectLength,
    existingTravel: existingTravel,
  });

});

tool.post('/api/benefits', async(req, res) => {

  const validate = ajv.getSchema("schemas/benefits.schema.json");
  const valid = validate(req.body);

  if(!valid) {
    return res.status(400).json({
      'error': 'Bad post data',
    });
  }

  // TODO
  // analysis of int/way props and update schemas for
  // nullable (or other cases)
  //
  // checks for:
  // county in counties
  // selected infrastructure in infrastructure
  // selected noninfrastructure in noninfrastructure
  // year reasonable

  const {
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
    safety,
  } = req.body;

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
      )

  return res.json({
    benefits: benefits,
  });

});

tool.get('/api/dropdowns', async(req, res) => {
  return res.json({
    infrastructure: infrastructure,
    nonInfrastructure: nonInfrastructure,
    counties: counties,
  });
});

app.use('/', tool);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
