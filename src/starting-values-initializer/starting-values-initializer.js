import {ascNumberSorter, pickValue} from '../_lib/utils';

export function setStartingStringAndFret(configs) {
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
