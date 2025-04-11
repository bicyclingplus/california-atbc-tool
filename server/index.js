import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compression from 'compression';
import dotenv from 'dotenv';

import routesBenefits from './routes/benefits.js';
import routesDropdowns from './routes/dropdowns.js';
import routesFeatures from './routes/features.js';
import routesProjects from './routes/projects.js';
import routesReach from './routes/reach.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const app = express();
const tool = express();

dotenv.config();

app.set('trust proxy', process.env.PROXY === "1");

app.use(compression());
app.use(morgan('combined'));
app.use(bodyParser.json({
  limit: '10mb',
}));

tool.use(express.static(path.resolve(__dirname, '../client/dist')));

routesBenefits(tool);
routesDropdowns(tool);
routesFeatures(tool);
routesProjects(tool);
routesReach(tool);

app.use('/', tool);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
