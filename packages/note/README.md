<a name="module_Note"></a>

## Note

<p><a href="https://www.npmjs.com/package/tonal-note"><img src="https://img.shields.io/npm/v/tonal-note.svg" alt="npm version"></a>
<a href="https://www.npmjs.com/browse/keyword/tonal"><img src="https://img.shields.io/badge/tonal-note-yellow.svg" alt="tonal"></a></p>
<p><code>tonal-note</code> is a collection of functions to manipulate musical notes in scientific notation</p>
<p>This is part of <a href="https://www.npmjs.com/package/tonal">tonal</a> music theory library.</p>
<h2>Usage</h2><pre class="prettyprint source lang-js"><code>import * as Note from &quot;tonal-note&quot;
// or const Note = require(&quot;tonal-note&quot;)
Note.name(&quot;bb2&quot;) // => &quot;Bb2&quot;
Note.chroma(&quot;bb2&quot;) // => 10
Note.midi(&quot;a4&quot;) // => 69
Note.freq(&quot;a4&quot;) // => 440
Note.oct(&quot;G3&quot;) // => 3

// part of tonal
const Tonal = require(&quot;tonal&quot;)
// or import Note from &quot;tonal&quot;
Tonal.Note.midi(&quot;d4&quot;) // => 62</code></pre><h2>Install</h2><p><a href="https://npmjs.org/package/tonal-note/"><img src="https://nodei.co/npm/tonal-note.png?mini=true" alt="npm install tonal-note"></a></p>

<h2>API Documentation</h2>

