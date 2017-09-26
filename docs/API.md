<a name="module_note"></a>

# note
[![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
[![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-note` is a collection of functions to manipulate musical notes in scientific notation

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import * as note from 'tonal-note'
// or const note = require('tonal-note')
note.name('bb2') // => 'Bb2'
note.chroma('bb2') // => 10
note.midi('a4') // => 69
note.freq('a4') // => 440
note.oct('G3') // => 3

// part of tonal
const tonal = require('tonal')
tonal.note.midi('d4') // => 62
```

## Install

[![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)

## API Documentation


* [note](#module_note)
    * [`.isNote`](#module_note.isNote) ⇒ <code>boolean</code>
    * [`.freqToMidi`](#module_note.freqToMidi) ⇒ <code>Number</code>
    * [`.chroma`](#module_note.chroma) ⇒ <code>Integer</code>
    * [`.stepToLetter`](#module_note.stepToLetter) ⇒ <code>string</code>
    * [`.altToAcc`](#module_note.altToAcc) ⇒ <code>String</code>
    * [`.name()`](#module_note.name) ⇒ <code>string</code>
    * [`.pc()`](#module_note.pc) ⇒ <code>string</code>
    * [`.midi(note)`](#module_note.midi) ⇒ <code>Integer</code>
    * [`.freq(note)`](#module_note.freq) ⇒ <code>Number</code>
    * [`.oct(note)`](#module_note.oct) ⇒ <code>Integer</code>
    * [`.step(note)`](#module_note.step) ⇒ <code>Integer</code>
    * [`.alt(note)`](#module_note.alt) ⇒ <code>Integer</code>
    * [`.fromMidi(midi, [boolean])`](#module_note.fromMidi) ⇒ <code>string</code>

<a name="module_note.isNote"></a>

## `note.isNote` ⇒ <code>boolean</code>
Test if the given string is a note

**Kind**: static constant of [<code>note</code>](#module_note)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_note.freqToMidi"></a>

## `note.freqToMidi` ⇒ <code>Number</code>
Get the midi number from a frequency in hertz. The midi number can
contain decimals (with two digits precission)

**Kind**: static constant of [<code>note</code>](#module_note)  

| Param | Type |
| --- | --- |
| frequency | <code>Number</code> | 

**Example**  
```js
note.freqToMidi(220)); //=> 57;
note.freqToMidi(261.62)); //=> 60;
note.freqToMidi(261)); //=> 59.96;
```
<a name="module_note.chroma"></a>

## `note.chroma` ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: static constant of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the chroma number  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note name |

**Example**  
```js
const note = require('tonal-note')
note.chroma('Cb') // => 11
['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
```
<a name="module_note.stepToLetter"></a>

## `note.stepToLetter` ⇒ <code>string</code>
Given a step number return it's letter (0 = C, 1 = D, 2 = E)

**Kind**: static constant of [<code>note</code>](#module_note)  
**Returns**: <code>string</code> - the letter  

| Param | Type |
| --- | --- |
| step | <code>number</code> | 

**Example**  
```js
note.stepToLetter(3) // => "F"
```
<a name="module_note.altToAcc"></a>

## `note.altToAcc` ⇒ <code>String</code>
Given an alteration number, return the accidentals

**Kind**: static constant of [<code>note</code>](#module_note)  

| Param | Type |
| --- | --- |
| alt | <code>Number</code> | 

**Example**  
```js
note.altToAcc(-3) // => 'bbb'
```
<a name="module_note.name"></a>

## `note.name()` ⇒ <code>string</code>
Given a note name, return the note name or null if not valid note.
The note name will ALWAYS have the letter in upercase and accidentals
using # or b

Can be used to test if a string is a valid note name.

**Kind**: static method of [<code>note</code>](#module_note)  

| Type |
| --- |
| <code>Pitch</code> \| <code>string</code> | 

**Example**  
```js
const note = require('tonal-note')
note.name('cb2') // => 'Cb2'
['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
```
<a name="module_note.pc"></a>

## `note.pc()` ⇒ <code>string</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>string</code> - the pitch class  

| Type |
| --- |
| <code>string</code> \| <code>Pitch</code> | 

**Example**  
```js
tonal.pc('Db3') // => 'Db'
tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
```
<a name="module_note.midi"></a>

## `note.midi(note)` ⇒ <code>Integer</code>
Get the note midi number
(an alias of tonal-midi `toMidi` function)

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the midi number or null if not valid pitch  
**See**: midi.toMidi  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Number</code> | the note to get the midi number from |

**Example**  
```js
note.midi('C4') // => 60
note.midi(60) // => 60
```
<a name="module_note.freq"></a>

## `note.freq(note)` ⇒ <code>Number</code>
Get the frequency of a note

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Number</code> - the frequency  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Number</code> | the note name or midi note number |

**Example**  
```js
note.freq('A4') // => 440
note.freq(69) // => 440
```
<a name="module_note.oct"></a>

## `note.oct(note)` ⇒ <code>Integer</code>
Get the octave of the given pitch

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the octave or null if doesn't have an octave or not a valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note |

**Example**  
```js
note.oct('C#4') // => 4
note.oct('C') // => null
note.oct('blah') // => undefined
```
<a name="module_note.step"></a>

## `note.step(note)` ⇒ <code>Integer</code>
Get the note step: a number equivalent of the note letter. 0 means C and
6 means B. This is different from `chroma` (see example)

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - a number between 0 and 6 or null if not a note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note |

**Example**  
```js
note.step('C') // => 0
note.step('Cb') // => 0
// usually what you need is chroma
note.chroma('Cb') // => 6
```
<a name="module_note.alt"></a>

## `note.alt(note)` ⇒ <code>Integer</code>
Get the note alteration: a number equivalent to the accidentals. 0 means
no accidentals, negative numbers are for flats, positive for sharps

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the alteration  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Pitch</code> | the note |

**Example**  
```js
note.alt('C') // => 0
note.alt('C#') // => 1
note.alt('Cb') // => -1
```
<a name="module_note.fromMidi"></a>

## `note.fromMidi(midi, [boolean])` ⇒ <code>string</code>
Given a midi number, returns a note name. The altered notes will have
flats unless explicitly set with the optional `useSharps` parameter.

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>string</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>number</code> | the midi note number |
| [boolean] |  | useSharps - (Optional) set to true to use sharps instead of flats |

**Example**  
```js
const note = require('tonal-note')
note.fromMidi(61) // => 'Db4'
note.fromMidi(61, true) // => 'C#4'
// it rounds to nearest note
note.fromMidi(61.7) // => 'D4'
```
<a name="module_interval"></a>

# interval
[![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
[![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-interval` is a collection of functions to create and manipulate music intervals.

The intervals are strings in shorthand notation. Two variations are supported:

- standard shorthand notation: type and number, for example: 'M3', 'd-4'
- inverse shorthand notation: number and then type, for example: '3M', '-4d'

The problem with the standard shorthand notation is that some strings can be
parsed as notes or intervals, for example: 'A4' can be note A in 4th octave
or an augmented four. To remove ambiguity, the prefered notation in tonal is the
inverse shortand notation.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import * as interval from 'tonal-interval'
// or const interval = require('tonal-interval')
interval.semitones('4P') // => 5
interval.invert('3m') // => '6M'
interval.simplify('9m') // => '2m'
```

## Install

[![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)

## API Documentation

<a name="module_interval.fromSemitones"></a>

## `interval.fromSemitones` ⇒ <code>String</code>
Get interval name from semitones number. Since there are several interval
names for the same number, the name it's arbitraty, but deterministic.

**Kind**: static constant of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | the number of semitones (can be negative) |

**Example**  
```js
import { fromSemitones } from 'tonal-interval'
fromSemitones(7) // => '5P'
// or using tonal
tonal.fromSemitones(-7) // => '-5P'
```
<a name="module_distance"></a>

# distance
[![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
[![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)

Transpose notes by intervals and find distances between notes

**Example**  
```js
// using ES6 import
import { interval, semitones, transpose } from 'tonal-distance'
semitones('C' ,'D') // => 2
interval('C4', 'G4') // => '5P'
transpose('C4', 'P5') // => 'G4'

// included in tonal facade
const tonal = require('tonal');
tonal.distance.transpose('C4', 'P5')
tonal.distance.transposeBy('P5', 'C4')
```

* [distance](#module_distance)
    * _static_
        * [`.transpose(note, interval)`](#module_distance.transpose) ⇒ <code>String</code>
        * [`.trFifths(pitchClass, fifhts)`](#module_distance.trFifths) ⇒ <code>String</code>
        * [`.fifths(to, from)`](#module_distance.fifths)
        * [`.transposeBy(note, interval)`](#module_distance.transposeBy) ⇒ <code>String</code>
        * [`.add(interval1, interval2)`](#module_distance.add) ⇒ <code>String</code>
        * [`.subtract(minuend, subtrahend)`](#module_distance.subtract) ⇒ <code>String</code>
        * [`.interval(from, to)`](#module_distance.interval) ⇒ <code>String</code>
        * [`.semitones(from, to)`](#module_distance.semitones) ⇒ <code>Integer</code>
    * _inner_
        * [`~decode(fifths, octs)`](#module_distance..decode) ⇒ <code>Array</code>

<a name="module_distance.transpose"></a>

## `distance.transpose(note, interval)` ⇒ <code>String</code>
Transpose a note by an interval. The note can be a pitch class.

This function can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>String</code> | 
| interval | <code>String</code> | 

**Example**  
```js
import { tranpose } from 'tonal-distance'
transpose('d3', '3M') // => 'F#3'
// it works with pitch classes
transpose('D', '3M') // => 'F#'
// can be partially applied
['C', 'D', 'E', 'F', 'G'].map(transpose('M3)) // => ['E', 'F#', 'G#', 'A', 'B']
```
<a name="module_distance.trFifths"></a>

## `distance.trFifths(pitchClass, fifhts)` ⇒ <code>String</code>
Transpose a pitch class by a number of perfect fifths. 

It can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed pitch class  

| Param | Type | Description |
| --- | --- | --- |
| pitchClass | <code>String</code> | the pitch class |
| fifhts | <code>Integer</code> | the number of fifths |

**Example**  
```js
import { trFifths } from 'tonal-transpose'
[0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
// or using tonal
tonal.trFifths('G4', 1) // => 'D'
```
<a name="module_distance.fifths"></a>

## `distance.fifths(to, from)`
Get the distance in fifths between pitch classes

Can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  

| Param | Type | Description |
| --- | --- | --- |
| to | <code>String</code> | note or pitch class |
| from | <code>String</code> | note or pitch class |

<a name="module_distance.transposeBy"></a>

## `distance.transposeBy(note, interval)` ⇒ <code>String</code>
The same as transpose with the arguments inverted.

Can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>String</code> | 
| interval | <code>String</code> | 

**Example**  
```js
import { tranposeBy } from 'tonal-distance'
transposeBy('3m', '5P') // => '7m'
```
<a name="module_distance.add"></a>

## `distance.add(interval1, interval2)` ⇒ <code>String</code>
Add two intervals 

Can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the resulting interval  

| Param | Type |
| --- | --- |
| interval1 | <code>String</code> | 
| interval2 | <code>String</code> | 

**Example**  
```js
import { add } from 'tonal-distance'
add('3m', '5P') // => '7m'
```
<a name="module_distance.subtract"></a>

## `distance.subtract(minuend, subtrahend)` ⇒ <code>String</code>
Subtract two intervals

Can be partially applied

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - interval diference  

| Param | Type |
| --- | --- |
| minuend | <code>String</code> | 
| subtrahend | <code>String</code> | 

<a name="module_distance.interval"></a>

## `distance.interval(from, to)` ⇒ <code>String</code>
Find the interval between two pitches. It works with pitch classes 
(both must be pitch classes and the interval is always ascending)

Can be partially applied

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the interval distance  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>String</code> | distance from |
| to | <code>String</code> | distance to |

**Example**  
```js
import { interval } from 'tonal-distance'
interval('C2', 'C3') // => 'P8'
interval('G', 'B') // => 'M3'

// or use tonal
var tonal = require('tonal')
tonal.distance.interval('M2', 'P5') // => 'P4'
```
<a name="module_distance.semitones"></a>

## `distance.semitones(from, to)` ⇒ <code>Integer</code>
Get the distance between two notes in semitones

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>Integer</code> - the distance in semitones or null if not valid notes  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>String</code> \| <code>Pitch</code> | first note |
| to | <code>String</code> \| <code>Pitch</code> | last note |

**Example**  
```js
import { semitones } from 'tonal-distance'
semitones('C3', 'A2') // => -3
// or use tonal
tonal.distance.semitones('C3', 'G3') // => 7
```
<a name="module_distance..decode"></a>

## `distance~decode(fifths, octs)` ⇒ <code>Array</code>
Decode a encoded pitch

**Kind**: inner method of [<code>distance</code>](#module_distance)  
**Returns**: <code>Array</code> - in the form [step, alt, oct]  

| Param | Type | Description |
| --- | --- | --- |
| fifths | <code>Number</code> | the number of fifths |
| octs | <code>Number</code> | the number of octaves to compensate the fifhts |

<a name="module_scale"></a>

# scale
A scale is a collection of pitches in ascending or descending order.

This module provides functions to get and manipulate scales.

**Example**  
```js
scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
scale.names() => ['major', 'minor', ...]
scale.detect('f5 d2 c5 b5 a2 e4 g') // => [ 'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian', 'A aeolian', 'B locrian'])
```

* [scale](#module_scale)
    * [`.props`](#module_scale.props) ⇒ <code>Array</code>
    * [`.intervals`](#module_scale.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.modes`](#module_scale.modes)
    * [`.chords`](#module_scale.chords)
    * [`.toScale`](#module_scale.toScale) ⇒ <code>Array</code>
    * [`.extensions`](#module_scale.extensions)
    * [`.names(aliases)`](#module_scale.names) ⇒ <code>Array</code>
    * [`.notes(tonic, name)`](#module_scale.notes) ⇒ <code>Array</code>
    * [`.exists(name)`](#module_scale.exists) ⇒ <code>Boolean</code>
    * [`.tokenize(name)`](#module_scale.tokenize) ⇒ <code>Array</code>

<a name="module_scale.props"></a>

## `scale.props` ⇒ <code>Array</code>
Get scale notes or intervals. It *always* return an array and the notes
are *always* pitch classes

**Kind**: static constant of [<code>scale</code>](#module_scale)  
**Returns**: <code>Array</code> - the scale intervals or pitch classes (if tonic is provided)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |
| [String] |  | tonic - the tonic (optional) |

**Example**  
```js
scale.get('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
```
<a name="module_scale.intervals"></a>

## `scale.intervals` ⇒ <code>Array.&lt;String&gt;</code>
Given a scale name, return its intervals. The name can be the type and
optionally the tonic (which is ignored)

It retruns an empty array when no scale found

**Kind**: static constant of [<code>scale</code>](#module_scale)  
**Returns**: <code>Array.&lt;String&gt;</code> - the scale intervals if is a known scale or an empty
array if no scale found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name (tonic and type, tonic is optional) |

**Example**  
```js
scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
```
<a name="module_scale.modes"></a>

## `scale.modes`
Find mode names of a scale

**Kind**: static constant of [<code>scale</code>](#module_scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | scale name |

<a name="module_scale.chords"></a>

## `scale.chords`
Get all chords that fits a given scale

**Kind**: static constant of [<code>scale</code>](#module_scale)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_scale.toScale"></a>

## `scale.toScale` ⇒ <code>Array</code>
Given an array of notes, return the scale: a pitch class set starting from 
the first note of the array

**Kind**: static constant of [<code>scale</code>](#module_scale)  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

<a name="module_scale.extensions"></a>

## `scale.extensions`
Find all scales than extends the given one

**Kind**: static constant of [<code>scale</code>](#module_scale)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_scale.names"></a>

## `scale.names(aliases)` ⇒ <code>Array</code>
Return the available scale names

**Kind**: static method of [<code>scale</code>](#module_scale)  
**Returns**: <code>Array</code> - the scale names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
const scale = require('tonal-scale')
scale.names() // => ['maj7', ...]
```
<a name="module_scale.notes"></a>

## `scale.notes(tonic, name)` ⇒ <code>Array</code>
Get the notes (pitch classes) of a scale. 

Note that it always returns an array, and the values are only pitch classes.

**Kind**: static method of [<code>scale</code>](#module_scale)  
**Returns**: <code>Array</code> - a pitch classes array  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> |  |
| name | <code>String</code> | the scale name |

**Example**  
```js
scale.notes("C", 'major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
scale.notes("C4", 'major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
scale.notes("A4", "no-scale") // => []
scale.notes("blah", "major") // => []
```
<a name="module_scale.exists"></a>

## `scale.exists(name)` ⇒ <code>Boolean</code>
Check if the given name is a known scale from the scales dictionary

**Kind**: static method of [<code>scale</code>](#module_scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

<a name="module_scale.tokenize"></a>

## `scale.tokenize(name)` ⇒ <code>Array</code>
Given a string with a scale name and (optionally) a tonic, split 
that components.

It retuns an array with the form [ name, tonic ] where tonic can be a 
note name or null and name can be any arbitrary string 
(this function doesn't check if that scale name exists)

**Kind**: static method of [<code>scale</code>](#module_scale)  
**Returns**: <code>Array</code> - an array [tonic, name]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

**Example**  
```js
scale.tokenize('C mixolydean') // => ["C", "mixolydean"]
scale.tokenize('anything is valid') // => [null, "anything is valid"]
scale.tokenize() // => [null, null]
```
<a name="module_chord"></a>

# chord
A chord is a harmonic unit with at least three different tones sounding simultaneously.

This module have functions to create and manipulate chords. It includes a
chord dictionary and a simple chord detection algorithm.

**Example**  
```js
var chord = require('tonal-chord')
chord.detect('c b g e') // => 'CMaj7'
chord.get('CMaj7') // => ['C', 'E', 'G', 'B']
```

* [chord](#module_chord)
    * [`.intervals`](#module_chord.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.names(aliases)`](#module_chord.names) ⇒ <code>Array</code>
    * [`.notes(nameOrTonic)`](#module_chord.notes) ⇒
    * [`.exists(name)`](#module_chord.exists) ⇒ <code>Boolean</code>
    * [`.detect(notes)`](#module_chord.detect) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.position(chord)`](#module_chord.position) ⇒ <code>Integer</code>
    * [`.inversion(num, chord)`](#module_chord.inversion) ⇒ <code>Array</code>
    * [`.tokenize(name)`](#module_chord.tokenize) ⇒ <code>Array</code>

<a name="module_chord.intervals"></a>

## `chord.intervals` ⇒ <code>Array.&lt;String&gt;</code>
Get chord intervals. It always returns an array

**Kind**: static constant of [<code>chord</code>](#module_chord)  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of intervals or null if the type is not known  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the chord name (optionally a tonic and type) |

<a name="module_chord.names"></a>

## `chord.names(aliases)` ⇒ <code>Array</code>
Return the available chord names

**Kind**: static method of [<code>chord</code>](#module_chord)  
**Returns**: <code>Array</code> - the chord names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
var chord = require('tonal-chord')
chord.names() // => ['maj7', ...]
```
<a name="module_chord.notes"></a>

## `chord.notes(nameOrTonic)` ⇒
Get the chord notes of a chord. This function accepts either a chord name
(for example: 'Cmaj7') or a list of notes.

It always returns an array, even if the chord is not found.

**Kind**: static method of [<code>chord</code>](#module_chord)  
**Returns**: [String] name - (Optional) name if the first parameter is the tonic  

| Param | Type | Description |
| --- | --- | --- |
| nameOrTonic | <code>String</code> | name of the chord or the tonic |

**Example**  
```js
chord.notes('Cmaj7') // => ['C', 'E', 'G', 'B']
chord.notes('C', 'maj7') // => ['C', 'E', 'G', 'B']
```
<a name="module_chord.exists"></a>

## `chord.exists(name)` ⇒ <code>Boolean</code>
Check if a given name correspond to a chord in the dictionary

**Kind**: static method of [<code>chord</code>](#module_chord)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

**Example**  
```js
chord.isKnownChord('CMaj7') // => true
chord.isKnownChord('Maj7') // => true
chord.isKnownChord('Ablah') // => false
```
<a name="module_chord.detect"></a>

## `chord.detect(notes)` ⇒ <code>Array.&lt;String&gt;</code>
Detect a chord. Given a list of notes, return the chord name(s) if any.
It only detects chords with exactly same notes.

**Kind**: static method of [<code>chord</code>](#module_chord)  
**Returns**: <code>Array.&lt;String&gt;</code> - an array with the possible chords  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array</code> \| <code>String</code> | the list of notes |

**Example**  
```js
chord.detect('b g f# d') // => [ 'GMaj7' ]
chord.detect('e c a g') // => [ 'CM6', 'Am7' ]
```
<a name="module_chord.position"></a>

## `chord.position(chord)` ⇒ <code>Integer</code>
Get the position (inversion number) of a chord (0 is root position, 1 is first
inversion...). It assumes the chord is formed by superposed thirds.

**Kind**: static method of [<code>chord</code>](#module_chord)  
**Returns**: <code>Integer</code> - the inversion number (0 for root inversion, 1 for first
inversion...) or null if not a valid chord  

| Param | Type | Description |
| --- | --- | --- |
| chord | <code>Array</code> \| <code>String</code> | the chord notes |

**Example**  
```js
chord.position('e g c') // => 1
chord.position('g3 e2 c5') // => 1 (e is the lowest note)
```
<a name="module_chord.inversion"></a>

## `chord.inversion(num, chord)` ⇒ <code>Array</code>
Given a chord in any inverstion, set to the given inversion. It accepts
chord names

**Kind**: static method of [<code>chord</code>](#module_chord)  
**Returns**: <code>Array</code> - the chord pitch classes in the desired inversion or
an empty array if no inversion found (not triadic)  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | the inversion number (0 root position, 1 first inversion, ...) |
| chord | <code>String</code> \| <code>Array</code> | the chord name or notes |

**Example**  
```js
chord.inversion(1, 'Cmaj7') // => [ 'E', 'G', 'B', 'C' ]
chord.inversion(0, 'e g c') // => [ 'C', 'E', 'G' ]
```
<a name="module_chord.tokenize"></a>

## `chord.tokenize(name)` ⇒ <code>Array</code>
Tokenize a chord name. It returns an array with the tonic and chord type 
If not tonic is found, all the name is considered the chord name.

This function does NOT check if the chord type exists or not. It only tries
to split the tonic and chord type.

**Kind**: static method of [<code>chord</code>](#module_chord)  
**Returns**: <code>Array</code> - an array with [type, tonic]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the chord name |

**Example**  
```js
chord.tokenize('Cmaj7') // => [ 'C', 'maj7' ]
chord.tokenize('C7') // => [ 'C', '7' ]
chord.tokenize('mMaj7') // => [ null, 'mMaj7' ]
chord.tokenize('Cnonsense') // => [ 'C', 'nonsense' ]
```
<a name="module_pcset"></a>

# pcset
[![npm version](https://img.shields.io/npm/v/tonal-pcset.svg?style=flat-square)](https://www.npmjs.com/package/tonal-pcset)
[![tonal](https://img.shields.io/badge/tonal-pcset-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-pcset` is a collection of functions to work with pitch class sets, oriented
to make comparations (isEqual, isSubset, isSuperset)

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-pcset`

```js
var pcset = require('tonal-pcset')
pcset.isEqual('c2 d5 e6', 'c6 e3 d1') // => true
```

## API documentation


* [pcset](#module_pcset)
    * [`.chroma(set)`](#module_pcset.chroma) ⇒ <code>String</code>
    * [`.modes(set, normalize)`](#module_pcset.modes) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.isChroma(chroma)`](#module_pcset.isChroma) ⇒ <code>Boolean</code>
    * [`.intervals(pcset)`](#module_pcset.intervals) ⇒ <code>Array</code>
    * [`.isEqual(set1, set2)`](#module_pcset.isEqual) ⇒ <code>Boolean</code>
    * [`.isSubset(test, set)`](#module_pcset.isSubset) ⇒ <code>Boolean</code>
    * [`.isSuperset(test, set)`](#module_pcset.isSuperset) ⇒ <code>Boolean</code>
    * [`.includes(set, note)`](#module_pcset.includes) ⇒ <code>Boolean</code>
    * [`.filter(set, notes)`](#module_pcset.filter) ⇒ <code>Array</code>

<a name="module_pcset.chroma"></a>

## `pcset.chroma(set)` ⇒ <code>String</code>
Get chroma of a pitch class set. A chroma identifies each set uniquely.
It's a 12-digit binary each presenting one semitone of the octave.

Note that this function accepts a chroma as parameter and return it
without modification.

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>String</code> - a binary representation of the pitch class set  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the pitch class set |

**Example**  
```js
pcset.chroma(["C", "D", "E"]) // => '1010100000000'
```
<a name="module_pcset.modes"></a>

## `pcset.modes(set, normalize)` ⇒ <code>Array.&lt;String&gt;</code>
Given a a list of notes or a pcset chroma, produce the rotations
of the chroma discarding the ones that starts with '0'

This is used, for example, to get all the modes of a scale.

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Array.&lt;String&gt;</code> - an array with all the modes of the chroma  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the list of notes or pitchChr of the set |
| normalize | <code>Boolean</code> | (Optional, true by default) remove all the rotations that starts with '0' |

**Example**  
```js
pcset.modes(["C", "D", "E"]).map(pcset.intervals)
```
<a name="module_pcset.isChroma"></a>

## `pcset.isChroma(chroma)` ⇒ <code>Boolean</code>
Test if the given string is a pitch class set chroma.

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if its a valid pcset chroma  

| Param | Type | Description |
| --- | --- | --- |
| chroma | <code>String</code> | the pitch class set chroma |

**Example**  
```js
pcset.isChroma('101010101010') // => true
pcset.isChroma('101001') // => false
```
<a name="module_pcset.intervals"></a>

## `pcset.intervals(pcset)` ⇒ <code>Array</code>
Given a pcset (notes or chroma) return it's intervals

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Array</code> - intervals or empty array if not valid pcset  

| Param | Type | Description |
| --- | --- | --- |
| pcset | <code>String</code> \| <code>Array</code> | the pitch class set (notes or chroma) |

**Example**  
```js
pcset.intervals('1010100000000') => ["1P", "2M", "3M"]
```
<a name="module_pcset.isEqual"></a>

## `pcset.isEqual(set1, set2)` ⇒ <code>Boolean</code>
Test if two pitch class sets are identical

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if they are equal  

| Param | Type | Description |
| --- | --- | --- |
| set1 | <code>Array</code> \| <code>String</code> | one of the pitch class sets |
| set2 | <code>Array</code> \| <code>String</code> | the other pitch class set |

**Example**  
```js
pcset.isEqual('c2 d3', 'c5 d2') // => true
```
<a name="module_pcset.isSubset"></a>

## `pcset.isSubset(test, set)` ⇒ <code>Boolean</code>
Test if a pitch class set is a subset of another

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if the test set is a subset of the set  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>Array</code> \| <code>String</code> | the set to test |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |

**Example**  
```js
pcset.subset('c d e', 'C2 D4 D5 C6') // => true
```
<a name="module_pcset.isSuperset"></a>

## `pcset.isSuperset(test, set)` ⇒ <code>Boolean</code>
Test if a pitch class set is a superset

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if the test set is a superset of the set  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>Array</code> \| <code>String</code> | the set to test |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |

**Example**  
```js
pcset.isSuperset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
```
<a name="module_pcset.includes"></a>

## `pcset.includes(set, note)` ⇒ <code>Boolean</code>
Test if a given pitch class set includes a note

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if the note is included in the pcset  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |
| note | <code>String</code> \| <code>Pitch</code> | the note to test |

**Example**  
```js
pcset.includes('c d e', 'C4') // => true
pcset.includes('c d e', 'C#4') // => false
```
<a name="module_pcset.filter"></a>

## `pcset.filter(set, notes)` ⇒ <code>Array</code>
Filter a list with a pitch class set

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Array</code> - the filtered notes  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the pitch class set notes |
| notes | <code>Array</code> \| <code>String</code> | the note list to be filtered |

**Example**  
```js
pcset.filter(c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ 'c2', 'c3' ])
```
<a name="module_key"></a>

# key
_Key_ refers to the tonal system based on the major and minor scales. This is
is the most common tonal system, but tonality can be present in music
based in other scales or concepts.

This is a collection of functions related to keys.

**Example**  
```js
const key = require('tonal-key')
key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
key.relative('minor', 'C major') // => 'A minor'
```
