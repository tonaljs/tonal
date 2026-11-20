---
"@tonaljs/scale-type": minor
"@tonaljs/scale": minor
---

Every mode of the harmonic major, neapolitan major, neapolitan minor and double harmonic major scales has a name now. 18 new scale types: dorian b5, phrygian b4, mixolydian b2, lydian augmented #2, locrian bb7 (harmonic major); lydian augmented dominant, locrian #2 b4, altered bb3 (neapolitan major); lydian #6, mixolydian augmented, aeolian #4, locrian dominant, ionian #2, ultralocrian bb3 (neapolitan minor); lydian #2 #6, ultraphrygian, ionian augmented #2, locrian bb3 bb7 (double harmonic major). So `Scale.modeNames("C harmonic major")` names all seven modes.

Scale types (and scales) have `family` and `degree`: the parent scale they're a mode of and the degree they start on, or `""` and `0`. The families are major, melodic minor, harmonic minor, harmonic major, neapolitan major, neapolitan minor, double harmonic major and major pentatonic: `ScaleType.get("dorian b5")` is degree 2 of "harmonic major".

"balinese" is now named "neapolitan minor", its usual name and its family's name; "balinese" stays as an alias, so `Scale.get("C balinese")` still works, but its `name` and `type` are "C neapolitan minor" and "neapolitan minor", and `Scale.names()`, `Scale.detect` and `Scale.modeNames` give the new name.

New aliases: "lydian b3" (lydian diminished), "lydian augmented #6" (leading whole tone), "byzantine" and "gypsy major" (double harmonic major), "freygish" and "spanish gypsy" (phrygian dominant). The other names and aliases are unchanged. More scales also means more results from functions that search the dictionary: `Chord.chordScales("C7b9")` now includes mixolydian b2 and phrygian b4.
