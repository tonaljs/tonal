# music-key [![npm](https://img.shields.io/npm/v/music-key.svg)](https://www.npmjs.com/package/music-key)

[![license](https://img.shields.io/npm/l/music-key.svg)](https://www.npmjs.com/package/music-key)
[![tonal](https://img.shields.io/badge/tonal-music--key-yellow.svg)](https://www.npmjs.com/package/tonal)

`music-key` is a collection of functions to create and manipulate music keys:

```js
var key = require('music-key')
key('###') // => 'A major'
key.signature('A major') // => '###'
key.altNotes('A major') // => ['F#', 'C#']
key.relative('minor', 'A major') // => 'F minor'
```

This is part of [tonal](https://www.npmjs.com/package/tonal)

## Installation

Via npm: `npm i --save music-key`

## User guide

#### Valid keys

A key in `music-key` is a string with a tonic and (optionally) a mode: `'C'`, `'C major'`,`'C minor'`,`'Ab dorian'` are valid keys. The valid modes are: `major`, `minor`, `ionian`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `aeolian` and `locrian` (`major` if not specified).

#### Create keys

The key function returns a key from a name or from a signature:

```js
key('C major') // => 'C major'
key('C') // => 'C major'
key('#') // => 'G major'
key('bb') // => 'Eb major'
```

#### Relative keys

You can get relative keys:

```js
key.relative('minor', 'C major') // => 'A minor'
key.relative('minor', key('#')) // => 'E minor'
```

This function can be partially applied:

```js
var minor = key.relative('minor')
minor('C major') // => 'A minor'
```

#### Get key signature and altered notes

The key signature is a string with the flats or sharps:

```js
key.signature('F major') // => 'b'
key.signature('Eb major') // => 'bbb'
key.signature('A major') // => '###'
key.altNotes('F major') // => ['Bb']
key.altNotes('Eb major') // => ['Bb', 'Eb', 'Ab']
key.altNotes('A major') // => ['F#', 'C#', 'G#']
```

The altered notes are returned in its proper order:

```js
key.altNotes('F major') // => ['Bb']
key.altNotes('Eb major') // => ['Bb', 'Eb', 'Ab']
key.altNotes('A major') // => ['F#', 'C#', 'G#']
```

#### Get key scale

```js
key.scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
```

## License

MIT License
