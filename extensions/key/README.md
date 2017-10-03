<a name="module_key"></a>

# key
[![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
[![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-key` is a collection of functions to query about tonal keys.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

**Example**  
```js
const key = require('tonal-key')
key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
key.relative('minor', 'C major') // => 'A minor'
```

* [key](#module_key)
    * [`.degrees`](#module_key.degrees) ⇒ <code>Array</code>
    * [`.modeNames(alias)`](#module_key.modeNames) ⇒ <code>Array</code>
    * [`.fromAlter(alt)`](#module_key.fromAlter) ⇒ <code>Key</code>
    * [`.props(name)`](#module_key.props) ⇒ <code>Object</code>
    * [`.scale(key)`](#module_key.scale) ⇒ <code>Array</code>
    * [`.alteredNotes(key)`](#module_key.alteredNotes) ⇒ <code>Array</code>
    * [`.chords(name)`](#module_key.chords) ⇒ <code>Array</code>
    * [`.secDomChords(name)`](#module_key.secDomChords) ⇒ <code>Array</code>
    * [`.relative(mode, key)`](#module_key.relative)
    * [`.tokenize(name)`](#module_key.tokenize) ⇒ <code>Array</code>

<a name="module_key.degrees"></a>

## `key.degrees` ⇒ <code>Array</code>
Get a list of key scale degrees

**Kind**: static constant of [<code>key</code>](#module_key)  

| Param | Type |
| --- | --- |
| keyName | <code>String</code> | 

**Example**  
```js
tonal.key.degrees('C major') => ["I", "ii", "iii", "IV", "V", "vi", "vii"]
```
<a name="module_key.modeNames"></a>

## `key.modeNames(alias)` ⇒ <code>Array</code>
Get a list of valid mode names. The list of modes will be always in
increasing order (ionian to locrian)

**Kind**: static method of [<code>key</code>](#module_key)  
**Returns**: <code>Array</code> - an array of strings  

| Param | Type | Description |
| --- | --- | --- |
| alias | <code>Boolean</code> | true to get aliases names |

**Example**  
```js
key.modes() // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
// 'mixolydian', 'aeolian', 'locrian' ]
key.modes(true) // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
// 'mixolydian', 'aeolian', 'locrian', 'major', 'minor' ]
```
<a name="module_key.fromAlter"></a>

## `key.fromAlter(alt)` ⇒ <code>Key</code>
Create a major key from alterations

**Kind**: static method of [<code>key</code>](#module_key)  
**Returns**: <code>Key</code> - the key object  

| Param | Type | Description |
| --- | --- | --- |
| alt | <code>Integer</code> | the alteration number (positive sharps, negative flats) |

**Example**  
```js
var key = require('tonal-key')
key.fromAlter(2) // => 'D major'
```
<a name="module_key.props"></a>

## `key.props(name)` ⇒ <code>Object</code>
Return the a key properties object with the following information:

- name {String}: name
- tonic {String}: key tonic
- mode {String}: key mode
- modenum {Number}: mode number (0 major, 1 dorian, ...)
- intervals {Array}: the scale intervals
- scale {Array}: the scale notes
- acc {String}: accidentals of the key signature
- alt {Number}: alteration number (a numeric representation of accidentals)

**Kind**: static method of [<code>key</code>](#module_key)  
**Returns**: <code>Object</code> - the key properties object or null if not a valid key  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the key name |

**Example**  
```js
var key = require('tonal-key')
key.props('C3 dorian') // => { tonic: 'C', mode: 'dorian', ... }
```
<a name="module_key.scale"></a>

## `key.scale(key)` ⇒ <code>Array</code>
Get scale of a key

**Kind**: static method of [<code>key</code>](#module_key)  
**Returns**: <code>Array</code> - the key scale  

| Param | Type |
| --- | --- |
| key | <code>String</code> \| <code>Object</code> | 

**Example**  
```js
key.scale('A major') // => [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ]
key.scale('Bb minor') // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab' ]
key.scale('C dorian') // => [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ]
key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
```
<a name="module_key.alteredNotes"></a>

## `key.alteredNotes(key)` ⇒ <code>Array</code>
Get a list of the altered notes of a given key. The notes will be in
the same order than in the key signature.

**Kind**: static method of [<code>key</code>](#module_key)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | the key name |

**Example**  
```js
var key = require('tonal-keys')
key.alteredNotes('Eb major') // => [ 'Bb', 'Eb', 'Ab' ]
```
<a name="module_key.chords"></a>

## `key.chords(name)` ⇒ <code>Array</code>
Get key chords

**Kind**: static method of [<code>key</code>](#module_key)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the key name |

**Example**  
```js
key.chords("A major") // => ["AMaj7", "Bm7", "C#m7", "DMaj7", ..,]
```
<a name="module_key.secDomChords"></a>

## `key.secDomChords(name)` ⇒ <code>Array</code>
Get secondary dominant key chords

**Kind**: static method of [<code>key</code>](#module_key)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the key name |

**Example**  
```js
key.secDomChords("A major") // => ["E7", "F#7", ...]
```
<a name="module_key.relative"></a>

## `key.relative(mode, key)`
Get relative of a key. Two keys are relative when the have the same
key signature (for example C major and A minor)

It can be partially applied.

**Kind**: static method of [<code>key</code>](#module_key)  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>String</code> | the relative destination |
| key | <code>String</code> | the key source |

**Example**  
```js
key.relative('dorian', 'B major') // => 'C# dorian'
// partial application
var minor = key.relative('minor')
minor('C major') // => 'A minor'
minor('E major') // => 'C# minor'
```
<a name="module_key.tokenize"></a>

## `key.tokenize(name)` ⇒ <code>Array</code>
Split the key name into its components (pitch class tonic and mode name)

**Kind**: static method of [<code>key</code>](#module_key)  
**Returns**: <code>Array</code> - an array in the form [tonic, key]  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

**Example**  
```js
key.tokenize('C major') // => ['C', 'major']
```
