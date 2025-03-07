import { getDropdowns } from '../controllers/dropdowns.js';

export default (app) => {
	app.get('/api/dropdowns', getDropdowns);
};
