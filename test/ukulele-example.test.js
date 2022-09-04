import {expect}               from 'chai';
import {formatNote}           from '../src/note-generator/_lib/note-generator-utils';
import {generateNotesDataset} from '../src';

describe('Ukulele Example Test', () => {
  it('generates notes in in string groupings for a 12-fret ukulele', () => {
    let configs = {progression: 'string', tuning: ['A', 'E', 'C', 'G'], maxFrets: 13};
    let {notes} = generateNotesDataset(configs);
    let As = formatNote('A#');
    let Cs = formatNote('C#');
    let Ds = formatNote('D#');
    let Fs = formatNote('F#');
    let Gs = formatNote('G#');

    expect(notes).to.eql({
      0: {0: 'A', 1: As,  2: 'B', 3: 'C', 4: Cs,  5: 'D', 6: Ds, 7: 'E', 8: 'F', 9: Fs,  10: 'G', 11: Gs,  12: 'A'},
      1: {0: 'E', 1: 'F', 2: Fs,  3: 'G', 4: Gs,  5: 'A', 6: As, 7: 'B', 8: 'C', 9: Cs,  10: 'D', 11: Ds,  12: 'E'},
      2: {0: 'C', 1: Cs,  2: 'D', 3: Ds,  4: 'E', 5: 'F', 6: Fs, 7: 'G', 8: Gs,  9: 'A', 10: As,  11: 'B', 12: 'C'},
      3: {0: 'G', 1: Gs,  2: 'A', 3: As,  4: 'B', 5: 'C', 6: Cs, 7: 'D', 8: Ds,  9: 'E', 10: 'F', 11: Fs,  12: 'G'}
    });
  });
});
