# tonal [![npm](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master&style=flat-square)](https://travis-ci.org/danigb/tonal)  [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)
[![codecov](https://codecov.io/gh/danigb/tonal/branch/master/graph/badge.svg)](https://codecov.io/gh/danigb/tonal)



`tonal` is a javascript modular music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

It uses a functional programing style, so all are pure functions, there is no data mutation, and no objects.

See the [demo app](https://danigb.github.io/tonal-app/) or [read the API documentation](http://danigb.github.io/tonal/api/)

## Example

```js
var tonal = require('tonal')

// note properties
tonal.note.chroma('Cb') // => 11
tonal.note.pc('Db5') // => 'Db'
tonal.note.freq('C#3') // => 138.59
tonal.note.midi('A4') // => 69
tonal.note.fromMidi(69) // => 'A4'

// interval properties
tonal.ivl.semitones('5P') // => 7
tonal.ivl.invert('3m') // => '6M'
tonal.ivl.fromSemitones(7) // => '5P'

// distances
tonal.distance.transpose('D4', '2M') // => 'E#4'
tonal.distance.interval('C', 'G') // => '5P'
tonal.distance.semitones('C', 'G') // => 7

// scales
tonal.scale.notes('Bb lydian') // => [ 'Bb', 'C', 'D', 'E', 'F', 'G', 'A']
tonal.scale.notes('Eb bebop') // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
tonal.scale.names() // => ["major", "minor", "bebop", ... and 90 more]

// chords
tonal.chord.notes('Fm7b5') // => [ 'F', 'Ab', 'Cb', 'Eb' ]
tonal.chord.names() // => ['M', 'm', 'm7b5', ... and 100 more]

// partial application
var upFifth = tonal.transpose('P5')
upFifth('c3') // => 'G3'
tonal.scale.notes('G melodic minor').map(tonal.transpose('m3')) // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'G', 'A' ]
```

## Features

`tonal` is still a work in progress, but currently has implemented:

- Note, intervals, transposition, distances
- Midi and frequency conversion
- Scales, chords, dictionaries
- Utilities to work with collection of notes: sort, filter, rotate, shuffle.
- Pitch sets comparations, chord and scale detection
- Keys, keys signatures, key scales
- Pitch and pitch class sets

In [extensions](https://github.com/danigb/tonal-extensions):
- Complex note range generation
- Chord progressions
- Enharmonics

## Philosophy

This library is evolving with this ideas in mind:

- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- Notes and intervals are represented with strings, instead of objects.
- Carefully written: small, fast and modular.
- Documented: all public functions are fully documented inside the code. Read the generated API documentation [here](http://danigb.github.io/tonal/api/)
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: every public method is tested with coverage support.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...

## Install

Using yarn: `yarn add tonal` (or a single module: `yarn add tonal-scale`)

Using npm: `npm install --save tonal` (or: `npm install --save tonal-scale`)

Browser: grab the minified file [here](https://github.com/danigb/tonal/blob/master/dist/tonal.min.js) (26kb) and include it in your html page (use a `Tonal` global object)

```html
<script src="tonal.min.js"></script>
```

## Usage

ES6:

```js
import { distance } from 'tonal'
distance.transpose('C4', '3M')
```

ES5:

```js
var tonal = require('tonal')
tonal.distance.transpose('C4', '2m')
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

I want to learn about music theory and I want to express the concepts I learn using functional programming style.

Also, I want a complete library, where I can model some (for me) esoteric features like [interval classes](http://danigb.github.io/tonal/api/module-interval.html#.ic), pitch sets, dft to pitch class sets, and so on.

## What

Tonal itself is built from a collection of [packages](https://github.com/danigb/tonal/tree/master/packages).

Please [read the generated API documentation here](http://danigb.github.io/tonal/api/) to get an overview.

## Build, test and documentation

It's a multipackage module that uses [lerna](https://github.com/lerna/lerna) to manage.

To build the library from the first time use `npm run init`

To run the tests: `npm run test` or just `jest` if you have jest globally installed.

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
