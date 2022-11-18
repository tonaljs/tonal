# @tonaljs/collection ![tonal](https://img.shields.io/badge/@tonaljs-collection-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/collection.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/collection)

> Functions to create and manipulate collections (collections)

## Usage

ES6:

```js
import { Collection } from "tonal";
```

node:

```js
const { Collection } = require("tonal");
```

## API

#### `range(from: number, to: number) => number[]`

Creates a numeric range:

```js
Collection.range(-2, 2); // => [-2, -1, 0, 1, 2]
Collection.range(2, -2); // => [2, 1, 0, -1, -2]
```

#### `rotate(times: number, collection: any[]) => any[]`

Rotate an collection a number of times:

```js
Collection.rotate(1, [1, 2, 3]); // => [2, 3, 1]
```

#### `shuffle(collection: any[]) => any[]`

Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.

```js
Collection.shuffle(["a", "b", "c"]);
```

#### `permutations(collection: any[]) => any[][]`

Get all permutations of an collection

```js
Collection.permutations(["a", "b", "c"])) // =>
// =>
// [
//   ["a", "b", "c"],
//   ["b", "a", "c"],
//   ["b", "c", "a"],
//   ["a", "c", "b"],
//   ["c", "a", "b"],
//   ["c", "b", "a"]
// ]
```
