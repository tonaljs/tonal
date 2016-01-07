# music-notation [![npm version](https://img.shields.io/npm/v/music-notation.svg)](https://www.npmjs.com/package/music-notation)

[![tonal](https://img.shields.io/badge/music--notation-tonal-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-notation` is a collection of javascript functions to parse alterations, notes, intervals and other pitched elements using different notations.

Install via npm : `npm install --save music-notation`

This is part of [tonal](https://github.com/danigb/tonal)

## Features

- Parse notes in scientific notation
- Parse notes in helmholtz notation
- Parse intervals in short hand notation
- Parse roman numerals
- Parse pitched elements (scales, chords, keys)
- Convert accidentals to alterations and back

## Notations

#### Fifths-octaves-duration array notation

The array notation a format to represent pitches and intervals using fifths, octaves and duration encoded as an array. It's largely based on `coord` notation by [teoria](https://github.com/saebekassebil/teoria)

The array notation is the primary format in this module. All the `parse` functions (`note/parse`, `interval/parse`, ...) converts from string to array format. All the `str` functions (`note/str`, `interval/str`, ...) converts from array notation to string.

A pitch in array notation is an array with different length depending what it stores:

- 1 length array: pitch classes. It stores the number of fifths from C to the pitch class. For example: `'C'` is `[ 0 ]`, `'D'` is `[ 2 ]`, `'E'` is `[ 4 ]`, and so on.
- 2 length array: intervals. It stores the number of fifths from unison as first element, and the number of octaves up or down from that fifths. For example, `[ 2, 0 ]` its `'9M'` (major ninth) since two fifths span more than a octave, so `'2M'` (major second) its `[ 2, -1 ]`
- 3 length arrays: notes. It's the interval from `C0` to the note pitch with an additional value of the duration. For example: `'C2'` with no duration would be `[0, 2, null]`.

The purpose of this design is to provide a uniform way to represent pitches (including notes, pitch classes and intervals) so lot of code can be shared, but be able to differentiate them easily.

#### Note scientific notation

The note scientific notation is a string with the form `<letter><alteration><octave>/<duration>` where only the `letter` is mandatory.

You can parse notes in scientific notation with  `note/parse`:

```js
var parse = require('music-notation/note/parse')
parse('C2') // => [0, 2, null]
parse('c2') // => [0, 2, null]
```

#### Note helmholtz notation

You can parse and build notes with strings containing [note helmholtz notation](https://en.wikipedia.org/wiki/Helmholtz_pitch_notation)

#### Interval shorthand notation

The interval shorthand notation is a way to encode intervals using strings. In tonal the cannonical form is `<number><quality>` in which the components are reversed from the standard [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation). The reason for this is to cleary differenciate between `A4` (the note) and `4A` (the interval).

The interval shorthand notation parser is capable to understand the reversed and the direct interval notation as well as intervals with the form `<number><alteration>`:

```js
var parse = require('music-notation/interval/parse')
parse('2M') // => [2, -1] // reverse shorthand notation (tonal's default)
parse('M2') // => [2, -1] // standard shorthand notation
parse('2') // => [2, -1] // number-alteration notation
```

#### Roman notation

The roman notation allows to express pitch classes using string with roman numerals. The cannonical form is `<alteration><roman>` but the parser is capable to understand the `<roman><alteration>` format:

```js
var parse = require('music-notation/roman/parse')
parse('bII') // => [ -5 ] <= same as `Db`
parse('bii') // => [ -5 ] <= case is ignored
parse('IIb') // => [ -5 ] <= reversed components allowed
```

#### Accidentals

You have functions to convert accidentals string to alterations integers (`### => 3`, for example) and vice versa.

## Usage

Read the [API documentation](https://github.com/danigb/tonal/blob/next/packages/music-notation/API.md) to see all the available functions.

## License

MIT License
