# tonal

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides lot of functions to create and manipulate musical entities:

```js
var transpose = require('tonal/interval/transpose')
transpose('M2', 'f#4') // => 'G#4'
var fromMidi = require('tonal/note/from-midi')
fromMidi(69) // => 'A4'
```

This library grows with different ideas in mind:
- Modular: get what you need. Require the desired methods, no more.
- Functional: all is data-in data-out, no objects, no side effects, no mutations.
- Prefer string representations when possible. Notes are 'C#2', intervals 'P5', scales: ['P1', 'P5'], key signatures: '###' and so on.
- Provide lot of functions (the swiss army knife)
- Well tested
- Documented

This scope of this library is music theory objects: generation and analisys of music pieces. This is __not__ for _real_ music or sound synthesis.

__This is alpha software__, if you need a stable music theory library in javascript you can use the excellent [teoria](https://github.com/saebekassebil/teoria)

## What

The library is divided in a number of modules:

- [notes](https://github.com/danigb/tonal/blob/master/docs/note.md): note pitch related functions (the most used package, I suppose)
- [intervals](https://github.com/danigb/tonal/blob/master/docs/interval.md): functions to manipulate intervals
- [scales](https://github.com/danigb/tonal/blob/master/docs/scale.md): scales
- [chords](https://github.com/danigb/tonal/blob/master/docs/chord.md): chords
- [set](https://github.com/danigb/tonal/blob/master/docs/set.md): working with list of intervals or notes
- [key](https://github.com/danigb/tonal/blob/master/docs/key.md): key signature related functions
- [cycles](https://github.com/danigb/tonal/blob/master/docs/cycles.md): cycles related functions
- [misc](https://github.com/danigb/tonal/blob/master/docs/misc.md): yet uncategorized functions


## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

The more I code music entities, the more I understand the relations between them.

Also, I want a complete library, where I can model all what I learn, with some esoteric features like interval classes, binary scales and weird stuff. You can require the parts you need.

## Usage

The idea is that you only require the methods you need:

```js
var transpose = require('tonal/note/transpose')
tranpose('P5', 'C')
```

Currently there's no way to load the entire library in one require.

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
