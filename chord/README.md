<a name="module_Chord"></a>

# Chord
[![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
[![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-chord` is a collection of functions to manipulate musical chords

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
// es6
import * as Chord from "tonal-chord"
// es5
const Chord = require("tonal-chord")
```
**Example**  
```js
Chord.notes("CMaj7") // => ["C", "E", "G", "B"]
```

* [Chord](#module_Chord)
    * [`.names(aliases)`](#module_Chord.names) ⇒ <code>Array</code>
    * [`.props(name)`](#module_Chord.props) ⇒ <code>Object</code>
    * [`.intervals(name)`](#module_Chord.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.notes(nameOrTonic, [name])`](#module_Chord.notes) ⇒ <code>Array</code>
    * [`.exists(name)`](#module_Chord.exists) ⇒ <code>Boolean</code>
    * [`.supersets(name)`](#module_Chord.supersets) ⇒ <code>Array</code>
    * [`.subsets(name)`](#module_Chord.subsets) ⇒ <code>Array</code>
    * [`.tokenize(name)`](#module_Chord.tokenize) ⇒ <code>Array</code>

<a name="module_Chord.names"></a>

## `Chord.names(aliases)` ⇒ <code>Array</code>
Return the available chord names

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Array</code> - the chord names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
Chord.names() // => ["maj7", ...]
```
<a name="module_Chord.props"></a>

## `Chord.props(name)` ⇒ <code>Object</code>
Get chord properties. It returns an object with:

- name: the chord name
- names: a list with all possible names (includes the current)
- intervals: an array with the chord intervals
- chroma:  chord croma (see pcset)
- setnum: chord chroma number

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Object</code> - an object with the properties or a object with all properties
set to null if not valid chord name  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the chord name (without tonic) |

<a name="module_Chord.intervals"></a>

## `Chord.intervals(name)` ⇒ <code>Array.&lt;String&gt;</code>
Get chord intervals. It always returns an array

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Array.&lt;String&gt;</code> - a list of intervals or null if the type is not known  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the chord name (optionally a tonic and type) |

<a name="module_Chord.notes"></a>

## `Chord.notes(nameOrTonic, [name])` ⇒ <code>Array</code>
Get the chord notes of a chord. This function accepts either a chord name
(for example: "Cmaj7") or a list of notes.

It always returns an array, even if the chord is not found.

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Array</code> - an array of notes or an empty array  

| Param | Type | Description |
| --- | --- | --- |
| nameOrTonic | <code>string</code> | name of the chord or the tonic (if the second parameter is present) |
| [name] | <code>string</code> | (Optional) name if the first parameter is the tonic |

**Example**  
```js
Chord.notes("Cmaj7") // => ["C", "E", "G", "B"]
Chord.notes("C", "maj7") // => ["C", "E", "G", "B"]
```
<a name="module_Chord.exists"></a>

## `Chord.exists(name)` ⇒ <code>Boolean</code>
Check if a given name correspond to a chord in the dictionary

**Kind**: static method of [<code>Chord</code>](#module_Chord)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

**Example**  
```js
Chord.exists("CMaj7") // => true
Chord.exists("Maj7") // => true
Chord.exists("Ablah") // => false
```
<a name="module_Chord.supersets"></a>

## `Chord.supersets(name)` ⇒ <code>Array</code>
Get all chords names that are a superset of the given one
(has the same notes and at least one more)

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Array</code> - a list of chord names  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="module_Chord.subsets"></a>

## `Chord.subsets(name)` ⇒ <code>Array</code>
Find all chords names that are a subset of the given one
(has less notes but all from the given chord)

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Array</code> - a list of chord names  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="module_Chord.tokenize"></a>

## `Chord.tokenize(name)` ⇒ <code>Array</code>
Tokenize a chord name. It returns an array with the tonic and chord type
If not tonic is found, all the name is considered the chord name.

This function does NOT check if the chord type exists or not. It only tries
to split the tonic and chord type.

**Kind**: static method of [<code>Chord</code>](#module_Chord)  
**Returns**: <code>Array</code> - an array with [tonic, type]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the chord name |

**Example**  
```js
Chord.tokenize("Cmaj7") // => [ "C", "maj7" ]
Chord.tokenize("C7") // => [ "C", "7" ]
Chord.tokenize("mMaj7") // => [ "", "mMaj7" ]
Chord.tokenize("Cnonsense") // => [ "C", "nonsense" ]
```
