import fs from 'fs/promises';
import * as turf from "@turf/turf";

const geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      type: 'Feature',
      properties: {
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [ -121.7851837, 38.5525955 ],
          [ -121.7853017, 38.5525871 ],
          [ -121.7861761, 38.5524529 ]
        ]
      }
    }
  ]
}

const buffer = turf.buffer(geojson, 0.05, { units: "kilometers"})

await fs.writeFile('input.json', JSON.stringify(geojson));
await fs.writeFile('output.json', JSON.stringify(buffer));
