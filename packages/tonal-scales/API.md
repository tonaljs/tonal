## Functions

<dl>
<dt><a href="#scale">scale(source, tonic)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a scale from a name or intervals and tonic</p>
</dd>
<dt><a href="#fromName">fromName(name)</a> ⇒ <code>Array</code></dt>
<dd><p>Get scale notes by scale name</p>
</dd>
<dt><a href="#names">names(aliases)</a> ⇒ <code>Array</code></dt>
<dd><p>Return the available scale names</p>
</dd>
<dt><a href="#scaleRange">scaleRange(src, start, end)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a scale range. It accepts a scale name or scale notes.</p>
</dd>
</dl>

<a name="scale"></a>

## scale(source, tonic) ⇒ <code>Array</code>
Create a scale from a name or intervals and tonic

**Kind**: global function  
**Returns**: <code>Array</code> - the list of notes  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Array</code> | the scale name, scale intervals or scale notes |
| tonic | <code>String</code> | the tonic of the scale |

**Example**  
```js
const scale = require('tonal-scales')
// get scale from type and tonic
scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
// get scale from intervals and tonic
scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
// partially applied
const major = scale('major')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
// part of tonal
tonal.scale('major', 'A')
```
<a name="fromName"></a>

## fromName(name) ⇒ <code>Array</code>
Get scale notes by scale name

**Kind**: global function  
**Returns**: <code>Array</code> - scale notes  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | the complete scale name (with tonic) |

**Example**  
```js
const scales = require('tonal-scales')
scales.fromName('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
```
<a name="names"></a>

## names(aliases) ⇒ <code>Array</code>
Return the available scale names

**Kind**: global function  
**Returns**: <code>Array</code> - an array of scale names  

| Param | Type | Description |
| --- | --- | --- |
| aliases | <code>boolean</code> | true to include aliases |

**Example**  
```js
const scales = require('tonal-scales')
scales.names() // => ['maj7', ...]
```
<a name="scaleRange"></a>

## scaleRange(src, start, end) ⇒ <code>Array</code>
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
import { scaleRange } from 'tonal-scales'
scalesRange('C bebbop', 'C3', 'C2')
// => [ 'C3', 'B2', 'Bb2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2' ]
```
