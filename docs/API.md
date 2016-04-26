## Constants

<dl>
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
<dt><a href="#freq">freq(pitch)</a> ⇒ <code>Float</code></dt>
<dd><p>Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz</p>
</dd>
<dt><a href="#transpose">transpose()</a></dt>
<dd><p>Transpose notes. Can be used to add intervals</p>
</dd>
<dt><a href="#tr">tr()</a></dt>
<dd><p>Transpose notes. An alias for <code>transpose</code></p>
</dd>
<dt><a href="#distance">distance(from, to)</a> ⇒ <code>Interval</code></dt>
<dd><p>Find distance between two pitches. Both pitches MUST be of the same type.
Distances between pitch classes always returns ascending intervals.
Distances between intervals substract one from the other.</p>
</dd>
<dt><a href="#dist">dist()</a></dt>
<dd><p>An alias for <code>distance</code></p>
</dd>
<dt><a href="#interval">interval()</a></dt>
<dd><p>An alias for <code>distance</code></p>
</dd>
<dt><a href="#asList">asList(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string by spaces (or commas or bars). Always returns an array, even if its empty</p>
</dd>
<dt><a href="#listFn">listFn()</a></dt>
<dd><p>Decorates a function to work with lists in pitch array notation</p>
</dd>
<dt><a href="#harmonizer">harmonizer()</a></dt>
<dd><p>Create an harmonizer: a function that given a note returns a list of notes.</p>
</dd>
<dt><a href="#range">range()</a></dt>
<dd><p>Create a range. It works with numbers or note names</p>
</dd>
<dt><a href="#noteRange">noteRange()</a></dt>
<dd><p>Create a note range</p>
</dd>
<dt><a href="#chromatic">chromatic()</a></dt>
<dd><p>Create a range of chromatic notes</p>
</dd>
<dt><a href="#fifthsFrom">fifthsFrom()</a></dt>
<dd><p>Transpose a tonic a number of perfect fifths.</p>
</dd>
</dl>

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

<a name="freq"></a>

## freq(pitch) ⇒ <code>Float</code>
Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz

**Kind**: global function  
**Returns**: <code>Float</code> - the frequency in herzs  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch to get the frequency from |

**Example**  
```js
tonal.freq('C4') // => 261.6255653005986
```
<a name="transpose"></a>

## transpose()
Transpose notes. Can be used to add intervals

**Kind**: global function  
<a name="tr"></a>

## tr()
Transpose notes. An alias for `transpose`

**Kind**: global function  
<a name="distance"></a>

## distance(from, to) ⇒ <code>Interval</code>
Find distance between two pitches. Both pitches MUST be of the same type.
Distances between pitch classes always returns ascending intervals.
Distances between intervals substract one from the other.

**Kind**: global function  
**Returns**: <code>Interval</code> - the distance between pitches  

| Param | Type | Description |
| --- | --- | --- |
| from | <code>Pitch</code> &#124; <code>String</code> | distance from |
| to | <code>Pitch</code> &#124; <code>String</code> | distance to |

**Example**  
```js
var tonal = require('tonal')
tonal.distance('C2', 'C3') // => 'P8'
tonal.distance('G', 'B') // => 'M3'
tonal.distance('M2', 'P5') // => 'P4'
```
<a name="dist"></a>

## dist()
An alias for `distance`

**Kind**: global function  
<a name="interval"></a>

## interval()
An alias for `distance`

**Kind**: global function  
<a name="asList"></a>

## asList(source) ⇒ <code>Array</code>
Split a string by spaces (or commas or bars). Always returns an array, even if its empty

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | the thing to get an array from |

<a name="listFn"></a>

## listFn()
Decorates a function to work with lists in pitch array notation

**Kind**: global function  
<a name="harmonizer"></a>

## harmonizer()
Create an harmonizer: a function that given a note returns a list of notes.

**Kind**: global function  
<a name="range"></a>

## range()
Create a range. It works with numbers or note names

**Kind**: global function  
<a name="noteRange"></a>

## noteRange()
Create a note range

**Kind**: global function  
<a name="chromatic"></a>

## chromatic()
Create a range of chromatic notes

**Kind**: global function  
**Example**  
```js
tonal.chromatic('C2', 'E2') // => ['C2', 'Db2', 'D2', 'Eb2', 'E2']
```
<a name="fifthsFrom"></a>

## fifthsFrom()
Transpose a tonic a number of perfect fifths.

**Kind**: global function  
