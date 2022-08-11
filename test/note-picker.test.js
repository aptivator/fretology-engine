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

  describe('String And Fret Progression', () => {
    describe('Random Progression', () => {
      let conditions = [{
        primary: 'string',
        secondary: 'fret',
        primaries: stringNumbers,
        startingProperty: 'startingString',
        configs: {progression: 'string', stringProgression: 'random', whole: true}
      }, {
        primary: 'fret',
        secondary: 'string',
        primaries: fretNumbers,
        startingProperty: 'startingFret',
        configs: {progression: 'fret', fretProgression: 'random', whole: true, sharp: true}
      }];

      conditions.forEach(({primary, secondary, primaries, startingProperty, configs}) => {
        it(`assigns a random ${primary} whose ${secondary}s are to be fully used before moving to a next ${primary}`, () => {
          let uniques = new Set();
          assignNotesAndDefaults(configs);
    
          Object.values(configs.notes).forEach((notes) => {
            Object.values(notes).forEach(() => {
              let {[primary]: value} = pickNote(configs);
              uniques.add(value);
            });
          });

          expect(uniques.size).to.equal(primaries.length);
          expect([...uniques]).to.not.eql(primaries);
        });
        
        it(`uses assigned starting ${primary} and then picks a ${primary} randomly`, () => {
          let uniques = new Set();
          configs[startingProperty] = 'highest';
          assignNotesAndDefaults(configs);
  
          Object.values(configs.notes).forEach((notes) => {
            Object.values(notes).forEach(() => {
              let {[primary]: value} = pickNote(configs);
              uniques.add(value);
            });
          });
  
          uniques = [...uniques];
          expect(uniques[0]).to.equal(primaries[primaries.length - 1]);
          expect(uniques).to.not.eql(primaries);
        });        
      });
    });

    describe('Sequential Progression', () => {
      let conditions = [
        {primary: 'string', secondary: 'fret', startingPoint: 'lowest', individualProgression: 1}, 
        {primary: 'fret', secondary: 'string', startingPoint: 'highest', individualProgression: -1}
      ];

      conditions.forEach(({primary, secondary, startingPoint, individualProgression}) => {
        let asc = individualProgression === 1;
        let order = asc ? 'ascending': 'descending';

        it(`selects ${primary} and ${secondary} sequentially in ${order} order from a ${startingPoint} starting point`, () => {
          let uniqueStrings = new Set();
          let uniqueFrets = new Set();
          let strings = stringNumbers.slice();
          let frets = fretNumbers.slice();
          let configs = {
            progression: primary, 
            startingString: startingPoint,
            stringProgression: individualProgression,
            startingFret: startingPoint,
            fretProgression: individualProgression,
            sharp: true,
            whole: true
          };

          if(!asc) {
            strings.reverse();
            frets.reverse();
          }

          assignNotesAndDefaults(configs);

          Object.values(configs.notes).forEach((notes) => {
            Object.values(notes).forEach(() => {
              let {string, fret} = pickNote(configs);
              uniqueStrings.add(string);
              uniqueFrets.add(fret);
            });
          });

          expect([...uniqueStrings]).to.eql(strings);
          expect([...uniqueFrets]).to.eql(frets);
        });
      });
    });
  });
});