- [Note](#module_Note)
  - _static_
    - [.midi](#module_Note.midi) ⇒ <code>Number</code>
    - [.freqToMidi](#module_Note.freqToMidi) ⇒ <code>Integer</code>
    - [.from](#module_Note.from)
    - [.simplify](#module_Note.simplify) ⇒ <code>String</code>
    - [.props()](#module_Note.props) ⇒ <code>string</code>
    - [.name()](#module_Note.name) ⇒ <code>string</code>
    - [.midiToFreq(note)](#module_Note.midiToFreq) ⇒ <code>Number</code>
    - [.chroma(note)](#module_Note.chroma) ⇒ <code>Integer</code>
    - [.altToAcc(props, [baseNote])](#module_Note.altToAcc) ⇒ <code>String</code>
    - [.build(midi, useSharps)](#module_Note.build) ⇒ <code>string</code>
  - _inner_
    - [~props](#module_Note..props) ⇒ <code>Object</code>
    - [~names(accTypes)](#module_Note..names) ⇒ <code>Array</code>
    - [~tokenize(str)](#module_Note..tokenize) ⇒ <code>Array</code>
    - [~midi(note)](#module_Note..midi) ⇒ <code>Integer</code>
    - [~freqToMidi(frequency)](#module_Note..freqToMidi) ⇒ <code>Number</code>
    - [~stepToLetter(step)](#module_Note..stepToLetter) ⇒ <code>string</code>
    - [~altToAcc(alt)](#module_Note..altToAcc) ⇒ <code>String</code>
    - [~simplify(note, useSameAccType)](#module_Note..simplify) ⇒ <code>String</code>

<a name="module_Note.midi"></a>

### Note.midi ⇒ <code>Number</code>

<p>Get the frequency from midi number</p>

**Kind**: static property of [<code>Note</code>](#module_Note)  
**Returns**: <code>Number</code> - <p>the frequency or null if not valid note midi</p>

| Param  | Type                | Description                      |
| ------ | ------------------- | -------------------------------- |
| midi   | <code>Number</code> | <p>the note midi number</p>      |
| tuning | <code>Number</code> | <p>(Optional) 440 by default</p> |

<a name="module_Note.freqToMidi"></a>

### Note.freqToMidi ⇒ <code>Integer</code>

<p>Return the chroma of a note. The chroma is the numeric equivalent to the
pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B</p>

**Kind**: static property of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - <p>the chroma number</p>

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| note  | <code>string</code> | <p>the note name</p> |

**Example**

```js
Note.chroma("Cb") // => 11
  [("C", "D", "E", "F")].map(Note.chroma); // => [0, 2, 4, 5]
```

<a name="module_Note.from"></a>

### Note.from

<p>Deprecated. This is kept for backwards compatibility only.
Use Note.from instead</p>

**Kind**: static property of [<code>Note</code>](#module_Note)  
<a name="module_Note.simplify"></a>

### Note.simplify ⇒ <code>String</code>

<p>Get the simplified and enhramonic note of the given one.</p>

**Kind**: static property of [<code>Note</code>](#module_Note)  
**Returns**: <code>String</code> - <p>the enhramonic note</p>

| Param | Type                |
| ----- | ------------------- |
| note  | <code>String</code> |

**Example**

```js
Note.enharmonic("Db"); // => "C#"
Note.enhramonic("C"); // => "C"
```

<a name="module_Note.props"></a>

### Note.props() ⇒ <code>string</code>

<p>Given a note name, return the note name or null if not valid note.
The note name will ALWAYS have the letter in upercase and accidentals
using # or b</p>
<p>Can be used to test if a string is a valid note name.</p>

**Kind**: static method of [<code>Note</code>](#module_Note)

| Param | Type                                      |
| ----- | ----------------------------------------- |
|       | <code>Pitch</code> \| <code>string</code> |

**Example**

```js
Note.name("cb2") // => "Cb2"
  [("c", "db3", "2", "g+", "gx4")].map(Note.name); // => ["C", "Db3", null, null, "G##4"]
```

<a name="module_Note.name"></a>

### Note.name() ⇒ <code>string</code>

<p>Get pitch class of a note. The note can be a string or a pitch array.</p>

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - <p>the pitch class</p>

| Param | Type                                      |
| ----- | ----------------------------------------- |
|       | <code>string</code> \| <code>Pitch</code> |

**Example**

```js
Note.pc("Db3") // => "Db"
  [("db3", "bb6", "fx2")].map(Note.pc); // => [ "Db", "Bb", "F##"]
```

<a name="module_Note.midiToFreq"></a>

### Note.midiToFreq(note) ⇒ <code>Number</code>

<p>Get the frequency of a note</p>

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Number</code> - <p>the frequency</p>

| Param | Type                                       | Description                              |
| ----- | ------------------------------------------ | ---------------------------------------- |
| note  | <code>string</code> \| <code>Number</code> | <p>the note name or midi note number</p> |

**Example**

```js
Note.freq("A4"); // => 440
Note.freq(69); // => 440
```

<a name="module_Note.chroma"></a>

### Note.chroma(note) ⇒ <code>Integer</code>

<p>Get the octave of the given pitch</p>

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - <p>the octave or null if doesn&quot;t have an octave or not a valid note</p>

| Param | Type                | Description     |
| ----- | ------------------- | --------------- |
| note  | <code>string</code> | <p>the note</p> |

**Example**

```js
Note.oct("C#4"); // => 4
Note.oct("C"); // => null
Note.oct("blah"); // => undefined
```

<a name="module_Note.altToAcc"></a>

### Note.altToAcc(props, [baseNote]) ⇒ <code>String</code>

<p>Creates a note name in scientific notation from note properties,
and optionally another note name.
It receives an object with:</p>
<ul>
<li>step: the note step (0 = C, 1 = D, ... 6 = B)</li>
<li>alt: (optional) the alteration. Negative numbers are flats, positive sharps</li>
<li>oct: (optional) the octave</li>
</ul>
<p>Optionally it receives another note as a &quot;base&quot;, meaning that any prop not explicitly
received on the first parameter will be taken from that base note. That way it can be used
as an immutable &quot;set&quot; operator for a that base note</p>

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>String</code> - <p>the note name in scientific notation or null if not valid properties</p>

| Param      | Type                | Description                                                                                                     |
| ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------- |
| props      | <code>Object</code> | <p>the note properties</p>                                                                                      |
| [baseNote] | <code>String</code> | <p>note to build the result from. If given, it returns the result of applying the given props to this note.</p> |

**Example**

```js
Note.from({ step: 5 }); // => "A"
Note.from({ step: 1, acc: -1 }); // => "Db"
Note.from({ step: 2, acc: 2, oct: 2 }); // => "E##2"
Note.from({ step: 7 }); // => null
Note.from({ alt: 1, oct: 3 }, "C4"); // => "C#3"
```

<a name="module_Note.build"></a>

### Note.build(midi, useSharps) ⇒ <code>string</code>

<p>Given a midi number, returns a note name. The altered notes will have
flats unless explicitly set with the optional <code>useSharps</code> parameter.</p>

**Kind**: static method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - <p>the note name</p>

| Param     | Type                 | Description                                                  |
| --------- | -------------------- | ------------------------------------------------------------ |
| midi      | <code>number</code>  | <p>the midi note number</p>                                  |
| useSharps | <code>boolean</code> | <p>(Optional) set to true to use sharps instead of flats</p> |

**Example**

```js
Note.fromMidi(61); // => "Db4"
Note.fromMidi(61, true); // => "C#4"
// it rounds to nearest note
Note.fromMidi(61.7); // => "D4"
```

<a name="module_Note..props"></a>

### Note~props ⇒ <code>Object</code>

<p>Get note properties. It returns an object with the following information:</p>
<ul>
<li>name {String}: the note name. The letter is always in uppercase</li>
<li>letter {String}: the note letter, always in uppercase</li>
<li>acc {String}: the note accidentals</li>
<li>octave {Number}: the octave or null if not present</li>
<li>pc {String}: the pitch class (letter + accidentals)</li>
<li>step {Number}: number equivalent of the note letter. 0 means C ... 6 means B.</li>
<li>alt {Number}: number equivalent of accidentals (negative are flats, positive sharps)</li>
<li>chroma {Number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...</li>
<li>midi {Number}: the note midi number (IMPORTANT! it can be outside 0 to 127 range)</li>
<li>freq {Number}: the frequency using an equal temperament at 440Hz</li>
</ul>
<p>This function <em>always</em> returns an object with all this properties, but if it&quot;s
not a valid note all properties will be null.</p>
<p>The returned object can&quot;t be mutated.</p>

**Kind**: inner constant of [<code>Note</code>](#module_Note)  
**Returns**: <code>Object</code> - <p>an object with the properties (or an object will all properties
set to null if not valid note)</p>

| Param | Type                | Description                                 |
| ----- | ------------------- | ------------------------------------------- |
| note  | <code>String</code> | <p>the note name in scientific notation</p> |

**Example**

```js
Note.props("fx-3").name; // => "F##-3"
Note.props("invalid").name; // => null
Note.props("C#3").oct; // => 3
Note.props().oct; // => null
```

<a name="module_Note..names"></a>

### Note~names(accTypes) ⇒ <code>Array</code>

<p>Get a list of note names (pitch classes) within a octave</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)

| Param    | Type                | Description                                                                                                                                                                                                 |
| -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| accTypes | <code>string</code> | <p>(Optional, by default &quot; b#&quot;). A string with the accidentals types: &quot; &quot; means no accidental, &quot;#&quot; means sharps, &quot;b&quot; mean flats, can be combined (see examples)</p> |

**Example**

```js
Note.names(" b"); // => [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B" ]
Note.names(" #"); // => [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ]
```

<a name="module_Note..tokenize"></a>

### Note~tokenize(str) ⇒ <code>Array</code>

<p>Split a string into tokens related to note parts.
It returns an array of strings <code>[letter, accidental, octave, modifier]</code></p>
<p>It always returns an array</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Array</code> - <p>an array of note tokens</p>

| Param | Type                |
| ----- | ------------------- |
| str   | <code>String</code> |

**Example**

```js
Note.tokenize("C#2"); // => ["C", "#", "2", ""]
Note.tokenize("Db3 major"); // => ["D", "b", "3", "major"]
Note.tokenize("major"); // => ["", "", "", "major"]
Note.tokenize("##"); // => ["", "##", "", ""]
Note.tokenize(); // => ["", "", "", ""]
```

<a name="module_Note..midi"></a>

### Note~midi(note) ⇒ <code>Integer</code>

<p>Get the note midi number. It always return a number between 0 and 127</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)  
**Returns**: <code>Integer</code> - <p>the midi number or null if not valid pitch</p>  
**See**: midi.toMidi

| Param | Type                                       | Description                                 |
| ----- | ------------------------------------------ | ------------------------------------------- |
| note  | <code>string</code> \| <code>Number</code> | <p>the note to get the midi number from</p> |

**Example**

```js
Note.midi("C4"); // => 60
Note.midi(60); // => 60
```

<a name="module_Note..freqToMidi"></a>

### Note~freqToMidi(frequency) ⇒ <code>Number</code>

<p>Get the midi number from a frequency in hertz. The midi number can
contain decimals (with two digits precission)</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)

| Param     | Type                |
| --------- | ------------------- |
| frequency | <code>Number</code> |

**Example**

```js
Note.freqToMidi(220)); //=> 57;
Note.freqToMidi(261.62)); //=> 60;
Note.freqToMidi(261)); //=> 59.96;
```

<a name="module_Note..stepToLetter"></a>

### Note~stepToLetter(step) ⇒ <code>string</code>

<p>Given a step number return it's letter (0 = C, 1 = D, 2 = E)</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)  
**Returns**: <code>string</code> - <p>the letter</p>

| Param | Type                |
| ----- | ------------------- |
| step  | <code>number</code> |

**Example**

```js
Note.stepToLetter(3); // => "F"
```

<a name="module_Note..altToAcc"></a>

### Note~altToAcc(alt) ⇒ <code>String</code>

<p>Given an alteration number, return the accidentals</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)

| Param | Type                |
| ----- | ------------------- |
| alt   | <code>Number</code> |

**Example**

```js
Note.altToAcc(-3); // => "bbb"
```

<a name="module_Note..simplify"></a>

### Note~simplify(note, useSameAccType) ⇒ <code>String</code>

<p>Simplify the note: find an enhramonic note with less accidentals.</p>

**Kind**: inner method of [<code>Note</code>](#module_Note)  
**Returns**: <code>String</code> - <p>the simplfiied note or null if not valid note</p>

| Param          | Type                 | Description                                                                                                                  |
| -------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| note           | <code>String</code>  | <p>the note to be simplified</p>                                                                                             |
| useSameAccType | <code>boolean</code> | <p>(optional, true by default) set to true to ensure the returned note has the same accidental types that the given note</p> |

**Example**

```js
Note.simplify("C##"); // => "D"
Note.simplify("C###"); // => "D#"
Note.simplify("C###", false); // => "Eb"
Note.simplify("B#4"); // => "C5"
```
