import { createRequire } from "module";
import getElement from './getElement.js';

const require = createRequire(import.meta.url);
const qualitative = require('../../data/qualitative.json');

const calcSafetyQualitative = (selectedInfrastructure) => {

  const benefits = [];

  for(let i in selectedInfrastructure) {

    // lighting could now be either lighting-block-face or lighting-intersection
    // but there is only one qualitative benefit entry for lighting, so
    // we take that if either are selected
    const shortname = i.startsWith('lighting') ? 'lighting' : i;

    // does this element have qualitative benefits
    if(!(shortname in qualitative)) {
      continue;
    }

    const { label } = getElement(i);

    benefits.push({
      element: label,
      shortname: i,
      benefits: qualitative[shortname].map((benefit, idx) => (
        {
          key: `${shortname}-${idx}`,
          description: benefit.description,
          sources: benefit.sources,
        }
      )),
    });
  }

  return benefits;
};

export default calcSafetyQualitative;
