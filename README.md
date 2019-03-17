# tonal [![npm](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master&style=flat-square)](https://travis-ci.org/danigb/tonal) [![license](https://img.shields.io/npm/l/tonal.svg)](https://www.npmjs.com/package/tonal)
[![codecov](https://codecov.io/gh/danigb/tonal/branch/master/graph/badge.svg)](https://codecov.io/gh/danigb/tonal)

`tonal` is a small (24kb minified, 8kb gzipped) javascript modular music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

It uses a functional programing style: all functions are pure, there is no data mutation, entities are represented by data structures instead of objects, and lot of functions accept partial application.

#### [Demo](https://danigb.github.io/tonal-app/)

#### [API documentation](http://danigb.github.io/tonal/)

## Examples

```js
import Tonal from "tonal";

Tonal.Note.chroma("Cb"); // => 11
Tonal.Note.pc("Db5"); // => 'Db'
Tonal.Note.freq("C#3"); // => 138.59
Tonal.Note.midi("A4"); // => 69
Tonal.Note.fromMidi(69); // => 'A4'
Tonal.Note.fromProps({ alt: 2, step: 5, oct: 4 }); // => 'A##4'
Tonal.Note.fromProps({ oct: 2 }, "C4"); // => 'C2'

Tonal.Interval.semitones("5P"); // => 7
Tonal.Interval.invert("3m"); // => '6M'
Tonal.Interval.fromSemitones(7); // => '5P'

Tonal.Distance.transpose("D4", "2M"); // => 'E#4'
Tonal.Distance.interval("C", "G"); // => '5P'
Tonal.Distance.semitones("C", "G"); // => 7

Tonal.Scale.notes("Bb lydian"); // => [ 'Bb', 'C', 'D', 'E', 'F', 'G', 'A']
Tonal.Scale.notes("Eb bebop"); // => [ 'Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'D' ]
Tonal.Scale.names(); // => ["major", "minor", "bebop", ... and 90 more]

Tonal.Chord.notes("Fm7b5"); // => [ 'F', 'Ab', 'Cb', 'Eb' ]
Tonal.Chord.names(); // => ['M', 'm', 'm7b5', ... and 100 more]

Tonal.Key.chord("Bb major"); // => ["BbMaj7", "Cm7", "Dm7", "EbMaj7", "F7", "Gm7", "Am7b5W]
```

## Install

**IMPORTANT: since v3.0.0 single module packages are deprecated. The only maintaned package is `tonal`**

Using yarn: `yarn add tonal`

Using npm: `npm install --save tonal`

## Usage

**ES6 modules (recommended):**

Currently, it requires a bundler (babel, browserify, webpack, parcel, rollup) to convert your source code. Lot of JS development enviroments support ES6 modules out of the box:

```js
import Scale from "tonal/scale";
Scale.notes("Db major");
```

**CommonJS modules (node):**

If for some reason you need to use CommonJS modules you can `require` the `Tonal` facade from the package:

```js
var Tonal = require("tonal");
Tonal.Scale.notes("Bb minor");
```

**Browser:**

Again, if you can't or want to use modules, you can download the browser compatible tonal package, and use the `Tonal` object exposed globally:

```html
<script src="https://unpkg.com/tonal.min.js"></script>
<script>
  console.log(Tonal.Distance.transpose("C4", "8P"));
</script>
```

## Modules

### Core modules

These are the core modules of Tonal:

- [Tonal.Note](https://github.com/danigb/tonal/tree/master/note)
- [Tonal.Interval](https://github.com/danigb/tonal/tree/master/interval)
- [Tonal.Distance](https://github.com/danigb/tonal/tree/master/distance)
- [Tonal.PcSet](https://github.com/danigb/tonal/tree/master/pcset)
- [Tonal.Scale](https://github.com/danigb/tonal/tree/master/scale)
- [Tonal.Chord](https://github.com/danigb/tonal/tree/master/chord)
- [Tonal.Key](https://github.com/danigb/tonal/tree/master/key)
- [Tonal.Array](https://github.com/danigb/tonal/tree/master/array)
- [Tonal.RomanNumeral](https://github.com/danigb/tonal/tree/master/roman-numeral)

Any of them can be imported individually, for example:

```js
import Note from "tonal/note";
Note.midi("C4");
```

Or can be accessed using the `Tonal` facade:

```js
import Tonal from "tonal";
// or
const Tonal = require("tonal");

Tonal.Note.midi("C4");
```

### Extension modules

These modules not belong to core either because they are work in progress or not stable enough, or because the functionallity they provide are not very common. Use they are your own risk:

- [Range](https://github.com/danigb/tonal/tree/master/range)
- [AbcNotation](https://github.com/danigb/tonal/tree/master/abc-notation)
- [PcsetDFT](https://github.com/danigb/tonal/tree/master/pcset-dft)

Work in progress:

- [Sonority](https://github.com/danigb/tonal/tree/master/sonority)
- [Fretboard](https://github.com/danigb/tonal/tree/master/fretboard)
- [Detect](https://github.com/danigb/tonal/tree/master/progression)

They only can be imported using ES6 import syntax. For example:

```js
import Abc from "tonal/abc-notation";
import Progression from "tonal/progression";
```

They are not included when importing or requiring the `Tonal` facade.

## Why

Mostly, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
> [\*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

I want to learn about music theory and I want to express the concepts I learn using functional programming style.

Also, I want a complete library, where I can model some (for me) esoteric features like [interval classes](http://danigb.github.io/tonal/module-Interval.html#.ic), pitch sets, dft to pitch class sets, and so on.

## Inspiration

This library takes inspiration from other music theory libraries:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html
- Sharp11: https://github.com/jsrmath/sharp11

I want to thanks all the authors!

## License

MIT License

```

```
