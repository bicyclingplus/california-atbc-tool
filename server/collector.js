import dotenv from 'dotenv';

dotenv.config();

class Collector {

	constructor() {
		this.enabled = parseInt(process.env.DEBUG) === 1;
		this.data = {}
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

		this.data[ns1][ns2].push(row);
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
}

const c = new Collector();

export default c;
