import { DISCOUNT_RATE } from './constants.js';

const calcDiscount = (annual_benefit, time_frame) => {

	let total_benefit = 0;

	for(let i = 1; i <= time_frame; i++) {

		total_benefit += annual_benefit / Math.pow(1 + DISCOUNT_RATE, i - 1);
	}

	return total_benefit;
};

export default calcDiscount;
