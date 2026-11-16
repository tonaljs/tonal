# @tonaljs/pcset ![tonal](https://img.shields.io/badge/@tonaljs-pcset-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pcset.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pcset)

> Functions to create and manipulate musical pitch class sets

A pitch class set is a set (no repeated) of pitch classes (notes without octaves). Pitch classes are useful to identify musical structures (if two chords are related, for example)

A pitch class set is a no repeated collection (set) of notes without octaves (pitch classes).

Pitch classes are useful to identify musical structures (if two chords are related, for example)

## Usage

ES6:

```js
import { Pcset } from "tonal";
```

nodejs:

```js
const { Pcset } = require("tonal");
```

## Properties

### `Pcset.get`

`get(src: note[] | string | number) => Pcset`

Given a collection of notes, a pitch class chroma string or a pitch class number, it returns a properties object with the following attributes:

- empty: true if the set is not valid
- name: the set name (empty for sets that are not scales or chords)
- setNum: the set number. Each pitch class set can be represented by an unique number between 0 and 4095. Those are the possible combinations of 12 different elements (pitch classes)
- chroma: the set number as binary string
- normalized: the chroma rotated to start with its first note
- intervals: the list of intervals **starting from C**

Example:

```js
Pcset.get(["c", "d", "e"]);
// =>
// {
//   empty: false,
//   name: "",
//   setNum: 2688,
//   chroma: "101010000000",
//   normalized: "100000001010",
//   intervals: ["1P", "2M", "3M"],
// }
```

It is possible to obtain the properties from chroma or set number. All this function calls returns the same object:

```js
Pcset.get(["c", "d", "e"]);
Pcset.get(2688);
Pcset.get("101010000000");
```

Several shorthands (`num`, `chroma`, `intervals`) are provided:

```js
Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
Pcset.num(["c", "d", "e"]); //=> 2688

// several set representations are accepted
Pcset.chroma(2688); //=> "101010000000"
Pcset.num("101010000000"); // => 2688
```

Intervals are always calculated from `C`:

```js
Pcset.intervals(["c", "d", "e"]); // => ["1P", "2M", "3M"]
Pcset.intervals(["D", "F", "A"]); // => ["2M", "4P", "6M"]
```

## Notes and intervals

### `Pcset.notes`

`notes(pcset: string | number | string[]) => string[]`

Given a pcset or a list of notes, it returns the sorted pitch class notes:

```js
Pcset.notes(["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4"]); // => ["C", "D", "E", "F", "G", "A", "Bb"]
Pcset.notes("101011010110"); // => ["C", "D", "E", "F", "G", "A", "Bb"]
```

## Querying

### `Pcset.isNoteIncludedIn`

`isNoteIncludedIn(parent: Set) => (note: string) => boolean`

Test if a note is included in the given set. This function is curried:

```js
const isInCTriad = Pcset.isNoteIncludedIn(["C", "E", "G"]);
isInCTriad("C4"); // => true
isInCTriad("C#4"); // => false
```

Keep in mind that enharmonics are included:

```js
isInCTriad("Fb"); // => true
```

### `Pcset.isSubsetOf`

`isSubsetOf(parent: Set) => (subset: Set) => boolean`

Test if a set is a subset of another. This function is curried

### `Pcset.isSupersetOf`

`isSupersetOf(subset: Set) => (parent: Set) => boolean`

Test if a set is a superset of another. This function is curried

## Want more?

Take a look to [@tonaljs/scale-type](https://tonaljs.github.io/tonal/docs/dictionaries/scale-types) or [@tonaljs/chord-type](https://tonaljs.github.io/tonal/docs/dictionaries/chord-types) that are, in fact, dictionaries of pitch class sets.

## FAQ

### How do I get a list of all possible music scales?

```js
import { chromas, pcset } from "@tonaljs/pcset";
import { transposeFrom } from "@tonaljs/note";

chromas().map((chroma) => pcset(chroma).intervals.map(transposeFrom("C")));
```
