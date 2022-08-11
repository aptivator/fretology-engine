# fretology-engine

### Introduction

This library was written as a primary dependency for freboard-learning applications.  `fretology-engine` fulfills two objectives: generation of custom
arrangement of fretboard notes and note selection from the built dataset.
Datasets can consist of of whole, flat/sharp, or both types of notes and be limited
to specific strings and frets.  The library uses standard guitar tuning (E-A-D-G-B-E)
by default and can use any custom tuning.  Notes by default are grouped by strings
and can also be grouped by frets.

Note picking from a dataset can be purely random or progress on a string-by-string
or fret-by-fret basis.  For the latter modes, a string or a fret is picked and notes
within are selected exhaustively, before selection moves to a next string or fret.
When using the string or fret progression, strings or frets can be chosen randomly or
sequentially.  Notes within a string or a fret can also be chosen randomly or
sequentially.  Starting strings or frets can be random, highest, lowest or middle.

### Installation

```
npm install --save fretology-engine
```

### Usage

#### Notes Generation

#### Note Picking

### Caveats

Highest-pitched string is the first string
The app comes with a maximum of 24 frets

### Future Features

Learning mode
