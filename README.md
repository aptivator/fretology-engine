# fretology-engine

## Introduction

This library was written as a primary dependency for freboard-learning applications.
`fretology-engine` fulfills two objectives: (1) generation of custom arrangement of 
fretboard notes and (2) note selection from the built dataset.  Datasets can consist
of whole, flat/sharp, or both types of notes and be limited to specific strings and 
frets.  The library uses standard guitar tuning (E-A-D-G-B-E) by default and can use 
any custom tuning.  Notes by default are grouped by strings and can also be grouped 
by frets.  Note picking from a dataset can be purely random or progress on a 
string-by-string or fret-by-fret basis.  For the latter modes, a string or a fret is 
picked and notes within are selected exhaustively, before selection moves to the next 
string or fret.  When using the string or fret progression, strings or frets can be 
chosen randomly or sequentially (acendingly or descendingly).  Notes within a string
or a fret can also be chosen randomly or sequentially.  Starting strings or frets
can be random, highest, lowest or middle.

## Installation

```
npm install --save fretology-engine
```

## Usage

### Notes Generation

The library exports `assignNotesAndDefaults` function.  The method accepts a
configuration object that directs a type of dataset to build.  The generated notes
are added to a configuration object as `notes` and `notesNotUsed`.  The latter is
employed to determine which notes can be picked during a selection.  Once a note is
picked, it is removed from `notesNotUsed`.  When `notesNotUsed` is empty, it is
"refilled" with `notes`.  `notes`, parallel with `notesNotUsed`, is drawn upon during
sequential selection to determine the next string and/or fret to pick.

How a note dataset is built is affected by the following configuration properties:

* **`progression`**
  * determines grouping of notes in a dataset
  * possible values: `random`, `string`, or `fret`
  * default: `random`
  * `random` and `string` instruct to group notes by strings
  * `fret` setting directs grouping of notes by frets
* **`whole`**
  * indicates whether to include whole notes
  * possible values: `true` or `false`
  * default: `true`
* **`sharp`**
  * specifies whether to include flat/sharp notes
  * possible values: `true` or `false`
  * default: `true`
* **`strings`**
  * contains string numbers to include in a dataset
  * possible values: any string numbers from the highest (i.e., `0`) to the lowest
    pitched (depending on the instrument)
  * default: `['0', '1', '2', '3', '4', '5']` (string numbers for a 
    standard guitar tuning)
* **`frets`**
  * includes fret numbers to contain in a dataset
  * possible values: any fret numbers from the lowest (i.e., `0` [open string]) to
    whatever the highest fret that is desired
  * example: `['1', '2', '3', '13', '14', '15']`
* **`maxFrets`**
  * sets a maximum number of frets to use
  * NOTE: the number must include fret `0` (open strings).  For a 21-fret arrangement,
    `maxFrets` should be `22`
  * NOTE: `maxFrets` is ignored when `frets` setting is provided
  * default: `25`
* **`tuning`**
  * defines base notes from which a dataset is built
  * NOTE: the first value in a `tuning` array should correspond to a highest-pitched
    string
  * NOTE: if a number of `strings` setting exceeds a number of strings in a `tuning`,
    the library will error out
  * default: `['E', 'B', 'G', 'D', 'A', 'E']` (highest pitched string is 
    first)
    
#### Example: Generating Default Dataset

```javascript
import {assignNotesAndDefaults} from 'fretology-engine';

let configs = assignNotesAndDefaults();
/* 
 * configs now includes notes and notesNotUsed
 * datasets with whole and sharp notes based on
 * the standard guitar tuning for 24 frets and
 * grouped by strings from highest- to 
 * lowested-pitched
 */
```

#### Example: 12-Fret Ukulele Dataset

`fretology-engine` also exports `generateNotesDataset` function that accepts a
configuration object and returns just the `notes` dataset.

```javascript
import {generateNotesDataset} from 'fretology-engine';

let configs = {
  progression: 'string', 
  tuning: ['A', 'E', 'C', 'G'], 
  maxFrets: 13
};

let notes = generateNotesDataset(configs);
/*
  printing notes['2'] (for C-string) should provide the
  following output:

  {
    0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10:'A#', 11: 'B', 12: 'C'
  }
*/
```

### Setting Starting String and Fret

When `string` or `fret` progression is used, it is possible to set 

### Note Picking

#### Random Selection

#### Sequential Selection

```javascript
import {assignNotesAndDefaults, pickFret} from 'fretology-engine';

let configs = {
  progression: 'fret',
  startingFret: 'random',
  fretProgression: 'random',
  startingString: 'random',
  stringProgression: -1,
  strings: [0, 1],
  frets: Array.from({length: 23}, (v, i) => i).slice(1),
  tuning: ['Bb', 'A', 'Gb', 'D', 'A', 'Bb'],
  whole: true,
  sharp: true
};
```

### Caveats

Highest-pitched string is the first string
The app comes with a maximum of 24 frets
The first value in tuning array is the highest pitched string
maxFrets should include open strings (0th fret)

### Future Features

Learning mode
