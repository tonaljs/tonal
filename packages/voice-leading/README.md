# @tonaljs/voice-leading

Contains a collection functions to find optimal transitions between chord voicings. Used by [@tonaljs/voicings](../voicings).

## Usage

ES6:

```js
import { VoiceLeading } from "tonal";
```

Nodejs:

```js
const { VoiceLeading } = require("tonal");
```

## API

### VoiceLeading

```ts
declare type VoiceLeadingFunction = (
  voicings: string[][],
  lastVoicing: string[]
) => string[];
```

A function that decides which of a set of voicings is picked as a follow up to lastVoicing.

Example:

```ts
const topNoteDiff: VoiceLeadingFunction = (voicings, lastVoicing) => {
  if (!lastVoicing || !lastVoicing.length) {
    // if no lastVoicing is given
    return voicings[0];
  }
  const topNoteMidi = (voicing: string[]) =>
    Note.midi(voicing[voicing.length - 1]) || 0;
  const diff = (voicing: string[]) =>
    Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
  return voicings.sort((a, b) => diff(a) - diff(b))[0]; // return voicing with least diff
};
```

Usage

```ts
topNoteDiff(
  [
    ["F3", "A3", "C4", "E4"], // top note = E4
    ["C4", "E4", "F4", "A4"], // top note = A4
  ],
  ["C4", "E4", "G4", "B4"] // top note = B4
);
// ['C4', 'E4', 'F4', 'A4'] // => A4 is closer to B4 than E4
```

[show available voice leading functions](./index.ts).

See [@tonaljs/voicings](../voicings) for usage examples.
