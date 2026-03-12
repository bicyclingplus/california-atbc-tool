import { DISCOUNT_RATE } from './constants.js';

const calcDiscount = (annual_benefit, time_frame) => {

	let total_benefit = 0;

	for(let i = 1; i <= time_frame; i++) {

		const current_benefit = annual_benefit / Math.pow(1 + DISCOUNT_RATE, i - 1);

		// console.log(`${i}: ${current_benefit}`);

		total_benefit += current_benefit;
	}

	return total_benefit;
};

export default calcDiscount;
