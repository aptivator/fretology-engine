import {accidentals, accidentalsMap, flatSymbol, sharpSymbol} from '../../_lib/configs';

const ACode = 'A'.charCodeAt(0);

export function formatNote(note) {
  note = note.toUpperCase();

  if(note.length > 1) {
    let [natural, accidental] = note;
    let isSharp = ['#', sharpSymbol].includes(accidental);
    let _natural = getNoteLetterFromLetter(natural, isSharp);
    let isSharpNatural = isSharp && 'CF'.includes(_natural);
    let isFlatNatural = !isSharp && 'BE'.includes(_natural);

    if(isSharpNatural || isFlatNatural) {
      return _natural;
    }

    if(!accidentals.includes(accidental)) {
      let _accidental = accidentalsMap[accidental];
      accidental = _accidental ? _accidental : flatSymbol;
      note = natural + accidental;
    }
  }

  return note;
}

export function getNextNote(note, options) {
  [note] = [].concat(note);

  if(note.length > 1 || 'BE'.includes(note)) {
    let [natural, accidental] = note;
    let isFlat = accidental === flatSymbol;
    return isFlat ? natural : getNoteLetterFromLetter(natural);
  }
  
  return normalizeNote(note + sharpSymbol, options);
}

function getNoteLetterFromLetter(letter, next = true) {
  let step = next ? 1 : -1;
  let nextCode = ACode + (7 + letter.charCodeAt(0) - ACode + step) % 7;
  return String.fromCharCode(nextCode);
}

export function getSequentialArray(length) {
  return Array.from({length}, (v, i) => `${i}`);
}

export function normalizeNote(note, options) {
  if(note.length > 1) {
    let {accidentalFormat = 'sharp'} = options;
    let [natural, accidental] = note;
    let isSharp = accidental === sharpSymbol;
    let otherNote = getNoteLetterFromLetter(natural, isSharp);
    let shouldBeSharpAndNot = accidentalFormat === 'sharp' && !isSharp;
    let shouldBeFlatAndNot = accidentalFormat === 'flat' && isSharp;
    let returnOtherNote = shouldBeSharpAndNot || shouldBeFlatAndNot;

    if(returnOtherNote || accidentalFormat === 'flatAndSharp') {
      otherNote += isSharp ? flatSymbol : sharpSymbol;

      if(returnOtherNote) {
        return otherNote;
      }

      note = [note, otherNote];

      if(!isSharp) {
        note.reverse();
      }
    }
  }

  return note;
}
