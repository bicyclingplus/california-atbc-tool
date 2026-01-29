// 68f970810a24061d521af568
// dump a project's selected ways/intersections
// and user ways/intersections as a geojson
// feature collection

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';
import * as turf from "@turf/turf";

import calcReach from '../helpers/benefits/calcReach.js';

dotenv.config({ path: '../.env'});

const outdir = path.join('..', 'output');

const dumpProject = async (projectId) => {

  const outfilename = path.join(outdir, `${projectId}.geojson`);

  let client;

  try {

    client = new MongoClient(process.env.MONGO_URI);

    const db = client.db('bctool');
    const projects = db.collection('projects');

    const project = await projects.findOne({
      '_id': new ObjectId(projectId),
    });

    if(project === null) {
      console.log(`Couldn't find project with id: ${projectId}`);
      process.exit();
    }

    if(!fs.existsSync(outdir)) {
      fs.mkdirSync(outdir)
    }

    const {
      segments,
      intersections,
      userSegments,
      userIntersections,
    } = project.scope;

    const selectedWayIds = segments.map(el => el.properties.edge_uid);
    const selectedIntersectionIds = intersections.map(el => el.properties.node_id);

    const reach = await calcReach(
      selectedWayIds,
      selectedIntersectionIds,
      userSegments,
      userIntersections,
    );

    const {
      selectedWays,
      selectedIntersections,
    } = reach;

    const geojson = {
      type: "FeatureCollection",
      features: [
        ...selectedWays,
        ...selectedIntersections,
        ...userSegments,
        ...userIntersections,
      ],
    };

    fs.writeFileSync(outfilename, JSON.stringify(geojson));

    for(const feature of geojson.features) {
      feature.properties = {};
    }

    let bike_buffer = turf.buffer(geojson, 1.00, {units: 'miles'});
    bike_buffer = turf.union(bike_buffer);

    let walk_buffer = turf.buffer(geojson, 0.25, {units: 'miles'});
    walk_buffer = turf.union(walk_buffer);

    const bike_buffer_filename = path.join(outdir, `${projectId}_buffer_bike.geojson`);
    const walk_buffer_filename = path.join(outdir, `${projectId}_buffer_walk.geojson`);

    fs.writeFileSync(bike_buffer_filename, JSON.stringify(bike_buffer));
    fs.writeFileSync(walk_buffer_filename, JSON.stringify(walk_buffer));

    console.log(`Created ${outfilename}`);
    console.log(`Created ${bike_buffer_filename}`);
    console.log(`Created ${walk_buffer_filename}`);

  }
  finally {
    await client.close();
  }
}

const usage = () => {
  console.log(`Dumps project with specified id scope from mongo as GeoJSON`);
  console.log(`usage: dump id\n`)
  console.log(`-h, --help\t display this message and exit`)

  process.exit();
}


if(process.argv.length === 3) {

  switch(process.argv[2]) {
    case '-h':
    case '--help':
      usage();
    break;
  }

  await dumpProject(process.argv[2]);
}
else {
  usage();
}
