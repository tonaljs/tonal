# note-midi [![npm version](https://img.shields.io/npm/v/note-midi.svg)](https://www.npmjs.com/package/note-midi)

[![tonal](https://img.shields.io/badge/tonal-note-midi-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`note-midi` is a tiny function (1kb minified) to get the midi number from a note name:

```js
var midi = require('note-midi')
midi('A4') // => 69
midi('c2') // => 36
```

This is part of [tonal](https://github.com/danigb/tonal)

## Installation

Install via npm: `npm install --save note-midi` or use add the dist file to the html page.

## API

## `midi`

Get the midi number of a note

The note can be an string in scientific notation or
[array pitch notation](https://github.com/danigb/music.array.notation)


### Parameters

* `note` **`String or Array`** the note in string or array notation

### Examples

```js
midi('A4') // => 69
midi('a3') // => 57
midi([0, 2]) // => 36 (C2 in array notation)
```

Returns `Integer` the midi number
[Generated documentation here](https://github.com/danigb/note-midi/blob/master/API.md)

## License

MIT License
