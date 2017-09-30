<a name="module_pcset"></a>

# pcset
[![npm version](https://img.shields.io/npm/v/tonal-pcset.svg?style=flat-square)](https://www.npmjs.com/package/tonal-pcset)
[![tonal](https://img.shields.io/badge/tonal-pcset-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-pcset` is a collection of functions to work with pitch class sets, oriented
to make comparations (isEqual, isSubset, isSuperset)

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-pcset`

```js
var pcset = require('tonal-pcset')
pcset.isEqual('c2 d5 e6', 'c6 e3 d1') // => true
```

## API documentation


* [pcset](#module_pcset)
    * [`.chroma(set)`](#module_pcset.chroma) ⇒ <code>String</code>
    * [`.modes(set, normalize)`](#module_pcset.modes) ⇒ <code>Array.&lt;String&gt;</code>
    * [`.isChroma(chroma)`](#module_pcset.isChroma) ⇒ <code>Boolean</code>
    * [`.intervals(pcset)`](#module_pcset.intervals) ⇒ <code>Array</code>
    * [`.isEqual(set1, set2)`](#module_pcset.isEqual) ⇒ <code>Boolean</code>
    * [`.isSubsetOf(set, notes)`](#module_pcset.isSubsetOf) ⇒ <code>boolean</code>
    * [`.isSupersetOf(set, notes)`](#module_pcset.isSupersetOf) ⇒ <code>boolean</code>
    * [`.includes(set, note)`](#module_pcset.includes) ⇒ <code>Boolean</code>
    * [`.filter(set, notes)`](#module_pcset.filter) ⇒ <code>Array</code>

<a name="module_pcset.chroma"></a>

## `pcset.chroma(set)` ⇒ <code>String</code>
Get chroma of a pitch class set. A chroma identifies each set uniquely.
It's a 12-digit binary each presenting one semitone of the octave.

Note that this function accepts a chroma as parameter and return it
without modification.

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>String</code> - a binary representation of the pitch class set  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the pitch class set |

**Example**  
```js
pcset.chroma(["C", "D", "E"]) // => '1010100000000'
```
<a name="module_pcset.modes"></a>

## `pcset.modes(set, normalize)` ⇒ <code>Array.&lt;String&gt;</code>
Given a a list of notes or a pcset chroma, produce the rotations
of the chroma discarding the ones that starts with '0'

This is used, for example, to get all the modes of a scale.

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Array.&lt;String&gt;</code> - an array with all the modes of the chroma  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the list of notes or pitchChr of the set |
| normalize | <code>Boolean</code> | (Optional, true by default) remove all the rotations that starts with '0' |

**Example**  
```js
pcset.modes(["C", "D", "E"]).map(pcset.intervals)
```
<a name="module_pcset.isChroma"></a>

## `pcset.isChroma(chroma)` ⇒ <code>Boolean</code>
Test if the given string is a pitch class set chroma.

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if its a valid pcset chroma  

| Param | Type | Description |
| --- | --- | --- |
| chroma | <code>String</code> | the pitch class set chroma |

**Example**  
```js
pcset.isChroma('101010101010') // => true
pcset.isChroma('101001') // => false
```
<a name="module_pcset.intervals"></a>

## `pcset.intervals(pcset)` ⇒ <code>Array</code>
Given a pcset (notes or chroma) return it's intervals

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Array</code> - intervals or empty array if not valid pcset  

| Param | Type | Description |
| --- | --- | --- |
| pcset | <code>String</code> \| <code>Array</code> | the pitch class set (notes or chroma) |

**Example**  
```js
pcset.intervals('1010100000000') => ["1P", "2M", "3M"]
```
<a name="module_pcset.isEqual"></a>

## `pcset.isEqual(set1, set2)` ⇒ <code>Boolean</code>
Test if two pitch class sets are identical

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if they are equal  

| Param | Type | Description |
| --- | --- | --- |
| set1 | <code>Array</code> \| <code>String</code> | one of the pitch class sets |
| set2 | <code>Array</code> \| <code>String</code> | the other pitch class set |

**Example**  
```js
pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
```
<a name="module_pcset.isSubsetOf"></a>

## `pcset.isSubsetOf(set, notes)` ⇒ <code>boolean</code>
Create a function that test if a collection of notes is a 
subset of a given set 

The function can be partially applied

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>boolean</code> - true if notes is a subset of set, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set string to test against |
| notes | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set |

**Example**  
```js
const inCMajor = pcset.isSubsetOf(["C", "E", "G"])
inCMajor(["e6", "c4"]) // => true
inCMajor(["e6", "c4", "d3"]) // => false
```
<a name="module_pcset.isSupersetOf"></a>

## `pcset.isSupersetOf(set, notes)` ⇒ <code>boolean</code>
Create a function that test if a collectio of notes is a
superset of a given set (it contains all notes and at least one more)

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>boolean</code> - true if notes is a superset of set, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set string to test against |
| notes | <code>Array</code> \| <code>String</code> | an array of notes or a chroma set |

**Example**  
```js
const extendsCMajor = pcset.isSupersetOf(["C", "E", "G"])
extendsCMajor(["e6", "a", "c4", "g2"]) // => true
extendsCMajor(["c6", "e4", "g3"]) // => false
```
<a name="module_pcset.includes"></a>

## `pcset.includes(set, note)` ⇒ <code>Boolean</code>
Test if a given pitch class set includes a note

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if the note is included in the pcset  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |
| note | <code>String</code> \| <code>Pitch</code> | the note to test |

**Example**  
```js
pcset.includes(["C", "D", "E"], 'C4') // => true
pcset.includes(["C", "D", "E"], 'C#4') // => false
```
<a name="module_pcset.filter"></a>

## `pcset.filter(set, notes)` ⇒ <code>Array</code>
Filter a list with a pitch class set

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Array</code> - the filtered notes  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>String</code> | the pitch class set notes |
| notes | <code>Array</code> \| <code>String</code> | the note list to be filtered |

**Example**  
```js
pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ 'c2', 'd2', 'c3', 'd3' ])
pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ 'c2', 'c3' ])
```
