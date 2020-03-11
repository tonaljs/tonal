# @tonaljs/chord-detect ![tonal](https://img.shields.io/badge/@tonaljs-chord_detect-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/chord-detect.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/chord-detect)

## Usage

With ES6 `import`:

```js
import { ChordDetect } from "@tonaljs/tonal";
```

With ES5 `require`:

```js
const { ChordDetect } = require("@tonaljs/tonal");
```

Standalone:

```js
import { detect } from "@tonaljs/chord-detect";
```

## API

### `ChordDetect.detect(notes: string[]) => string[]`

Examples:

```js
ChordDetect.detect(["D", "F#", "A", "C"]); // => ["D7"]
ChordDetect.detect(["F#", "A", "C", "D"]); // => ["D7/F#"]
ChordDetect.detect(["A", "C", "D", "F#"]); // => ["D7/A"]
ChordDetect.detect(["E", "G#", "B", "C#"]); // => ["E6", "C#m7/E"]
```

This function is also exposed in [`Chord`](/packages/chord) module.
