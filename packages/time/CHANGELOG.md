# @tonaljs/time

## 1.0.0

### Major Changes

- 5acfe18: A new package, `@tonaljs/time` (`Time` in `tonal`): musical time as exact values. Positions and durations are numbers of quarter notes, returned as reduced fractions (`[3, 2]` is a dotted quarter, `[1, 3]` a triplet eighth), so triplets and septuplets add up exactly. As input, functions also take exact numbers (multiples of 1/1024, like `1.5`) and strings (`"3/2"`).

  - `fraction`, `add`, `sub`, `mul`, `div`, `compare`, `equal`, `toNumber`, `toString`.
  - `duration("q.")` is `[3, 2]`: a `DurationValue` in quarters.
  - `meter("6/8")` gives the length of the bar (`[3, 1]`), of the beat (the lower note: `[1, 2]`) and of each pulse (the groups it's felt in: two dotted quarters); additive meters have one pulse per group.
  - `fromBarBeat("2:3+1/3", "4/4")` is `[19, 3]`, and `toBarBeat` goes back. Beats are the lower note, as in most music software: in 6/8 the second dotted quarter is `"1:4"`.
  - `onsets(pattern, step, start)` turns a `RhythmPattern` into positions: `onsets([1, 0, 0, 1, 0, 0, 1, 0], [1, 2])` is `[[0, 1], [3, 2], [3, 1]]`.

  It says where something is in musical time, never when it plays: no seconds, tempo or scheduling.
