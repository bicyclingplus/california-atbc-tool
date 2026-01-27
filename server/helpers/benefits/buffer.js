import fs from 'fs/promises';
import * as turf from "@turf/turf";

const geojson = {
  "type": "FeatureCollection",
  "features": [
    ...selectedWays,
    ...selectedIntersections,
  ],
};

const buffer = turf.buffer(geojson, 0.05, { units: "kilometers"})

await fs.writeFile('input.json', JSON.stringify(geojson));
await fs.writeFile('output.json', JSON.stringify(buffer));
