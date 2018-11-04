<a name="module_Key"></a>

# Key

[![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
[![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-key` is a collection of functions to query about tonal keys.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**

```js
// es6
import * as Key from "tonal-key";
// es5
const Key = require("tonal-key");
```

**Example**

```js
Key.scale("E mixolydian"); // => [ "E", "F#", "G#", "A", "B", "C#", "D" ]
Key.relative("minor", "C major"); // => "A minor"
```

- [Key](#module_Key)
  - [`.degrees`](#module_Key.degrees) ⇒ <code>Array</code>
  - [`.modeNames(alias)`](#module_Key.modeNames) ⇒ <code>Array</code>
  - [`.fromAlter(alt)`](#module_Key.fromAlter) ⇒ <code>Key</code>
  - [`.props(name)`](#module_Key.props) ⇒ <code>Object</code>
  - [`.scale(key)`](#module_Key.scale) ⇒ <code>Array</code>
  - [`.alteredNotes(key)`](#module_Key.alteredNotes) ⇒ <code>Array</code>
  - [`.leadsheetSymbols(symbols, keyName)`](#module_Key.leadsheetSymbols) ⇒ <code>function</code>
  - [`.chords(name)`](#module_Key.chords) ⇒ <code>Array</code>
  - [`.triads(name)`](#module_Key.triads) ⇒ <code>Array</code>
  - [`.secDomChords(name)`](#module_Key.secDomChords) ⇒ <code>Array</code>
  - [`.relative(mode, key)`](#module_Key.relative)
  - [`.tokenize(name)`](#module_Key.tokenize) ⇒ <code>Array</code>

<a name="module_Key.degrees"></a>

## `Key.degrees` ⇒ <code>Array</code>

Get a list of key scale degrees

**Kind**: static constant of [<code>Key</code>](#module_Key)

| Param   | Type                |
| ------- | ------------------- |
| keyName | <code>String</code> |

**Example**

```js
Key.degrees("C major") => ["I", "ii", "iii", "IV", "V", "vi", "vii"]
```

<a name="module_Key.modeNames"></a>

## `Key.modeNames(alias)` ⇒ <code>Array</code>

Get a list of valid mode names. The list of modes will be always in
increasing order (ionian to locrian)

**Kind**: static method of [<code>Key</code>](#module_Key)  
**Returns**: <code>Array</code> - an array of strings

| Param | Type                 | Description               |
| ----- | -------------------- | ------------------------- |
| alias | <code>Boolean</code> | true to get aliases names |

**Example**

```js
Key.modes(); // => [ "ionian", "dorian", "phrygian", "lydian",
// "mixolydian", "aeolian", "locrian" ]
Key.modes(true); // => [ "ionian", "dorian", "phrygian", "lydian",
// "mixolydian", "aeolian", "locrian", "major", "minor" ]
```

<a name="module_Key.fromAlter"></a>

## `Key.fromAlter(alt)` ⇒ <code>Key</code>

Create a major key from alterations

**Kind**: static method of [<code>Key</code>](#module_Key)  
**Returns**: <code>Key</code> - the key object

| Param | Type                 | Description                                             |
| ----- | -------------------- | ------------------------------------------------------- |
| alt   | <code>Integer</code> | the alteration number (positive sharps, negative flats) |

**Example**

```js
Key.fromAlter(2); // => "D major"
```

<a name="module_Key.props"></a>

## `Key.props(name)` ⇒ <code>Object</code>

Return the a key properties object with the following information:

- name {String}: name
- tonic {String}: key tonic
- mode {String}: key mode
- modenum {Number}: mode number (0 major, 1 dorian, ...)
- intervals {Array}: the scale intervals
- scale {Array}: the scale notes
- acc {String}: accidentals of the key signature
- alt {Number}: alteration number (a numeric representation of accidentals)

**Kind**: static method of [<code>Key</code>](#module_Key)  
**Returns**: <code>Object</code> - the key properties object or null if not a valid key

| Param | Type                | Description  |
| ----- | ------------------- | ------------ |
| name  | <code>String</code> | the key name |

**Example**

```js
Key.props("C3 dorian"); // => { tonic: "C", mode: "dorian", ... }
```

<a name="module_Key.scale"></a>

## `Key.scale(key)` ⇒ <code>Array</code>

Get scale of a key

**Kind**: static method of [<code>Key</code>](#module_Key)  
**Returns**: <code>Array</code> - the key scale

| Param | Type                                       |
| ----- | ------------------------------------------ |
| key   | <code>String</code> \| <code>Object</code> |

**Example**

```js
Key.scale("A major"); // => [ "A", "B", "C#", "D", "E", "F#", "G#" ]
Key.scale("Bb minor"); // => [ "Bb", "C", "Db", "Eb", "F", "Gb", "Ab" ]
Key.scale("C dorian"); // => [ "C", "D", "Eb", "F", "G", "A", "Bb" ]
Key.scale("E mixolydian"); // => [ "E", "F#", "G#", "A", "B", "C#", "D" ]
```

<a name="module_Key.alteredNotes"></a>

## `Key.alteredNotes(key)` ⇒ <code>Array</code>

Get a list of the altered notes of a given Key. The notes will be in
the same order than in the key signature.

**Kind**: static method of [<code>Key</code>](#module_Key)

| Param | Type                | Description  |
| ----- | ------------------- | ------------ |
| key   | <code>String</code> | the key name |

**Example**

```js
Key.alteredNotes("Eb major"); // => [ "Bb", "Eb", "Ab" ]
```

<a name="module_Key.leadsheetSymbols"></a>

## `Key.leadsheetSymbols(symbols, keyName)` ⇒ <code>function</code>

Get a lead-sheet symbols for a given key name

This function is currified (so can be partially applied)

From http://openmusictheory.com/triads.html

A lead-sheet symbol begins with a capital letter (and, if necessary,
an accidental) denoting the root of the chord.
That letter is followed by information about a chord’s quality:

- major triad: no quality symbol is added
- minor triad: lower-case “m”
- diminished triad: lower-case “dim” or a degree sign “°”
- augmented triad: lower-case “aug” or a plus sign “+”

**Kind**: static method of [<code>Key</code>](#module_Key)  
**See**

- Key.chords
- Key.triads

| Param   | Type                              | Description                                  |
| ------- | --------------------------------- | -------------------------------------------- |
| symbols | <code>Array.&lt;String&gt;</code> | an array of symbols in major scale order     |
| keyName | <code>String</code>               | the name of the key you want the symbols for |

**Example**

```js
const chords = Key.leadsheetSymbols(["M", "m", "m", "M", "7", "m", "dim"]);
chords("D dorian"); //=> ["Dm", "Em", "FM", "G7", "Am", "Bdim", "CM"]
```

<a name="module_Key.chords"></a>

## `Key.chords(name)` ⇒ <code>Array</code>

Get key chords

**Kind**: static method of [<code>Key</code>](#module_Key)

| Param | Type                | Description  |
| ----- | ------------------- | ------------ |
| name  | <code>String</code> | the key name |

**Example**

```js
Key.chords("A major"); // => ["AMaj7", "Bm7", "C#m7", "DMaj7", ..,]
```

<a name="module_Key.triads"></a>

## `Key.triads(name)` ⇒ <code>Array</code>

Get key triads

**Kind**: static method of [<code>Key</code>](#module_Key)

| Param | Type                | Description  |
| ----- | ------------------- | ------------ |
| name  | <code>String</code> | the key name |

**Example**

```js
Key.triads("A major"); // => ["AM", "Bm", "C#m", "DM", "E7", "F#m", "G#mb5"]
```

<a name="module_Key.secDomChords"></a>

## `Key.secDomChords(name)` ⇒ <code>Array</code>

Get secondary dominant key chords

**Kind**: static method of [<code>Key</code>](#module_Key)

| Param | Type                | Description  |
| ----- | ------------------- | ------------ |
| name  | <code>String</code> | the key name |

**Example**

```js
Key.secDomChords("A major"); // => ["E7", "F#7", ...]
```

<a name="module_Key.relative"></a>

## `Key.relative(mode, key)`

Get relative of a key. Two keys are relative when the have the same
key signature (for example C major and A minor)

It can be partially applied.

**Kind**: static method of [<code>Key</code>](#module_Key)

| Param | Type                | Description              |
| ----- | ------------------- | ------------------------ |
| mode  | <code>String</code> | the relative destination |
| key   | <code>String</code> | the key source           |

**Example**

```js
Key.relative("dorian", "B major"); // => "C# dorian"
// partial application
var minor = Key.relative("minor");
minor("C major"); // => "A minor"
minor("E major"); // => "C# minor"
```

<a name="module_Key.tokenize"></a>

## `Key.tokenize(name)` ⇒ <code>Array</code>

Split the key name into its components (pitch class tonic and mode name)

**Kind**: static method of [<code>Key</code>](#module_Key)  
**Returns**: <code>Array</code> - an array in the form [tonic, key]

| Param | Type                |
| ----- | ------------------- |
| name  | <code>String</code> |

**Example**

```js
Key.tokenize("C major"); // => ["C", "major"]
```
