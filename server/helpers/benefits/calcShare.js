
// TODO handle the totalLength/numIntersections being zero
// here. this causes division by zero -> Infinity
// maybe just set the share to zero in this case?

const calcShare = (element, value, totalLength, numIntersections) => {

	const {
		calc_units,
		units,
	} = element;

	let share, Ni, L;

	// calculate the project share for this element
    if(calc_units === 'length') {

        if(units === 'count') {
            // In this case we ask them for a count and
            // then apply a preset length per item
            // i.e. lights every 100 feet
            // and then apply that as a portion of the
            // total project length
            // all are assumed to be per 100 feet right now
            // this will probably change at some point.
            share = (value * 100) / totalLength;
            Ni = value * 100;
            L = totalLength;
        }
        else if(units === 'length') {
            share = value / totalLength;
            Ni = value;
            L = totalLength;
        }

        // if(totalLength === 0) {
        //     share = 0;
        // }
    }
    else if(calc_units === 'count') {
        share = value / numIntersections;
        Ni = value;
        L = numIntersections;
    }

    return {
    	share: share,
    	Ni: Ni,
    	L: L,
    };

};

export default calcShare;
