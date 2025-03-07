import { getFeatures } from '../controllers/features.js';

export default (app) => {
	app.get('/api/features', getFeatures);
};
