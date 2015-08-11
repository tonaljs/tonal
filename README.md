# tonal

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides lot of functions to create and manipulate musical entities:

```js
var transpose = require('tonal/transpose')
transpose('M2', 'f#4') // => 'G#4'
```

It's modular because you can require just what you need. The library is still big, but your dependencies can be tiny.

It's functional because all the library is built using functions with no side effects, just data-in, data-out. Notes and intervals are represented by strings. No objects. Functions are isolated, simpler and tested.

You can read de [documentation here](https://github.com/danigb/tonal/blob/master/documentation.md)

__This is alpha software__, if you need a stable music theory library in javascript you can use the excellent [teoria](https://github.com/saebekassebil/teoria)

## What

The library functions are divided in some different areas (functions in _italic_ are work in progress or not implemented)

- __notes__: parseNote, noteName, freq, midi, noteFromMidi, transpose, enharmonics, pitchClass, cycle, cycleOfFifths
- __intervals__: parseInterval, intervalNames, intervalNumber, invertInterval, distance, intervalClass, _intervalAnalisys_
- __scales__: _scaleIntervals_, _scaleNotes_, scaleBinary, scaleModes, cannonicalScaleMode, coscale, reflection, scaleName, isScaleBinaryNumber, isDecimalScale
- __chords__:
- __tonallity__: keySignature
- __sequences__: sequence, timeStretch

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

The more I code music entities, the more I understand the relations between them.

Also, I want a complete library, where I can model all what I learn, with some esoteric features like interval classes, binary scales and weird stuff. You can require the parts you need.

## Usage

You can install it using npm: `npm i --save tonal` and although you can require the whole library:

```js
var tonal = require('tonal')
tonal.tranpose('P5', 'C')
```

The idea is that you only require the methods you need:

```js
var transpose = require('tonal/transpose')
tranpose('P5', 'C')
```

## Documentation and tests

The functions are documented inside the code. The generated documentation can be read [here](https://github.com/danigb/tonal/blob/master/documentation.md)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## References

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale code is inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Interval analisys is based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

## License

MIT License
