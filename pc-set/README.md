<a name="module_PCSet"></a>

# PCSet
[![npm version](https://img.shields.io/npm/v/tonal.svg?style=flat-square)](https://www.npmjs.com/package/tonal)

`tonal/pc-set` is a collection of functions to work with pitch class sets, oriented
to make comparations (isEqual, isSubset, isSuperset)

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
// es6
import PCSet from "tonal-pcset"
const PCSet = require("tonal-pcset")

PCSet.isEqual("c2 d5 e6", "c6 e3 d1") // => true
```

## API documentation


* [PCSet](#module_PCSet)
    * [`.chroma(set)`](#module_PCSet.chroma) ⇒ <code>string</code>
    * [`.chromas()`](#module_PCSet.chromas) ⇒ <code>Array</code>
    * [`.modes(set, normalize)`](#module_PCSet.modes) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.isChroma(chroma)`](#module_PCSet.isChroma) ⇒ <code>Boolean</code>
    * [`.intervals(pcset)`](#module_PCSet.intervals) ⇒ <code>Array</code>
    * [`.isEqual(set1, set2)`](#module_PCSet.isEqual) ⇒ <code>Boolean</code>
    * [`.isSubsetOf(set, notes)`](#module_PCSet.isSubsetOf) ⇒ <code>boolean</code>
    * [`.isSupersetOf(set, notes)`](#module_PCSet.isSupersetOf) ⇒ <code>boolean</code>
    * [`.includes(set, note)`](#module_PCSet.includes) ⇒ <code>Boolean</code>
    * [`.filter(set, notes)`](#module_PCSet.filter) ⇒ <code>Array</code>

<a name="module_PCSet.chroma"></a>

## `PCSet.chroma(set)` ⇒ <code>string</code>
Get chroma of a pitch class set. A chroma identifies each set uniquely.
It"s a 12-digit binary each presenting one semitone of the octave.

Note that this function accepts a chroma as parameter and return it
without modification.

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>string</code> - a binary representation of the pitch class set  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the pitch class set |

**Example**  
```js
PCSet.chroma(["C", "D", "E"]) // => "1010100000000"
```
<a name="module_PCSet.chromas"></a>

## `PCSet.chromas()` ⇒ <code>Array</code>
Get a list of all possible chromas (all possible scales)
More information: http://allthescales.org/

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Array</code> - an array of possible chromas from '10000000000' to '11111111111'  
<a name="module_PCSet.modes"></a>

## `PCSet.modes(set, normalize)` ⇒ <code>Array.&lt;String&gt;</code>
Given a a list of notes or a pcset chroma, produce the rotations
of the chroma discarding the ones that starts with "0"

This is used, for example, to get all the modes of a scale.

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Array.&lt;String&gt;</code> - an array with all the modes of the chroma  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the list of notes or pitchChr of the set |
| normalize | <code>Boolean</code> | (Optional, true by default) remove all the rotations that starts with "0" |

**Example**  
```js
PCSet.modes(["C", "D", "E"]).map(PCSet.intervals)
```
<a name="module_PCSet.isChroma"></a>

## `PCSet.isChroma(chroma)` ⇒ <code>Boolean</code>
Test if the given string is a pitch class set chroma.

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Boolean</code> - true if its a valid pcset chroma  

| Param | Type | Description |
| --- | --- | --- |
| chroma | <code>string</code> | the pitch class set chroma |

**Example**  
```js
PCSet.isChroma("101010101010") // => true
PCSet.isChroma("101001") // => false
```
<a name="module_PCSet.intervals"></a>

## `PCSet.intervals(pcset)` ⇒ <code>Array</code>
Given a pcset (notes or chroma) return it"s intervals

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Array</code> - intervals or empty array if not valid pcset  

| Param | Type | Description |
| --- | --- | --- |
| pcset | <code>String</code> \| <code>Array</code> | the pitch class set (notes or chroma) |

**Example**  
```js
PCSet.intervals("1010100000000") => ["1P", "2M", "3M"]
```
<a name="module_PCSet.isEqual"></a>

## `PCSet.isEqual(set1, set2)` ⇒ <code>Boolean</code>
Test if two pitch class sets are identical

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Boolean</code> - true if they are equal  

| Param | Type | Description |
| --- | --- | --- |
| set1 | <code>Array</code> \| <code>String</code> | one of the pitch class sets |
| set2 | <code>Array</code> \| <code>String</code> | the other pitch class set |

**Example**  
```js
PCSet.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
```
<a name="module_PCSet.isSubsetOf"></a>

## `PCSet.isSubsetOf(set, notes)` ⇒ <code>boolean</code>
Create a function that test if a collection of notes is a
subset of a given set

The function can be partially applied

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>boolean</code> - true if notes is a subset of set, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set string to test against |
| notes | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set |

**Example**  
```js
const inCMajor = PCSet.isSubsetOf(["C", "E", "G"])
inCMajor(["e6", "c4"]) // => true
inCMajor(["e6", "c4", "d3"]) // => false
```
<a name="module_PCSet.isSupersetOf"></a>

## `PCSet.isSupersetOf(set, notes)` ⇒ <code>boolean</code>
Create a function that test if a collectio of notes is a
superset of a given set (it contains all notes and at least one more)

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>boolean</code> - true if notes is a superset of set, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set string to test against |
| notes | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set |

**Example**  
```js
const extendsCMajor = PCSet.isSupersetOf(["C", "E", "G"])
extendsCMajor(["e6", "a", "c4", "g2"]) // => true
extendsCMajor(["c6", "e4", "g3"]) // => false
```
<a name="module_PCSet.includes"></a>

## `PCSet.includes(set, note)` ⇒ <code>Boolean</code>
Test if a given pitch class set includes a note

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Boolean</code> - true if the note is included in the pcset  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |
| note | <code>String</code> \| <code>Pitch</code> | the note to test |

**Example**  
```js
PCSet.includes(["C", "D", "E"], "C4") // => true
PCSet.includes(["C", "D", "E"], "C#4") // => false
```
<a name="module_PCSet.filter"></a>

## `PCSet.filter(set, notes)` ⇒ <code>Array</code>
Filter a list with a pitch class set

**Kind**: static method of [<code>PCSet</code>](#module_PCSet)  
**Returns**: <code>Array</code> - the filtered notes  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the pitch class set notes |
| notes | <code>Array</code> \| <code>String</code> | the note list to be filtered |

**Example**  
```js
PCSet.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
PCSet.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
```
