import {MAX_FRETS, standardTuning}                                  from '../_lib/configs';
import {ascNumberSorter, setObjectValue}                            from '../_lib/utils';
import {getNextNote, getSequentialArray, formatNote, normalizeNote} from './_lib/note-generator-utils';

export function generateNotesDataset(configs = {}) {
  let {tuning = standardTuning, progression} = configs;
  let {strings, frets, maxFrets = MAX_FRETS} = configs;
  let {natural = true, accidental = true} = configs;
  let pather = progression === 'fret' ? (p1, p2) => [p2, p1] : (...args) => args;
  let usingAllFrets = true;
  let notes = {};
  let notesArray = [];

  if(!progression) {
    configs.progression = 'random';
  }

  if(!strings) {
    strings = Object.keys(tuning);
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

    if(tuning !== standardTuning) {
      note = formatNote(note);
      note = normalizeNote(note, configs);
    }

    for(let fret of fretNumbers) {
      if(usingAllFrets || frets.hasOwnProperty(fret)) {
        let isNatural = note.length === 1;

        if((natural && isNatural) || (accidental && !isNatural)) {
          let path = pather(string, fret);
          setObjectValue(notes, path, note);
          setObjectValue(notesArray, path, note);
        }
      }

      note = getNextNote(note, configs);
    }
  }

  return {notes, notesArray};
}
