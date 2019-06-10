# @tonaljs/tonal [![npm](https://img.shields.io/npm/v/@tonaljs/tonal.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/tonal)

## We're moving. Looking for v2? It's [here](https://github.com/tonaljs/v2)

`@tonaljs/tonal` is a small (4kb minified, 2kb gzipped) javascript music theory library. It provides functions to manipulate tonal elements of music (notes, intervals, transposition, distances). It deals with abstractions (not actual music).

## Usage

#### Install

npm: `npm i --save @tonaljs/tonal`

yarn: `yarn add @tonaljs/tonal`

#### Import

ES6 module:

```js
import * as tonal from '@tonaljs/tonal'
```

ES5 module:

```js
const tonal = require('@tonaljs/tonal')
```

## Documentation

#### API

- `note(note: string): NoteProps`: get properties of a note name
- `interval(interval: string): IntervalProps`: get properties of an interval name
- `transpose(note: string, interval: string): string`: transpose a note by an interval
- `distance(fromNote: string, toNote: string): string`: find the interval between two notes

Read the [full API documentation here](API.md)

#### Examples

```js
tonal.note('C4').midi // => 60
tonal.note('A4').freq // => 440
tonal.transpose('C4', '5P') // => 'G4'
tonal.distance('C4', 'G4') // => '5P'
```

## License

MIT License
