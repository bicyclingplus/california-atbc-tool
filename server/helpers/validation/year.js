// start of application development
const minYear = 2021;

const validYear = (year) => {
	const currentYear = new Date().getFullYear();

	return year <= currentYear && year >= minYear;
};

export default validYear;
