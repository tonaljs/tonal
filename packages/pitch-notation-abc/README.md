# @tonaljs/pitch-notation-abc ![tonal](https://img.shields.io/badge/@tonaljs-pitch_notation_abc-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch-notation-abc.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch-notation-scientific)

> Parse note names in ABC notation

## Usage

```js
import AbcNotation from "@tonaljs/pitch-notation-abc";
```

## API

#### `abcToScientificNotation(noteNameInAbc: string) => string`

```js
AbcNotation.abcToScientificNotation("c"); // => "C5"
```

#### `scientificToAbcNotation(noteNameInScientific: string) => string`

```js
AbcNotation.scientificToAbcNotation("C#4"); // => "^C"
```

## References

- [ABC Notation in Wikipedia](https://en.wikipedia.org/wiki/ABC_notation)
- [ABC Notation learning materials](https://abcnotation.com/learn)
- [ABC Notation standard documentation (old and new)](https://abcnotation.com/wiki/abc:standard)
- [ABC in BCN format](https://web.archive.org/web/20080309023424/http://www.norbeck.nu/abc/abcbnf.htm)
