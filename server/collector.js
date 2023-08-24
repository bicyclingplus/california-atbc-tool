import dotenv from 'dotenv';

dotenv.config();

class Collector {

	constructor() {
		this.enabled = parseInt(process.env.DEBUG) === 1;
		this.data = {};
		this.prepends = {};
	}

	addPrepends(ns1, ns2, prepends) {
		this.prepends[ns1][ns2] = [
			...this.prepends[ns1][ns2],
			...prepends,
		];
	}

	setPrepends(ns1, ns2, prepends) {

		if(!(ns1 in this.prepends)) {
			this.prepends[ns1] = {};
		}

		this.prepends[ns1][ns2] = prepends;
	}

	put(ns1, ns2, row) {

		if(!this.enabled) {
			return;
		}

		if(!(ns1 in this.data)) {
			this.data[ns1] = {};
		}

		if(!(ns2 in this.data[ns1])) {
			this.data[ns1][ns2] = [];
		}

		if(ns1 in this.prepends &&
			ns2 in this.prepends[ns1]) {

			this.data[ns1][ns2].push([
				...this.prepends[ns1][ns2],
				...row,
			])
		}
		else {

			this.data[ns1][ns2].push(row);
		}
	}

	get(ns1, ns2) {
		if(ns1 in this.data && ns2 in this.data[ns1]) {
			return this.data[ns1][ns2];
		}

		return [];
	}

	on() {
		this.enabled = true;
	}

	off() {
		this.enabled = false;
	}

	enabled() {
		return this.enabled;
	}
}

const c = new Collector();

export default c;
