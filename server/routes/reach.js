import { postReach } from '../controllers/reach.js';

export default (app) => {
	app.post('/api/reach', postReach);
};
