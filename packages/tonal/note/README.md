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

// using ES6 import syntax
import { name } from 'tonal-note'
['c', 'db3', '2', 'g+', 'gx4'].map(name)
// => ['C', 'Db3', null, null, 'G##4']

// part of tonal
const tonal = require('tonal')
tonal.note.midi('d4') // => 62
```

## Install

[![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)

## API Documentation


* [note](#module_note)
    * [`.chroma`](#module_note.chroma) ⇒ <code>Integer</code>
    * [`.fromMidi(midi, useSharps)`](#module_note.fromMidi) ⇒ <code>String</code>
    * [`.freq(note)`](#module_note.freq) ⇒ <code>Number</code>
    * ~~[`.note()`](#module_note.note)~~
    * [`.oct(note)`](#module_note.oct) ⇒ <code>Integer</code>
    * [`.step(note)`](#module_note.step) ⇒ <code>Integer</code>
    * ~~[`.pcFifths(note)`](#module_note.pcFifths) ⇒ <code>Integer</code>~~
    * [`.alt(note)`](#module_note.alt) ⇒ <code>Integer</code>
    * [`.build(parsed)`](#module_note.build) ⇒ <code>string</code>
    * [`.name()`](#module_note.name) ⇒ <code>String</code>
    * [`.pc()`](#module_note.pc) ⇒ <code>String</code>
    * [`~SEMI(note)`](#module_note..SEMI) ⇒ <code>Integer</code>

<a name="module_note.chroma"></a>

## `note.chroma` ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: static constant of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the chroma number  

| Param | Type |
| --- | --- |
| note | <code>String</code> | 

**Example**  
```js
var note = require('tonal-note')
note.chroma('Cb') // => 11
['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
```
<a name="module_note.fromMidi"></a>

## `note.fromMidi(midi, useSharps)` ⇒ <code>String</code>
Get the note name of a given midi note number
(an alias of tonal-midi `note` function)

**Kind**: static method of [<code>note</code>](#module_note)  
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

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Number</code> - the frequency  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to get the frequency |

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
| note | <code>String</code> | the note |

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
| note | <code>String</code> | the note |

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
| note | <code>String</code> \| <code>Pitch</code> | the note (can be a pitch class) |

<a name="module_note.alt"></a>

## `note.alt(note)` ⇒ <code>Integer</code>
Get the note alteration: a number equivalent to the accidentals. 0 means
no accidentals, negative numbers are for flats, positive for sharps

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the alteration  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> \| <code>Pitch</code> | the note |

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

## `note.name()` ⇒ <code>String</code>
Given a note name, return the note name or null if not valid note.
The note name will ALWAYS have the letter in upercase and accidentals
using # or b

Can be used to test if a string is a valid note name.

**Kind**: static method of [<code>note</code>](#module_note)  

| Type |
| --- |
| <code>Pitch</code> \| <code>String</code> | 

**Example**  
```js
var note = require('tonal-note')
note.name('cb2') // => 'Cb2'
['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
```
<a name="module_note.pc"></a>

## `note.pc()` ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: static method of [<code>note</code>](#module_note)  
**Returns**: <code>String</code> - the pitch class  

| Type |
| --- |
| <code>String</code> \| <code>Pitch</code> | 

**Example**  
```js
tonal.pc('Db3') // => 'Db'
tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
```
<a name="module_note..SEMI"></a>

## `note~SEMI(note)` ⇒ <code>Integer</code>
Get the note midi number
(an alias of tonal-midi `toMidi` function)

**Kind**: inner method of [<code>note</code>](#module_note)  
**Returns**: <code>Integer</code> - the midi number or null if not valid pitch  
**See**: midi.toMidi  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>Array</code> \| <code>String</code> \| <code>Number</code> | the note to get the midi number from |

**Example**  
```js
note.midi('C4') // => 60
```
