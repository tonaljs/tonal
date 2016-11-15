# Changelog

## 0.60.0

`tonal`
- Big breaking change: the packages are now namespaced! So instead of `tonal.pc` you need to write `tonal.note.pc`
- Add scale, chord, notation, progression, sonority.

`tonal-note`
- Rename simpleEnh to simplify
- Remove enh alias
- rename noteName to toNote

`tonal-interval`
- Rename ivlName to toInterval

`tonal-midi`
- rename toMidi to fromNote
- rename fromMidi to toNote
- remove fromMidiS, instead use an optional parameter in toNote
- rename isMidiNum to isValidNote

`tonal-range`
- rename range to numeric
- rename cycleOfFifths to fifths
- rename scaleRange to pitchSet
- add sharps option to chromatic

`tonal-distance`
- rename distance to interval
- return distInSemitones to semitones

`tonal-filter`
- TODO: needs some thinking about API

`tonal-dictionary`
- rename fromName to get
- rename names to keys

`tonal-transpose`
- remove tr alias
