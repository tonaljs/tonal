# tonal-notation [![npm version](https://img.shields.io/npm/v/tonal-notation.svg)](https://www.npmjs.com/package/tonal-notation)

[![tonal](https://img.shields.io/badge/tonal-notation-yellow.svg)](https://www.npmjs.com/package/tonal)

`tonal-notation` is a collection of javascript functions to parse notes, intervals and other musical elements to numerical pitch representations and convert them back to strings:

```js
var notation = require('tonal-notation')
notation.note.parse('C2') // => [0, 2, null]
notation.interval.parse('5P') // => [1, 0]
notation.roman.parse('IV') // => [-1, 0]
notation.note.split('Bb3 dorian') // => ['Bb3', 'B', 'b', '3', '', 'dorian']
```

This is a low level library and part of [tonal](https://www.npmjs.com/package/tonal)

One of the central ideas of `tonal` is that, from the user persepective, notes and intervals are just strings (as opposite of objects, in most of the libraries). Internally they are converted to numerical formats to perform operations, and thats the library that performs that conversions. Aditionally, it allows to use different string notations (using the `operation` function) so `tonal` can deal with diferent note and interval formats.

This library it's for music library builders, not music library users.

## Install

Via npm only: `npm i --save tonal-notation` and then require the whole library:

```js
var notation = require('tonal-notation')
notation.roman.split(...)
```

or the individual functions (recommended):

```js
var note = require('tonal-notation/note')
note(...)
```

## Notation

This library represent pitches in three different formats:

- Strings literals: just it.
- Array notation: a numerical fifths/octave pitch representation
- Properties: pitch properties expressed with numbers

You can read more about them [here](https://github.com/danigb/tonal-notation/blob/master/NOTATION.md)

## Functions and documentation

You can read the [generated API documentation here](https://github.com/danigb/tonal-notation/blob/master/API.md)

The implemented functions are:

- `interval`: return an interval string from a source. `null` if not valid interval
- `interval.parse`: convert an interval string into array notation
- `interval.str`: convert an interval in array notation to string
- `note`: return an note string from a source. `null` if not valid note
- `note.split`: divides a note string into its components
- `note.parse`: convert a note string into array notation
- `note.str`: convert a note in array notation to string
- `pitch`: return an pitch string from a source. `null` if not valid pitch
- `pitch.parse`: convert a pitch string into array notation
- `pitch.str`: convert a pitch in array notation to string
- `roman.split`: divides a roman string into its components
- `roman.parse`: convert a roman string into array notation
- `operation`: decorates a function to parse params and convert to string the result
- `parser`: decorates a parser function to ensure correct params and cache results
- `props`: convert from array notation to properties
- `props.parse`: convert from properties to array notation

## Usage

Require the function and use it:

```js
var parse = require('tonal-notation/note.parse')
parse('C2') // => [0, 2, null]
```

It's fast, since all results are memoized by default.

Although you can require the while library, it's recommended to require the individual functions.

#### Entities

There are four type of entities implemented at this moment:

- __Notes__: include pitch classes (notes without octaves), notes without durations and notes with duration. Examples: `Db` (pitch class), `G#4` (notes), `Ebb5/4` (note with duration)
- __Intervals__: two different shorthand interval format: with accidentals and with qualifiers. Examples: `3M` or `3` (major third), `3m` or `3b` (minor third)
- __Pitches__: an abstraction that includes notes and intervals. Used when you want to manipulate both in a uniform way.
- __Roman numerals__: They are used to express pitches in relation with a scale. Examples: `VI`, `bIV`, `iii`

#### Processes

You can:

- __Split__: divide the string into its parts (implemented using regexp)
- __Parse__: convert a string to array notation
- __Str__: convert from array notation back to string
- __Props__: convert from array notation to properties (and the opposite)

Examples:

```js
notation.note.split('Gb4Maj7') // => ['Gb4Maj9', 'G', 'b', '4', '', 'Maj7']
notation.roman.split('bVIIMaj7') // => ['bVIIMaj7', 'b', 'VII', 'Maj7' ]

notation.note.parse('D4') // => [1, 0, 3, null]
notation.interval.parse('P5') // => [1, 0]

notation.note.str([3]) // => 'A'
```

#### Operations

The `operation` function decorates another function that manipulates pitches in array notation without worry about parsing and convert back to string:

```js
var operation = require('tonal-notation/operation')
var parse = require('tonal-notation/interval.parse')
var str = require('tonal-notation/interval.str')

// The function adds two intervals and the operation takes care of the conversion
var add = operation(parse, str, function(a, b) {
  return [a[0] + b[0], a[1] + b[1]]
})
add('3m', '3M') // => '5P'
```

#### Create you own parser

`tonal-notation` provides a helper function to create your own parsers:

```js
notation.parser(function (str) {
  // the parameter is always an string
  // the result of the parse process is cached
})
```
#### More...

Read the [generated documentation](https://github.com/danigb/tonal-notation/blob/master/API.md) to learn more. Or take a look to [tonal](https://www.npmjs.com/package/tonal)

## License

MIT License
