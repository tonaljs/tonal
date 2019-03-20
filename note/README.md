<a name="module_Note"></a>

# Note
A collection of functions to manipulate musical notes in scientific notation

## Usage

**Example**  
```js
import Note from "tonal/note"
Note.name("bb2") // => "Bb2"
Note.chroma("bb2") // => 10
Note.midi("a4") // => 69
Note.freq("a4") // => 440
Note.oct("G3") // => 3
```
**Example**  
```js
const Tonal = require('tonal')
Tonal.Note.midi("C4") // => 60

## API
```

* [Note](#module_Note)
    * [`.midiToFreq`](#module_Note.midiToFreq) ⇒ <code>number</code>
    * [`.names(filter)`](#module_Note.names) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.tokenize(str)`](#module_Note.tokenize) ⇒ <code>Array</code>
    * [`.props(note)`](#module_Note.props) ⇒ <code>Object</code>
    * [`.name(str)`](#module_Note.name) ⇒ <code>string</code>
    * [`.pc(str)`](#module_Note.pc) ⇒ <code>string</code>
    * [`.midi(note)`](#module_Note.midi) ⇒ <code>Integer</code>
    * [`.freq(note)`](#module_Note.freq) ⇒ <code>number</code>
    * [`.freqToMidi(frequency)`](#module_Note.freqToMidi) ⇒ <code>number</code>
    * [`.chroma(note)`](#module_Note.chroma) ⇒ <code>Integer</code>
    * [`.oct(note)`](#module_Note.oct) ⇒ <code>Integer</code>
    * [`.stepToLetter(step)`](#module_Note.stepToLetter) ⇒ <code>string</code>
    * [`.altToAcc(alt)`](#module_Note.altToAcc) ⇒ <code>string</code>
    * [`.fromProps(props, [baseNote])`](#module_Note.fromProps) ⇒ <code>string</code>
    * [`.fromMidi(midi, options, useSharps)`](#module_Note.fromMidi) ⇒ <code>string</code>
    * [`.simplify(note, options)`](#module_Note.simplify) ⇒ <code>string</code>
    * [`.enharmonic(note)`](#module_Note.enharmonic) ⇒ <code>string</code>

<a name="module_Note.midiToFreq"></a>

## `Note.midiToFreq` ⇒ <code>number</code>
Get the frequency from midi number

**Kind**: static constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>number</code> - the frequency or null if not valid note midi  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>number</code> | the note midi number |
| tuning | <code>number</code> | (Optional) 440 by default |

<a name="module_Note.names"></a>

## `Note.names(filter)` ⇒ <code>Array.&lt;string&gt;</code>
Get a list of note names (pitch classes) within a octave

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Array.&lt;string&gt;</code> - the list of notes  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>string</code> | an object with - [boolean] unaltered: defaults to true - [boolean] flats: defaults to false - [boolean] sharps: defaults to false |

**Example**  
```js
Note.names() // => [ "C", "D", "E", "F", "G", "A", "B" ]
Note.names({ flats: true }) // => [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
Note.names({ sharps: true }) // => [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
Note.names({ unaltered: false, flats: true })
// => [ "Db", "Eb", "Gb", "Ab", "Bb" ]
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
| str | <code>string</code> | 

**Example**  
```js
Note.tokenize("C#2") // => ["C", "#", "2", ""]
Note.tokenize("Db3 major") // => ["D", "b", "3", "major"]
Note.tokenize("major") // => ["", "", "", "major"]
Note.tokenize("##") // => ["", "##", "", ""]
Note.tokenize() // => ["", "", "", ""]
```
<a name="module_Note.props"></a>

## `Note.props(note)` ⇒ <code>Object</code>
Get note properties. It returns an object with the following information:

- name {string}: the note name. The letter is always in uppercase
- letter {string}: the note letter, always in uppercase
- acc {string}: the note accidentals
- octave {number}: the octave or null if not present
- pc {string}: the pitch class (letter + accidentals)
- step {number}: number equivalent of the note letter. 0 means C ... 6 means B.
- alt {number}: number equivalent of accidentals (negative are flats, positive sharps)
- chroma {number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...
- midi {number}: the note midi number (IMPORTANT! it can be outside 0 to 127 range)
- freq {number}: the frequency using an equal temperament at 440Hz

This function *always* returns an object with all this properties, but if it"s
not a valid note all properties will be null.

The returned object can"t be mutated.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Object</code> - an object with the properties (or an object will all properties
set to null if not valid note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note name in scientific notation |

**Example**  
```js
Note.props("fx-3").name // => "F##-3"
Note.props("invalid").name // => null
Note.props("C#3").oct // => 3
Note.props().oct // => null
```
<a name="module_Note.name"></a>

## `Note.name(str)` ⇒ <code>string</code>
Given a note name, return the note name or null if not valid note.
The note name will ALWAYS have the letter in upercase and accidentals
using # or b

Can be used to test if a string is a valid note name.

**Kind**: static method of [<code>Note</code>](#module_Note)  

| Param | Type |
| --- | --- |
| str | <code>Pitch</code> \| <code>string</code> | 

**Example**  
```js
Note.name("cb2") // => "Cb2"
["c", "db3", "2", "g+", "gx4"].map(Note.name) // => ["C", "Db3", null, null, "G##4"]
```
<a name="module_Note.pc"></a>

## `Note.pc(str)` ⇒ <code>string</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the pitch class  

| Param | Type |
| --- | --- |
| str | <code>string</code> \| <code>Pitch</code> | 

**Example**  
```js
Note.pc("Db3") // => "Db"
["db3", "bb6", "fx2"].map(Note.pc) // => [ "Db", "Bb", "F##"]
```
<a name="module_Note.midi"></a>

## `Note.midi(note)` ⇒ <code>Integer</code>
Get the note midi number. It always return a number between 0 and 127

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

## `Note.freq(note)` ⇒ <code>number</code>
Get the frequency of a note

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>number</code> - the frequency  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> \| <code>Number</code> | the note name or midi note number |

**Example**  
```js
Note.freq("A4") // => 440
Note.freq(69) // => 440
```
<a name="module_Note.freqToMidi"></a>

## `Note.freqToMidi(frequency)` ⇒ <code>number</code>
Get the midi number from a frequency in hertz. The midi number can
contain decimals (with two digits precission)

**Kind**: static method of [<code>Note</code>](#module_Note)  

| Param | Type |
| --- | --- |
| frequency | <code>number</code> | 

**Example**  
```js
Note.freqToMidi(220)); //=> 57;
Note.freqToMidi(261.62)); //=> 60;
Note.freqToMidi(261)); //=> 59.96;
```
<a name="module_Note.chroma"></a>

## `Note.chroma(note)` ⇒ <code>Integer</code>
Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - the chroma number  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note name |

**Example**  
```js
Note.chroma("Cb") // => 11
["C", "D", "E", "F"].map(Note.chroma) // => [0, 2, 4, 5]
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
<a name="module_Note.stepToLetter"></a>

## `Note.stepToLetter(step)` ⇒ <code>string</code>
Given a step number return it's letter (0 = C, 1 = D, 2 = E)

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the letter  

| Param | Type |
| --- | --- |
| step | <code>number</code> | 

**Example**  
```js
Note.stepToLetter(3) // => "F"
```
<a name="module_Note.altToAcc"></a>

## `Note.altToAcc(alt)` ⇒ <code>string</code>
Given an alteration number, return the accidentals

**Kind**: static method of [<code>Note</code>](#module_Note)  

| Param | Type |
| --- | --- |
| alt | <code>number</code> | 

**Example**  
```js
Note.altToAcc(-3) // => "bbb"
```
<a name="module_Note.fromProps"></a>

## `Note.fromProps(props, [baseNote])` ⇒ <code>string</code>
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
**Returns**: <code>string</code> - the note name in scientific notation or null if not valid properties  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | the note properties |
| [baseNote] | <code>string</code> | note to build the result from. If given, it returns the result of applying the given props to this note. |

**Example**  
```js
Note.from({ step: 5 }) // => "A"
Note.from({ step: 1, acc: -1 }) // => "Db"
Note.from({ step: 2, acc: 2, oct: 2 }) // => "E##2"
Note.from({ step: 7 }) // => null
Note.from({alt: 1, oct: 3}, "C4") // => "C#3"
```
<a name="module_Note.fromMidi"></a>

## `Note.fromMidi(midi, options, useSharps)` ⇒ <code>string</code>
Given a midi number, returns a note name. The altered notes will have
flats unless explicitly set with the optional `useSharps` parameter.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>number</code> | the midi note number |
| options | <code>Object</code> | = default: `{ sharps: false, pitchClass: false }` |
| useSharps | <code>boolean</code> | (Optional) set to true to use sharps instead of flats |

**Example**  
```js
Note.fromMidi(61) // => "Db4"
Note.fromMidi(61, { pitchClass: true }) // => "Db"
Note.fromMidi(61, { sharps: true }) // => "C#4"
Note.fromMidi(61, { pitchClass: true, sharps: true }) // => "C#"
// it rounds to nearest note
Note.fromMidi(61.7) // => "D4"
```
<a name="module_Note.simplify"></a>

## `Note.simplify(note, options)` ⇒ <code>string</code>
Simplify the note: find an enhramonic note with less accidentals.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the simplfiied note or null if not valid note  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note to be simplified |
| options | <code>object</code> | - sameAccType: default true. Use same kind of accidentals that source |

**Example**  
```js
Note.simplify("C##") // => "D"
Note.simplify("C###") // => "D#"
Note.simplify("C###", { sameAccType : false }) // => "Eb"
Note.simplify("B#4") // => "C5"
```
<a name="module_Note.enharmonic"></a>

## `Note.enharmonic(note)` ⇒ <code>string</code>
Get the simplified and enhramonic note of the given one.

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - the enhramonic note  

| Param | Type |
| --- | --- |
| note | <code>string</code> | 

**Example**  
```js
Note.enharmonic("Db") // => "C#"
Note.enhramonic("C") // => "C"
```
