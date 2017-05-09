# tonal-range [![npm version](https://img.shields.io/npm/v/tonal-range.svg)](https://www.npmjs.com/package/tonal-range)

[![tonal](https://img.shields.io/badge/tonal-range-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-range` is a collection of functions to create note ranges.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-range`

## API Reference

<dl>
<dt><a href="#range">range(begin, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a numeric range. As parameters, it accepts numbers or note names.
It can create ascending or descending ranges.</p>
</dd>
<dt><a href="#fromPitchSet">fromPitchSet(coll, midi)</a> ⇒ <code>String</code></dt>
<dd><p>Given a collection of pitch classes and a midi number, return the note name
from the collection or null if not in the collection.</p>
<p>This function can be partially applied.</p>
</dd>
<dt><a href="#noteRange">noteRange(gen, start, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a note range using a function that convert from midi number to
note names</p>
<p>Can be partially applied</p>
</dd>
<dt><a href="#chromatic">chromatic(start, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a range of chromatic notes. The altered notes will use flats.</p>
</dd>
<dt><a href="#cycleOfFifths">cycleOfFifths(the, the, the)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a range with a cycle of fifths</p>
</dd>
<dt><a href="#scaleRange">scaleRange(notes, start, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a scale range. Given a pitch set (a collection of pitch classes),
and a start and end it returns a note range.</p>
</dd>
</dl>

<a name="range"></a>

## range(begin, end) ⇒ <code>Array</code>
Create a numeric range. As parameters, it accepts numbers or note names.
It can create ascending or descending ranges.

**Kind**: global function  
**Returns**: <code>Array</code> - an array of numbers or empty array if not valid parameters  

| Param | Type | Description |
| --- | --- | --- |
| begin | <code>Pitch</code> &#124; <code>String</code> &#124; <code>Number</code> | the beginning note or number |
| end | <code>Pitch</code> &#124; <code>String</code> &#124; <code>Number</code> | the end note or number |

**Example**  
```js
import { range } from 'tonal-range'
range('C5', 'C4') // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
range(10, 5) // => [ 10, 9, 8, 7, 6, 5 ]
// or use tonal
tonal.range('C2', 'C3')
```
<a name="fromPitchSet"></a>

## fromPitchSet(coll, midi) ⇒ <code>String</code>
Given a collection of pitch classes and a midi number, return the note name
from the collection or null if not in the collection.

This function can be partially applied.

**Kind**: global function  
**Returns**: <code>String</code> - the note name or null if note in the pitch classes  

| Param | Type | Description |
| --- | --- | --- |
| coll | <code>Array</code> | the pitch classes collection |
| midi | <code>Number</code> | the midi number |

**Example**  
```js
var fromPitchSet = require('note-ranges').fromPitchSet
fromPitchSet('C D E', 60) // => 'C4'
aMajor = fromPitchSet('A C# E')
[69, 70, 71, 72, 73].map(aMajor) // => [ 'A4', null, null, null, 'C#5' ]
```
<a name="noteRange"></a>

## noteRange(gen, start, end) ⇒ <code>Array</code>
Create a note range using a function that convert from midi number to
note names

Can be partially applied

**Kind**: global function  
**Returns**: <code>Array</code> - an array of note names  

| Param | Type | Description |
| --- | --- | --- |
| gen | <code>function</code> | the note name generator. Its a function with signature (Number) => (String) that receives a note midi number and returns a note name |
| start | <code>String</code> &#124; <code>Pitch</code> &#124; <code>Integer</code> | the first note (or midi number) of the range |
| end | <code>String</code> &#124; <code>Pitch</code> &#124; <code>Integer</code> | the last note (or midi number) of the range |

<a name="chromatic"></a>

## chromatic(start, end) ⇒ <code>Array</code>
Create a range of chromatic notes. The altered notes will use flats.

**Kind**: global function  
**Returns**: <code>Array</code> - an array of note names  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>String</code> &#124; <code>Pitch</code> &#124; <code>Integer</code> | the first note (or midi number) of the range |
| end | <code>String</code> &#124; <code>Pitch</code> &#124; <code>Integer</code> | the last note (or midi number) of the range |

**Example**  
```js
tonal.chromatic('C2', 'E2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2']
```
<a name="cycleOfFifths"></a>

## cycleOfFifths(the, the, the) ⇒ <code>Array</code>
Create a range with a cycle of fifths

**Kind**: global function  
**Returns**: <code>Array</code> - a range of cycle of fifths  

| Param | Type | Description |
| --- | --- | --- |
| the | <code>Integer</code> | first step from tonic |
| the | <code>Integer</code> | last step from tonic (can be negative) |
| the | <code>String</code> &#124; <code>Pitch</code> | tonic |

**Example**  
```js
var range = require('tonal-ranges')
range.cycleOfFifths(0, 6, 'C') // => [ 'C', 'G', 'D', 'A', 'E', 'B', 'F#' ])
```
<a name="scaleRange"></a>

## scaleRange(notes, start, end) ⇒ <code>Array</code>
Create a scale range. Given a pitch set (a collection of pitch classes),
and a start and end it returns a note range.

**Kind**: global function  
**Returns**: <code>Array</code> - the scale range, an empty array if not valid source or
null if not valid start or end  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>String</code> &#124; <code>Array</code> | the collection of pitch sets |
| start | <code>String</code> | the first note of the range |
| end | <code>String</code> | the last note of the range |

**Example**  
```js
var range = require('tonal-ranges')
range.scale('C D E F G A B', 'C3', 'C2')
// => [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
```
