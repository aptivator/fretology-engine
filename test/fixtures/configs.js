import {MAX_FRETS, standardTuning} from '../../src/_lib/configs';
import {getSequentialArray}        from '../../src/note-generator/_lib/note-generator-utils';

export const stringNumbers = getSequentialArray(standardTuning.length);
export const fretNumbers = getSequentialArray(MAX_FRETS);
