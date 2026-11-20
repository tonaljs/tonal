# ABC Notation

> Convert note names between scientific and abc notation

```js
import { AbcNotation } from "tonal";

AbcNotation.abcToScientificNotation("c"); // => "C5"
```

## API

### `AbcNotation.abcToScientificNotation`

`abcToScientificNotation(noteNameInAbc: string) => string`

```js
AbcNotation.abcToScientificNotation("c"); // => "C5"
```

### `AbcNotation.scientificToAbcNotation`

`scientificToAbcNotation(noteNameInScientific: string) => string`

```js
AbcNotation.scientificToAbcNotation("C#4"); // => "^C"
```

### `AbcNotation.transpose`

`transpose(note: string, interval: string) => string`

Transpose an note in abc notation:

```js
AbcNotation.transpose("=C", "P19"); // => "g'"
```

### `AbcNotation.distance`

`distance(from: string, to: string) => string`

Find the interval between two notes in abc notation:

```js
AbcNotation.distance("=C", "g"); // => "12P"
```

### `AbcNotation.tokenize`

`tokenize(note: string) => [string, string, string]`

Split a note in abc notation into its accidentals, letter and octave marks. Invalid notes give empty strings:

```js
AbcNotation.tokenize("^c'"); // => ["^", "c", "'"]
AbcNotation.tokenize("_B,,"); // => ["_", "B", ",,"]
AbcNotation.tokenize("x"); // => ["", "", ""]
```

## References

- [ABC Notation](https://en.wikipedia.org/wiki/ABC_notation)
