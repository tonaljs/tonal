---
title: Collections
package: collections
---

This package contains a collection of utility functions to manipulate abstract collections

```js
import { Collection } from "tonal";
Collection.shuffle(["a", "b", "c"]);
```

### `Collection.range`

`range(from: number, to: number) => number[]`

Creates a numeric range:

```js
Collection.range(-2, 2); // => [-2, -1, 0, 1, 2]
Collection.range(2, -2); // => [2, 1, 0, -1, -2]
```

### `Collection.rotate`

`rotate(times: number, collection: any[]) => any[]`

Rotate an collection a number of times:

```js
Collection.rotate(1, [1, 2, 3]); // => [2, 3, 1]
```

### `Collection.shuffle`

`shuffle(collection: any[]) => any[]`

Randomizes the order of the specified collection in-place, using the Fisher–Yates shuffle.

```js
Collection.shuffle(["a", "b", "c"]);
```

### `Collection.permutations`

`permutations(collection: any[]) => any[][]`

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
