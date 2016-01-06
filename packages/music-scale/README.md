# music-scale [![npm version](https://img.shields.io/npm/v/music-scale.svg)](https://www.npmjs.com/package/music-scale)

[![tonal](https://img.shields.io/badge/tonal-music--gamut-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-scale` is a function to create pitch sets:

```js
var set = require('music-scale')
var set('C2 D3 C4 D5') // => ['C', 'D']
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save music-scale`

## Usage

A pitch set is an ordered collection of unique pitch classes. You can create a pitch set from a collection of notes:

```js
set('f# e4 C2 g5 d3', null) // => ['F#', 'G', 'C', 'D', 'E']
```

The null as second parameter indicates that the first note of the gamut will be the first note of the set. The set is always ordered by pitch.

#### Create scales

Scales are a sets with a tonic. Scales can be created from a list of intervals and a tonic:

```js
set('1 2 3m 4 5 6m 7', 'D') // => ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#']
```

This function can be partially applied:

```js
var dorian = set('1 2 3b 4 5 6 7b')
dorian('eb') // => [ 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'Db' ]
```

## License

MIT License
