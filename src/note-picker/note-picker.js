import {ascNumberSorter, cloneDeep, isEmpty, pickRandom, pickValue} from '../_lib/utils';

export function pickNote(configs) {
  if(configs.progression === 'random') {
    return pickRandomNote(configs);
  }

  return pickNoteByProgression(configs);
}

function pickRandomNote(configs) {
  let {notesNotUsed} = configs;
  let strings = Object.keys(notesNotUsed);
  let string = pickRandom(strings);
  let frets = Object.keys(notesNotUsed[string]);
  let fret = pickRandom(frets);
  let note = notesNotUsed[string][fret];
  
  delete notesNotUsed[string][fret];

  if(isEmpty(notesNotUsed[string])) {
    delete notesNotUsed[string];
  }

  if(isEmpty(notesNotUsed)) {
    configs.notesNotUsed = cloneDeep(configs.notes);
  }

  return {string, fret, note}; 
}

function pickNoteByProgression(configs) {
  let {progression, string, fret, notes, notesNotUsed} = configs;
  let fretProgression = progression === 'fret';
  let primaryProgression = 'stringProgression';
  let secondaryProgression = 'fretProgression';
  let secondaryStarting = 'startingFret';
  let result = {string, fret};

  if(fretProgression) {
    [primaryProgression, secondaryProgression] = [secondaryProgression, primaryProgression];
    [string, fret] = [fret, string];
    secondaryStarting = 'startingString';
  }

  result.note = notesNotUsed[string][fret];

  delete notesNotUsed[string][fret];

  if(isEmpty(notesNotUsed[string])) {
    delete notesNotUsed[string];
  }
  
  if(!notesNotUsed[string]) {
    if(isEmpty(notesNotUsed)) {
      notesNotUsed = cloneDeep(configs.notes);
      Object.assign(configs, {notesNotUsed});
    }

    string = pickByProgression(configs[primaryProgression], string, notesNotUsed, notes);
    let frets = Object.keys(notes[string]).sort(ascNumberSorter);
    fret = pickValue(frets, configs[secondaryStarting]);
  } else {
    fret = pickByProgression(configs[secondaryProgression], fret, notesNotUsed[string], notes[string]);
  }

  if(fretProgression) {
    [string, fret] = [fret, string];
  }
  
  Object.assign(configs, {string, fret});
  return result;
}

function pickByProgression(progression = 'random', currentValue, randomDataset, nonRandomDataset) {
  if(progression !== 'random') {
    var values = Object.keys(nonRandomDataset).sort(ascNumberSorter);
    let {length} = values;
    let index = values.findIndex((value) => value === currentValue);
    index = (length + index + progression) % length;
    return values[index];
  }
  
  values = Object.keys(randomDataset);
  return pickRandom(values);
}
