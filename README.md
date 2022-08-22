# fretology-engine

## Introduction

This library was written as a primary dependency for fretboard-learning applications.
`fretology-engine` fulfills two objectives: (1) generation of custom arrangement of 
fretboard notes and (2) note selection from the built dataset.  Datasets can consist
of natural, accidental, or both types of notes and be limited to specific strings and 
frets.  The library uses standard guitar tuning (E-A-D-G-B-E) by default and can use 
any custom tuning.  Notes by default are grouped by strings and can also be grouped 
by frets.  Note picking from a dataset can be purely random or progress on a 
string-by-string or fret-by-fret basis.  For the latter modes, a string or a fret is 
picked and notes within are selected exhaustively, before selection moves to the next 
string or fret.  When using the string or fret progression, strings or frets can be 
chosen randomly or sequentially (ascendingly or descendingly).  Notes within a string
or a fret can also be chosen randomly or sequentially.  Starting strings or frets
can be random, highest, lowest or middle.

## Installation

```
npm install --save fretology-engine
```

## Usage

### Notes Generation

The library exports `assignNotesAndStartingValues` function.  The method accepts a
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
  * `random` or `string` instructs to group notes by strings
  * `fret` setting directs grouping of notes by frets
* **`natural`**
  * indicates whether to include natural notes
  * possible values: `true` or `false`
  * default: `true`
* **`accidental`**
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
  * default: `25`
  * The number must include fret `0` (open strings).  For a 21-fret arrangement,
    `maxFrets` should be `22`
  * `maxFrets` is ignored when `frets` setting is provided
* **`tuning`**
  * defines base notes from which a dataset is built
  * default: `['E', 'B', 'G', 'D', 'A', 'E']` (highest pitched string is 
    first)  
  * The first value in a `tuning` array should correspond to a highest-pitched
    string
  * If a number of `strings` setting exceeds a number of strings in a `tuning`,
    the library will error out
    
#### Example: Generating Default Dataset

```javascript
import {assignNotesAndStartingValues} from 'fretology-engine';

let configs = assignNotesAndStartingValues();
/* 
 * configs now includes notes and notesNotUsed
 * datasets with natural and accidental notes
 * based on the standard guitar tuning for 24 
 * frets and grouped by strings from highest- 
 * to lowest-pitched
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
  printing notes['2'] (for C-string) should provide the following output:

  {
    0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B', 12: 'C'
  }
*/
```

### Setting Starting String and/or Fret

When `string` or `fret` progression is used, it is possible to select from
which string and/or fret note selection would start.

Starting string and/or fret selection is affected by these configuration
properties.

* **`startingString`**
  * sets from which string to start note selection
  * possible values: `random`, `lowest`, `highest`, or `middle`
  * default: `random`
  * When `progression` is by `fret`, a fret is selected first and then
    string selection begins in accordance with `startingString` setting
  * `lowest` and `highest` denote string numbers and **not** pitch; whenever
    all strings are used, `lowest` is string `0` which is the highest-pitched
    string and `highest` string is the reverse
  * When `middle` setting is used and there is an even number of strings,
    one of the two strings closest to the middle is randomly selected
* **`startingFret`**
  * selects from which fret note selection starts
  * possible values: `random`, `lowest`, `highest`, or `middle`
  * default: `random`
  * When `progression` is by `string`, a string is selected first and then
    fret selection starts as directed by `startingFret` configuration
  * `lowest` denotes a fret closest to the neck of an instrument, `highest`
    indicates a fret nearest to an instrument's bridge
  * When `middle` setting is used and there is an even number of frets, one
    of the two frets right by the midpoint is selected at random

After configurations are processed by `assignNotesAndStartingValues` function,
starting `string` and `fret` are written to the configuration object to be
subsequently used by the note-picking method that `fretology-engine` provides.

#### Example

