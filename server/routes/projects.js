import {
	getProject,
	postProject,
} from '../controllers/projects.js';

import validInputs from '../middleware/validInputs.js';

export default (app) => {
	app.get('/api/projects/:projectId', getProject);
	app.post('/api/projects', validInputs, postProject);
};
