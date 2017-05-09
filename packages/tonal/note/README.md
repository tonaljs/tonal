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
note.enharmonics('C#6') // => [ 'B##5', 'C#6', 'Db6' ]
note.simplify('B#3') // => 'C4'

// using ES6 import syntax
import { name } from 'tonal-note'
['c', 'db3', '2', 'g+', 'gx4'].map(name)
// => ['C', 'Db3', null, null, 'G##4']
```

## Install

[![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)

## API Documentation


* [note](#module_note)
    * [`.midi(note)`](#module_note.midi) ⇒ <code>Integer</code>
    * [`.fromMidi(midi, useSharps)`](#module_note.fromMidi) ⇒ <code>String</code>
    * [`.freq(note)`](#module_note.freq) ⇒ <code>Number</code>
    * [`.chroma(note)`](#module_note.chroma) ⇒ <code>Integer</code>
    * [`.name(n)`](#module_note.name) ⇒ <code>String</code>
    * ~~[`.note()`](#module_note.note)~~
    * ~~[`.props(note)`](#module_note.props) ⇒ <code>Object</code>~~
    * ~~[`.fromProps(noteProps)`](#module_note.fromProps) ⇒ <code>String</code>~~
    * [`.oct(note)`](#module_note.oct) ⇒ <code>Integer</code>
    * [`.step(note)`](#module_note.step) ⇒ <code>Integer</code>
    * ~~[`.pcFifths(note)`](#module_note.pcFifths) ⇒ <code>Integer</code>~~
    * [`.alt(note)`](#module_note.alt) ⇒ <code>Integer</code>
    * [`.pc(n)`](#module_note.pc) ⇒ <code>String</code>
    * [`.enharmonics(note)`](#module_note.enharmonics) ⇒ <code>Array</code>
    * [`.simplify(note)`](#module_note.simplify) ⇒ <code>String</code>

<a name="module_note.midi"></a>

## `note.midi(note)` ⇒ <code>Integer</code>
Get the note midi number
(an alias of tonal-midi `toMidi` function)

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - the midi number or null if not valid pitch  
**See**: midi.toMidi  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>Array</code> &#124; <code>String</code> &#124; <code>Number</code> | the note to get the midi number from |

**Example**  
```js
note.midi('C4') // => 60
```
<a name="module_note.fromMidi"></a>

## `note.fromMidi(midi, useSharps)` ⇒ <code>String</code>
Get the note name of a given midi note number
(an alias of tonal-midi `note` function)

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>String</code> - the note name  
**See**: midi.note  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>Integer</code> | the midi note number |
| useSharps | <code>Boolean</code> | (Optional) set to true to use sharps instead of flats |

**Example**  
```js
note.fromMidi(60) // => 'C4'
```
<a name="module_note.freq"></a>

## `note.freq(note)` ⇒ <code>Number</code>
Get the frequency of a note
(an alias of the tonal-note package `toFreq` function)

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Number</code> - the frequency  
**See**: freq.toFreq  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>Array</code> &#124; <code>String</code> &#124; <code>Number</code> | the note to get the frequency |

**Example**  
```js
note.freq('A4') // => 440
```
<a name="module_note.chroma"></a>

## `note.chroma(note)` ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - the chroma  

| Param | Type |
| --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> | 

**Example**  
```js
var note = require('tonal-note')
note.chroma('Cb') // => 11
['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
```
<a name="module_note.name"></a>

## `note.name(n)` ⇒ <code>String</code>
Given a note (as string or as array notation) returns a string
with the note name in scientific notation or null
if not valid note

Can be used to test if a string is a valid note name.

**Kind**: static method of <code>[note](#module_note)</code>  

| Param | Type |
| --- | --- |
| n | <code>Pitch</code> &#124; <code>String</code> | 

**Example**  
```js
var note = require('tonal-note')
note.name('cb2') // => 'Cb2'
['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
```
<a name="module_note.note"></a>

## ~~`note.note()`~~
***Deprecated***

**Kind**: static method of <code>[note](#module_note)</code>  
<a name="module_note.props"></a>

## ~~`note.props(note)` ⇒ <code>Object</code>~~
***Deprecated***

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Object</code> - the object with note properties or null if not valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> | the note |

**Example**  
```js
note.props('Db3') // => { step: 1, alt: -1, oct: 3 }
note.props('C#') // => { step: 0, alt: 1, oct: undefined }
```
<a name="module_note.fromProps"></a>

## ~~`note.fromProps(noteProps)` ⇒ <code>String</code>~~
***Deprecated***

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>String</code> - the note name

- step: a number from 0 to 6 meaning note step letter from 'C' to 'B'
- alt: the accidentals as number (0 no accidentals, 1 is '#', 2 is '##', -2 is 'bb')
- oct: (Optional) the octave. If not present (or undefined) it returns a pitch class  

| Param | Type | Description |
| --- | --- | --- |
| noteProps | <code>Object</code> | an object with the following attributes: |

**Example**  
```js
note.fromProps({ step: 1, alt: -1, oct: 5 }) // => 'Db5'
note.fromProps({ step: 0, alt: 1 }) // => 'C#'
```
<a name="module_note.oct"></a>

## `note.oct(note)` ⇒ <code>Integer</code>
Get the octave of the given pitch

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - the octave, undefined if its a pitch class or null if
not a valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> | the note |

**Example**  
```js
note.oct('C#4') // => 4
note.oct('C') // => undefined
note.oct('blah') // => undefined
```
<a name="module_note.step"></a>

## `note.step(note)` ⇒ <code>Integer</code>
Get the note step: a number equivalent of the note letter. 0 means C and
6 means B. This is different from `chroma` (see example)

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - a number between 0 and 6 or null if not a note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> | the note |

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

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - the number of fifths to reach that pitch class from 'C'  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> | the note (can be a pitch class) |

<a name="module_note.alt"></a>

## `note.alt(note)` ⇒ <code>Integer</code>
Get the note alteration: a number equivalent to the accidentals. 0 means
no accidentals, negative numbers are for flats, positive for sharps

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Integer</code> - the alteration  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> &#124; <code>Pitch</code> | the note |

**Example**  
```js
note.alt('C') // => 0
note.alt('C#') // => 1
note.alt('Cb') // => -1
```
<a name="module_note.pc"></a>

## `note.pc(n)` ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>String</code> - the pitch class  

| Param | Type |
| --- | --- |
| n | <code>String</code> &#124; <code>Pitch</code> | 

**Example**  
```js
tonal.pc('Db3') // => 'Db'
tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
```
<a name="module_note.enharmonics"></a>

## `note.enharmonics(note)` ⇒ <code>Array</code>
Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>Array</code> - an array of pitches ordered by distance to the given one  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to get the enharmonics from |

**Example**  
```js
var note = require('tonal-note')
note.enharmonics('C') // => ['B#', 'C', 'Dbb']
note.enharmonics('A') // => ['G##', 'A', 'Bbb']
note.enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
note.enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
```
<a name="module_note.simplify"></a>

## `note.simplify(note)` ⇒ <code>String</code>
Get a simpler enharmonic note name from a note if exists

**Kind**: static method of <code>[note](#module_note)</code>  
**Returns**: <code>String</code> - the simplfiied note (if not found, return same note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to simplify |

**Example**  
```js
var note = require('tonal-note')
note.simplify('B#3') // => 'C4'
```
