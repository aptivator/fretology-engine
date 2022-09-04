export {pickNote}                 from './note-picker/note-picker';
export {normalizeNote}            from './note-generator/_lib/note-generator-utils';
import {generateNotesDataset}     from './note-generator/note-generator';
import {setStartingStringAndFret} from './starting-values-initializer/starting-values-initializer';
import {cloneDeep}                from './_lib/utils';

export function assignNotesAndStartingValues(configs = {}) {
  let {notes, notesArray} = generateNotesDataset(configs);
  Object.assign(configs, {notes, notesArray, notesNotUsed: cloneDeep(notes)});
  setStartingStringAndFret(configs);
  return configs;
}

export {generateNotesDataset};
