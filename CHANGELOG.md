# Changelog

## 0.63.0

`tonal-pitchset`
- Add includes
- Add filter

`tonal-array`
- Remove cMap

`tonal-filter`
- Deprecated

## 0.62.0

`tonal-pitchset`
- Add toBinary, equal, subset and superset functions

`tonal-note`
- add note.midi and note.fromMidi
- add note.freq

`tonal-midi`
- Rename fromNote to toMidi
- Remove isValidNote

`tonal-freq`
- Rename fromFreq a toNote
- Rename midiFromFreq a toMidi (and now it can return float numbers)

## 0.61.0

__Now packages are namespaced inside tonal. Instead of `tonal.invert` now we have to write `tonal.ivl.invert`__

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
