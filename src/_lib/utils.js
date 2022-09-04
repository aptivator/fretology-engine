//import {libraryName} from './configs';

export function ascNumberSorter(n1, n2) {
  return n1 - n2;
}

export function cloneDeep(o) {
  return JSON.parse(JSON.stringify(o));
}
/*
export function error(errorMessage) {
  throw new Error(`${libraryName}: ${errorMessage}`);
}
*/

export function isEmpty(o) {
  return !Object.keys(o).length;
}

export function pickRandom(choices) {
  return choices[Math.floor(Math.random() * choices.length)];
}

export function pickValue(values, pickType) {
  if(pickType === 'random') {
    return pickRandom(values);
  }

  if(pickType === 'middle') {
    let {length} = values;
    let midPointIndex = Math.floor(length / 2);

    if(length % 2 === 0) {
      let midPointIndices = [midPointIndex, midPointIndex - 1];
      midPointIndex = pickRandom(midPointIndices);
    }

    return values[midPointIndex];
  }

  if(pickType === 'highest') {
    return values[values.length - 1];
  }

  return values[0];
}

export function setObjectValue(o, path, value) {
  let last = path.at(-1);
  path = path.slice(0, -1);

  for(let part of path) {
    o = o[part] ??= Array.isArray(o) ? [] : {};
  }
  
  o[last] = value;
}
