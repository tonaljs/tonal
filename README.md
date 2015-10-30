# tonal

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal)
[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)


## Deprecated. See [music.kit](https://github.com/danigb/music.kit)

All the code of this library (and more) has been refactored into [music.kit](https://github.com/danigb/music.kit)

## Old Documentation

Tonal is a library to create and manipulate tonal elements of music (pitches, chords, scales and keys). It deals with abstractions (not actual music) and can be used to develop midi or audio software:

```js
var tonal = require('tonal/pitch')

// pitches
tonal.fromMidi(60) // => 'C4'
tonal.toMidi('A4') // => 69
tonal.fromFreq(220) // => 'A3'
tonal.toFreq('C') // => ...

// intervals and tranposition
tonal.tranpose('D4', '2M') // => 'E#4'
tonal.interval('C', 'G') // => '5P'
['c', 'd', 'e'].map(tonal.transpose('3M')) // => ['E4', 'F#4', 'G#4']

// harmonizers
var major = tonal.harmonizer(['1P', '3M', '5M'])
major('C6') // => ['C6', 'E6', 'G6']
major('E5', true) /// => ['E', 'G#', 'B'] (only pitch classes)
var V7 = tonal.harmonizer(['1P', '3M', '5M', '7m'])
var V7ofV = function(pitch) { V7(tonal.transpose(pitch, '5P')) }
var V7ofV('D') // => ['A4', 'C#5', 'E5', 'G7']
```

Tonal has a number of characteristics that make it unique:

- It is pure __functional__: no classes, no side effects, no mutations, just data-in-and-out and functions
- Heavy use of __strings to represent entities__: pitches (`'C#2'`, `'Bb'`, `'G##'`), intevals (`'2M'`, `'-9m'`), chords (`'Cmaj7'`, `'Bb79'`), scales (`'C major'`, `'Bb bebop'`), collections (`'C D E F'`, `'1P 2M 3M'`, `'Cmaj7 D9m'`), keys (`'C major'`, `'Bb minor'`, `'###'`)
- Extremely __modular__: your can require the whole library, a module or an individual function, so the dependencies are reduced to the minimum. Think each function in tonal like a npm micro-module.
- Advanced features: binary scales, chord and scale detection, chord voicings, chord progressions

_This is still [beta software](https://github.com/danigb/tonal/blob/master/docs/TODO.md)_ and it's being actively developed. For a stable library see [teoria](https://github.com/saebekassebil/teoria)

## What

The library is divided in a number of modules:

- [Pitch module](https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md#pitch-module): the main module of tonal. Work with pitches (`C#4` is one), midi and frequencies. Transpose pitches and find distances (using semitones or intervals).
- [Interval module](https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md#interval-module): Work with intervals.
- [Scale](https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md#scale-module): provides dictionaries to create scales using names
- [Chord](https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md#chord-module): get chord intervals or pitches by its name (more than 100) and detect chords by its pitches
And [more ...](https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md)

## Usage

Install via npm: `npm i --save tonal`

Then you can load the whole library...

```js
var tonal = require('tonal')
tonal.pitch.transpose(tonal.pitch.fromMidi(60), '2M')
```

... one module ...

```js
var pitch = require('tonal/pitch')
pitch.transpose(pitch.fromMidi(60), '2M')
```

or a function:

```js
var transpose = require('tonal/pitch/transpose')
tranpose('C', '5P')
```

## Documentation and tests

The functions are extensively documented inside the code. The documentation can be read [here](https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## Resources and inspiration

This library takes inspiration from lot of places:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html

And many more... (see documentation)

## License

MIT License
