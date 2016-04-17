## Functions

<dl>
<dt><a href="#pitchClass">pitchClass(lnum, alt)</a> ⇒ <code>Array</code></dt>
<dd><p>Create a pitch class from its letter number
and it&#39;s alteration number</p>
</dd>
<dt><a href="#pitch">pitch(lnum, alt, oct)</a> ⇒ <code>Array</code></dt>
<dd><p>Build a pitch from letter number, alteration and octave. If
octave is not present, it builds a pitch class.</p>
</dd>
<dt><a href="#isPitch">isPitch(p)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch</p>
</dd>
<dt><a href="#accToAlt">accToAlt(acc)</a> ⇒ <code>Integer</code></dt>
<dd><p>Convert accidental string to alteration number</p>
</dd>
<dt><a href="#altToAcc">altToAcc(alt)</a> ⇒ <code>String</code></dt>
<dd><p>Convert alteration number to accidentals</p>
</dd>
<dt><a href="#pitchRegex">pitchRegex()</a> ⇒ <code>Regex</code></dt>
<dd><p>Get the a regex to parse pitch in scientific notation</p>
</dd>
<dt><a href="#pitchParse">pitchParse(str)</a> ⇒ <code>Array</code></dt>
<dd><p>Given a pitch string in scientific notation, get the pitch in array notation</p>
</dd>
<dt><a href="#tryPitch">tryPitch(obj)</a> ⇒ <code>Array</code> | <code>Object</code></dt>
<dd><p>Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.</p>
</dd>
<dt><a href="#prop">prop(fn)</a> ⇒ <code>function</code></dt>
<dd><p>Decorate a function with one parameter to accepts
pitch in scientific notation</p>
</dd>
<dt><a href="#alt">alt(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get alteration of a pitch.</p>
<p>The alteration is an integer indicating the number of sharps or flats</p>
</dd>
<dt><a href="#letter">letter(pitch)</a> ⇒ <code>String</code></dt>
<dd><p>Get the pitch letter. It accepts scientific or array notation.</p>
</dd>
<dt><a href="#accidentals">accidentals(pitch)</a> ⇒ <code>String</code></dt>
<dd><p>Get accidentals string from a pitch. It accepts pitches in scientific and array notation.</p>
</dd>
<dt><a href="#oct">oct(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get the octave from pitch. The pitch can be in array or scientific notation</p>
</dd>
<dt><a href="#pitchStr">pitchStr(pitch)</a> ⇒ <code>String</code></dt>
<dd><p>Convert a pitch in array notation to pitch in scientific notation (string)</p>
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
<dt><a href="#interval">interval(sim, alteration, oct, dir)</a> ⇒ <code>Array</code></dt>
<dd><p>Create an interval from interval simplified number, interval alteration, interval octave and direction</p>
</dd>
<dt><a href="#isInterval">isInterval(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Return if the given object is an interval</p>
</dd>
<dt><a href="#qualityToAlt">qualityToAlt(type, quality)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get an alteration number from an interval quality string.
It accepts the standard <code>dmMPA</code> but also sharps and flats.</p>
</dd>
<dt><a href="#ivlRegex">ivlRegex()</a> ⇒ <code>Regex</code></dt>
<dd><p>Get regex to parse intervals in shorthand notation</p>
</dd>
<dt><a href="#ivlParse">ivlParse(str)</a> ⇒ <code>Array</code></dt>
<dd><p>Parse a string with an interval in shorthand notation. It support two types: standard shorthand interval notation <code>quality+[direction]+number</code> or the tonal shorthand notation <code>[direction]+number+quality</code></p>
</dd>
<dt><a href="#ivlProp">ivlProp(fn)</a> ⇒ <code>function</code></dt>
<dd><p>Decorate a function to accept intervals in array of shorthand notation. It only works with 1-parameter functions.</p>
</dd>
<dt><a href="#simpleNum">simpleNum(ivl)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get the simplified interval number (in 1-based index)</p>
</dd>
<dt><a href="#number">number(ivl)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get the interval number</p>
</dd>
<dt><a href="#ivlType">ivlType(ivl, &#x27;P&#x27;)</a></dt>
<dd><p>Get the interval type</p>
</dd>
<dt><a href="#quality">quality(ivl)</a> ⇒ <code>String</code></dt>
<dd><p>Get interval quality</p>
</dd>
<dt><a href="#ivlStr">ivlStr(ivl)</a> ⇒ <code>String</code></dt>
<dd><p>Convert an interval in array notation to shorthand notation</p>
</dd>
<dt><a href="#transpose">transpose(a, b)</a> ⇒ <code>String</code></dt>
<dd><p>Transpose a pitch by an interval
This function is currified, and aliased as <code>tr</code></p>
</dd>
<dt><a href="#tr">tr()</a></dt>
<dd><p>An alias for <code>transpose</code></p>
</dd>
<dt><a href="#split">split(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string by spaces (or commas or bars). Always returns an array, even if its empty</p>
</dd>
</dl>

<a name="pitchClass"></a>

## pitchClass(lnum, alt) ⇒ <code>Array</code>
Create a pitch class from its letter number
and it's alteration number

**Kind**: global function  
**Returns**: <code>Array</code> - the pitch class in array notation  

| Param | Type | Description |
| --- | --- | --- |
| lnum | <code>Integer</code> | the letter num (0 is C, 1 is D...) |
| alt | <code>Integer</code> | the alteration number |

**Example**  
```js
pitchClass('Cb') // => [-7]
```
<a name="pitch"></a>

## pitch(lnum, alt, oct) ⇒ <code>Array</code>
Build a pitch from letter number, alteration and octave. If
octave is not present, it builds a pitch class.

**Kind**: global function  
**Returns**: <code>Array</code> - the pitch in coord notation  

| Param | Type | Description |
| --- | --- | --- |
| lnum | <code>Integer</code> | the letter number (0-based index) |
| alt | <code>Integer</code> | the pitch accidentals integer |
| oct | <code>Integer</code> | the pitch octave |

<a name="isPitch"></a>

## isPitch(p) ⇒ <code>Boolean</code>
Test if a given object is a pitch

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if is a pitch array  

| Param | Type | Description |
| --- | --- | --- |
| p | <code>Object</code> | the object to test |

**Example**  
```js
isPitch([3]) // => true
```
<a name="accToAlt"></a>

## accToAlt(acc) ⇒ <code>Integer</code>
Convert accidental string to alteration number

**Kind**: global function  
**Returns**: <code>Integer</code> - the alteration number  

| Param | Type | Description |
| --- | --- | --- |
| acc | <code>String</code> | the accidental string |

**Example**  
```js
accToAlt('#') // => 1
accToAlt('bbb') // => -2
accToAlt('') // => 0
accToAlt('x') // => 2
```
<a name="altToAcc"></a>

## altToAcc(alt) ⇒ <code>String</code>
Convert alteration number to accidentals

**Kind**: global function  
**Returns**: <code>String</code> - the accidentals string  

| Param | Type | Description |
| --- | --- | --- |
| alt | <code>Integer</code> | the alteration number |

**Example**  
```js
altToAcc(2) // => '##'
altToAcc(-2) // => 'bb'
```
<a name="pitchRegex"></a>

## pitchRegex() ⇒ <code>Regex</code>
Get the a regex to parse pitch in scientific notation

**Kind**: global function  
**Returns**: <code>Regex</code> - the regex

After exec against a valid string we get:
- 0: the complete string
- 1: the letter (in upper or lower case)
- 2: the alterations (a list of #, b or x)
- 3: an optional octave number  
<a name="pitchParse"></a>

## pitchParse(str) ⇒ <code>Array</code>
Given a pitch string in scientific notation, get the pitch in array notation

**Kind**: global function  
**Returns**: <code>Array</code> - the pitch in array notation or null if not valid string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to parse |

**Example**  
```js
pitchParse('C2') // => [2, 1]
pitchParse('bla') // => null
```
<a name="tryPitch"></a>

## tryPitch(obj) ⇒ <code>Array</code> &#124; <code>Object</code>
Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.

**Kind**: global function  
**Returns**: <code>Array</code> &#124; <code>Object</code> - the parsed pitch or the object if not valid pitch string  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to parse |

**Example**  
```js
tryPitch('G3') // => [1, 3]
tryPitch([1, 3]) // => [1, 3]
tryPitch(3) // => 2
```
<a name="prop"></a>

## prop(fn) ⇒ <code>function</code>
Decorate a function with one parameter to accepts
pitch in scientific notation

**Kind**: global function  
**Returns**: <code>function</code> - a function with one parameter that can be a pitch in scientific notation or anything else.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to decorate |

<a name="alt"></a>

## alt(pitch) ⇒ <code>Integer</code>
Get alteration of a pitch.

The alteration is an integer indicating the number of sharps or flats

**Kind**: global function  
**Returns**: <code>Integer</code> - the alteration  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch (either in scientific notation or array notation) |

**Example**  
```js
alt('C#2') // => 2
```
<a name="letter"></a>

## letter(pitch) ⇒ <code>String</code>
Get the pitch letter. It accepts scientific or array notation.

**Kind**: global function  
**Returns**: <code>String</code> - the letter  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch to get the letter from |

**Example**  
```js
letter('C#2') // => 'C'
letter([-7, 2]) // => 'C'
```
<a name="accidentals"></a>

## accidentals(pitch) ⇒ <code>String</code>
Get accidentals string from a pitch. It accepts pitches in scientific and array notation.

**Kind**: global function  
**Returns**: <code>String</code> - the accidentals string  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch to get the accidentals from |

**Example**  
```js
accidentals('C##2') // => '##'
accidentals([-7]) // => 'b'
```
<a name="oct"></a>

## oct(pitch) ⇒ <code>Integer</code>
Get the octave from pitch. The pitch can be in array or scientific notation

**Kind**: global function  
**Returns**: <code>Integer</code> - the octave or null if it's a pitch class or not a valid pitch  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch to get the octave from |

**Example**  
```js
oct('C#2') // => 2
oct('C') // => null
```
<a name="pitchStr"></a>

## pitchStr(pitch) ⇒ <code>String</code>
Convert a pitch in array notation to pitch in scientific notation (string)

**Kind**: global function  
**Returns**: <code>String</code> - the pitch in scientific notation  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> | the pitch to convert |

**Example**  
```js
pitchStr([2, 1]) // => 'D2'
```
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
<a name="interval"></a>

## interval(sim, alteration, oct, dir) ⇒ <code>Array</code>
Create an interval from interval simplified number, interval alteration, interval octave and direction

**Kind**: global function  
**Returns**: <code>Array</code> - an interval in array notation  

| Param | Type | Description |
| --- | --- | --- |
| sim | <code>Integer</code> | the simplified interval number 0-based index |
| alteration | <code>Integer</code> | the interval alteration |
| oct | <code>Integer</code> | how many octaves the interval spans |
| dir | <code>Integer</code> | the direction (1 ascending, -1 descending) |

<a name="isInterval"></a>

## isInterval(obj) ⇒ <code>Boolean</code>
Return if the given object is an interval

**Kind**: global function  
**Returns**: <code>Boolean</code> - true if the object is an interval object  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to check |

**Example**  
```js
isInterval([0,3,1]) // => true
```
<a name="qualityToAlt"></a>

## qualityToAlt(type, quality) ⇒ <code>Integer</code>
Get an alteration number from an interval quality string.
It accepts the standard `dmMPA` but also sharps and flats.

**Kind**: global function  
**Returns**: <code>Integer</code> - the interval alteration  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | the interval type ('P' or 'M') |
| quality | <code>String</code> | the quality string |

**Example**  
```js
qualityToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
qualityToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
qualityToAlt('M', 'P') // => null (majorables can't be perfect)
```
<a name="ivlRegex"></a>

## ivlRegex() ⇒ <code>Regex</code>
Get regex to parse intervals in shorthand notation

**Kind**: global function  
**Returns**: <code>Regex</code> - the regex

After executing the regex, we will have an array-like object with:
- 0: the complete string  
<a name="ivlParse"></a>

## ivlParse(str) ⇒ <code>Array</code>
Parse a string with an interval in shorthand notation. It support two types: standard shorthand interval notation `quality+[direction]+number` or the tonal shorthand notation `[direction]+number+quality`

**Kind**: global function  
**Returns**: <code>Array</code> - the interval in array notation or null if not valid interval string  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | the string to parse |

**Example**  
```js
ivlParse('3M') // => [ 4, -2, 1 ]
ivlParse('-3M') // => [ 4, -2, -1 ]
ivlParse('M3') // => [ 4, -2, 1 ]
ivlParse('M-3') // => [ 4, -2, -1 ]
```
<a name="ivlProp"></a>

## ivlProp(fn) ⇒ <code>function</code>
Decorate a function to accept intervals in array of shorthand notation. It only works with 1-parameter functions.

**Kind**: global function  
**Returns**: <code>function</code> - the decorated function  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to be decorated |

<a name="simpleNum"></a>

## simpleNum(ivl) ⇒ <code>Integer</code>
Get the simplified interval number (in 1-based index)

**Kind**: global function  
**Returns**: <code>Integer</code> - the simplified interval number  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>Array</code> &#124; <code>String</code> | the interval to get the number from |

<a name="number"></a>

## number(ivl) ⇒ <code>Integer</code>
Get the interval number

**Kind**: global function  
**Returns**: <code>Integer</code> - a integer greater than 0 or null if not valid interval  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>Array</code> &#124; <code>String</code> | the interval to get the number from |

**Example**  
```js
number('P8') // => 8
```
<a name="ivlType"></a>

## ivlType(ivl, &#x27;P&#x27;)
Get the interval type

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>Array</code> &#124; <code>String</code> | the interval |
| 'P' | <code>String</code> | if it's perfectable, 'M' if it's majorable |

<a name="quality"></a>

## quality(ivl) ⇒ <code>String</code>
Get interval quality

**Kind**: global function  
**Returns**: <code>String</code> - the quality string  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>Array</code> &#124; <code>String</code> | the interval |

**Example**  
```js
quality('3M') // => 'M'
```
<a name="ivlStr"></a>

## ivlStr(ivl) ⇒ <code>String</code>
Convert an interval in array notation to shorthand notation

**Kind**: global function  
**Returns**: <code>String</code> - the interval in shorthand notation  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>Array</code> | the interval in array notation |

<a name="transpose"></a>

## transpose(a, b) ⇒ <code>String</code>
Transpose a pitch by an interval
This function is currified, and aliased as `tr`

**Kind**: global function  
**Returns**: <code>String</code> - the pitch transposed by the interval  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Array</code> &#124; <code>String</code> | the pitch or interval |
| b | <code>Array</code> &#124; <code>String</code> | the pitch or interval |

**Example**  
```js
transpose('C2', 'm3') // => 'Eb2'
transpose('C', '6m') // => 'Ab'
```
<a name="tr"></a>

## tr()
An alias for `transpose`

**Kind**: global function  
<a name="split"></a>

## split(source) ⇒ <code>Array</code>
Split a string by spaces (or commas or bars). Always returns an array, even if its empty

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | the thing to get an array from |

