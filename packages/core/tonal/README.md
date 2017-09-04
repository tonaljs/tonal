# tonal [![npm](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master&style=flat-square)](https://travis-ci.org/danigb/tonal) [![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg?style=flat-square)](https://codeclimate.com/github/danigb/tonal) [![license](https://img.shields.io/npm/l/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)
[![codecov](https://codecov.io/gh/danigb/tonal/branch/master/graph/badge.svg)](https://codecov.io/gh/danigb/tonal)



`tonal` is a functional music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

Think like an [underscorejs](http://underscorejs.org/) (or better: [ramdajs](http://ramdajs.com/)) library for music theory.

[Read the API documentation](http://danigb.github.io/tonal/api/)

Warning: although this library has some time now, the API is still changing.

![stability](https://img.shields.io/badge/stability-experimental-red.svg?style=flat-square)

## Example

```js
var tonal = require('tonal')

// note properties
tonal.note.chroma('Cb') // => 11
tonal.note.pc('Db5') // => 'Db'
tonal.note.simplify('B#3') // => 'C4'
tonal.note.freq('C#3') // => 138.59
tonal.note.midi('A4') // => 69
tonal.note.fromMidi(69) // => 'A4'

// interval properties
tonal.ivl.semitones('5P') // => 7
tonal.ivl.invert('3m') // => '6M'
tonal.ivl.fromSemitones(7) // => '5P'

// transposition and distances
tonal.transpose('D4', '2M') // => 'E#4'
tonal.interval('C', 'G') // => '5P'
tonal.semitones('C', 'G') // => 7

// scales
tonal.scale('Bb lydian') // => [ 'Ab', 'Bb', 'C', 'D', 'Eb', 'F', 'G' ]
tonal.scale('Eb bebop') // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
tonal.scale.names()
tonal.scale.detect('Bb4 Eb4 C5 G4 Bb4 F6') // => ['Eb major pentatonic']

// chords
tonal.chord('Fm7b5') // => [ 'F', 'Ab', 'Cb', 'Eb' ]
tonal.chord.names()
tonal.chord.detect('g f# d b') // => [ 'GMaj7' ]

// partial application
var fifthUp = tonal.transpose('P5')
fifthUp('c3') // => 'G3'
tonal.scale('G melodic minor').map(tonal.transpose('m3')) // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'G', 'A' ]

// map lists
tonal.map(tonal.note.pc, 'C2 Eb5 gx4') // => ['C', 'Eb', 'G##']
tonal.map(tonal.transpose('3M'), 'c d e') // => ['E4', 'F#4', 'G#4']

// lift functions
var toPitchClasses = tonal.map(tonal.note.pc)
toPitchClasses('C2 db3 e5') // => ['C', 'Db', 'E']
var fifthUpAll = tonal.map(tonal.transpose('5P'))
fifthUpAll('c d e') // => ['G', 'A', 'B']

// Create complex note ranges: from C4 up to F4 and then down to D4
tonal.range.chromatic('C4, F4, D4') // => [ 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'E4', 'Eb4', 'D4' ]
// Filter ranges to certain notes: from C3 to C4 and back to C3 , using only C Eb G and Bb notes
tonal.range.pitchSet('C Eb G Bb', ['C3', 'C4', 'C3']) // => ['C3', 'Eb3', 'G3', 'Bb3', 'C4', 'Bb3', 'G3', 'Eb3', 'C3']

// harmonize a note with a list intervals
tonal.harmonize('1P 3m 5d', 'C') // => ['C', 'Eb', 'Gb']
// or a list of a notes with an interval
tonal.harmonize('c d e', 'M3') // => ['E', 'F#', 'G']
// partial application
var maj7 = tonal.harmonize('1P 3M 5P 7M')
maj7('C2') // => ['C2', 'E2', 'G2', 'B2']

// extract intervals
tonal.harmonics('C Eb G Bb') // => ['1P', '3m', '5P', '7m']

// work with chord progressions
tonal.progression.abstract('Cmaj7 Dm7 G7', 'C') // => ['Imaj7', 'IIm7', 'V7']
```

Because tonal makes heavy use of functional concepts, there's a few things that are not so common inside JS space, so take in mind that:

- there are no objects. Only functions that performs transformations on data.
- notes and intervals are represented using strings.
- most of the functions are currified, so you can partially applied them: it means that if you don't pass all the arguments, you get another function that accepts the rest of the parameters. For example `transpose` function accepts two arguments, the note and the interval, but sometimes is useful to pass only one: `['C', 'D', 'E'].map(tonal.transpose('P5'))`
- the `tonal` module is a facade of the rest of the modules. If you are concerned about code size, you can import only the required modules.
- within the `tonal` facade, most (but not all) of the functions are namespaced to the name of the module. For example, to use the `chromatic` function of `tonal-range` module, you must write `tonal.range.chromatic`. The modules that are not namespaced are `array`, `transpose` and `distance`
- the code is written using ES6 module system (and converted to ES5 modules using [rollup](http://rollupjs.org)). It means that if you use ES6 modules you can get some benefits like code tree shaking, for example. Anyway, they are fully compatible with ES5 modules.

## Features

`tonal` is still a work in progress, but currently has implemented:

- Note, intervals, transposition, distances, enharmonics
- Midi and frequency conversion
- Scales, chords, dictionaries
- Utilities to work with collection of notes: sort, filter, rotate, shuffle.
- Pitch sets comparations, chord and scale detection
- Keys, keys signatures, key scales
- Chord progressions
- Pitch and pitch class sets

## Philosophy

This library is evolving with this ideas in mind:

- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- Notes and intervals are represented with strings, instead of objects.
- Carefully written: small, fast and modular.
- Different notations: scientific notation by default. Helmholtz coming soon.
- Documented: all public functions are fully documented inside the code. Read the generated API documentation [here](http://danigb.github.io/tonal/api/)
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: every public method is tested with coverage support.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...

## Install

Using yarn: `yarn add tonal` (or a single module: `yarn add tonal-scale`)

Using npm: `npm install --save tonal` (or: `npm install --save tonal-scale`)

Browser:

```html
<script src="tonal.min.js"></script>
```

## Usage

ES6:

```js
import tonal from 'tonal' 
tonal.transpose('C4', '3M')
```

ES5:

```js
var tonal = require('tonal')
tonal.tranpose('C4', '2m')
```

Browser (use the `Tonal` global object):

```html
<script>
  console.log(Tonal.transpose('C4', '8P'))
</script>
```

## Why

Mostly, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

I want to learn about music theory and I want to express the conpcets I learn using functional programming style.

Also, I want a complete library, where I can model some (for me) esoteric features like [interval classes](http://danigb.github.io/tonal/api/module-interval.html#.ic), pitch sets, dft to pitch class sets, and so on.

## What

Tonal itself is built from a collection of [packages](https://github.com/danigb/tonal/tree/master/packages).

Please [read the generated API documentation here](http://danigb.github.io/tonal/api/) to get an overview.

## Build, test and documentation

It's a multipackage module that uses [lerna](https://github.com/lerna/lerna) to manage.

To build the library from the first time use `npm run init`

To run the tests: `npm run test`

The distributable `tonal.min.js` file is generated with `npm run dist`

The documentation can be generated with: `npm run docs`

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- Sharp11: https://github.com/jsrmath/sharp11

## License

MIT License
