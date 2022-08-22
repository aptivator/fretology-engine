import {expect}                                             from 'chai';
import {MAX_FRETS, standardTuning}                          from '../src/_lib/configs';
import {ascNumberSorter}                                    from '../src/_lib/utils';
import {sharpifyNote}                                       from '../src/note-generator/_lib/note-generator-utils';
import {assignNotesAndStartingValues, generateNotesDataset} from '../src';
import {stringNumbers, fretNumbers}                         from './fixtures/configs';

describe('Generating Notes Dataset', () => {
  let configs;

  beforeEach(() => configs = {});
  
  describe('Using default assignNotesAndStartingValues()', () => {
    it('makes two equal datasets: notes and notesNotUsed', () => {
      assignNotesAndStartingValues(configs);
      expect(configs.notes).to.be.an('object');
      expect(configs.notes).to.eql(configs.notesNotUsed);
    });
    
    it('can create and return a configs object', () => {
      let configs = assignNotesAndStartingValues();
      expect(configs.notes).to.be.an('object');
      expect(configs.notes).to.eql(configs.notesNotUsed);
    });

    it(`uses a default ${standardTuning.length} strings and ${MAX_FRETS - 1} frets`, () => {
      let counter = 0;
      assignNotesAndStartingValues(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach(() => counter++);
      });

      expect(counter).to.equal(standardTuning.length * MAX_FRETS);
    });
    
    it('builds a notes dataset grouped by strings', () => {
      assignNotesAndStartingValues(configs);
      expect(Object.keys(configs.notes)).to.deep.equalInAnyOrder(stringNumbers);
    });
    
    it('assembles a notes dataset grouped by frets', () => {
      configs.progression = 'fret';
      assignNotesAndStartingValues(configs);
      expect(Object.keys(configs.notes)).to.deep.equalInAnyOrder(fretNumbers);
    });

    it('limits generated note dataset to select strings', () => {
      configs.strings = ['0', '4'];
      assignNotesAndStartingValues(configs);
      expect(Object.keys(configs.notes)).to.eql(configs.strings);
    });

    it('constrains built note dataset to a specified highest fret', () => {
      let maxFrets = 22;
      Object.assign(configs, {maxFrets, progression: 'fret'});
      assignNotesAndStartingValues(configs);
      expect(Object.keys(configs.notes).sort(ascNumberSorter).reverse()[0]).to.equal(`${maxFrets - 1}`);
    });

    it('restricts generated note dataset to select frets (ignores maxFrets setting)', () => {
      Object.assign(configs, {progression: 'fret', frets: ['1', '2', '3'], maxFrets: 55});
      assignNotesAndStartingValues(configs);
      expect(Object.keys(configs.notes)).to.eql(configs.frets);
    });    

    it('outputs a note dataset consisting only of natural notes', () => {
      configs.accidental = false;
      assignNotesAndStartingValues(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          expect(/^[A-G]$/.test(note)).to.be.true;
        });
      });
    });

    it('selects only accidental notes for a generated note dataset', () => {
      configs.natural = false;
      assignNotesAndStartingValues(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          expect(/^[A-G]\#$/.test(note)).to.be.true;
        });
      });
    });

    it(`employs standard tuning (${standardTuning.slice().reverse().join('-')}) by default`, () => {
      assignNotesAndStartingValues(configs);
      standardTuning.forEach((note, index) => {
        expect(configs.notes[index][0]).to.equal(note);
      });
    });

    it('arranges notes accurately', () => {
      assignNotesAndStartingValues(configs);
      expect(configs.notes[0][12]).to.equal('E');
      expect(configs.notes[5][2]).to.equal('F#');
    });

    it('configures a dataset using custom tuning (flats are converted to sharps)', () => {
      configs.tuning = ['Bb', 'A', 'D', 'A', 'D', 'A#'];
      assignNotesAndStartingValues(configs);
      configs.tuning.forEach((note, index) => {
        note = sharpifyNote(note);
        expect(configs.notes[index][0]).to.equal(note);
        expect(configs.notes[index][12]).to.equal(note);
      });
    });

    it('capitalizes notes in a provided tuning', () => {
      configs.tuning = ['e', 'gb', 'd', 'e', 'e', 'f'];
      assignNotesAndStartingValues(configs);
      configs.tuning.forEach((note, index) => {
        note = note.toUpperCase();
        note = sharpifyNote(note);
        expect(configs.notes[index][0]).to.equal(note);
        expect(configs.notes[index][12]).to.equal(note);
      });
    });

    it('throws an error when a number of requested strings exceeds exceeds strings in a tuning', () => {
      configs.strings = [0, 1, 2, 3, 4, 5, 6, 7];
      expect(() => assignNotesAndStartingValues(configs)).to.throw(/exceeds number of strings in a tuning/);
    });
  });

  describe('Using generateNotesDataset()', () => {
    it('is used just to generate notes', () => {
      let configs = {strings: ['1'], frets: ['0']};
      let notes = generateNotesDataset(configs);
      expect(notes).to.eql({1: {0: 'B'}});
    });

    it('uses default settings when no configs are provided', () => {
      let notes = generateNotesDataset();
      expect(Object.keys(notes).length).to.equal(standardTuning.length);
      expect(Object.keys(notes[0]).length).to.equal(MAX_FRETS);
    });
  });  
});
