<a name="module_Note"></a>

# Note
[![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
[![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-note` is a collection of functions to manipulate musical notes in scientific notation

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import * as Note from "tonal-note"
// or const Note = require("tonal-note")
Note.name("bb2") // => "Bb2"
Note.chroma("bb2") // => 10
Note.midi("a4") // => 69
Note.freq("a4") // => 440
Note.oct("G3") // => 3

// part of tonal
const Tonal = require("tonal")
// or import Note from "tonal"
Tonal.Note.midi("d4") // => 62
```

## Install

[![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)

## API Documentation


* [Note](#module_Note)
    * [`.names`](#module_Note.names) ⇒ <code>Array</code>
    * [`.props`](#module_Note.props) ⇒ <code>Object</code>
    * [`.midiToFreq`](#module_Note.midiToFreq) ⇒ <code>Number</code>
    * [`.freqToMidi`](#module_Note.freqToMidi) ⇒ <code>Number</code>
    * [`.chroma`](#module_Note.chroma) ⇒ <code>Integer</code>
    * [`.stepToLetter`](#module_Note.stepToLetter) ⇒ <code>string</code>
    * [`.altToAcc`](#module_Note.altToAcc) ⇒ <code>String</code>
    * [`.build`](#module_Note.build)
    * [`.simplify`](#module_Note.simplify) ⇒ <code>String</code>
    * [`.enharmonic`](#module_Note.enharmonic) ⇒ <code>String</code>
    * [`.tokenize(str)`](#module_Note.tokenize) ⇒ <code>Array</code>
    * [`.name()`](#module_Note.name) ⇒ <code>string</code>
    * [`.pc()`](#module_Note.pc) ⇒ <code>string</code>
    * [`.midi(note)`](#module_Note.midi) ⇒ <code>Integer</code>
    * [`.freq(note)`](#module_Note.freq) ⇒ <code>Number</code>
    * [`.oct(note)`](#module_Note.oct) ⇒ <code>Integer</code>
    * [`.from(props, [baseNote])`](#module_Note.from) ⇒ <code>String</code>
    * [`.fromMidi(midi, useSharps)`](#module_Note.fromMidi) ⇒ <code>string</code>

<a name="module_Note.names"></a>

## `Note.names` ⇒ <code>Array</code>
Get a list of note names (pitch classes) within a octave

**Kind**: static constant of [<code>Note</code>](#module_Note)  

| Param | Type | Description |
| --- | --- | --- |
| accTypes | <code>string</code> | (Optional, by default " b#"). A string with the accidentals types: " " means no accidental, "#" means sharps, "b" mean flats, can be conbined (see examples) |

**Example**  
```js
Note.names(" b") // => [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
Note.names(" #") // => [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
```
<a name="module_Note.props"></a>

## `Note.props` ⇒ <code>Object</code>
Get note properties. It returns an object with the following information:

- name {String}: the note name. The letter is always in uppercase
- letter {String}: the note letter, always in uppercase
- acc {String}: the note accidentals
- octave {Number}: the octave or null if not present
- pc {String}: the pitch class (letter + accidentals)
- step {Number}: number equivalent of the note letter. 0 means C ... 6 means B.
- alt {Number}: number equivalent of accidentals (negative are flats, positive sharps)
- chroma {Number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
- midi {Number}: the note midi number
- freq {Number}: the frequency using an equal temperament at 440Hz

This function *always* returns an object with all this properties, but if it"s
not a valid note all properties will be null.

The returned object can"t be mutated.

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>Object</code> - an object with the properties (or an object will all properties
set to null if not valid note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note name in scientific notation |

**Example**  
```js
Note.props("fx-3").name // => "F##-3"
Note.props("invalid").name // => null
Note.props("C#3").oct // => 3
Note.props().oct // => null
```
<a name="module_Note.midiToFreq"></a>

## `Note.midiToFreq` ⇒ <code>Number</code>
Get the frequency from midi number

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>Number</code> - the frequency or null if not valid note midi  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>Number</code> | the note midi number |
| tuning | <code>Number</code> | (Optional) 440 by default |

<a name="module_Note.freqToMidi"></a>

## `Note.freqToMidi` ⇒ <code>Number</code>
Get the midi number from a frequency in hertz. The midi number can
contain decimals (with two digits precission)

**Kind**: static constant of [<code>Note</code>](#module_Note)  

| Param | Type |
| --- | --- |
| frequency | <code>Number</code> | 

**Example**  
```js
Note.freqToMidi(220)); //=> 57;
Note.freqToMidi(261.62)); //=> 60;
Note.freqToMidi(261)); //=> 59.96;
```
<a name="module_Note.chroma"></a>

## `Note.chroma` ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - the chroma number  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note name |

**Example**  
```js
Note.chroma("Cb") // => 11
["C", "D", "E", "F"].map(Note.chroma) // => [0, 2, 4, 5]
```
<a name="module_Note.stepToLetter"></a>

## `Note.stepToLetter` ⇒ <code>string</code>
Given a step number return it"s letter (0 = C, 1 = D, 2 = E)

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the letter  

| Param | Type |
| --- | --- |
| step | <code>number</code> | 

**Example**  
```js
Note.stepToLetter(3) // => "F"
```
<a name="module_Note.altToAcc"></a>

## `Note.altToAcc` ⇒ <code>String</code>
Given an alteration number, return the accidentals

**Kind**: static constant of [<code>Note</code>](#module_Note)  

| Param | Type |
| --- | --- |
| alt | <code>Number</code> | 

**Example**  
```js
Note.altToAcc(-3) // => "bbb"
```
<a name="module_Note.build"></a>

## `Note.build`
Deprecated. This is kept for backwards compatibility only.
Use Note.from instead

**Kind**: static constant of [<code>Note</code>](#module_Note)  
<a name="module_Note.simplify"></a>

## `Note.simplify` ⇒ <code>String</code>
Simplify the note: find an enhramonic note with less accidentals.

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>String</code> - the simplfiied note or null if not valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>String</code> | the note to be simplified |
| useSameAccType | <code>boolean</code> | (optional, true by default) set to true to ensure the returned note has the same accidental types that the given note |

**Example**  
```js
Note.simplify("C##") // => "D"
Note.simplify("C###") // => "D#"
Note.simplify("C###", false) // => "Eb"
Note.simplify("B#4") // => "C5"
```
<a name="module_Note.enharmonic"></a>

## `Note.enharmonic` ⇒ <code>String</code>
Get the simplified and enhramonic note of the given one.

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>String</code> - the enhramonic note  

| Param | Type |
| --- | --- |
| note | <code>String</code> | 

**Example**  
```js
Note.enharmonic("Db") // => "C#"
Note.enhramonic("C") // => "C"
```
<a name="module_Note.tokenize"></a>

## `Note.tokenize(str)` ⇒ <code>Array</code>
Split a string into tokens related to note parts.
It returns an array of strings `[letter, accidental, octave, modifier]`

It always returns an array

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Array</code> - an array of note tokens  

| Param | Type |
| --- | --- |
| str | <code>String</code> | 

**Example**  
```js
Note.tokenize("C#2") // => ["C", "#", "2", ""]
Note.tokenize("Db3 major") // => ["D", "b", "3", "major"]
Note.tokenize("major") // => ["", "", "", "major"]
Note.tokenize("##") // => ["", "##", "", ""]
Note.tokenize() // => ["", "", "", ""]
```
<a name="module_Note.name"></a>

## `Note.name()` ⇒ <code>string</code>
Given a note name, return the note name or null if not valid note.
The note name will ALWAYS have the letter in upercase and accidentals
using # or b

Can be used to test if a string is a valid note name.

**Kind**: static method of [<code>Note</code>](#module_Note)  

| Type |
| --- |
| <code>Pitch</code> \| <code>string</code> | 

**Example**  
```js
Note.name("cb2") // => "Cb2"
["c", "db3", "2", "g+", "gx4"].map(Note.name) // => ["C", "Db3", null, null, "G##4"]
```
<a name="module_Note.pc"></a>

## `Note.pc()` ⇒ <code>string</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the pitch class  

| Type |
| --- |
| <code>string</code> \| <code>Pitch</code> | 

**Example**  
```js
Note.pc("Db3") // => "Db"
["db3", "bb6", "fx2"].map(Note.pc) // => [ "Db", "Bb", "F##"]
```
<a name="module_Note.midi"></a>

## `Note.midi(note)` ⇒ <code>Integer</code>
Get the note midi number
(an alias of tonal-midi `toMidi` function)

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - the midi number or null if not valid pitch  
**See**: midi.toMidi  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Number</code> | the note to get the midi number from |

**Example**  
```js
Note.midi("C4") // => 60
Note.midi(60) // => 60
```
<a name="module_Note.freq"></a>

## `Note.freq(note)` ⇒ <code>Number</code>
Get the frequency of a note

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Number</code> - the frequency  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Number</code> | the note name or midi note number |

**Example**  
```js
Note.freq("A4") // => 440
Note.freq(69) // => 440
```
<a name="module_Note.oct"></a>

## `Note.oct(note)` ⇒ <code>Integer</code>
Get the octave of the given pitch

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - the octave or null if doesn"t have an octave or not a valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note |

**Example**  
```js
Note.oct("C#4") // => 4
Note.oct("C") // => null
Note.oct("blah") // => undefined
```
<a name="module_Note.from"></a>

## `Note.from(props, [baseNote])` ⇒ <code>String</code>
Creates a note name in scientific notation from note properties,
and optionally another note name.
It receives an object with:
- step: the note step (0 = C, 1 = D, ... 6 = B)
- alt: (optional) the alteration. Negative numbers are flats, positive sharps
- oct: (optional) the octave

Optionally it receives another note as a "base", meaning that any prop not explicitly
received on the first parameter will be taken from that base note. That way it can be used
as an immutable "set" operator for a that base note

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>String</code> - the note name in scientific notation or null if not valid properties  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | the note properties |
| [baseNote] | <code>String</code> | note to build the result from. If given, it returns the result of applying the given props to this note. |

**Example**  
```js
Note.from({ step: 5 }) // => "A"
Note.from({ step: 1, acc: -1 }) // => "Db"
Note.from({ step: 2, acc: 2, oct: 2 }) // => "E##2"
Note.from({ step: 7 }) // => null
Note.from({alt: 1, oct: 3}, "C4") // => "C#3"
```
<a name="module_Note.fromMidi"></a>

## `Note.fromMidi(midi, useSharps)` ⇒ <code>string</code>
Given a midi number, returns a note name. The altered notes will have
flats unless explicitly set with the optional `useSharps` parameter.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>number</code> | the midi note number |
| useSharps | <code>boolean</code> | (Optional) set to true to use sharps instead of flats |

**Example**  
```js
Note.fromMidi(61) // => "Db4"
Note.fromMidi(61, true) // => "C#4"
// it rounds to nearest note
Note.fromMidi(61.7) // => "D4"
```
