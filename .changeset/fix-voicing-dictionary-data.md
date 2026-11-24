---
"@tonaljs/voicing-dictionary": patch
---

Fix three `lefthand` voicings that gave wrong or misspelled notes: `69` had an augmented sixth (`C69` sounded A# instead of A), `7#11` had an augmented thirteenth (A# instead of A), and `o7` spelled its diminished seventh as a major sixth (A instead of Bbb, unlike `Chord.notes("Co7")`). A new test checks that every voicing note is a chord tone or a tension, spelled as in the chord.
