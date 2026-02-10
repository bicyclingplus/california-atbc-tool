const avgProp = (items, property, subProperty=null) => {

  let total = 0;
  let count = 0;

  for(let item of items) {

    let value = item.properties[property];

    if(subProperty) {
      try {
        value = item.properties[property][subProperty];
      }
      catch (e) {
        if(e.name === 'TypeError') {
          console.log(item)
          console.log(property)
          console.log(subProperty)
          return;
        }

        throw e;
      }
    }

    if(value !== null) {
      total += value;
      count++;
    }
  }

  if(count > 0) {
    return total / count;
  }

  return null;
};

export default avgProp;
