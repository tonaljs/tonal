<a name="module_Pcset"></a>

# Pcset
`tonal/pcset` is a collection of functions to work with pitchclass sets.
It has methods to compare pitch class sets and to work with pitch class set chromas


## Usage

**Example**  
```js
import Pcset from "tonal/pcset"
Pcset.isEqual("c2 d5 e6", "c6 e3 d1") // => true
```
**Example**  
```js
const Tonal = require('tonal')
Tonal.Pcset.chroma(['C', 'D', 'E']) // => "101010000000"

## API
```

* [Pcset](#module_Pcset)
    * [`.chroma(set)`](#module_Pcset.chroma) ⇒ <code>string</code>
    * [`.chromas([number])`](#module_Pcset.chromas) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.modes(set, normalize)`](#module_Pcset.modes) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.isChroma(chroma)`](#module_Pcset.isChroma) ⇒ <code>boolean</code>
    * [`.intervals(pcset)`](#module_Pcset.intervals) ⇒ <code>Array</code>
    * [`.isEqual(set1, set2)`](#module_Pcset.isEqual) ⇒ <code>boolean</code>
    * [`.isSubsetOf(set, notes)`](#module_Pcset.isSubsetOf) ⇒ <code>boolean</code>
    * [`.isSupersetOf(set, notes)`](#module_Pcset.isSupersetOf) ⇒ <code>boolean</code>
    * [`.includes(set, note)`](#module_Pcset.includes) ⇒ <code>boolean</code>
    * [`.filter(set, notes)`](#module_Pcset.filter) ⇒ <code>Array</code>

<a name="module_Pcset.chroma"></a>

## `Pcset.chroma(set)` ⇒ <code>string</code>
Get chroma of a pitch class set. A chroma identifies each set uniquely.
It"s a 12-digit binary each presenting one semitone of the octave.

Note that this function accepts a chroma as parameter and return it
without modification.

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>string</code> - a binary representation of the pitch class set or null  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array.&lt;string&gt;</code> | the pitch class set |

**Example**  
```js
Pcset.chroma(["C", "D", "E"]) // => "1010100000000"
```
<a name="module_Pcset.chromas"></a>

## `Pcset.chromas([number])` ⇒ <code>Array.&lt;string&gt;</code>
Get a list of all possible chromas (all possible scales)
More information: http://allthescales.org/

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array of possible chromas from '10000000000' to '11111111111'  

| Param | Description |
| --- | --- |
| [number] | numberOfNotes - number of notes of the given chromas. Any by default |

<a name="module_Pcset.modes"></a>

## `Pcset.modes(set, normalize)` ⇒ <code>Array.&lt;string&gt;</code>
Given a a list of notes or a pcset chroma, produce the rotations
of the chroma discarding the ones that starts with "0"

This is used, for example, to get all the modes of a scale.

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>Array.&lt;string&gt;</code> - an array with all the modes of the chroma  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>string</code> | the list of notes or pitchChr of the set |
| normalize | <code>boolean</code> | (Optional, true by default) remove all the rotations that starts with "0" |

**Example**  
```js
Pcset.modes(["C", "D", "E"]).map(Pcset.intervals)
```
<a name="module_Pcset.isChroma"></a>

## `Pcset.isChroma(chroma)` ⇒ <code>boolean</code>
Test if the given string is a pitch class set chroma.

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>boolean</code> - true if its a valid pcset chroma  

| Param | Type | Description |
| --- | --- | --- |
| chroma | <code>string</code> | the pitch class set chroma |

**Example**  
```js
Pcset.isChroma("101010101010") // => true
Pcset.isChroma("101001") // => false
```
<a name="module_Pcset.intervals"></a>

## `Pcset.intervals(pcset)` ⇒ <code>Array</code>
Given a pcset (notes or chroma) return it"s intervals

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>Array</code> - intervals or empty array if not valid pcset  

| Param | Type | Description |
| --- | --- | --- |
| pcset | <code>string</code> \| <code>Array</code> | the pitch class set (notes or chroma) |

**Example**  
```js
Pcset.intervals("1010100000000") => ["1P", "2M", "3M"]
```
<a name="module_Pcset.isEqual"></a>

## `Pcset.isEqual(set1, set2)` ⇒ <code>boolean</code>
Test if two pitch class sets are identical

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>boolean</code> - true if they are equal  

| Param | Type | Description |
| --- | --- | --- |
| set1 | <code>Array</code> \| <code>string</code> | one of the pitch class sets |
| set2 | <code>Array</code> \| <code>string</code> | the other pitch class set |

**Example**  
```js
Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
```
<a name="module_Pcset.isSubsetOf"></a>

## `Pcset.isSubsetOf(set, notes)` ⇒ <code>boolean</code>
Create a function that test if a collection of notes is a
subset of a given set

The function can be partially applied

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>boolean</code> - true if notes is a subset of set, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>string</code> | an array of notes or a chroma set string to test against |
| notes | <code>Array</code> \| <code>string</code> | an array of notes or a chroma set |

**Example**  
```js
const inCMajor = Pcset.isSubsetOf(["C", "E", "G"])
inCMajor(["e6", "c4"]) // => true
inCMajor(["e6", "c4", "d3"]) // => false
```
<a name="module_Pcset.isSupersetOf"></a>

## `Pcset.isSupersetOf(set, notes)` ⇒ <code>boolean</code>
Create a function that test if a collectio of notes is a
superset of a given set (it contains all notes and at least one more)

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>boolean</code> - true if notes is a superset of set, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>string</code> | an array of notes or a chroma set string to test against |
| notes | <code>Array</code> \| <code>string</code> | an array of notes or a chroma set |

**Example**  
```js
const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
extendsCMajor(["e6", "a", "c4", "g2"]) // => true
extendsCMajor(["c6", "e4", "g3"]) // => false
```
<a name="module_Pcset.includes"></a>

## `Pcset.includes(set, note)` ⇒ <code>boolean</code>
Test if a given pitch class set includes a note

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>boolean</code> - true if the note is included in the pcset

Can be partially applied  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array.&lt;string&gt;</code> | the base set to test against |
| note | <code>string</code> | the note to test |

**Example**  
```js
Pcset.includes(["C", "D", "E"], "C4") // => true
Pcset.includes(["C", "D", "E"], "C#4") // => false
```
<a name="module_Pcset.filter"></a>

## `Pcset.filter(set, notes)` ⇒ <code>Array</code>
Filter a list with a pitch class set

**Kind**: static method of [<code>Pcset</code>](#module_Pcset)  
**Returns**: <code>Array</code> - the filtered notes  

| Param | Type | Description |
| --- | --- | --- |
| set | <code>Array</code> \| <code>string</code> | the pitch class set notes |
| notes | <code>Array</code> \| <code>string</code> | the note list to be filtered |

**Example**  
```js
Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
```
