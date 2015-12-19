# tonal.scale

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal.scale)
[![Code Climate](https://codeclimate.com/github/danigb/tonal.scale/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal.scale)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://img.shields.io/npm/v/tonal.scale.svg)](https://www.npmjs.com/package/tonal.scale)
[![license](https://img.shields.io/npm/l/tonal.scale.svg)](https://www.npmjs.com/package/tonal.scale)
[![tonal](https://img.shields.io/badge/lib-tonal-yellow.svg)](https://www.npmjs.com/package/tonal)

Music scales made easy:

```js
var scale = require('tonal.scale')
scale('C dorian') // => ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb']
```
`music.scale` is a [compact](https://rawgit.com/danigb/tonal.scale/master/dist/disc.html) library to create and manipulate scales, and a [scale dictionary](). It is part of [tonal](https://www.npmjs.com/package/tonal)

## Install

Via npm: `npm i --save tonal.scale` or add the [distribution file](https://raw.githubusercontent.com/danigb/tonal.scale/master/dist/tonal.scale.min.js) to your html page (will set `scale` global variable with the library)

## Usage

A scale is a array with a set of notes or intervals with a tonic and ordered by pitch.

#### Get scale by name

tonal.scale includes a [dictionary](https://github.com/danigb/tonal.scale/blob/master/lib/scales.json) with 89 scales. You can get them with a tonic and a scale name:

```js
// the simplest way
scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

Optionally you can specify the tonic as a second parameter:

```js
scale('major', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

Also you can partially apply the function:

```js
var major = scale('major')
major('C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

Set `false` as tonic to get the intervals:

```js
major(false) // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
scale('major', false) // => ['1P', '2M', '3M', '4P', '5P', '6M', '7M'])
```

#### Get available names

You can all available scale names invoking `scale.names` without arguments:

```js
scale.names() // => ['major', 'dorian', ...] (89 names)
```

If you pass `true` you get the names and the aliases:

```js
scale.names(true) // => ['major', 'dorian', ...] (89 names)
```

#### Detect scales

You can get the scale name(s) from a collection of notes with the `scale.names` function:

```js
scale.names('C D E F G A B') // => ['C major', 'C ionian']
scale.names('D E F G A B C') // => ['D dorian']
```

The first name is always the principal name and the rest is the aliases (if any).

#### Build scales from intervals

The `build` function allows to create scales from a list of intervals:

```js
scale.build('1M 2M 3m 7m', 'F') // => ['F', 'G', 'Ab', 'Eb']
scale.build('1 2 3 4 5', 'A3') // => ['A3', 'B3', 'C#4', 'D4', 'E4']
```

Also, you can partially apply the function:

```js
var pentatonic = scale('1 2 3 5 6')
pentatonic('E') // => ['E', 'F#', 'G#', 'B', 'C#']
```

If you don't need the whole dictionary (and code weight matters) you can require this function only:

```js
var build = require('tonal.scale/build')
```

#### Build scales from notes

The same of above can be applied to notes instead of intervals:

```js
var lydian = scale('C D E F# G A B')
lydian('A') // => ['A', 'B', 'C#', 'D#', 'E', 'F#', 'G#']
```

`build` function assumes that the first note is the tonic.

#### Melodic patterns with scales

The `scale.select` function uses a list of degrees to select notes from a scale. The notes are returned in the same order as the degree numbers:

```js
scale.select('3 2 1', 'C D E F G A B') // => ['E', 'D', 'C']
```

Degree numbers bigger than 7 will make the note to be transported one or more octaves. Notice that this only works if the tonic of the scale (the first note) have an explicit octave number:

```js
scale.select('1 8 15', 'C2 D2 E2') // => ['C2', 'C3', 'C4']
scale.select('1 8 15', 'C2 D5 E') // => ['C2', 'C3', 'C4']
scale.select('1 8 15', 'C D E') // => ['C', 'C', 'C']
```

The partially applied version of this function is useful to create melodic patterns ([Bergonzi](http://www.amazon.com/Melodic-Structures-Jerry-Bergonzi/dp/B000FSVJEI) would love this) with independence of the scale:

```js
var pattern = scale.select('1 2 7 9 3') // <- partially applied
pattern(major) // => ...
pattern(mixolydian) // => ...
```

#### More...

Read the [generated documentation](https://github.com/danigb/tonal.scale/blob/master/API.md) or get [tonal](https://www.npmjs.com/package/tonal)

## License

MIT License
