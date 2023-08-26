import dotenv from 'dotenv';

dotenv.config();

class Collector {

	constructor() {
		this.enabled = parseInt(process.env.DEBUG) === 1;
		this.data = {};
		this.prepends = {};
	}

	reset() {
		this.data = {};
		this.prepends = {};
	}

	addPrepends(ns1, ns2, prepends) {

		if(!(ns1 in this.prepends) || !(ns2 in this.prepends[ns1])) {
			console.log(`${ns1}_${ns2} has no prepends to add on to!`);
			return;
		}

		this.prepends[ns1][ns2] = [
			...this.prepends[ns1][ns2],
			...prepends,
		];
	}

	changePrepend(ns1, ns2, idx, newVal) {

		if(!(ns1 in this.prepends) ||
			!(ns2 in this.prepends[ns1]) ||
			this.prepends[ns1][ns2][idx] === undefined) {
			console.log(`${ns1}_${ns2} has no prepend at idx ${idx}!`);
			return;
		}

		this.prepends[ns1][ns2][idx] = newVal;
	}

	setPrepends(ns1, ns2, prepends) {

		if(!(ns1 in this.prepends)) {
			this.prepends[ns1] = {};
		}

		this.prepends[ns1][ns2] = prepends;
	}

	dumpPrepends(ns1, ns2) {

		console.log(`Dumping ${ns1}_${ns2} prepends`);

		if(!(ns1 in this.prepends) || !(ns2 in this.prepends[ns1])) {
			console.log(`None`);
			return;
		}

		console.log(this.prepends[ns1][ns2]);
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
		if(!(ns1 in this.data) ||
			!(ns2 in this.data[ns1])) {
			return [];
		}

		return this.data[ns1][ns2];
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
