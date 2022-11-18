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

## API

#### `get(src: note[] | string | number)`

Given a collection of notes, a pitch class chroma string or a pitch class number, it returns a properties object with the following attributes:

- num: the set number. Each pitch class set can be represented by an unique name between 0 and 4096. Those are the possible combinations of 12 different elements (pitch classesj)
- chroma: the set number as binary string
- intervals: the list of intervals **starting from C**
- length: the number of notes

Example:

```js
Pcset.get(["c", "d", "e"]);
// =>
// {
//   num: 2688,
//   chroma: "101010000000",
//   intervals: ["1P", "2M", "3M"],
//   length: 3
// }
```

It is possible to obtain the properties from chroma or set number. All this function calls returns the same object:

```js
Pcset.get(["c", "d", "e"]);
Pcset.get(2688);
Pcset.get("101010000000");
```

Several shorthands (`num`, `chroma`, intervals`) are provided:

```js
Pcset.chroma(["c", "d", "e"]); //=> "101010000000"
Pcset.num(["c", "d", "e"]); //=> 2192

// several set representations are accepted
Pcset.chroma(2192); //=> "101010000000"
Pcset.num("101010000000"); // => 2192
```

Intervals are always calculated from `C`:

```js
Pcset.intervals(["c", "d", "e"]); // => ["1P", "5P", "7M"]
Pcset.intervals(["D", "F", "A"]); // => ["2M", "4P", "6M"]
```

### `isIncludedIn(parent: Set) => (note: string) => boolean`

Test if a note is included in the given set. This function is currified:

```js
const isInCTriad = isNoteIncludedIn(["C", "E", "G"]);
isInCTriad("C4"); // => true
isInCTriad("C#4"); // => false
```

Keep in mind that enharmonics are included:

```js
isInCTriad("Fb"); // => true
```

#### `isSubsetOf(parent: Set) => (subset: Set) => boolean`

Test if a set is a subset of another. This function is currified

#### `isSupersetOf(subset: Set) => (parent: Set) => boolean`

Test if a set is a superset of another. This function is currified

## Want more?

Take a look to [@tonal/scale-type]() or [@tonal/chord-type]() that are, in fact, dictionaries of pitch class sets.

## FAQ

##### How do I get a list of all possible music scales?

```js
import { chromas, pcset } from "@tonaljs/pcset";
import { transposeFrom } from "@tonaljs/note";

chromas().map((chroma) => pcset(chroma).intervals.map(transposeFrom("C")));
```
