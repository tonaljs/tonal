# array-notation [![npm version](https://img.shields.io/npm/v/array-notation.svg)](https://www.npmjs.com/package/array-notation)

`array-notation` is a collection of javascript functions to parse notes, intervals and other pitched elements to array notation.

This is part of [tonal](https://github.com/danigb/tonal)

## Features

- Parse notes and pitch classes
- Parse intervals in short hand notation
- Parse roman numerals
- Parse pitched elements (scales, chords, keys)

## Install

Via npm only: `npm install --save array-notation`

It's important to notice that you can __NOT__ require the whole library. Instead, you must require the functions you will use.

## Notations

#### Fifths-octaves-duration array notation

The fod-array-notation is a way to encode pitches, notes and intervals using arrays.

#### Note scientific notation

The note scientific notation is a string with the form `<letter><alteration><octave>/<duration>` where only the `letter` is mandatory.

You can parse notes in scientific notation with  `note/parse`:

```js
var parse = require('array-notation/note/parse')
parse('C2') // => [0, 2, null]
parse('c2') // => [0, 2, null]
```

#### Note helmholtz notation

You can parse and build notes with strings containing [note helmholtz notation](https://en.wikipedia.org/wiki/Helmholtz_pitch_notation):


#### Interval shorthand notation

The interval shorthand notation is a way to encode intervals using strings. In tonal the cannonical form is `<number><quality>` in which the components are reversed from the standard [interval shorthand notation](https://en.wikipedia.org/wiki/Interval_(music)#Shorthand_notation). The reason for this is to cleary differenciate between `A4` (the note) and `4A` (the interval).

The interval shorthand notation parser is capable to understand the reversed and the direct interval notation as well as intervals with the form `<number><alteration>`:

```js
var parse = require('array-notation/interval/parse')
parse('2M') // => [2, -1] // reverse shorthand notation (tonal's default)
parse('M2') // => [2, -1] // standard shorthand notation
parse('2') // => [2, -1] // number-alteration notation
```

#### Roman notation

The roman notation allows to express pitch classes using string with roman numerals. The cannonical form is `<alteration><roman>` but the parser is capable to understand the `<roman><alteration>` format:

```js
var parse = require('array-notation/roman/parse')
parse('bII') // => [ -5 ] <= same as `Db`
parse('bii') // => [ -5 ] <= case is ignored
parse('IIb') // => [ -5 ] <= reversed components allowed
```


## Usage

Read the [API documentation](https://github.com/danigb/tonal/blob/next/packages/array-notation/API.md) to see all the available functions.

## License

MIT License
