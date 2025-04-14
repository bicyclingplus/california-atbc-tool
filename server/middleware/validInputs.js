import {
  validCounty,
  validInfrastructure,
  validNonInfrastructure,
} from '../helpers/validation/dropdowns.js';

import validYear from '../helpers/validation/year.js';
import validTimeframe from '../helpers/validation/timeframe.js';

const validInputs = (req, res, next) => {

  const {
    county,
    year,
    timeframe,
    selectedInfrastructure,
    selectedNonInfrastructure,
  } = req.body;

  if(!validCounty(county)) {
    return res.status(400).json({
      'error': 'Bad county',
    });
  }

  if(!validYear(year)) {
    return res.status(400).json({
      'error': 'Bad year',
    });
  }

  if(!validTimeframe(timeframe)) {
    return res.status(400).json({
      'error': 'Bad timeframe',
    });
  }

  if(!validInfrastructure(selectedInfrastructure)) {
    return res.status(400).json({
      'error': 'Bad infrastructure',
    });
  }

  if(!validNonInfrastructure(selectedNonInfrastructure)) {
    return res.status(400).json({
      'error': 'Bad non infrastructure',
    });
  }

  next();
}

export default validInputs;