```javascript
import {assignNotesAndStartingValues} from 'fretology-engine';

let configs = {
  progression: 'string', 
  startingString: 'highest', 
  startingFret: 'middle'
};

assignNotesAndStartingValues(configs);
console.log(configs.string); //should be '5'  (the low-E string)
console.log(configs.fret);   //should be '12' (midpoint of 25 [include open strings] frets)
```

### Note Selection

The library provides `pickNote` function that takes `configs` object after
it has been augmented with the necessary data by `assignNotesAndStartingValues`
method.  `pickNote`, with each call, returns an object with previously-not-picked
`string` and `fret` values and their corresponding `note`.  Note picking can
be done purely randomly, purely sequentially, or both randomly and sequentially
when selecting a string and fret.

#### Purely Random Selection

`progression` set to `random` directs `pickNote` to select a string and a fret
randomly from the `notesNotUsed`.  `startingString`, `startingFret`, and other
selection-related settings are ignored.

```javascript
import {assignNotesAndStartingValues, pickNote} from 'fretology-engine';

let configs = assignNotesAndStartingValues();
let {string, fret, note} = pickNote(configs);
//string should be between '0' and '5'
//fret should be between '0' and '24'
//note should be a value appropriate for the selected string and fret
```

#### Not Purely Random Selection

`progression` set to `string` or `fret` allows selected fretboard
notes traversed a string or fret at a time.  Note picking within a string
or fret continues until all notes within are used up.  Selection then
moves to a next string or fret.

Progression from string to string and/or fret to fret is directed by the
following configurations:

* **`stringProgression`**
  * directs how a next string is picked
  * possible values: `random`, `1`, or `-1`
  * default: `random`
  * `random` instructs to select randomly out of the available strings
  * `1` specifies to take a currently selected string and ascendingly
    go to the next one; e.g., if the first-selected string is `5` (for
    a six-string instrument), then the next would be `0`, and the next 
    would be `1`
  * `-1` denotes descending selection; e.g., if the first-selected
    string is `0` (for a six-string instrument), then the next would
    be `5`, and the next would be `4`
* **`fretProgression`**
  * specifies how a next fret is selected
  * possible values: `random`, `1`, or `-1`
  * default: `random`
  * `random`, `1`, and `-1` settings would have the same effect as
    described above

##### Example: Purely Sequential Selection

```javascript
import {assignNotesAndStartingValues, pickNote} from 'fretology-engine';

let configs = {
  progression: 'string',
  frets: [0, 1],
  startingString: 'lowest', 
  startingFret: 'highest',
  stringProgression: 1,
  fretProgression: -1
};

assignNotesAndStartingValues(configs);

let {string, fret, note} = pickNote(configs); //string is '0', fret is '1', note is 'F' 
({string, fret, note} = pickNote(configs));   //string is '0', fret is '0', note is 'E'
({string, fret, note} = pickNote(configs));   //string is '1', fret is '1', note is 'C'
({string, fret, note} = pickNote(configs));   //string is '1', fret is '0', note is 'B'
({string, fret, note} = pickNote(configs));   //string is '2', fret is '1', note is 'G#'
({string, fret, note} = pickNote(configs));   //string is '2', fret is '0', note is 'G'
```

##### Example: Sequential and Random Selection

```javascript
import {assignNotesAndStartingValues, pickNote} from 'fretology-engine';

let configs = {
  progression: 'string',
  frets: [0, 1],
  startingString: 'lowest', 
  stringProgression: 1,
  fretProgression: 'random'
};

assignNotesAndStartingValues(configs);

let {string, fret, note} = pickNote(configs); //string is '0', fret is '0' or '1', note is 'E' or 'F'
({string, fret, note} = pickNote(configs));   //string is '0', fret is '0' or '1', note is 'E' or 'F'
({string, fret, note} = pickNote(configs));   //string is '1', fret is '1' or '0', note is 'C' or 'B'
({string, fret, note} = pickNote(configs));   //string is '1', fret is '1' or '0', note is 'C' or 'B'
({string, fret, note} = pickNote(configs));   //string is '2', fret is '0' or '1', note is 'G' or 'G#'
({string, fret, note} = pickNote(configs));   //string is '2', fret is '0' or '1', note is 'G' or 'G#'
```

