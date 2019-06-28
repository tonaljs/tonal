# @tonaljs/array ![tonal](https://img.shields.io/badge/@tonaljs-array-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/array.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/array)

> A collection of functions to create and manipulate arrays of notes or intervals.

## API

### `range(from: number, to: number) => number[]`

Creates a numeric range:

```js
range(-2, 2); // => [-2, -1, 0, 1, 2]
range(2, -2); // => [2, 1, 0, -1, -2]
```

### `rotate(times: number, array: any[]) => any[]`

Rotate an array a number of times:

```js
rotate(1, [1, 2, 3]); // => [2, 3, 1]
```

### `sortedNoteNames(array: any[]) => string[]`

Sort an array of note names in ascending order. Pitch classes are listed before notes.
Any string that is not a note is removed.

```js
sortedNoteNames(["c2", "c5", "c1", "c0", "c6", "c"]);
// => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
sortedNoteNames(["c", "F", "G", "a", "b", "h", "J"]);
// => ['C', 'F', 'G', 'A', 'B']
```

### `sortedUniqNoteNames(array: any[]) => string[]`

Return a list of sorted note names with duplications removed.

### `shuffle(array: any[]) => any[]`

Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.

### `permutations(array: any[]) => any[][]`

Get all permutations of an array

```js
permutations(["a", "b", "c"])) // =>
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
