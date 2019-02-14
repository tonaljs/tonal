# tonal [![npm](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master&style=flat-square)](https://travis-ci.org/danigb/tonal) [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)
[![codecov](https://codecov.io/gh/danigb/tonal/branch/master/graph/badge.svg)](https://codecov.io/gh/danigb/tonal)

`tonal` is a small (20kb minified, 6kb gzipped) javascript modular music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

It uses a functional programing style: all functions are pure, there is no data mutation, entities are represented by data structures instead of objects, and lot of functions accept partial application.

#### [Demo](https://danigb.github.io/tonal-app/)

#### [API documentation](http://danigb.github.io/tonal/)

## Examples

Basic usage:

```js
import { midi, transpose, scale } from "tonal";

midi("c4"); // => 60
transpose("d4", "3M"); // => 'F#4'
scale("major").map(transpose("C2")); // => ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2']
```

Tonal modules:

```js
import { Note, Interval, Distance, Scale, Chord } from "tonal";

// note properties
Note.chroma("Cb"); // => 11
Note.pc("Db5"); // => 'Db'
Note.freq("C#3"); // => 138.59
Note.midi("A4"); // => 69
Note.fromMidi(69); // => 'A4'
Note.from({ alt: 2 }, "C4"); // => 'C##4'
Note.from({ oct: 2 }, "C4"); // => 'C2'

// interval properties
Interval.semitones("5P"); // => 7
Interval.invert("3m"); // => '6M'
Interval.fromSemitones(7); // => '5P'

// distances
Distance.transpose("D4", "2M"); // => 'E#4'
Distance.interval("C", "G"); // => '5P'
Distance.semitones("C", "G"); // => 7

// scales
Scale.notes("Bb lydian"); // => [ 'Bb', 'C', 'D', 'E', 'F', 'G', 'A']
Scale.notes("Eb bebop"); // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
Scale.names(); // => ["major", "minor", "bebop", ... and 90 more]

// chords
Chord.notes("Fm7b5"); // => [ 'F', 'Ab', 'Cb', 'Eb' ]
Chord.names(); // => ['M', 'm', 'm7b5', ... and 100 more]
```

Extensions modules:

```js
import * as Key from "tonal-key";

Key.chord("Bb major"); // => ["BbMaj7", "Cm7", "Dm7", "EbMaj7", "F7", "Gm7", "Am7b5W]
```

## Features

`tonal` is still a work in progress, but currently has implemented:

- Note, intervals, transposition, distances, enharmonics, midi, frecuency [`tonal-note`](https://danigb.github.io/tonal/module-Note.html)
- Scales and chords, dictionaries [`tonal-dictionary`](https://danigb.github.io/tonal/module-Dictionary.html)
- Utilities to work arrays of notes: sort, filter, rotate, shuffle [`tonal-array`](https://danigb.github.io/tonal/module-Array.html)
- Pitch sets comparations, chord and scale detection [`tonal-pcset`](https://danigb.github.io/tonal/module-PcSet.html)

In [extensions](https://github.com/danigb/tonal/tree/master/extensions):

- Keys, keys signatures, key scales [`tonal-key`](https://danigb.github.io/tonal/module-Key.html)
- Complex note range generation [`tonal-range`](https://danigb.github.io/tonal/module-Range.html)
- Chord progressions
- Enharmonics

## Philosophy

This library is evolving with this ideas in mind:

- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- Notes and intervals are represented with strings, instead of objects.
- Carefully written: small, fast and modular.
- Documented: all public functions are fully documented inside the code. Read the generated API documentation [here](http://danigb.github.io/tonal/)
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: every public method is tested with coverage support.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...

## Install

Using yarn: `yarn add tonal` (or a single module: `yarn add tonal-scale`)

Using npm: `npm install --save tonal` (or: `npm install --save tonal-scale`)

Browser: grab the minified file [here](https://github.com/danigb/tonal/blob/master/dist/tonal.min.js) (20kb) and include it in your html page (use a `Tonal` global object)

```html
<script src="tonal.min.js"></script>
```

## Usage

ES6:

```js
import { transpose, Scale } from "tonal";
transpose("C4", "3M");
Scale.notes("Db major");
```

ES5:

```js
var Tonal = require("tonal");
Tonal.transpose("C4", "2m");
Tonal.Scale.notes("Bb minor");
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
> [\*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

I want to learn about music theory and I want to express the concepts I learn using functional programming style.

Also, I want a complete library, where I can model some (for me) esoteric features like [interval classes](http://danigb.github.io/tonal/module-Interval.html#.ic), pitch sets, dft to pitch class sets, and so on.

## What

Tonal itself is built from a collection of [packages](https://github.com/danigb/tonal/tree/master/packages).

Please [read the generated API documentation here](http://danigb.github.io/tonal/) to get an overview.

## Build, test and documentation

It's a multipackage module that uses [lerna](https://github.com/lerna/lerna) to manage.

To build the library from the first time use `npm run init` or `yarn`

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
