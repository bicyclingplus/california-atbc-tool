import { createRequire } from "module";

const require = createRequire(import.meta.url);
const infrastructure = require('../../data/infrastructure.json');

const getElement = (shortname) => {

	for(let category of infrastructure.categories) {
		for(let element of category.items) {
			if(element.shortname === shortname) {
				return element;
			}
		}
	}

	return null;
}

export default getElement;
