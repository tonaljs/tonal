# Tonal documentation

This folder contains the documentation of tonal.

## Library overview

Tonal is a collection of functions, grouped by modules. Each module has functions related to the same problem:

- pitch: create and manipulate pitches. Get pitch properties like pitchClass, midi number or frequency. For apps dealing with midi (and nothing more) a couple of functions of this module is all you need.
- interval: create and manipulate intervals. Since most of the time you will write interval strings you probably won't need anything of this (except, maybe, `simplify` to convert compound intervals to simple ones)
- chord and scales: a dictionary of chord and scales
- sequence: create arrays of events (mostly pitches) easily. A `pitchSet` function to create pitch class sets is included.
- key: work with keys and key signatures

The most important function of each module (if any) is called the same as the module: `pitch/pitch`, `scale/scale`, ...

The sequences are almost sugar to work with arrays:

```js
var sequence = require('tonal/sequence/sequence')
var set = require('tonal/sequence/pitchSet')
sequence('A B C').map(transpose('5P')) // => ['E5', 'F#5', 'G4']
set(sequence('A B C').map(transpose('3M'))) // => ['E', 'F#', 'G']
```
