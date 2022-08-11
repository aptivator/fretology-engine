import chai, {expect}                               from 'chai';
import deepEqualInAnyOrder                          from 'deep-equal-in-any-order';
import {fretNumbers, stringNumbers, standardTuning} from '../src/_lib/configs';
import {cloneDeep}                                  from '../src/_lib/utils';
import {sharpifyNote}                               from '../src/data-generator/_lib/data-generator-utils';
import {assignNotesAndDefaults}                     from '../src';

chai.use(deepEqualInAnyOrder);

describe('Data Generator', () => {
  let configs;
  let baseConfigs = {progression: 'string', whole: true, sharp: true};

  beforeEach(() => configs = cloneDeep(baseConfigs));
  
  describe('Building Notes Dataset', () => {
    it('makes two equal datasets: notes and notesNotUsed', () => {
      assignNotesAndDefaults(configs);
      expect(configs.notes).to.be.an('object');
      expect(configs.notes).to.eql(configs.notesNotUsed);
    });

    it(`uses a default ${stringNumbers.length} strings and ${fretNumbers.length - 1} frets`, () => {
      let counter = 0;
      assignNotesAndDefaults(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach(() => counter++);
      });

      expect(counter).to.equal(fretNumbers.length * stringNumbers.length);
    });

    it('builds a notes dataset grouped by strings', () => {
      assignNotesAndDefaults(configs);
      expect(Object.keys(configs.notes)).to.eql(stringNumbers);
    });

    it('assembles a notes dataset grouped by frets', () => {
      configs.progression = 'fret';
      assignNotesAndDefaults(configs);
      expect(Object.keys(configs.notes)).to.eql(fretNumbers);
    });

    it('limits generated note dataset to select strings', () => {
      configs.strings = ['0', '4'];
      assignNotesAndDefaults(configs);
      expect(Object.keys(configs.notes)).to.eql(configs.strings);
    });

    it('restricts generated note dataset to select frets', () => {
      Object.assign(configs, {progression: 'fret', frets: ['1', '2', '3']});
      assignNotesAndDefaults(configs);
      expect(Object.keys(configs.notes)).to.eql(configs.frets);
    });

    it('outputs a note dataset consisting only of wholes', () => {
      delete configs.sharp;
      assignNotesAndDefaults(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          expect(/^[A-G]$/.test(note)).to.be.true;
        });
      });
    });

    it('selects only sharp notes for a generated note dataset', () => {
      configs.whole = false;
      assignNotesAndDefaults(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          expect(/^[A-G]\#$/.test(note)).to.be.true;
        });
      });
    });

    it('employes standard tuning (E-A-D-G-B-E) by default', () => {
      assignNotesAndDefaults(configs);
      standardTuning.forEach((note, index) => {
        expect(configs.notes[index][0]).to.equal(note);
      });
    });

    it('arranges notes accurately', () => {
      assignNotesAndDefaults(configs);
      expect(configs.notes[0][12]).to.equal('E');
      expect(configs.notes[5][2]).to.equal('F#');
    });

    it('configures a dataset using custom tuning (flats are converted to sharps)', () => {
      configs.tuning = ['Bb', 'A', 'D', 'A', 'D', 'A#'];
      assignNotesAndDefaults(configs);
      configs.tuning.forEach((note, index) => {
        note = sharpifyNote(note);
        expect(configs.notes[index][0]).to.equal(note);
        expect(configs.notes[index][12]).to.equal(note);
      });
    });
  });

  describe('Assigning Initial String and Fret to Use', () => {
    it('does not assign initial string and fret values when progression is random', () => {
      configs.progression = 'random';
      assignNotesAndDefaults(configs);
      expect(configs.string).to.be.undefined;
      expect(configs.fret).to.be.undefined;
    });

    it('selects an initial string and fret randomly when progression is not random and starting string and fret values are unspecified', () => {
      assignNotesAndDefaults(configs);
      expect(stringNumbers.includes(configs.string)).to.be.true;
      expect(fretNumbers.includes(configs.fret)).to.be.true;
    });

    it('sets an initial string and fret to lowest', () => {
      Object.assign(configs, {startingString: 'lowest', startingFret: 'lowest'});
      assignNotesAndDefaults(configs);
      expect(configs.string).to.equal(stringNumbers[0]);
      expect(configs.fret).to.equal(fretNumbers[0]);
    });

    it('initializes starting string and fret to highest', () => {
      Object.assign(configs, {startingString: 'highest', startingFret: 'highest'});
      assignNotesAndDefaults(configs);
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
      Object.assign(configs, {startingString: 'middle', startingFret: 'middle', frets});

      for(let i = 0; i < 20; i++) {
        assignNotesAndDefaults(configs);
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
      Object.assign(configs, {startingString: 'middle', startingFret: 'middle', strings});
      assignNotesAndDefaults(configs);
      expect(strings.length % 2).to.equal(1);
      expect(fretNumbers.length % 2).to.equal(1);
      expect(configs.string).to.equal(strings[stringMid]);
      expect(configs.fret).to.equal(fretNumbers[fretMid]);
    });
  });
});
