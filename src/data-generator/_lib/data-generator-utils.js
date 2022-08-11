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

export function sharpifyNote(note) {
  if(note.length === 2) {
    let [_note, flat] = note;

    if(flat !== '#') {
      _note = getNextNoteLetter(_note, false);
      note = _note + '#';
    }
  }

  return note;
}
