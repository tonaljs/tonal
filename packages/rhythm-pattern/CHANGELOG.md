# @tonaljs/rhythm-pattern

## 1.0.0 Initial release

New package:

```ts
import { RhythmPattern } from "tonal";

RhythmPattern.euclid(8, 3); // => [1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.hex("8f"); // => [1, 0, 0, 0, 1, 1, 1, 1]
RhythmPattern.binary(12, 13); // => [1, 1, 0, 0, 1, 1, 0, 1]
RhythmPattern.onsets(1, 2, 2, 1); // => [1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
RhythmPattern.random(4); // => [1, 0, 0, 1]
RhythmPattern.probability([0.6, 0, 0.2, 0.5]); // => [0, 0, 0, 1]
RhythmPattern.rotate([1, 0, 0, 1], 2); // => [0, 1, 1, 0]
```
