import {expect}                                             from 'chai';
import {flatSymbol, MAX_FRETS, sharpSymbol, standardTuning} from '../src/_lib/configs';
import {ascNumberSorter}                                    from '../src/_lib/utils';
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

    it('produces an array version of notes dataset', () => {
      assignNotesAndStartingValues(configs);
      expect(configs.notesArray.length).to.equal(6);
      expect(configs.notesArray[0].length).to.equal(25);
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

    it('selects only sharp accidental notes (default) for a generated note dataset', () => {
      let rx = new RegExp(`^[A-G]${sharpSymbol}$`);
      configs.natural = false;
      assignNotesAndStartingValues(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          expect(rx.test(note)).to.be.true;
        });
      });
    });

    it('picks only flat accidental notes for a note dataset', () => {
      let rx = new RegExp(`^[A-G]${flatSymbol}$`);
      Object.assign(configs, {natural: false, accidentalFormat: 'flat'});
      assignNotesAndStartingValues(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          expect(rx.test(note)).to.be.true;
        });
      });      
    });

    it('generates accidental notes in sharp and flat format', () => {
      let rx = new RegExp(`^[A-G]${flatSymbol}|${sharpSymbol}$`);
      Object.assign(configs, {natural: false, accidentalFormat: 'flatAndSharp'});
      assignNotesAndStartingValues(configs);
      Object.values(configs.notes).forEach((stringNotes) => {
        Object.values(stringNotes).forEach((note) => {
          note.forEach((note) => expect(rx.test(note)).to.be.true);
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
      expect(configs.notes[5][2]).to.equal(`F${sharpSymbol}`);
    });

    it('produces notes accurately for flat formatting', () => { 
      configs.accidentalFormat = 'flat';
      assignNotesAndStartingValues(configs);
      expect(configs.notes[0][12]).to.equal('E');
      expect(configs.notes[5][2]).to.equal(`G${flatSymbol}`);      
    });

    it('generates notes accurately for flatAndSharp formatting', () => {
      configs.accidentalFormat = 'flatAndSharp';
      assignNotesAndStartingValues(configs);
      expect(configs.notes[0][12]).to.equal('E');
      expect(configs.notes[5][2]).to.eql([`F${sharpSymbol}`, `G${flatSymbol}`]);   
    });

    it('configures a dataset using a custom tuning', () => {
      configs.tuning = ['cb', 'e#', 'db', 'a', 'D', 'A#'];
      assignNotesAndStartingValues(configs);

      expect(configs.notes[0][0]).to.equal('B');
      expect(configs.notes[0][12]).to.equal('B');
      expect(configs.notes[1][0]).to.equal('F');
      expect(configs.notes[1][12]).to.equal('F');
      expect(configs.notes[2][0]).to.equal(`C${sharpSymbol}`);
      expect(configs.notes[2][12]).to.equal(`C${sharpSymbol}`);
      expect(configs.notes[3][0]).to.equal('A');
      expect(configs.notes[3][12]).to.equal('A');
    });

    it(`formats custom tuning notes by "presuming" that anything other than #, ${sharpSymbol}, or ${flatSymbol} is a flat`, () => {
      let dFlat = `C${sharpSymbol}`;
      let dFlatArray = [dFlat, `D${flatSymbol}`]
      let tuning = ['cb', 'e#', 'df', 'a', 'D', `A${sharpSymbol}`];
      Object.assign(configs, {accidentalFormat: 'flatAndSharp', tuning});
      assignNotesAndStartingValues(configs);
      expect(configs.notes[2][0]).to.equal(dFlat);
      expect(configs.notes[2][12]).to.eql(dFlatArray);      
    });
  });

  describe('Using generateNotesDataset()', () => {
    it('is used just to generate notes', () => {
      let configs = {strings: ['1'], frets: ['0']};
      let {notes} = generateNotesDataset(configs);
      expect(notes).to.eql({1: {0: 'B'}});
    });

    it('uses default settings when no configs are provided', () => {
      let {notes} = generateNotesDataset();
      expect(Object.keys(notes).length).to.equal(standardTuning.length);
      expect(Object.keys(notes[0]).length).to.equal(MAX_FRETS);
    });
  });
});
