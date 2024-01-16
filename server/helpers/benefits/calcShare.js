
// TODO handle the totalLength/numIntersections being zero
// here. this causes division by zero -> Infinity
// maybe just set the share to zero in this case?

const calcShare = (element, value, totalLength, numIntersections) => {

	const {
		calc_units,
		units,
	} = element;

	let Ni = value;
    let L;

	// calculate the project share for this element
    if(calc_units === 'length') {

        L = totalLength;

        if(units === 'count') {
            // In this case we ask them for a count and
            // then apply a preset length per item
            // i.e. lights every 100 feet
            // and then apply that as a portion of the
            // total project length
            // all are assumed to be per 100 feet right now
            // this will probably change at some point.
            Ni = value * 100;
        }
    }
    else if(calc_units === 'count') {
        L = numIntersections;
    }

    // calculate the share Ni/L
    // set share to zero in the event
    // of zero L (prevent division by zero)
    const share = L === 0 ? 0 : Ni / L;

    return {
    	share: share,
    	Ni: Ni,
    	L: L,
    };

};

export default calcShare;
