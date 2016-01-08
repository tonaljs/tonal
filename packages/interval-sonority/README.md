# interval-analyzer

This is mostly an academic puzzle. Implements the ideas found in "The Analysis of Intervals" chapter from [Harmonic Materials of Modern Music]():

> The letters _pmn_, therefore, represent intervals commonly considered consonant, whereas the letters _sdt_ represent the intervals commonly considered dissonant. (...) A sonority represented, for example, by the symbol `sd^2`, indicating a triad composed of one major second and two minor seconds, would be recognized as a highly dissonant sound, while the symbol `pmn` would indicate a consonant sound.

```js
var sonority = require('interval-sonority')
sonority('C3 D5 F#2 G4') // => []
```
