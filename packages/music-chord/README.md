# tonal.chord

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal.chord)
[![Code Climate](https://codeclimate.com/github/danigb/tonal.chord/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal.chord)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://img.shields.io/npm/v/tonal.chord.svg)](https://www.npmjs.com/package/tonal.chord)
[![license](https://img.shields.io/npm/l/tonal.chord.svg)](https://www.npmjs.com/package/tonal.chord)
[![tonal](https://img.shields.io/badge/lib-tonal-yellow.svg)](https://www.npmjs.com/package/tonal)

Music chords made easy:

```js
var chord = require('tonal.chord')
chord('CMaj7') // => ['C', 'E', 'G', 'B']
var dom7 = chord.build('C E G Bb')
dom7('A4') // => ['A4', 'C#5', 'E5', 'G5']
```

`tonal.chord` is a [compact](https://rawgit.com/danigb/tonal.chord/master/dist/disc.html) library to create and manipulate chords, and a [chord dictionary](https://github.com/danigb/tonal.chord/blob/master/lib/chords.json)

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save tonal.chord` or add the [distribution file](https://raw.githubusercontent.com/danigb/tonal.chord/master/dist/tonal.chord.min.js) to your html page (will set `chord` global variable with the library)

## Usage

A chord is an array of notes ordered by pitch starting with a tonic. Sometimes it can be expressed with intervals. With `tonal.chord` you can:

- `chord`: create chords by name (and optionally a tonic)
- `build`: create chords from a list of notes
- `type`: get the chord type (major, minor, diminished, augmented)

#### Create a chord from name

You can get a chord by its tonic and name:

```js
chord('Bb7') // => ['Bb', 'D', 'F', 'Ab']
```

Optionally, you can set the tonic as second parameter:

```js
chord('7', 'Bb') // => ['Bb', 'D', 'F', 'Ab']
```

Or pass `false` to get the intervals:

```js
chord('7', false) // => ['1P', '3M', '5M', '7m']
```

Finally, you can partially apply the function by specifying only the chord type:

```js
var V7 = chord('7')
V7('Bb') // => ['Bb', 'D', 'F', 'Ab']
```

#### Build chords from intervals

You don't need the dictionary to create a chord. You can build a chord with a list of intervals:

```js
chord.build('1 3 5 7b 9', 'F2') // => ['F2', 'A2', 'C3', 'Eb3', 'G3']
```

You can partially apply the function:

```js
var dom79 = chord.build('1 3 5 7b 9')
dom79('F2') // => ['F2', 'A2', 'C3', 'Eb3', 'G3']
```

__Its important to note that all chord notes are ordered by pitch:__

```js
chord.build('1 3 5 7 2', 'C') // => ['C', 'D', 'E', 'G', 'B']
```

If you don't need the chord dictionary you can require only the `build` function to save size:

```js
var chord = require('tonal.chord/build')
```

#### Build chord from notes

You can build from notes the same way (again, ordered notes):

```js
var m7b5 = chord.build('C Eb Gb Bb')
m7b5('D4') // => ['D4', 'F4', 'Ab4', 'C5']
var maj7drop2 = chord.build('C2 E2 G1 B2')
maj7drop2('C4') // => [ 'G3', 'C4', 'E4', 'B4' ]
```

#### More...

Read the [generated documentation](https://github.com/danigb/tonal.chord/blob/master/API.md) or get the [whole stuff](https://www.npmjs.com/package/tonal)

## Example

To run the example `npm install -g beefy` then `beefy example/chords.js` and navigate to http://localhost:9966/

## License

MIT License