##### Example: Random Fret and String Selection

```javascript
import {assignNotesAndStartingValues, pickNote} from 'fretology-engine';

let configs = {
  progression: 'fret',
  frets: [0, 1, 2],
  strings: [0, 1, 2],
  startingString: 'lowest', 
  startingFret: 'lowest',
  stringProgression: 'random',
  fretProgression: 'random'
};

assignNotesAndStartingValues(configs);

let {string, fret, note} = pickNote(configs); //fret is '0', string is '0', note is 'E'
({string, fret, note} = pickNote(configs));   //fret is '0', string is '1' or '2', note is 'B' or 'G'
({string, fret, note} = pickNote(configs));   //fret is '0', string is '1' or '2', note is 'B' or 'G'
({string, fret, note} = pickNote(configs));   //fret is '1' or '2', string is '0', note is 'F' or 'F#'
({string, fret, note} = pickNote(configs));   //fret is '1' or '2', string is '1' or '2', note is 'C', 'G#', 'C#', or 'A'
({string, fret, note} = pickNote(configs));   //fret is '1' or '2', string is '1' or '2', note is 'C', 'G#', 'C#', or 'A'
({string, fret, note} = pickNote(configs));   //fret is '1' or '2', string is '0', note is 'F' or 'F#'
({string, fret, note} = pickNote(configs));   //fret is '1' or '2', string is '1' or '2', note is 'C', 'G#', 'C#', or 'A'
({string, fret, note} = pickNote(configs));   //fret is '1' or '2', string is '1' or '2', note is 'C', 'G#', 'C#', or 'A'
```

## Caveats

Accidentals in the `notes` and `notesNotUsed` datasets are presented
as sharps.  B-flat (Bb) is listed as A-sharp (A#).  Whenever a `note`
selection is returned by `pickNote` method, it will as a sharp.  If
note normalization is required, `fretology-engine` exports
`normalizeNote` method.  It will convert a flat into a sharp.  A C-
or F-flat will be converted to a B or E, respectively.  A B-sharp or
E-sharp will be normalized to a respective C or F.  By default,
`normalizeNote` will capitalize a note.  An accidental note that does
not include a pound sign (`#`) as the second character will be treated
as a flat.

```javascript
import {normalizeNote} from 'fretology-engine';

console.log(normalizeNote('db'));       //should print C#
console.log(normalizeNote('B#'))        //should print C
console.log(normalizeNote('fb'))        //should print E
```

All of the notes that the library generates are uppercased.  Whenever
a note selected by `pickNote` is compared to a note within an application
that uses `fretology-engine` as a dependency, the application note should
be capitalized or the selected note lowercased.

Magnitude of string numbers does not indicate pitch but rather a
position.  String `0` is the lowest string from the bottom of a fretboard
and highest by pitch.  Whenever `startingString` configuration is set,
`lowest`, `highest`, or `middle` setting also indicates an order and not
a pitch.

The first string in the `tuning` configuration likewise indicates a position
and not a frequency.  Standard guitar tuning is defined within the library as
`['E', 'B', 'G', 'D', 'A', 'E']` and not as `['E', 'A', 'D', 'G', 'B', 'E']`
that is commonly listed in music materials.  Any custom tuning used should
list its first open string as the one at the bottom of the fretboard.

## Future Features

Along with `notes` and `notesNotUsed`, it may be useful to include `notesUsed`
dataset.  Perhaps some visual applications may use the latter to highlight
the notes that have already been picked.

One of the next versions of the `fretology-engine` will include a learning
mode.  Notes that are picked incorrectly or selected correctly, but with
above-average deliberation time, should be shown more often during a training
session compared to the notes that are chosen correctly and quickly.

## Contributing

Bug fixes and new features are welcome.  When adding new functionality, use
the latest ECMAScript constructs, pair the new code with tests with complete
coverage, and include appropriate documentation.
