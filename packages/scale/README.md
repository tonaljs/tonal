<a name="module_Scale"></a>

# Scale
[![npm version](https://img.shields.io/npm/v/tonal-scale.svg?style=flat-square)](https://www.npmjs.com/package/tonal-scale)

A scale is a collection of pitches in ascending or descending order.

This module provides functions to get and manipulate scales.

**Example**  
```js
// es6
import * as Scale from "tonal-scale"
// es5
const Scale = require("tonal-scale");
```
**Example**  
```js
Scale.notes("Ab bebop") // => [ "Ab", "Bb", "C", "Db", "Eb", "F", "Gb", "G" ]
Scale.names() => ["major", "minor", ...]
```

* [Scale](#module_Scale)
    * [`.props(name)`](#module_Scale.props) ⇒ <code>Object</code>
    * [`.names(aliases)`](#module_Scale.names) ⇒ <code>Array</code>
    * [`.intervals(name)`](#module_Scale.intervals) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.notes(tonic, nameOrTonic, [name])`](#module_Scale.notes) ⇒ <code>Array</code>
    * [`.exists(name)`](#module_Scale.exists) ⇒ <code>Boolean</code>
    * [`.tokenize(name)`](#module_Scale.tokenize) ⇒ <code>Array</code>
    * [`.modeNames(name)`](#module_Scale.modeNames)
    * [`.chords(name)`](#module_Scale.chords)
    * [`.toScale(notes)`](#module_Scale.toScale) ⇒ <code>Array</code>
    * [`.supersets(name)`](#module_Scale.supersets) ⇒ <code>Array</code>
    * [`.subsets(name)`](#module_Scale.subsets) ⇒ <code>Array</code>

<a name="module_Scale.props"></a>

## `Scale.props(name)` ⇒ <code>Object</code>
Get scale properties. It returns an object with:
- name: the scale name
- names: a list with all possible names (includes the current)
- intervals: an array with the scale intervals
- chroma:  scale croma (see pcset)
- setnum: scale chroma number

**Kind**: static method of [<code>Scale</code>](#module_Scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name (without tonic) |

<a name="module_Scale.names"></a>

## `Scale.names(aliases)` ⇒ <code>Array</code>
Return the available scale names

**Kind**: static method of [<code>Scale</code>](#module_Scale)  
**Returns**: <code>Array</code> - the scale names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
Scale.names() // => ["maj7", ...]
```
<a name="module_Scale.intervals"></a>

## `Scale.intervals(name)` ⇒ <code>Array.&lt;String&gt;</code>
Given a scale name, return its intervals. The name can be the type and
optionally the tonic (which is ignored)

It retruns an empty array when no scale found

**Kind**: static method of [<code>Scale</code>](#module_Scale)  
**Returns**: <code>Array.&lt;String&gt;</code> - the scale intervals if is a known scale or an empty
array if no scale found  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name (tonic and type, tonic is optional) |

**Example**  
```js
Scale.intervals("major") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M" ]
```
<a name="module_Scale.notes"></a>

## `Scale.notes(tonic, nameOrTonic, [name])` ⇒ <code>Array</code>
Get the notes (pitch classes) of a scale.

Note that it always returns an array, and the values are only pitch classes.

**Kind**: static method of [<code>Scale</code>](#module_Scale)  
**Returns**: <code>Array</code> - a pitch classes array  

| Param | Type | Description |
| --- | --- | --- |
| tonic | <code>String</code> |  |
| nameOrTonic | <code>String</code> | the scale name or tonic (if 2nd param) |
| [name] | <code>String</code> | the scale name without tonic |

**Example**  
```js
Scale.notes("C", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
Scale.notes("C major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
Scale.notes("C4", "major") // => [ "C", "D", "E", "F", "G", "A", "B" ]
Scale.notes("A4", "no-scale") // => []
Scale.notes("blah", "major") // => []
```
<a name="module_Scale.exists"></a>

## `Scale.exists(name)` ⇒ <code>Boolean</code>
Check if the given name is a known scale from the scales dictionary

**Kind**: static method of [<code>Scale</code>](#module_Scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

<a name="module_Scale.tokenize"></a>

## `Scale.tokenize(name)` ⇒ <code>Array</code>
Given a string with a scale name and (optionally) a tonic, split
that components.

It retuns an array with the form [ name, tonic ] where tonic can be a
note name or null and name can be any arbitrary string
(this function doesn"t check if that scale name exists)

**Kind**: static method of [<code>Scale</code>](#module_Scale)  
**Returns**: <code>Array</code> - an array [tonic, name]  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the scale name |

**Example**  
```js
Scale.tokenize("C mixolydean") // => ["C", "mixolydean"]
Scale.tokenize("anything is valid") // => ["", "anything is valid"]
Scale.tokenize() // => ["", ""]
```
<a name="module_Scale.modeNames"></a>

## `Scale.modeNames(name)`
Find mode names of a scale

**Kind**: static method of [<code>Scale</code>](#module_Scale)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | scale name |

<a name="module_Scale.chords"></a>

## `Scale.chords(name)`
Get all chords that fits a given scale

**Kind**: static method of [<code>Scale</code>](#module_Scale)  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_Scale.toScale"></a>

## `Scale.toScale(notes)` ⇒ <code>Array</code>
Given an array of notes, return the scale: a pitch class set starting from
the first note of the array

**Kind**: static method of [<code>Scale</code>](#module_Scale)  

| Param | Type |
| --- | --- |
| notes | <code>Array</code> | 

<a name="module_Scale.supersets"></a>

## `Scale.supersets(name)` ⇒ <code>Array</code>
Get all scales names that are a superset of the given one
(has the same notes and at least one more)

**Kind**: static method of [<code>Scale</code>](#module_Scale)  
**Returns**: <code>Array</code> - a list of scale names  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_Scale.subsets"></a>

## `Scale.subsets(name)` ⇒ <code>Array</code>
Find all scales names that are a subset of the given one
(has less notes but all from the given scale)

**Kind**: static method of [<code>Scale</code>](#module_Scale)  
**Returns**: <code>Array</code> - a list of scale names  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

