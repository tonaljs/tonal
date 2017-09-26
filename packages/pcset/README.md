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
    * [`.isSubset(test, set)`](#module_pcset.isSubset) ⇒ <code>Boolean</code>
    * [`.isSuperset(test, set)`](#module_pcset.isSuperset) ⇒ <code>Boolean</code>
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
pcset.isEqual('c2 d3', 'c5 d2') // => true
```
<a name="module_pcset.isSubset"></a>

## `pcset.isSubset(test, set)` ⇒ <code>Boolean</code>
Test if a pitch class set is a subset of another

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if the test set is a subset of the set  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>Array</code> \| <code>String</code> | the set to test |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |

**Example**  
```js
pcset.subset('c d e', 'C2 D4 D5 C6') // => true
```
<a name="module_pcset.isSuperset"></a>

## `pcset.isSuperset(test, set)` ⇒ <code>Boolean</code>
Test if a pitch class set is a superset

**Kind**: static method of [<code>pcset</code>](#module_pcset)  
**Returns**: <code>Boolean</code> - true if the test set is a superset of the set  

| Param | Type | Description |
| --- | --- | --- |
| test | <code>Array</code> \| <code>String</code> | the set to test |
| set | <code>Array</code> \| <code>String</code> | the base set to test against |

**Example**  
```js
pcset.isSuperset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
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
pcset.includes('c d e', 'C4') // => true
pcset.includes('c d e', 'C#4') // => false
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
pcset.filter(c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ 'c2', 'c3' ])
```
