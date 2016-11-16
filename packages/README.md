# tonal packages

You can [read the generated API documentation here](http://danigb.github.io/tonal/api/).


#### [tonal-note](https://github.com/danigb/tonal/tree/master/modules/note) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
  - [noteName](https://github.com/danigb/tonal/tree/master/modules/note#noteName): get the note name
  - [chroma](https://github.com/danigb/tonal/tree/master/modules/note#chroma): get chroma of a note
  - [pc](https://github.com/danigb/tonal/tree/master/modules/note#pc): get pitch class of a note
  - [enharmonics](https://github.com/danigb/tonal/tree/master/modules/note#enenharmonics): get a list of note enharmonics
  - [simpleEnh](https://github.com/danigb/tonal/tree/master/modules/note#simpleEnh): get the simplest enharmonic of a note

#### [tonal-interval](https://github.com/danigb/tonal/tree/master/modules/interval) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
  - [ivlName](https://github.com/danigb/tonal/tree/master/modules/interval#vilName): get the interval name
  - [semitones](https://github.com/danigb/tonal/tree/master/modules/interval#semitones): get the size of an interval in semitones
  - [fromSemitones](https://github.com/danigb/tonal/tree/master/modules/interval#fromSemitones): create an interval from a semitones number
  - [ic](https://github.com/danigb/tonal/tree/master/modules/interval#ic): get interval class
  - [itype](https://github.com/danigb/tonal/tree/master/modules/interval#itype): get interval type
  - [invert](https://github.com/danigb/tonal/tree/master/modules/interval#invert): invert interval
  - [simplify](https://github.com/danigb/tonal/tree/master/modules/interval#ssimplify): simplify interval

#### [tonal-midi](https://github.com/danigb/tonal/tree/master/modules/midi) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-midi.svg)](https://www.npmjs.com/package/tonal-midi)
  - [isMidiNum](https://github.com/danigb/tonal/tree/master/modules/midi#isMidiNum): test if the given number is a valid midi note number
  - [toMidi](https://github.com/danigb/tonal/tree/master/modules/midi#toMidi): get midi note number from a note
  - [fromMidi](https://github.com/danigb/tonal/tree/master/modules/midi#fromMidi): get note name from midi number
  - [fromMidiS](https://github.com/danigb/tonal/tree/master/modules/midi#fromMidiS): get note name from midi number using sharps when altered

#### [tonal-freq](https://github.com/danigb/tonal/tree/master/modules/freq) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-freq.svg)](https://www.npmjs.com/package/tonal-freq)
  - [toFreq](https://github.com/danigb/tonal/tree/master/modules/freq#toFreq): get frequency of a note name
  - [fromFreq](https://github.com/danigb/tonal/tree/master/modules/freq#fromFreq): get note name from frequency
  - [cents](https://github.com/danigb/tonal/tree/master/modules/freq#cents): get distance in cents between two notes or frequencies
  - [toEqualTemp](https://github.com/danigb/tonal/tree/master/modules/freq#totoEqualTemp): create a function to convert notes to frequencies using equal temperament
  - [fromEqualTemp](https://github.com/danigb/tonal/tree/master/modules/freq#fromEqualTemp): create a function to convert frequencies to notes using equal temperament

#### [tonal-transpose](https://github.com/danigb/tonal/tree/master/modules/transpose) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-transpose.svg)](https://www.npmjs.com/package/tonal-transpose)
 - [transpose](https://github.com/danigb/tonal/tree/master/modules/transpose#transpose): transpose notes by intervals. Can be used to add intervals.
 - [trFifths](https://github.com/danigb/tonal/tree/master/modules/transpose#trFifths): transpose a note by a number of perfect fifths

#### [tonal-distance](https://github.com/danigb/tonal/tree/master/modules/distance) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
  - [distance](https://github.com/danigb/tonal/tree/master/modules/distance#distance): find the interval distance between two notes
  - [distInSemitones](https://github.com/danigb/tonal/tree/master/modules/distance#distInSemitones): get the distance between notes measured in semitones

#### [tonal-array](https://github.com/danigb/tonal/tree/master/modules/array) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-array.svg)](https://www.npmjs.com/package/tonal-array)
  - [asArr](https://github.com/danigb/tonal/tree/master/modules/array#asArr): split a strings into arrays
  - [map](https://github.com/danigb/tonal/tree/master/modules/array#map): map a function to a list
  - [filter](https://github.com/danigb/tonal/tree/master/modules/array#filter): filter a list using a function
  - [harmonizer](https://github.com/danigb/tonal/tree/master/modules/array#harmonizer): return a function that harmonizes notes using a list of intervals
  - [harmonize](https://github.com/danigb/tonal/tree/master/modules/array#harmonize): given a note and a list of intervals, harmonize the note with the intervals
  - [harmonics](https://github.com/danigb/tonal/tree/master/modules/array#harmonics): Given a list of notes, return the intervals from the first note to the rest.
  - [rotate](https://github.com/danigb/tonal/tree/master/modules/array#rotate): rotate a list
  - [rotateAsc](https://github.com/danigb/tonal/tree/master/modules/array#rotateAsc): rotate an list of ascending pitches keeping the asceding property after rotation
  - [select](https://github.com/danigb/tonal/tree/master/modules/array#select): select some elements from a list
  - [sort](https://github.com/danigb/tonal/tree/master/modules/array#sort): sort a list of notes or intervals
  - [shuffle](https://github.com/danigb/tonal/tree/master/modules/array#shuffle): shuffle an array


#### [tonal-filter](https://github.com/danigb/tonal/tree/master/modules/filter) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-filter.svg)](https://www.npmjs.com/package/tonal-filter)
- [scaleFilter](https://github.com/danigb/tonal/tree/master/modules/filter#scaleFilter): filter notes by a scale

#### [tonal-range](https://github.com/danigb/tonal/tree/master/modules/range) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-range.svg)](https://www.npmjs.com/package/tonal-range)
- [range](https://github.com/danigb/tonal/tree/master/modules/range#range): create a range of notes
- [scaleRange](https://github.com/danigb/tonal/tree/master/modules/range#sscaleRange): create a range using a scale
- [chromatic](https://github.com/danigb/tonal/tree/master/modules/range#chromatic): create a chromatic range
- [cycleOfFifths](https://github.com/danigb/tonal/tree/master/modules/range#cycleOfFifths): create a cycle of fifths range

#### [tonal-scale](https://github.com/danigb/tonal/tree/master/modules/scale) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-scale.svg)](https://www.npmjs.com/package/tonal-scale)

- [get](https://github.com/danigb/tonal/tree/master/modules/scale#get): get a scale from name
- [build](https://github.com/danigb/tonal/tree/master/modules/scale#build): build a scale from type or intervals and tonic
- [names](https://github.com/danigb/tonal/tree/master/modules/scale#names): get a list of all scale names

#### [tonal-chord](https://github.com/danigb/tonal/tree/master/modules/chord) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
- [get](https://github.com/danigb/tonal/tree/master/modules/chord#get): get a chord from name
- [build](https://github.com/danigb/tonal/tree/master/modules/chord#build): build a chord from type or intervals and tonic
- [names](https://github.com/danigb/tonal/tree/master/modules/chord#names): get a list of all chord names


#### [tonal-key](https://github.com/danigb/tonal/tree/master/modules/key) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-key.svg)](https://www.npmjs.com/package/tonal-key)

- [scale](https://github.com/danigb/tonal/tree/master/modules/key#scale): Get the scale of a given key
- [relative](https://github.com/danigb/tonal/tree/master/modules/key#relative): Given a key in one mode, find it's relative in other.
- [names](https://github.com/danigb/tonal/tree/master/modules/key#names): Get a list of mode names.
- [isKeyMode](https://github.com/danigb/tonal/tree/master/modules/key#isKeyMode): test if a string is a valid key mode
- [build](https://github.com/danigb/tonal/tree/master/modules/key#build): build a key from mode and tonic
- [fromAlter](https://github.com/danigb/tonal/tree/master/modules/key#fromAlter): create a key from alteration
- [fromAcc](https://github.com/danigb/tonal/tree/master/modules/key#fromAcc): create a key from accidentals
- [fromName](https://github.com/danigb/tonal/tree/master/modules/key#fromName): create a key from name
- [asKey](https://github.com/danigb/tonal/tree/master/modules/key#asKey): try to interpret the object as a key
- [alteration](https://github.com/danigb/tonal/tree/master/modules/key#alteration): get key alteration
- [accidentals](https://github.com/danigb/tonal/tree/master/modules/key#accidentals): get key accidentals
- [alteredNotes](https://github.com/danigb/tonal/tree/master/modules/key#alteredNotes): get the altered notes of a key

#### [tonal-progression](https://github.com/danigb/tonal/tree/master/modules/progression) ⇒ [![npm version](https://img.shields.io/npm/v/tonal-progression.svg)](https://www.npmjs.com/package/tonal-progression)

- [build](https://github.com/danigb/tonal/tree/master/modules/progression#build): build a progression from a list of chords (in roman numerals) and a tonic
- [romanRegex](https://github.com/danigb/tonal/tree/master/modules/progression#romanRegex): get a regex to match roman numerals.
- [parseRomanChord](https://github.com/danigb/tonal/tree/master/modules/progression#parseRomanChord): parse chord expressed with roman numerals.
