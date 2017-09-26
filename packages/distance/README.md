<a name="module_distance"></a>

# distance
[![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
[![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)

Transpose notes by intervals and find distances between notes

**Example**  
```js
// using ES6 import
import { interval, semitones, transpose } from 'tonal-distance'
semitones('C' ,'D') // => 2
interval('C4', 'G4') // => '5P'
transpose('C4', 'P5') // => 'G4'

// included in tonal facade
const tonal = require('tonal');
tonal.distance.transpose('C4', 'P5')
tonal.distance.transposeBy('P5', 'C4')
```

* [distance](#module_distance)
    * _static_
        * [`.transpose(note, interval)`](#module_distance.transpose) ⇒ <code>String</code>
        * [`.trFifths(pitchClass, fifhts)`](#module_distance.trFifths) ⇒ <code>String</code>
        * [`.fifths(to, from)`](#module_distance.fifths)
        * [`.transposeBy(note, interval)`](#module_distance.transposeBy) ⇒ <code>String</code>
        * [`.add(interval1, interval2)`](#module_distance.add) ⇒ <code>String</code>
        * [`.subtract(minuend, subtrahend)`](#module_distance.subtract) ⇒ <code>String</code>
        * [`.interval(from, to)`](#module_distance.interval) ⇒ <code>String</code>
        * [`.semitones(from, to)`](#module_distance.semitones) ⇒ <code>Integer</code>
    * _inner_
        * [`~decode(fifths, octs)`](#module_distance..decode) ⇒ <code>Array</code>

<a name="module_distance.transpose"></a>

## `distance.transpose(note, interval)` ⇒ <code>String</code>
Transpose a note by an interval. The note can be a pitch class.

This function can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>String</code> | 
| interval | <code>String</code> | 

**Example**  
```js
import { tranpose } from 'tonal-distance'
transpose('d3', '3M') // => 'F#3'
// it works with pitch classes
transpose('D', '3M') // => 'F#'
// can be partially applied
['C', 'D', 'E', 'F', 'G'].map(transpose('M3)) // => ['E', 'F#', 'G#', 'A', 'B']
```
<a name="module_distance.trFifths"></a>

## `distance.trFifths(pitchClass, fifhts)` ⇒ <code>String</code>
Transpose a pitch class by a number of perfect fifths. 

It can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed pitch class  

| Param | Type | Description |
| --- | --- | --- |
| pitchClass | <code>String</code> | the pitch class |
| fifhts | <code>Integer</code> | the number of fifths |

**Example**  
```js
import { trFifths } from 'tonal-transpose'
[0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
// or using tonal
tonal.trFifths('G4', 1) // => 'D'
```
<a name="module_distance.fifths"></a>

## `distance.fifths(to, from)`
Get the distance in fifths between pitch classes

Can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  

| Param | Type | Description |
| --- | --- | --- |
| to | <code>String</code> | note or pitch class |
| from | <code>String</code> | note or pitch class |

<a name="module_distance.transposeBy"></a>

## `distance.transposeBy(note, interval)` ⇒ <code>String</code>
The same as transpose with the arguments inverted.

Can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>String</code> | 
| interval | <code>String</code> | 

**Example**  
```js
import { tranposeBy } from 'tonal-distance'
transposeBy('3m', '5P') // => '7m'
```
<a name="module_distance.add"></a>

## `distance.add(interval1, interval2)` ⇒ <code>String</code>
Add two intervals 

Can be partially applied.

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the resulting interval  

| Param | Type |
| --- | --- |
| interval1 | <code>String</code> | 
| interval2 | <code>String</code> | 

**Example**  
```js
import { add } from 'tonal-distance'
add('3m', '5P') // => '7m'
```
<a name="module_distance.subtract"></a>

## `distance.subtract(minuend, subtrahend)` ⇒ <code>String</code>
Subtract two intervals

Can be partially applied

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - interval diference  

| Param | Type |
| --- | --- |
| minuend | <code>String</code> | 
| subtrahend | <code>String</code> | 

<a name="module_distance.interval"></a>

## `distance.interval(from, to)` ⇒ <code>String</code>
Find the interval between two pitches. It works with pitch classes 
(both must be pitch classes and the interval is always ascending)

Can be partially applied

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>String</code> - the interval distance  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>String</code> | distance from |
| to | <code>String</code> | distance to |

**Example**  
```js
import { interval } from 'tonal-distance'
interval('C2', 'C3') // => 'P8'
interval('G', 'B') // => 'M3'

// or use tonal
var tonal = require('tonal')
tonal.distance.interval('M2', 'P5') // => 'P4'
```
<a name="module_distance.semitones"></a>

## `distance.semitones(from, to)` ⇒ <code>Integer</code>
Get the distance between two notes in semitones

**Kind**: static method of [<code>distance</code>](#module_distance)  
**Returns**: <code>Integer</code> - the distance in semitones or null if not valid notes  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>String</code> \| <code>Pitch</code> | first note |
| to | <code>String</code> \| <code>Pitch</code> | last note |

**Example**  
```js
import { semitones } from 'tonal-distance'
semitones('C3', 'A2') // => -3
// or use tonal
tonal.distance.semitones('C3', 'G3') // => 7
```
<a name="module_distance..decode"></a>

## `distance~decode(fifths, octs)` ⇒ <code>Array</code>
Decode a encoded pitch

**Kind**: inner method of [<code>distance</code>](#module_distance)  
**Returns**: <code>Array</code> - in the form [step, alt, oct]  

| Param | Type | Description |
| --- | --- | --- |
| fifths | <code>Number</code> | the number of fifths |
| octs | <code>Number</code> | the number of octaves to compensate the fifhts |

