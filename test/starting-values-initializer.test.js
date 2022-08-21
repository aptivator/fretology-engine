import {expect}                       from 'chai';
import {assignNotesAndStartingValues} from '../src';
import {stringNumbers, fretNumbers}   from './fixtures/configs';

describe('Assigning Initial String and Fret to Use', () => {
  let configs;

  beforeEach(() => configs = {});

  it('does not assign initial string and fret values when progression is random', () => {
    configs.progression = 'random';
    assignNotesAndStartingValues(configs);
    expect(configs.string).to.be.undefined;
    expect(configs.fret).to.be.undefined;
  });

  it('selects an initial string and fret randomly when progression is not random and starting string and fret values are unspecified', () => {
    configs.progression = 'string';
    assignNotesAndStartingValues(configs);
    expect(stringNumbers.includes(configs.string)).to.be.true;
    expect(fretNumbers.includes(configs.fret)).to.be.true;
  });

  it('sets an initial string and fret to lowest', () => {
    Object.assign(configs, {progression: 'string', startingString: 'lowest', startingFret: 'lowest'});
    assignNotesAndStartingValues(configs);
    expect(configs.string).to.equal(stringNumbers[0]);
    expect(configs.fret).to.equal(fretNumbers[0]);
  });

  it('initializes starting string and fret to highest', () => {
    Object.assign(configs, {progression: 'fret', startingString: 'highest', startingFret: 'highest'});
    assignNotesAndStartingValues(configs);
    expect(configs.string).to.equal(stringNumbers[stringNumbers.length - 1]);
    expect(configs.fret).to.equal(fretNumbers[fretNumbers.length - 1]);
  });

  it('picks a random middle starting string and fret when the number of strings and frets is even', () => {
    let frets = fretNumbers.slice(1);
    let stringMid = Math.floor(stringNumbers.length / 2);
    let fretMid = Math.floor(frets.length / 2);
    let stringMids = [stringNumbers[stringMid - 1], stringNumbers[stringMid]];
    let fretMids = [frets[fretMid - 1], frets[fretMid]];
    let uniqueStrings = new Set();
    let uniqueFrets = new Set();
    Object.assign(configs, {progression: 'string', startingString: 'middle', startingFret: 'middle', frets});

    for(let i = 0; i < 20; i++) {
      assignNotesAndStartingValues(configs);
      uniqueStrings.add(configs.string);
      uniqueFrets.add(configs.fret);  
    }

    expect([...uniqueStrings]).to.deep.equalInAnyOrder(stringMids);
    expect([...uniqueFrets]).to.deep.equalInAnyOrder(fretMids);
  });

  it('assigns a middle starting string and fret when the number of strings and frets is odd', () => {
    let strings = stringNumbers.slice(1);
    let stringMid = Math.floor(strings.length / 2);
    let fretMid = Math.floor(fretNumbers.length / 2);
    Object.assign(configs, {progression: 'fret', startingString: 'middle', startingFret: 'middle', strings});
    assignNotesAndStartingValues(configs);
    expect(strings.length % 2).to.equal(1);
    expect(fretNumbers.length % 2).to.equal(1);
    expect(configs.string).to.equal(strings[stringMid]);
    expect(configs.fret).to.equal(fretNumbers[fretMid]);
  });
});
