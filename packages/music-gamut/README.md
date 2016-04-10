# music-gamut [![npm version](https://img.shields.io/npm/v/music-gamut.svg)](https://www.npmjs.com/package/music-gamut)

[![tonal](https://img.shields.io/badge/tonal-music--gamut-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-gamut` is a library to work with collections of notes or intervals using a functional programming paradigm. Standard `map`, `filter` and `reduce` functions are implemented:

```js
var gamut = require('music-gamut')
var octUp = gamut.map(function (p) { return [p[0], p[1] + 1, p[2]]})
octUp('c2 d3 fx4') // => ['C3', 'D4', 'F##5']
```

This is part of [tonal](https://www.npmjs.com/package/tonal):

```js
var tonal = require('tonal')
tonal.map(...)
tonal.filter(...)
tonal.reduce(...)
```

## Install

Via npm: `npm i --save music-gamut`

## Usage

In [tonal](https://www.npmjs.com/package/tonal) a gamut is a collection of pitches (notes, intervals or pitch classes). This collection can be expressed as:

- array of notes: `['C2', 'D2', 'E3']`
- a string with notes (separated with spaces, commas or bars): `C2 D2 E3`
- an array of notes in array notation: `[[0, 2, null], [1, 2, null]]`

#### Create gamuts

You can create a gamut from a string with notes or intervals separated by spaces, bars or commas:

```js
var gamut = require('music-gamut')
gamut(null, 'a b c 1 2 3 blah') // => ['A', 'B', 'C', '1P', '2M', '3M', null]
gamut(null, 'c d | e f') // => ['C', 'D', 'E' 'F']
```

#### Map collection of notes

The `gamut.map` function can be used to map a collection of notes:

```js
var transpose = require('note-transposer')
gamut.map(transpose('M3'), 'a b c d e') // => ['C#', 'D', 'E', 'F#', 'G#']
```

Or partially apply to more functional style:

```js
var thirdUp = gamut.map(transpose('M3'))
thirdUp('a b c d e') // => ['C#', 'D', 'E', 'F#', 'G#']
```

#### Filter collection of notes

Filter works the same way:

```js
var onlyC = gamut.map(function (p) { return p[0] === 0 })
onlyC('a b c d') // => ['C']
```

#### Select elements from a gamut

You can select elements with a list of 1-based index numbers and a gamut:

```js
gamut.select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
```

#### Rotate gamuts

```js
gamut.rotate(2, 'c d e') // => ['e', 'c', 'd']
```

## License

MIT License
