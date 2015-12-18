# music-dictionary

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/music-dictionary)
[![Test Coverage](https://codeclimate.com/github/danigb/music-dictionary/badges/coverage.svg)](https://codeclimate.com/github/danigb/music-dictionary/coverage)
[![Code Climate](https://codeclimate.com/github/danigb/music-dictionary/badges/gpa.svg)](https://codeclimate.com/github/danigb/music-dictionary)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://img.shields.io/npm/v/music-dictionary.svg)](https://www.npmjs.com/package/music-dictionary)
[![license](https://img.shields.io/npm/l/music-dictionary.svg)](https://www.npmjs.com/package/music-dictionary)
[![tonal](https://img.shields.io/badge/tonal-dictionary-yellow.svg)](https://www.npmjs.com/package/tonal)


`music-dictionary` is a function to create musical dictionaries. A musical dictionary is a collection of notes with a name:

```js
var dictionary = require('music-dictionary')
var chords = dictionary({'Maj7': ['1 3 5 7', ['maj7', 'M7']]})
chords('CMaj7') // => ['C', 'E', 'G', 'B']
chords('BbM7') // => ['Bb', 'D', 'F', 'A']
```

This is part of [tonal](https://www.npmjs.com/package/tonal) and the foundation of the [tonal.scale](https://github.com/danigb/tonal.scale) and [chord.dictionary](https://github.com/danigb/chord.dictionary) dictionaries.

## Install

Via npm only: `npm i --save music-dictionary`

## Usage

The function returned by `music-dictionary` creates list of notes (or intervals) from a name. The name may include a root:

```js
var chords = dictionary({'Maj7', ['1 3 5 7', ['maj7', 'M7']], 'm7': ['1 3m 7 7m']})
chords('CMaj7') // => ['C', 'E', 'G', 'B']
chords('Maj7', 'C') // => ['C', 'E', 'G', 'B']
chords('Fm7') // => ['F', 'Ab', 'C', 'Eb']
```

Without root, a list of intervals is returned:

```js
chords('Maj7') // => ['1P', '3M', '5P', '7M']
```

__It never returns null__. If no name is found, an empty array is returned:

```js
chords('Cdim') // => []
chords(null) // => []
chords() // => []
```

#### Dictionary data

The `data` property of the dictionary is a hashmap of names mapped to data objects. The data objects has the following properties:

- name: the name
- aliases: an array with the alternative names
- intervals: an array with the intervals
- steps: an array with the intervals in __array notation__
- binary: a binary representation of the set
- decimal: the decimal representation of the set

```js
var chords = dictionary({'Maj7', ['1 3 5 7', ['maj7', 'M7']]})
// dictionary data
chords.data['M7'] // => { name: 'Maj7', aliases: ['M7'],
                  //      intervals: ['1', '3', '5', '7'], steps: [ ...],
                  //      binary: '10010010001', decimal: 2193 }

// get chord by binary numbers
chords.data['100010010001'] === chords.data['Maj7']
chords.data[2193] === chords.data['Maj7']
```

#### Get available names

The property `names` is an array with the available names. The property `aliases` adds the aliases names:

```js
var chords = dictionary({'Maj7', ['1 3 5 7', ['maj7', 'M7']], 'm': ['1 3b 5']})
chords.names // => ['Maj7', 'm']
chords.aliases // => ['Maj7', 'm', 'maj7', 'M7']
```

#### More...

Read the [generated documentation](https://github.com/danigb/music-dictionary/blob/master/API.md) or take a look at [tonal](https://www.npmjs.com/package/tonal)

## License

MIT License
