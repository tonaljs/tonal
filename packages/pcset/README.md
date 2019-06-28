# @tonaljs/pcset ![tonal](https://img.shields.io/badge/@tonaljs-pcset-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pcset.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pcset)

> Functions to create and manipulate musical pitch class sets

A pitch class set is a set (no repeated) of pitch classes (notes without octaves). Pitch classes are usefull to identify musical structures (like if two chords are related)

## API

### `pcset(src: note[] | string | number) => Pcset`

Given a collection of notes, a pitch class chroma string or a pitch class number, it returns the Pcset data object with the following attributes:

- num: the set number. Each pitch class set can be represented by an unique name between 0 and 4096. Those are the possible combinations of 12 different elements (pitch classesj)
- chroma: the set number as binary string
- intervals: the list of intervals **starting from C**
- length: the number of notes

Example:

```js
pcset(["c", "d", "e"]);
// =>
// {
//   num: 2688,
//   chroma: "101010000000",
//   intervals: ["1P", "2M", "3M"],
//   length: 3
// }
```

It is possible to obtain the Pcset object from chroma or number:

```js
pcset(["c", "d", "e"]) == pcset(2688);
pcset(2688) == pcset("101010000000");
```

### `isSubsetOf(parent: Set) => (subset: Set) => boolean`

Test if a set is a subset of another. This function is currified

### `isSupersetOf(subset: Set) => (parent: Set) => boolean`

Test if a set is a superset of another. This function is currified

## Want more?

Take a look to [@tonal/scale-dictionary]() or [@tonal/chord-dictionary]() that are, in fact, dictionaries of pitch class sets.

## FAQ

#### How do I get a list of all possible music scales?

```js
import { chromas, pcset } from "@tonaljs/pcset";
import { transposeFrom } from "@tonaljs/note";

chromas().map(chroma => pcset(chroma).intervals.map(transposeFrom("C")));
```
