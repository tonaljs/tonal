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

## Usage

You can parse notes to array notation with the `note/parse` function:

```js
var parse = require('array-notation/note/parse')
parse('C2') // => [0, 2, null]
```

Read the [API documentation](https://github.com/danigb/tonal/blob/next/packages/array-notation/API.md) to see all the available functions.

## License

MIT License
