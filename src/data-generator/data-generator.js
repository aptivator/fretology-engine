import {MAX_FRETS, standardTuning}                                    from '../_lib/configs';
import {ascNumberSorter, cloneDeep, error, pickValue, setObjectValue} from '../_lib/utils';
import {getNextNote, getSequentialArray, sharpifyNote}                from './_lib/data-generator-utils';

export function assignNotesAndDefaults(configs = {}) {
  let notes = generateNotesDataset(configs);
  Object.assign(configs, {notes, notesNotUsed: cloneDeep(notes)});
  setStringAndFretToUse(configs);
  return configs;
}

export function generateNotesDataset(configs) {
  let {tuning, progression} = configs;
  let {strings, frets, maxFrets = MAX_FRETS} = configs;
  let {whole = true, sharp = true} = configs;
  let pather = progression === 'fret' ? (p1, p2) => [p2, p1] : (...args) => args;
  let usingAllFrets = true;
  let notes = {};

  if(!progression) {
    configs.progression = 'random';
  }

  if(!tuning) {
    tuning = standardTuning;
  } else {
    tuning = tuning.map((note) => note.toUpperCase());
  }

  if(!strings) {
    strings = Object.keys(tuning);
  }

  if(strings.length > tuning.length) {
    error('number of specified strings exceeds number of strings in a tuning');
  }

  if(frets) {
    frets.sort(ascNumberSorter);
    maxFrets = +frets[frets.length - 1] + 1;
  }

  let fretNumbers = getSequentialArray(maxFrets);

  if(!frets) {
    frets = fretNumbers;
  }

  if(frets.length !== fretNumbers.length) {
    usingAllFrets = false;

    frets = frets.reduce((frets, fret, index) => {
      frets[fret] = index;
      return frets;
    }, {});
  }

  for(let string of strings) {
    let note = tuning[string];
    note = sharpifyNote(note);
    
    for(let fret of fretNumbers) {
      if(usingAllFrets || frets.hasOwnProperty(fret)) {
        let isWhole = note.length === 1;

        if((whole && isWhole) || (sharp && !isWhole)) {
          let path = pather(string, fret);
          setObjectValue(notes, path, note);
        }
      }

      note = getNextNote(note);
    }
  }

  return notes;
}

function setStringAndFretToUse(configs) {
  let {progression} = configs;
  
  if(progression !== 'random') {
    let {notes} = configs;
    let settings = [['startingString', 'string']];
    let fretMethod = progression === 'fret' ? 'unshift' : 'push';
    settings[fretMethod](['startingFret', 'fret']);
    
    for(let [startingProp, toUseProp] of settings) {
      let {[startingProp]: pickType = 'random'} = configs;
      let availables = Object.keys(notes).sort(ascNumberSorter);
      let fretOrStringSelection = pickValue(availables, pickType);
      configs[toUseProp] = fretOrStringSelection;
      notes = notes[fretOrStringSelection];
    }
  }
}
