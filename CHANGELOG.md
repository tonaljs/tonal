# Changelog

## 0.65.0

`tonal-note`
- Expose note properties: props, oct, alt, step

`tonal-array`
- sort: change order of parameters to make it more JS friendly

`tonal-pitchset`
- rename toBinary to chroma

## 0.64.1

`tonal-chord`
- detect: given a list of notes, return the possible chords

`tonal-pitchset`
- add functions: isBinary, rotations, fromBinary


## 0.64.0

`tonal-array`
- remove listFn (now is private)
- Move harmonizer, harmonize and harmonics to tonal-harmonizer

`tonal-harmonizer`
- New module with: harmonizer, harmonize, harmonics

`tonal-progression`
- rename build to concrete
- add abstract function to convert from chords to roman numerals

`tonal-interval`
- add props, num, value and alt functions

`tonal-notation`
- toAcc returns an empty array when is called without a number

## 0.63.1

`tonal-note`
- Add note.freq

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
