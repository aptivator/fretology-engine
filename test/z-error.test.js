import {expect}                       from 'chai';
import {assignNotesAndStartingValues} from '../src';

describe('Errors', () => {
  it('tuning', () => {
    let configs = {frets: ['z', 'a']};
    assignNotesAndStartingValues(configs);
    console.log(configs.notes);
  });
});
