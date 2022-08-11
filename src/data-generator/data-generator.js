import setWith                                      from 'lodash.setwith';
import {fretNumbers, stringNumbers, standardTuning} from '../_lib/configs';
import {ascNumberSorter, cloneDeep, pickValue}      from '../_lib/utils';
import {getNextNote, sharpifyNote}                  from './_lib/data-generator-utils';

export function assignNotesAndDefaults(configs) {
  addNotesDataset(configs);
  setStringAndFretToUse(configs);
}

function addNotesDataset(configs) {
  let {tuning = standardTuning, progression} = configs;
  let {strings = stringNumbers, frets = fretNumbers} = configs;
  let {whole, sharp} = configs;
  let pather = progression === 'fret' ? (p1, p2) => [p2, p1] : (...args) => args;
  let notes = {};

  frets = frets.reduce((frets, fret, index) => {
    frets[fret] = index;
    return frets;
  }, {});
    
  for(let string of strings) {
    let note = tuning[string];
    note = sharpifyNote(note);
    
    for(let fret of fretNumbers) {
      if(frets.hasOwnProperty(fret)) {
        let isWhole = note.length === 1;

        if((whole && isWhole) || (sharp && !isWhole)) {
          let path = pather(string, fret);
          setWith(notes, path, note, Object);
        }
      }

      note = getNextNote(note);
    }
  }

  Object.assign(configs, {notes, notesNotUsed: cloneDeep(notes)});
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
