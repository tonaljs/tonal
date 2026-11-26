---
"@tonaljs/rhythm-pattern": minor
"tonal": minor
---

Rhythm patterns from durations and onset positions, and measures from Toussaint's _The Geometry of Musical Rhythm_ (#483).

- `fromDurations([3, 3, 2])` and `fromOnsets([0, 3, 6], 8)` build a pattern (`[1, 0, 0, 1, 0, 0, 1, 0]`); `toDurations` and `toOnsets` read it back. Positions count from 0, and a pattern is a loop.
- `onsets` is deprecated and warns on every call: its numbers are the rests after each onset, not onsets. `onsets(...gaps)` is `fromDurations(gaps.map((g) => g + 1))`. It will be removed in tonal 7.
- `complement`, `necklace` (the same for every rotation) and `intervalVector`.
- `isMaximallyEven`, `evenness`, `isDeep`, `hasOddity`, `oddity`, `offbeatness` and `distance` (`"hamming"` or `"swap"`). Measures that can't be computed return `null`.
- The `euclid` docs note its argument order: steps first, then beats (E(3, 8) is `euclid(8, 3)`).
