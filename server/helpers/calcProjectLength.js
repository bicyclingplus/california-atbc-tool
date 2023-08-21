const calcProjectLength = (selectedWays, userWays) => {

	let projectLength = 0;

	for(let way of selectedWays) {
		projectLength += way.properties.length;
	}

	for(let way of userWays) {
		projectLength += way.properties.length;
	}

	return projectLength;

}

export default calcProjectLength;
