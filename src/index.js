export {pickNote}                 from './note-picker/note-picker';
import {generateNotesDataset}     from './note-generator/note-generator';
import {setStartingStringAndFret} from './starting-values-initializer/starting-values-initializer';
import {cloneDeep}                from './_lib/utils';

export function assignNotesAndStartingValues(configs = {}) {
  let notes = generateNotesDataset(configs);
  Object.assign(configs, {notes, notesNotUsed: cloneDeep(notes)});
  setStartingStringAndFret(configs);
  return configs;
}

export {generateNotesDataset};
