# note-transpose

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/note-transpose)
[![Code Climate](https://codeclimate.com/github/danigb/note-transpose/badges/gpa.svg)](https://codeclimate.com/github/danigb/note-transpose)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://img.shields.io/npm/v/note-transpose.svg)](https://www.npmjs.com/package/note-transpose)
[![license](https://img.shields.io/npm/l/note-transpose.svg)](https://www.npmjs.com/package/note-transpose)
[![tonal](https://img.shields.io/badge/tonal-transpose-yellow.svg)](https://www.npmjs.com/package/tonal)


`note-transpose` is a [compact](https://rawgit.com/danigb/note-transpose/master/dist/disc.html) function to transpose notes:

```js
var transpose = require('note-transpose')
transpose('C3', '3m') // => 'Eb3'
```

It's part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save note-transpose` and require the function. Use browserify or webpack to create a browser ready distribution.

Or use the [distribution file](https://raw.githubusercontent.com/danigb/note-transpose/master/dist/note-transpose.min.js) (adds `transpose` function to window globals):

```html
<script src="note-transpose.min.js"></script>
<script>console.log(transpose('C3', '3m'))</script>
```

## Usage

#### Note transposition

The simplest usage is with a note name (pitch) and interval (the order doesn't matter):

```js
transpose('C2', '4A') // => 'F#2'
transpose('4A', 'C2') // => 'F#2'
```

#### Pitch class transposition

You can transpose pitch classes (note names without octaves), and the returned value will be a pitch class:

```js
tranpose('A', '3M') // => 'C#'
tranpose('A5', '3M') // => 'C#5'
```

#### Add intervals

If you need it you can transpose an interval:

```js
transpose('3M', '3M') // => '5A'
```

#### Transposers

Also, you can partially apply the function to get a transposer:

```js
var major3th = transpose('3M')
major3th('D') // => 'F#'
```

#### Map arrays

Partially applied transposers allows to work with arrays seamlessly:

```js
['C', 'D', 'E', 'F', 'G'].map(transpose('3M')) // => ['E', 'F#', 'G#', 'A', 'B']
['1P', '3m', '5P'].map(transpose('C')) // => ['C', 'Eb', 'G']
```

#### More...

See [tonal](https://www.npmjs.com/package/tonal)

## License

MIT License
