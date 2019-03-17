<a name="module_Distance"></a>

# Distance
[![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
[![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)

Transpose notes by intervals and find distances between notes

**Example**  
```js
// es6
import * as Distance from "tonal-distance"
Distance.interval("C3", "C4") // => "1P"
```
**Example**  
```js
// es6 import selected functions
import { interval, semitones, transpose } from "tonal-distance"

semitones("C" ,"D") // => 2
interval("C4", "G4") // => "5P"
transpose("C4", "P5") // => "G4"
```
**Example**  
```js
// included in tonal facade
const Tonal = require("tonal");
Tonal.Distance.transpose("C4", "P5")
Tonal.Distance.transposeBy("P5", "C4")
```

* [Distance](#module_Distance)
    * [`.transpose(note, interval)`](#module_Distance.transpose) ⇒ <code>string</code>
    * [`.trFifths(pitchClass, fifhts)`](#module_Distance.trFifths) ⇒ <code>string</code>
    * [`.fifths(to, from)`](#module_Distance.fifths)
    * [`.transposeBy(note, interval)`](#module_Distance.transposeBy) ⇒ <code>string</code>
    * [`.add(interval1, interval2)`](#module_Distance.add) ⇒ <code>string</code>
    * [`.subtract(minuend, subtrahend)`](#module_Distance.subtract) ⇒ <code>string</code>
    * [`.interval(from, to)`](#module_Distance.interval) ⇒ <code>string</code>
    * [`.semitones(from, to)`](#module_Distance.semitones) ⇒ <code>Integer</code>

<a name="module_Distance.transpose"></a>

## `Distance.transpose(note, interval)` ⇒ <code>string</code>
Transpose a note by an interval. The note can be a pitch class.

This function can be partially applied.

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>string</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>string</code> | 
| interval | <code>string</code> | 

**Example**  
```js
import { tranpose } from "tonal-distance"
transpose("d3", "3M") // => "F#3"
// it works with pitch classes
transpose("D", "3M") // => "F#"
// can be partially applied
["C", "D", "E", "F", "G"].map(transpose("M3)) // => ["E", "F#", "G#", "A", "B"]
```
<a name="module_Distance.trFifths"></a>

## `Distance.trFifths(pitchClass, fifhts)` ⇒ <code>string</code>
Transpose a pitch class by a number of perfect fifths.

It can be partially applied.

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>string</code> - the transposed pitch class  

| Param | Type | Description |
| --- | --- | --- |
| pitchClass | <code>string</code> | the pitch class |
| fifhts | <code>Integer</code> | the number of fifths |

**Example**  
```js
import { trFifths } from "tonal-transpose"
[0, 1, 2, 3, 4].map(trFifths("C")) // => ["C", "G", "D", "A", "E"]
// or using tonal
Distance.trFifths("G4", 1) // => "D"
```
<a name="module_Distance.fifths"></a>

## `Distance.fifths(to, from)`
Get the distance in fifths between pitch classes

Can be partially applied.

**Kind**: static method of [<code>Distance</code>](#module_Distance)  

| Param | Type | Description |
| --- | --- | --- |
| to | <code>string</code> | note or pitch class |
| from | <code>string</code> | note or pitch class |

<a name="module_Distance.transposeBy"></a>

## `Distance.transposeBy(note, interval)` ⇒ <code>string</code>
The same as transpose with the arguments inverted.

Can be partially applied.

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>string</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>string</code> | 
| interval | <code>string</code> | 

**Example**  
```js
import { tranposeBy } from "tonal-distance"
transposeBy("3m", "5P") // => "7m"
```
<a name="module_Distance.add"></a>

## `Distance.add(interval1, interval2)` ⇒ <code>string</code>
Add two intervals

Can be partially applied.

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>string</code> - the resulting interval  

| Param | Type |
| --- | --- |
| interval1 | <code>string</code> | 
| interval2 | <code>string</code> | 

**Example**  
```js
import { add } from "tonal-distance"
add("3m", "5P") // => "7m"
```
<a name="module_Distance.subtract"></a>

## `Distance.subtract(minuend, subtrahend)` ⇒ <code>string</code>
Subtract two intervals

Can be partially applied

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>string</code> - interval diference  

| Param | Type |
| --- | --- |
| minuend | <code>string</code> | 
| subtrahend | <code>string</code> | 

<a name="module_Distance.interval"></a>

## `Distance.interval(from, to)` ⇒ <code>string</code>
Find the interval between two pitches. It works with pitch classes
(both must be pitch classes and the interval is always ascending)

Can be partially applied

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>string</code> - the interval distance  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>string</code> | distance from |
| to | <code>string</code> | distance to |

**Example**  
```js
import { interval } from "tonal-distance"
interval("C2", "C3") // => "P8"
interval("G", "B") // => "M3"
```
**Example**  
```js
import * as Distance from "tonal-distance"
Distance.interval("M2", "P5") // => "P4"
```
<a name="module_Distance.semitones"></a>

## `Distance.semitones(from, to)` ⇒ <code>Integer</code>
Get the distance between two notes in semitones

**Kind**: static method of [<code>Distance</code>](#module_Distance)  
**Returns**: <code>Integer</code> - the distance in semitones or null if not valid notes  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>String</code> \| <code>Pitch</code> | first note |
| to | <code>String</code> \| <code>Pitch</code> | last note |

**Example**  
```js
import { semitones } from "tonal-distance"
semitones("C3", "A2") // => -3
// or use tonal
Tonal.Distance.semitones("C3", "G3") // => 7
```
