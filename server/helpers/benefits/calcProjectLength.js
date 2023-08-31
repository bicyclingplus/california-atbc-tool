import c from '../collector.js';

const calcProjectLength = (selectedWays, userWays) => {

	let network_length = 0;
	let user_length = 0;

	for(let way of selectedWays) {
		c.put('reach', 'ways', ['network', way.properties.length]);
		network_length += way.properties.length;
	}

	c.put('reach', 'ways', ['network total', network_length]);

	for(let way of userWays) {
		c.put('reach', 'ways', ['user', way.properties.length]);
		user_length += way.properties.length;
	}

	c.put('reach', 'ways', ['user total', user_length]);
	c.put('reach', 'ways', ['project total', network_length + user_length]);

	return network_length + user_length;

}

export default calcProjectLength;
