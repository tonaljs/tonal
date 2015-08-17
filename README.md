# tonal

[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides lot of functions to create and manipulate musical entities:

```js
transpose('M2', 'f#4') // => 'G#4'
fromMidi(69) // => 'A4'
scale('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
```

This library grows with some ideas in mind:
- String representations are first class citizens. Notes are 'C#2', 'Db4'..., intervals 'P5', 'm2', 'M-7'..., scales are 'C major', 'D harmonic minor'..., chords are 'Cmaj7', 'Bb79', interval sets are 'P1 M2 P5', 'P1 M-3'..., a valid note sets is 'C D E', and key signatures are defined with (for example) '###'
- Modular: get what you need. Require the desired functions, no more.
- Functional: all is data-in data-out, no classes, no side effects, no mutations.
- Provide lot of functions (the swiss army knife)
- Well tested
- Documented

This scope of this library is music theory objects: generation and analysis of music pieces. This is __not__ for _real_ music or sound synthesis although it can be used to create it ;-)

__This is alpha software__, if you need a stable music theory library in javascript you can use the excellent [teoria](https://github.com/saebekassebil/teoria)

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

The more I code music entities, the more I understand the relations between them.

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.

## What

The library is divided in a number of modules:

### Notes

Notes is the basic building block of tonal. A note is represented with a string: `C`, `D#`, `F#8` are valid notes. A note always have three parts:
- step: a uppercase letter between A and code
- accidentals: a string representing the note accidentals: `##`, `bb`
- octave: a integer representing the octave (if note present, 4 by default)

The note module has some functions to query and manipulate notes. Here are some examples:

```js
parse('c') // => { note: 'cx', step: 'C', acc: '##', oct: 4 }
freq('a') // => 440
alteration('Abb4') // => -2
```

Complete module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/note.md)

### Intervals

Intervals are the next building block. The main purpose of this module is calculate transpositions and distances:

```js
transpose-interval('M2', 'C') // => 'D4'
distance-interval('C', 'G') // => 'P5'
```

In tonal, an interval is also represented with a string. These are valid intervals:  `P5`, `m2`, `M-3`. The intervals has three parts:
- quality: a letter representing the interval quality (`d` is dimished, `m` is minor, `P` is perfect, `M` is major and `A` is augmented)
- direction: number 1 or -1 for ascending or descending intervals respectively
- number: the interval's [diatonic number](https://en.wikipedia.org/wiki/Interval_(music)#Number). A positive or negative integer. Can't be 0

The interval module has functions to query and manipulate intervals. Here are some examples:

Complete interval module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/interval.md)

### Sets

A set is a group of intervals or notes, and they are the building blocks of scales and chords. They can be constructed using a space separated string list or an array:

```js
set('P1 P5 M6', 'C') // => 'C4 G4 A4'
set(['P1', 'M2'], 'C') // => 'C4 D4'
set('C D') // => ['P1', 'M2']
set(['C', 'G']) // => ['P1', 'P5']
set('C D', 'E') // => ['E4', 'F#4']
```

A set can also be constructed with a binary string or its decimal equivalent:

```js
set('101') // => ['P1', 'M2']
set('101', 'C') // => ['C4', 'D4']
set(2773, 'C') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
```

For a complete module documentation look [here](https://github.com/danigb/tonal/blob/master/docs/set.md)

### Scales

Complete scale module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/scale.md)

### Chords

Complete chord module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/chord.md)

### Duration

A module to work with musical event durations.

A complete duration module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/duration.md)


### Key

Key signature related functions

Complete key module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/key.md)

### Misc

Yet uncategorized functions. Currently is a bag of utilities.

Complete misc module documentation is [here](https://github.com/danigb/tonal/blob/master/docs/misc.md)

## Usage

The idea is that you only require the functions you need:

```js
var transpose = require('tonal/note/transpose')
tranpose('P5', 'C')
```

Currently there's no way to load the entire library in one require.

## Documentation and tests

The functions are documented inside the code. The generated documentation can be read [here](https://github.com/danigb/tonal/blob/master/docs)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## Resources and inspiration

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale code is inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Interval analisys is based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
Musical futures: https://www.musicalfutures.org/

Music JSON proposal: https://github.com/soundio/music-json

## License

MIT License
