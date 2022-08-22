const ACode = 'A'.charCodeAt(0);

export function getNextNote(note) {
  if(note.length === 2 || 'BE'.includes(note)) {
    return getNextNoteLetter(note[0]);
  }

  return note + '#';
}

function getNextNoteLetter(letter, next = true) {
  let step = next ? 1 : -1;
  let nextCode = ACode + (letter.charCodeAt(0) - ACode + step) % 7;
  return String.fromCharCode(nextCode);  
}

export function getSequentialArray(length) {
  return Array.from({length}, (v, i) => `${i}`);
}

export function normalizeNote(note, toUpperCase = true) {
  if(toUpperCase) {
    note = note.toUpperCase();
  }
  
  if(note.length === 2) {
    let [natural, accidental] = note;
    let isFlat = accidental !== '#';
    natural = getNextNoteLetter(natural, !isFlat);

    if(isFlat) {
      if('BE'.includes(natural)) {
        return natural;       
      }

      return natural + '#';
    }
    
    if('CF'.includes(natural)) {
      return natural;
    }
  }

  return note;
}
