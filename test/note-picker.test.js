import {expect}                           from 'chai';
import sinon                              from 'sinon';
import {stringNumbers, fretNumbers}       from '../src/_lib/configs';
import {assignNotesAndDefaults, pickNote} from '../src';

describe('Note Picker', () => {
  describe('Default Behaviors', () => {
    let configs;
    let stringToUse = '0';

    beforeEach(() => {
      configs = {progression: 'random', strings: [stringToUse], sharp: true, whole: true};
      assignNotesAndDefaults(configs);
    })

    it('returns string, fret, and note object', () => {
      let {string, fret, note} = pickNote(configs);
      expect(string).to.equal(stringToUse);
      expect(fretNumbers.includes(fret)).to.be.true;
      expect(/^[A-G]#?$/.test(note)).to.be.true;
    });

    it('selects a note from notesNotUsed and then deletes it from the dataset', () => {
      let pickFrom = 4;
      fretNumbers.slice(pickFrom).forEach(() => pickNote(configs));
      expect(Object.keys(configs.notesNotUsed[stringToUse]).length).to.equal(pickFrom);
    });

    it('replaces notesNotUsed afresh once all notes have been used', () => {
      fretNumbers.forEach(() => pickNote(configs));
      expect(configs.notes).to.eql(configs.notesNotUsed);
    });
  });

  describe('Random Progression', () => {
    it('picks a string and a fret randomly', () => {
      let spy = sinon.spy(Math, 'random');
      let strings = ['0', '1'];
      let frets = fretNumbers.slice(12);
      let configs = {progression: 'random', sharp: true, whole: true, strings, frets};
      assignNotesAndDefaults(configs);
      strings.forEach(() => frets.forEach(() => pickNote(configs)));
      expect(spy.callCount).to.equal(strings.length * frets.length * 2);
      spy.restore();
    });
  });

  describe('String Progression', () => {
    describe('Random String Progression', () => {
      let configs;

      beforeEach(() => configs = {progression: 'string', stringProgression: 'random', whole: true});

      it('assigns a random string whose frets are to be fully used before moving to a next string', () => {
        let uniqueStrings = new Set();
        assignNotesAndDefaults(configs);
  
        Object.values(configs.notes).forEach((stringNotes) => {
          Object.values(stringNotes).forEach(() => {
            let {string} = pickNote(configs);
            uniqueStrings.add(string);
          });
        });
  
        expect(uniqueStrings.size).to.equal(stringNumbers.length);
        expect([...uniqueStrings]).to.not.eql(stringNumbers);
      });

      it('uses assigned starting string and then picks a string randomly', () => {
        let uniqueStrings = new Set();
        configs.startingString = 'highest';
        assignNotesAndDefaults(configs);

        Object.values(configs.notes).forEach((stringNotes) => {
          Object.values(stringNotes).forEach(() => {
            let {string} = pickNote(configs);
            uniqueStrings.add(string);
          });
        });

        uniqueStrings = [...uniqueStrings];
        expect(uniqueStrings[0]).to.equal(stringNumbers[stringNumbers.length - 1]);
        expect(uniqueStrings).to.not.eql(stringNumbers);
      });
    });

    describe('Sequential String Progression', () => {
      let configs;

      beforeEach(() => configs = {progression: 'string', startingString: 'lowest', stringProgression: 1, whole: true});

      it('selects a string sequentially in ascending order', () => {
        let uniqueStrings = new Set();
        assignNotesAndDefaults(configs);

        Object.values(configs.notes).forEach((stringNotes) => {
          Object.values(stringNotes).forEach(() => {
            let {string} = pickNote(configs);
            uniqueStrings.add(string);
          });
        });

        expect([...uniqueStrings]).to.eql(stringNumbers);
      });

      it('selects a string sequentlly in descending order', () => {
        let uniqueStrings = new Set();
        configs.stringProgression = -1;
        assignNotesAndDefaults(configs);

        Object.values(configs.notes).forEach((stringNotes) => {
          Object.values(stringNotes).forEach(() => {
            let {string} = pickNote(configs);
            uniqueStrings.add(string);
          });
        });

        expect([...uniqueStrings]).to.eql(stringNumbers.slice(0, 1).concat(stringNumbers.slice(1).reverse()));
      });
    });
  });

  describe('Fret Progression', () => {
    describe('Random Fret Progression', () => {
      let configs;

      beforeEach(() => configs = {progression: 'fret', fretProgression: 'random', whole: true, sharp: true});

      it('assigns a random fret whose strings are to be fully used before moving to a next fret', () => {
        let uniqueFrets = new Set();
        assignNotesAndDefaults(configs);
  
        Object.values(configs.notes).forEach((fretNotes) => {
          Object.values(fretNotes).forEach(() => {
            let {fret} = pickNote(configs);
            uniqueFrets.add(fret);
          });
        });
  
        expect(uniqueFrets.size).to.equal(fretNumbers.length);
        expect([...uniqueFrets]).to.not.eql(fretNumbers);
      });

      it('uses assigned starting fret and then picks a fret randomly', () => {
        let uniqueFrets = new Set();
        configs.startingFret = 'highest';
        assignNotesAndDefaults(configs);

        Object.values(configs.notes).forEach((fretNotes) => {
          Object.values(fretNotes).forEach(() => {
            let {fret} = pickNote(configs);
            uniqueFrets.add(fret);
          });
        });

        uniqueFrets = [...uniqueFrets];
        expect(uniqueFrets[0]).to.equal(fretNumbers[fretNumbers.length - 1]);
        expect(uniqueFrets).to.not.eql(fretNumbers);
      });
    });

    describe('Sequential Fret Progression', () => {
      let configs;

      beforeEach(() => configs = {progression: 'fret', startingFret: 'lowest', fretProgression: 1, whole: true, sharp: true});

      it('selects a fret sequentially in ascending order', () => {
        let uniqueFrets = new Set();
        assignNotesAndDefaults(configs);

        Object.values(configs.notes).forEach((fretNotes) => {
          Object.values(fretNotes).forEach(() => {
            let {fret} = pickNote(configs);
            uniqueFrets.add(fret);
          });
        });

        expect([...uniqueFrets]).to.eql(fretNumbers);
      });

      it('selects a string sequentlly in descending order', () => {
        let uniqueFrets = new Set();
        configs.fretProgression = -1;
        assignNotesAndDefaults(configs);

        Object.values(configs.notes).forEach((fretNotes) => {
          Object.values(fretNotes).forEach(() => {
            let {fret} = pickNote(configs);
            uniqueFrets.add(fret);
          });
        });

        expect([...uniqueFrets]).to.eql(fretNumbers.slice(0, 1).concat(fretNumbers.slice(1).reverse()));
      });
    });
  });


});
