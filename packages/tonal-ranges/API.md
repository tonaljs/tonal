## Functions

<dl>
<dt><a href="#midi">midi(begin, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a midi range. As parameters, it accepts numbers or note names.
It can create ascending or descending ranges. Although midi notes ranges from
1 to 128 this function can create unlimited numeric ranges (even with
negative numbers)</p>
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
<dt><a href="#scale">scale(src, start, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a scale range. It accepts a scale name or scale notes.</p>
</dd>
</dl>

<a name="midi"></a>

## midi(begin, end) ⇒ <code>Array</code>
Create a midi range. As parameters, it accepts numbers or note names.
It can create ascending or descending ranges. Although midi notes ranges from
1 to 128 this function can create unlimited numeric ranges (even with
negative numbers)

**Kind**: global function  
**Returns**: <code>Array</code> - an array of numbers or empty array if not valid parameters  

| Param | Type | Description |
| --- | --- | --- |
| begin | <code>Pitch</code> &#124; <code>String</code> &#124; <code>Number</code> | the beginning note or number |
| end | <code>Pitch</code> &#124; <code>String</code> &#124; <code>Number</code> | the end note or number |

**Example**  
```js
var range = require('tonal-ranges')
range.midi('C5', 'C4') // => [ 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60 ]
range.midi(10, 5) // => [ 10, 9, 8, 7, 6, 5 ]
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
<a name="scale"></a>

## scale(src, start, end) ⇒ <code>Array</code>
Create a scale range. It accepts a scale name or scale notes.

**Kind**: global function  
**Returns**: <code>Array</code> - the scale range, an empty array if not valid source or
null if not valid start or end  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> &#124; <code>Array</code> | the scale name or scale notes |
| start | <code>String</code> | the first note of the range |
| end | <code>String</code> | the last note of the range |

**Example**  
```js
var range = require('tonal-ranges')
range.scale('C D E F G A B', 'C3', 'C2')
// => [ 'C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
```
