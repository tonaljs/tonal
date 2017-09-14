<a name="module_note"></a>

# note
[![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
[![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-note` is a collection of functions to manipulate musical notes in scientific notation

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import * as note from 'tonal-note'
// or var note = require('tonal-note')
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
    * [`.chroma`](#module_note.chroma) ⇒ <code>Integer</code>
    * [`.midi(note)`](#module_note.midi) ⇒ <code>Integer</code>
    * [`.fromMidi(midi, [boolean])`](#module_note.fromMidi) ⇒ <code>string</code>
    * [`.freq(note)`](#module_note.freq) ⇒ <code>Number</code>
    * ~~[`.note()`](#module_note.note)~~
    * [`.oct(note)`](#module_note.oct) ⇒ <code>Integer</code>
    * [`.step(note)`](#module_note.step) ⇒ <code>Integer</code>
    * ~~[`.pcFifths(note)`](#module_note.pcFifths) ⇒ <code>Integer</code>~~
    * [`.alt(note)`](#module_note.alt) ⇒ <code>Integer</code>
    * [`.build(parsed)`](#module_note.build) ⇒ <code>string</code>
    * [`.name()`](#module_note.name) ⇒ <code>string</code>
    * [`.pc()`](#module_note.pc) ⇒ <code>string</code>

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
var note = require('tonal-note')
note.chroma('Cb') // => 11
['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
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
var midi = require('tonal-midi')
midi.note(61) // => 'Db4'
midi.note(61, true) // => 'C#4'
// it rounds to nearest note
midi.note(61.7) // => 'D4'
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
```
<a name="module_note.note"></a>

## ~~`note.note()`~~
***Deprecated***

**Kind**: static method of [<code>note</code>](#module_note)  
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
note.oct('blah') // => null
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
<a name="module_note.pcFifths"></a>

## ~~`note.pcFifths(note)` ⇒ <code>Integer</code>~~
***Deprecated***

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the number of fifths to reach that pitch class from 'C'  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Pitch</code> | the note (can be a pitch class) |

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
<a name="module_note.build"></a>

## `note.build(parsed)` ⇒ <code>string</code>
Build a note name in scientific notation from a parsed note 
(an object with { step, alt, oct })

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>string</code> - the note name  

| Param | Type |
| --- | --- |
| parsed | <code>parsed</code> | 

**Example**  
```js
note.build({ step: 1, alt: -1, oct: 3 }) // => Db3
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
var note = require('tonal-note')
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
// or var interval = require('tonal-interval')
interval.semitones('4P') // => 5
interval.invert('3m') // => '6M'
interval.simplify('9m') // => '2m'
```

## Install

[![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)

## API Documentation


* [interval](#module_interval)
    * [`.toInterval(interval)`](#module_interval.toInterval) ⇒ <code>String</code>
    * [`.num(interval)`](#module_interval.num) ⇒ <code>Integer</code>
    * [`.value(interval)`](#module_interval.value) ⇒ <code>Integer</code>
    * [`.props(interval)`](#module_interval.props) ⇒ <code>Array</code>
    * [`.fromProps(props)`](#module_interval.fromProps) ⇒ <code>String</code>
    * [`.semitones(ivl)`](#module_interval.semitones) ⇒ <code>Integer</code>
    * [`.fromSemitones(num)`](#module_interval.fromSemitones) ⇒ <code>String</code>
    * [`.ic(interval)`](#module_interval.ic) ⇒ <code>Integer</code>
    * [`.type(interval)`](#module_interval.type) ⇒ <code>String</code>
    * [`.invert(interval)`](#module_interval.invert) ⇒ <code>String</code> \| <code>Pitch</code>
    * [`.simplify(interval)`](#module_interval.simplify) ⇒ <code>String</code> \| <code>Array</code>

<a name="module_interval.toInterval"></a>

## `interval.toInterval(interval)` ⇒ <code>String</code>
Get interval name. Can be used to test if it's an interval. It accepts intervals
as pitch or string in shorthand notation or tonal notation. It returns always
intervals in tonal notation.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name or null if not valid interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Pitch</code> | the interval string or array |

**Example**  
```js
interval.toInterval('m-3') // => '-3m'
interval.toInterval('3') // => null
```
<a name="module_interval.num"></a>

## `interval.num(interval)` ⇒ <code>Integer</code>
Get the number of the interval (same as value, but always positive)

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Integer</code> - the positive interval number (P1 is 1, m2 is 2, ...)  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Pitch</code> | the interval |

**Example**  
```js
interval.num('m2') // => 2
interval.num('P9') // => 9
interval.num('P-4') // => 4
```
<a name="module_interval.value"></a>

## `interval.value(interval)` ⇒ <code>Integer</code>
Get the interval value (the interval number, but positive or negative
depending the interval direction)

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Integer</code> - the positive interval number (P1 is 1, m-2 is -2, ...)  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Pitch</code> | the interval |

**Example**  
```js
interval.num('m2') // => 2
interval.num('m9') // => 9
interval.num('P-4') // => -4
interval.num('m-9') // => -9
```
<a name="module_interval.props"></a>

## `interval.props(interval)` ⇒ <code>Array</code>
Get interval properties. It returns an object with:

- num: the interval number (always positive)
- alt: the interval alteration (0 for perfect in perfectables, or 0 for major in _majorables_)
- dir: the interval direction (1 ascending, -1 descending)

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Array</code> - the interval in the form [number, alt]  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Pitch</code> | the interval |

**Example**  
```js
interval.parse('m2') // => { num: 2, alt: -1, dir: 1 }
interval.parse('m9') // => { num: 9, alt: -1, dir: 1 }
interval.parse('P-4') // => { num: 4, alt: 0, dir: -1}
interval.parse('m-9') // => { num: 9, alt: -1, dir: -1 }
```
<a name="module_interval.fromProps"></a>

## `interval.fromProps(props)` ⇒ <code>String</code>
Given a interval property object, get the interval name

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | the interval property object - num: the interval number - alt: the interval alteration - dir: the direction |

<a name="module_interval.semitones"></a>

## `interval.semitones(ivl)` ⇒ <code>Integer</code>
Get size in semitones of an interval

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Integer</code> - the number of semitones or null if not an interval  

| Param | Type |
| --- | --- |
| ivl | <code>String</code> \| <code>Pitch</code> | 

**Example**  
```js
import { semitones } from 'tonal-interval'
semitones('P4') // => 5
// or using tonal
tonal.semitones('P5') // => 7
```
<a name="module_interval.fromSemitones"></a>

## `interval.fromSemitones(num)` ⇒ <code>String</code>
Get interval name from semitones number. Since there are several interval
names for the same number, the name it's arbitraty, but deterministic.

**Kind**: static method of [<code>interval</code>](#module_interval)  
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
<a name="module_interval.ic"></a>

## `interval.ic(interval)` ⇒ <code>Integer</code>
Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
number of a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes

As paramter you can pass an interval in shorthand notation, an interval in
array notation or the number of semitones of the interval

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Integer</code> - A value between 0 and 6  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Integer</code> | the interval or the number of semitones |

**Example**  
```js
interval.ic('P8') // => 0
interval.ic('m6') // => 4
['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
```
<a name="module_interval.type"></a>

## `interval.type(interval)` ⇒ <code>String</code>
Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)
It does NOT return the actual quality.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - 'P' for perfectables, 'M' for majorables or null if not
valid interval  

| Param | Type |
| --- | --- |
| interval | <code>String</code> \| <code>Pitch</code> | 

**Example**  
```js
interval.type('5A') // => 'P'
```
<a name="module_interval.invert"></a>

## `interval.invert(interval)` ⇒ <code>String</code> \| <code>Pitch</code>
Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
of an interval.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> \| <code>Pitch</code> - the inverted interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Pitch</code> | the interval to invert in interval shorthand notation or interval array notation |

**Example**  
```js
interval.invert('3m') // => '6M'
interval.invert('2M') // => '7m'
```
<a name="module_interval.simplify"></a>

## `interval.simplify(interval)` ⇒ <code>String</code> \| <code>Array</code>
Get the simplified version of an interval.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> \| <code>Array</code> - the simplified interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Array</code> | the interval to simplify |

**Example**  
```js
interval.simplify('9M') // => '2M'
['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(interval.simplify)
// => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
interval.simplify('2M') // => '2M'
interval.simplify('-2M') // => '7m'
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
    * [`.transpose(note, interval)`](#module_distance.transpose) ⇒ <code>String</code>
    * [`.transposeBy(note, interval)`](#module_distance.transposeBy) ⇒ <code>String</code>
    * [`.add(interval1, interval2)`](#module_distance.add) ⇒ <code>String</code>
    * [`.trFifths(note, times)`](#module_distance.trFifths) ⇒ <code>String</code>
    * [`.interval(from, to)`](#module_distance.interval) ⇒ <code>String</code>
    * [`.subtract(minuend, subtrahend)`](#module_distance.subtract) ⇒ <code>String</code>
    * [`.semitones(from, to)`](#module_distance.semitones) ⇒ <code>Integer</code>

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
<a name="module_distance.trFifths"></a>

## `distance.trFifths(note, times)` ⇒ <code>String</code>
Transpose a note by a number of perfect fifths. 

It can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> |  |
| times | <code>Integer</code> | the number of times |

**Example**  
```js
import { trFifths } from 'tonal-transpose'
[0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
// or using tonal
tonal.trFifths('G4', 1) // => 'D5'
```
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
<a name="module_distance.subtract"></a>

## `distance.subtract(minuend, subtrahend)` ⇒ <code>String</code>
Subtract two intervals

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - interval diference  

| Param | Type |
| --- | --- |
| minuend | <code>String</code> | 
| subtrahend | <code>String</code> | 

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
<a name="module_notes"></a>

# notes
[![npm version](https://img.shields.io/npm/v/tonal-notes.svg)](https://www.npmjs.com/package/tonal-notes)
[![tonal](https://img.shields.io/badge/tonal-notes-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

> Manipulate arrays of music notes

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import { sort } as collection from 'tonal-notes'
sort(["a3", "c2", "a4", "cb2"]) // => ["Cb2", "C2", "A3", "A4"]
sort(["g", "a", "f", "d", "c", "b", "e"]) // => ["C", "D", "E", "F", "G", "A", "B"]

// part of tonal
const tonal = require('tonal')
tonal.notes.sort(["a3", "c2", "a4", "cb2"]) // => ["Cb2", "C2", "A3", "A4"]
```

## Install

[![npm install tonal-notes](https://nodei.co/npm/tonal-notes.png?mini=true)](https://npmjs.org/package/tonal-notes/)

## API Documentation


* [notes](#module_notes)
    * [`.sort(notes)`](#module_notes.sort) ⇒ <code>Array</code>
    * [`.unique(notes)`](#module_notes.unique)
    * [`.filter(source)`](#module_notes.filter) ⇒ <code>Array</code>
    * [`.pcset(notes)`](#module_notes.pcset) ⇒ <code>Array</code>

<a name="module_notes.sort"></a>

## `notes.sort(notes)` ⇒ <code>Array</code>
Sort an array of notes in ascending order

**Kind**: static method of [<code>notes</code>](#module_notes)  
**Returns**: <code>Array</code> - sorted array of notes  

| Param | Type |
| --- | --- |
| notes | <code>String</code> \| <code>Array</code> | 

<a name="module_notes.unique"></a>

## `notes.unique(notes)`
Get notes sorted with duplicates removed

**Kind**: static method of [<code>notes</code>](#module_notes)  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

<a name="module_notes.filter"></a>

## `notes.filter(source)` ⇒ <code>Array</code>
Filter all except notes from an array

**Kind**: static method of [<code>notes</code>](#module_notes)  

| Param | Type |
| --- | --- |
| source | <code>Array</code> | 

**Example**  
```js
notes.filter("c d5 p5 5p other") // => ["C", "D5"]
```
<a name="module_notes.pcset"></a>

## `notes.pcset(notes)` ⇒ <code>Array</code>
Get a pitch class set, ordered, starting from the first note

**Kind**: static method of [<code>notes</code>](#module_notes)  
**Returns**: <code>Array</code> - a pitch class set ordered starting from the first note  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

