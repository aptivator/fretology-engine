import {MAX_FRETS, standardTuning}                      from '../_lib/configs';
import {ascNumberSorter, error, setObjectValue}         from '../_lib/utils';
import {getNextNote, getSequentialArray, normalizeNote} from './_lib/note-generator-utils';

export function generateNotesDataset(configs = {}) {
  let {tuning, progression} = configs;
  let {strings, frets, maxFrets = MAX_FRETS} = configs;
  let {natural = true, accidental = true} = configs;
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
    frets = frets.reduce((frets, fret) => Object.assign(frets, {[fret]: true}), {});
  }

  for(let string of strings) {
    let note = tuning[string];
    note = normalizeNote(note, false);
    
    for(let fret of fretNumbers) {
      if(usingAllFrets || frets.hasOwnProperty(fret)) {
        let isNatural = note.length === 1;

        if((natural && isNatural) || (accidental && !isNatural)) {
          let path = pather(string, fret);
          setObjectValue(notes, path, note);
        }
      }

      note = getNextNote(note);
    }
  }

  return notes;
}
