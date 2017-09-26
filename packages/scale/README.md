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
    * [`.props(name)`](#module_scale.props) ⇒ <code>Object</code>
    * [`.names(aliases)`](#module_scale.names) ⇒ <code>Array</code>
    * [`.intervals(name)`](#module_scale.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.notes(tonic, name)`](#module_scale.notes) ⇒ <code>Array</code>
    * [`.exists(name)`](#module_scale.exists) ⇒ <code>Boolean</code>
    * [`.tokenize(name)`](#module_scale.tokenize) ⇒ <code>Array</code>
    * [`.modeNames(name)`](#module_scale.modeNames)
    * [`.chords(name)`](#module_scale.chords)
    * [`.toScale(notes)`](#module_scale.toScale) ⇒ <code>Array</code>
    * [`.extensions(name)`](#module_scale.extensions)

<a name="module_scale.props"></a>

## `scale.props(name)` ⇒ <code>Object</code>
Get scale properties. It returns an object with:
- name: the scale name
- names: a list with all possible names (includes the current)
- intervals: an array with the scale intervals
- chroma:  scale croma (see pcset)
- setnum: scale chroma number

**Kind**: static method of [<code>scale</code>](#module_scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name (without tonic) |

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
<a name="module_scale.intervals"></a>

## `scale.intervals(name)` ⇒ <code>Array.&lt;String&gt;</code>
Given a scale name, return its intervals. The name can be the type and
optionally the tonic (which is ignored)

It retruns an empty array when no scale found

**Kind**: static method of [<code>scale</code>](#module_scale)  
**Returns**: <code>Array.&lt;String&gt;</code> - the scale intervals if is a known scale or an empty
array if no scale found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name (tonic and type, tonic is optional) |

**Example**  
```js
scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
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
<a name="module_scale.modeNames"></a>

## `scale.modeNames(name)`
Find mode names of a scale

**Kind**: static method of [<code>scale</code>](#module_scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | scale name |

<a name="module_scale.chords"></a>

## `scale.chords(name)`
Get all chords that fits a given scale

**Kind**: static method of [<code>scale</code>](#module_scale)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_scale.toScale"></a>

## `scale.toScale(notes)` ⇒ <code>Array</code>
Given an array of notes, return the scale: a pitch class set starting from 
the first note of the array

**Kind**: static method of [<code>scale</code>](#module_scale)  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

<a name="module_scale.extensions"></a>

## `scale.extensions(name)`
Find all scales than extends the given one

**Kind**: static method of [<code>scale</code>](#module_scale)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

