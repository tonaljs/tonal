# @tonaljs/pcset ![tonal](https://img.shields.io/badge/@tonaljs-pcset-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pcset.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pcset)

> Functions to create and manipulate musical pitch class sets

A pitch class set is a set (no repeated) of pitch classes (notes without octaves). Pitch classes are useful to identify musical structures (if two chords are related, for example)

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

A set number must be a whole number from 0 to 4095. Any other number gives the empty set:

```js
Pcset.get(2.5).empty; // => true
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

### `Pcset.isChroma`

`isChroma(value: any) => boolean`

Test if the value is a pitch class set chroma (a string of 12 ones or zeros):

```js
Pcset.isChroma("101010000000"); // => true
Pcset.isChroma("1010"); // => false
```

## Notes and intervals

### `Pcset.notes`

`notes(pcset: string | number | string[]) => string[]`

Given a pcset or a list of notes, it returns the sorted pitch class notes:

```js
Pcset.notes(["D3", "A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4"]); // => ["C", "D", "E", "F", "G", "A", "Bb"]
Pcset.notes("101011010110"); // => ["C", "D", "E", "F", "G", "A", "Bb"]
```

### `Pcset.modes`

`modes(set: Set, normalize?: boolean) => string[]`

Get the rotations of a set, as chromas. This is used, for example, to get the modes of a scale. By default it removes the rotations that don't start with a note (`normalize = false` keeps them):

```js
Pcset.modes(["C", "D", "E"]); // => ["101010000000", "101000000010", "100000001010"]
Pcset.modes(["C", "D", "E"]).map(Pcset.intervals); // => [["1P", "2M", "3M"], ["1P", "2M", "7m"], ["1P", "6m", "7m"]]
```

### `Pcset.chromas`

`chromas() => string[]`

Get the chromas of all the 2048 possible pitch class sets that include C:

```js
Pcset.chromas().length; // => 2048
Pcset.chromas()[0]; // => "100000000000"
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

Test if a set is a proper subset of another: all its notes are in the other set, which has more (a set is not a subset of itself). This function is curried

### `Pcset.isSupersetOf`

`isSupersetOf(subset: Set) => (parent: Set) => boolean`

Test if a set is a proper superset of another: it has all the notes of the other set and more (a set is not a superset of itself). This function is curried

### `Pcset.isEqual`

`isEqual(set1: Set, set2: Set) => boolean`

Test if two sets have the same pitch classes:

```js
Pcset.isEqual(["c2", "d3"], ["c5", "d2"]); // => true
Pcset.isEqual(["C", "E"], ["C", "Eb"]); // => false
```

### `Pcset.filter`

`filter(set: Set) => (notes: string[]) => string[]`

Returns a function that keeps the notes included in the set (with any octave). This function is curried:

```js
Pcset.filter(["C", "D", "E"])(["c2", "c#2", "d2", "c3", "c#3", "d3"]); // => ["c2", "d2", "c3", "d3"]
Pcset.filter(["C2"])(["c2", "c#2", "d2", "c3", "c#3", "d3"]); // => ["c2", "c3"]
```

## Want more?

Take a look to [@tonaljs/scale-type](https://tonaljs.github.io/tonal/docs/dictionaries/scale-types) or [@tonaljs/chord-type](https://tonaljs.github.io/tonal/docs/dictionaries/chord-types) that are, in fact, dictionaries of pitch class sets.

## FAQ

### How do I get a list of all possible music scales?

```js
import { chromas, pcset } from "@tonaljs/pcset";
import { transposeFrom } from "@tonaljs/note";

chromas().map((chroma) => pcset(chroma).intervals.map(transposeFrom("C")));
```
