## Constants

<dl>
<dt><a href="#tryPitch">tryPitch</a> ⇒ <code>Array</code> | <code>Object</code></dt>
<dd><p>Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.</p>
</dd>
<dt><a href="#alt">alt</a> ⇒ <code>Integer</code></dt>
<dd><p>Get alteration of a pitch.</p>
<p>The alteration is an integer indicating the number of sharps or flats</p>
</dd>
<dt><a href="#letter">letter</a> ⇒ <code>String</code></dt>
<dd><p>Get the pitch letter</p>
</dd>
</dl>

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
<dt><a href="#pitchRegex">pitchRegex()</a></dt>
<dd><p>Get the a regex to parse pitch in scientific notation</p>
<p>After exec against a valid string we get:</p>
<ul>
<li>0: the complete string</li>
<li>1: the letter (in upper or lower case)</li>
<li>2: the alterations (a list of #, b or x)</li>
<li>3: an optional octave number</li>
</ul>
</dd>
<dt><a href="#pitchParse">pitchParse(str)</a> ⇒ <code>Array</code></dt>
<dd><p>Given a pitch string in scientific notation, get the pitch in array notation</p>
</dd>
<dt><a href="#prop">prop(fn)</a> ⇒ <code>function</code></dt>
<dd><p>Decorate a function with one parameter to accepts
pitch in scientific notation</p>
</dd>
<dt><a href="#accidentals">accidentals(pitch)</a> ⇒ <code>String</code></dt>
<dd><p>Get accidental string from a pitch</p>
</dd>
<dt><a href="#pitchStr">pitchStr(pitch)</a> ⇒ <code>String</code></dt>
<dd><p>Convert a pitch in array notation to string</p>
</dd>
</dl>

<a name="tryPitch"></a>

## tryPitch ⇒ <code>Array</code> &#124; <code>Object</code>
Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.

**Kind**: global constant  
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
<a name="alt"></a>

## alt ⇒ <code>Integer</code>
Get alteration of a pitch.

The alteration is an integer indicating the number of sharps or flats

**Kind**: global constant  
**Returns**: <code>Integer</code> - the alteration  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch (either in scientific notation or array notation) |

**Example**  
```js
alt('C#2') // => 2
```
<a name="letter"></a>

## letter ⇒ <code>String</code>
Get the pitch letter

**Kind**: global constant  
**Returns**: <code>String</code> - the letter  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> &#124; <code>String</code> | the pitch (either in scientific notation or array notation) |

**Example**  
```js
letter('C#2') // => 'C'
letter([-7, 2]) // => 'C'
```
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

## pitchRegex()
Get the a regex to parse pitch in scientific notation

After exec against a valid string we get:
- 0: the complete string
- 1: the letter (in upper or lower case)
- 2: the alterations (a list of #, b or x)
- 3: an optional octave number

**Kind**: global function  
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
<a name="prop"></a>

## prop(fn) ⇒ <code>function</code>
Decorate a function with one parameter to accepts
pitch in scientific notation

**Kind**: global function  
**Returns**: <code>function</code> - a function with one parameter that can be a pitch in scientific notation or anything else.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to decorate |

<a name="accidentals"></a>

## accidentals(pitch) ⇒ <code>String</code>
Get accidental string from a pitch

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
<a name="pitchStr"></a>

## pitchStr(pitch) ⇒ <code>String</code>
Convert a pitch in array notation to string

**Kind**: global function  
**Returns**: <code>String</code> - the pitch in scientific notation  

| Param | Type | Description |
| --- | --- | --- |
| pitch | <code>Array</code> | the pitch to convert |

**Example**  
```js
pitchStr([2, 1]) // => 'D2'
```
