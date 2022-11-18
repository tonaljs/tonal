# @tonaljs/voicing-dictionary

Contains dictionaries for many chord voicings. Used by [@tonaljs/voicings](../voicings).

## Usage

ES6:

```js
import { VoicingDictionary } from "tonal";
```

Nodejs:

```js
const { VoicingDictionary } = require("tonal");
```

## API

### VoicingDictionary

Maps a chord symbol to a set of voicings:

```ts
const lefthand = {
  m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
  "7": ["3M 6M 7m 9M", "7m 9M 10M 13M"],
  "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
  "69": ["3M 5P 6A 9M"],
  m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
  "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
  o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
  "7#11": ["7m 9M 11A 13A"],
  "7#9": ["3M 7m 9A"],
  mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
  m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"],
};
```

[show available dictionaries](./data.ts).

See [@tonaljs/voicings](../voicings) for usage examples.
