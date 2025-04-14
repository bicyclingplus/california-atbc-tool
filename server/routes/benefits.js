import { postBenefits } from '../controllers/benefits.js';

import validInputs from '../middleware/validInputs.js';

export default (app) => {

	app.post('/api/benefits', validInputs, postBenefits);
};
