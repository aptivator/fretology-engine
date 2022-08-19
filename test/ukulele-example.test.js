import {expect}               from 'chai';
import {generateNotesDataset} from '../src';

describe('Ukulele Example Test', () => {
  it('generates notes in in string groupings for a 12-fret ukulele', () => {
    let tuning = ['A', 'E', 'C', 'G']
    let maxFrets = 13;
    let configs = {progression: 'string', tuning, maxFrets};
    let notes = generateNotesDataset(configs);

    expect(notes).to.eql({
      0: {0: 'A', 1: 'A#', 2: 'B', 3: 'C', 4: 'C#', 5: 'D', 6: 'D#', 7: 'E', 8: 'F', 9: 'F#', 10: 'G', 11: 'G#', 12: 'A'},
      1: {0: 'E', 1: 'F', 2: 'F#', 3: 'G', 4: 'G#', 5: 'A', 6: 'A#', 7: 'B', 8: 'C', 9: 'C#', 10: 'D', 11: 'D#', 12: 'E'},
      2: {0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B', 12: 'C'},
      3: {0: 'G', 1: 'G#', 2: 'A', 3: 'A#', 4: 'B', 5: 'C', 6: 'C#', 7: 'D', 8: 'D#', 9: 'E', 10: 'F', 11: 'F#', 12: 'G'}
    });
  });
});
