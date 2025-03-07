import {
	getProject,
	postProject,
} from '../controllers/projects.js';

export default (app) => {
	app.get('/api/projects/:projectId', getProject);
	app.post('/api/projects', postProject);
};
