---
"@tonaljs/voice-leading": minor
---

Measure voice leading and find the smoothest path, following Dmitri Tymoczko's *A Geometry of Music*:

- `VoiceLeading.get(from, to)`: the smallest voice leading between two voicings, `{ distance, moves }`. Voices are matched in order from the bottom; a smaller voicing doubles notes.
- `VoiceLeading.distance(from, to, { metric })`: its size, as the sum of the moves (`"L1"`, default), Euclidean (`"L2"`) or the largest move (`"Linf"`). `null` for an empty voicing or a note without octave.
- `VoiceLeading.pcDistance(from, to)`: the same between pitch-class sets, each voice moving the shortest way.
- `VoiceLeading.path(candidates, { metric, previous, maxLeap, costs })`: the smoothest path through the candidate voicings of each chord, exact (dynamic programming), not greedy.
