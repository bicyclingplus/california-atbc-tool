import { postBenefits } from '../controllers/benefits.js';

export default (app) => {
	app.post('/api/benefits', postBenefits);
};
