## Constants

<dl>
<dt><a href="#chromatic">chromatic</a> ⇒ <code>function</code></dt>
<dd><p>Create a chromatic scale note names generator. A name generator is a function
that given a midi number returns a note name.</p>
</dd>
<dt><a href="#fromMidi">fromMidi</a> ⇒ <code>String</code></dt>
<dd><p>Given a midi number, returns a note name. The altered notes will have
flats.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isPitch">isPitch(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch</p>
</dd>
<dt><a href="#isPitchClass">isPitchClass(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch class</p>
</dd>
<dt><a href="#encode">encode(step, alt, oct, dir)</a> ⇒ <code>Pitch</code></dt>
<dd><p>Create a pitch. A pitch in tonal may refer to a pitch class, the pitch
of a note or an interval.</p>
</dd>
<dt><a href="#isMidi">isMidi(num)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given number is a valid midi note number</p>
</dd>
<dt><a href="#midi">midi(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get midi number for a pitch</p>
</dd>
<dt><a href="#wellTempered">wellTempered(ref)</a> ⇒ <code>function</code></dt>
<dd><p>Get a frequency calculator function that uses well temperament and a tuning reference.</p>
</dd>
<dt><a href="#toFreq">toFreq(pitch)</a> ⇒ <code>Float</code></dt>
<dd><p>Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz</p>
</dd>
<dt><a href="#listArr">listArr(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string by spaces (or commas or bars). Always returns an array, even if its empty</p>
</dd>
</dl>

<a name="chromatic"></a>

## chromatic ⇒ <code>function</code>
Create a chromatic scale note names generator. A name generator is a function
that given a midi number returns a note name.

**Kind**: global constant  
**Returns**: <code>function</code> - returns a function that converts from midi number to
note name  

| Param | Type | Description |
| --- | --- | --- |
| useSharps | <code>Boolean</code> | use sharps or flats when notes is altered |

**Example**  
```js
var tonal = require('tonal')
var flats = tonal.chromatic(false)
[60, 61, 62, 63].map(flats) // => ['C4', 'Db4', 'D4', 'Eb']
```
<a name="fromMidi"></a>

## fromMidi ⇒ <code>String</code>
Given a midi number, returns a note name. The altered notes will have
flats.

**Kind**: global constant  
**Returns**: <code>String</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>Integer</code> | the midi note number |

**Example**  
```js
tonal.fromMidi(61) // => 'Db4'
```
<a name="isPitch"></a>

## isPitch(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if is a pitch, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="isPitchClass"></a>

## isPitchClass(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch class

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if is a pitch class, false otherwise  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="encode"></a>

## encode(step, alt, oct, dir) ⇒ <code>Pitch</code>
Create a pitch. A pitch in tonal may refer to a pitch class, the pitch
of a note or an interval.

**Kind**: global function  
**Returns**: <code>Pitch</code> - the pitch encoded as array notation  

| Param | Type | Description |
| --- | --- | --- |
| step | <code>Integer</code> | an integer from 0 to 6 representing letters from C to B or simple interval numbers from unison to seventh |
| alt | <code>Integer</code> | the alteration |
| oct | <code>Integer</code> | the pitch octave |
| dir | <code>Integer</code> | (Optional, intervals only) The interval direction |

<a name="isMidi"></a>

## isMidi(num) ⇒ <code>Boolean</code>
Test if the given number is a valid midi note number

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if it's a valid midi note number  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Object</code> | the number to test |

<a name="midi"></a>

## midi(pitch) ⇒ <code>Integer</code>
Get midi number for a pitch

**Kind**: global function  
**Returns**: <code>Integer</code> - the midi number or null if not valid pitch  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch |

**Example**  
```js
midi('C4') // => 60
```
<a name="wellTempered"></a>

## wellTempered(ref) ⇒ <code>function</code>
Get a frequency calculator function that uses well temperament and a tuning reference.

**Kind**: global function  
**Returns**: <code>function</code> - the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>Float</code> | the tuning reference |

<a name="toFreq"></a>

## toFreq(pitch) ⇒ <code>Float</code>
Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz

**Kind**: global function  
**Returns**: <code>Float</code> - the frequency in herzs  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch to get the frequency from |

**Example**  
```js
toFreq('C4') // => 261.6255653005986
```
<a name="listArr"></a>

## listArr(source) ⇒ <code>Array</code>
Split a string by spaces (or commas or bars). Always returns an array, even if its empty

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | the thing to get an array from |

