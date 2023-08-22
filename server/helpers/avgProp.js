const avgProp = (items, property) => {

  let total = 0;
  let count = 0;

  for(let item of items) {

    if(item.properties[property]) {
      total+= item.properties[property];
      count++;
    }
  }

  if(count > 0) {
    return total / count;
  }

  return null;
};

export default avgProp;
