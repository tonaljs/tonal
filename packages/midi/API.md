## Functions

<dl>
<dt><a href="#pcArr">pcArr(fifhts)</a> ⇒ <code>Pitch</code></dt>
<dd><p>Create a pitch class in array notation</p>
</dd>
<dt><a href="#noteArr">noteArr(fifhts, octaves)</a> ⇒ <code>Pitch</code></dt>
<dd><p>Create a note pitch in array notation</p>
</dd>
<dt><a href="#ivlPitch">ivlPitch(fifhts, octaves, dir)</a> ⇒ <code>Pitch</code></dt>
<dd><p>Create an interval in array notation</p>
</dd>
<dt><a href="#isPitch">isPitch(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch</p>
</dd>
<dt><a href="#isPitchClass">isPitchClass(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch class</p>
</dd>
<dt><a href="#hasOct">hasOct(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch with octave (note pitch or interval)</p>
</dd>
<dt><a href="#isNotePitch">isNotePitch(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a note pitch</p>
</dd>
<dt><a href="#isIvlPitch">isIvlPitch(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch interval</p>
</dd>
<dt><a href="#isPitchNotIvl">isPitchNotIvl(obj)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if a given object is a pitch, but not an interval</p>
</dd>
<dt><a href="#encode">encode(step, alt, oct, dir)</a> ⇒ <code>Pitch</code></dt>
<dd><p>Create a pitch. A pitch in tonal may refer to a pitch class, the pitch
of a note or an interval.</p>
</dd>
<dt><a href="#decode">decode(p)</a> ⇒ <code>Object</code></dt>
<dd><p>Decode a pitch to its numeric properties</p>
</dd>
<dt><a href="#parseNote">parseNote()</a> ⇒ <code>Pitch</code></dt>
<dd><p>Parse a note name</p>
</dd>
<dt><a href="#isNoteStr">isNoteStr()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given string is a note name</p>
</dd>
<dt><a href="#parseIvl">parseIvl()</a> ⇒ <code>Pitch</code></dt>
<dd><p>Parses an interval name in shorthand notation</p>
</dd>
<dt><a href="#isIvlPitchStr">isIvlPitchStr()</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given string is an interval name</p>
</dd>
<dt><a href="#toLetter">toLetter()</a> ⇒ <code>String</code></dt>
<dd><p>Given a step number return the letter</p>
</dd>
<dt><a href="#toAcc">toAcc()</a> ⇒ <code>String</code></dt>
<dd><p>Given an alteration number, return the accidentals</p>
</dd>
<dt><a href="#strNote">strNote(n)</a> ⇒ <code>String</code></dt>
<dd><p>Given a pitch class or a pitch note, get the string in scientific
notation</p>
</dd>
<dt><a href="#strIvl">strIvl(pitch)</a> ⇒ <code>String</code></dt>
<dd><p>Given an interval, get the string in scientific
notation</p>
</dd>
<dt><a href="#note">note()</a> ⇒ <code>String</code></dt>
<dd><p>Given a string return a note string in scientific notation or null
if not valid string</p>
</dd>
<dt><a href="#pc">pc()</a> ⇒ <code>String</code></dt>
<dd><p>Get pitch class of a note. The note can be a string or a pitch array.</p>
</dd>
<dt><a href="#chroma">chroma()</a> ⇒ <code>Integer</code></dt>
<dd><p>Return the chroma of a pitch.</p>
</dd>
</dl>

<a name="pcArr"></a>

## pcArr(fifhts) ⇒ <code>Pitch</code>
Create a pitch class in array notation

**Kind**: global function  
**Returns**: <code>Pitch</code> - the pitch in array notation  

| Param | Type | Description |
| --- | --- | --- |
| fifhts | <code>Integer</code> | the number of fifths from C |

<a name="noteArr"></a>

## noteArr(fifhts, octaves) ⇒ <code>Pitch</code>
Create a note pitch in array notation

**Kind**: global function  
**Returns**: <code>Pitch</code> - the pitch in array notation  

| Param | Type | Description |
| --- | --- | --- |
| fifhts | <code>Integer</code> | the number of fifths from C |
| octaves | <code>Integer</code> | the number of encoded octaves |

<a name="ivlPitch"></a>

## ivlPitch(fifhts, octaves, dir) ⇒ <code>Pitch</code>
Create an interval in array notation

**Kind**: global function  
**Returns**: <code>Pitch</code> - the pitch in array notation  

| Param | Type | Description |
| --- | --- | --- |
| fifhts | <code>Integer</code> | the number of fifths from C |
| octaves | <code>Integer</code> | the number of encoded octaves |
| dir | <code>Integer</code> | (Optional) the direction |

<a name="isPitch"></a>

## isPitch(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="isPitchClass"></a>

## isPitchClass(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch class

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="hasOct"></a>

## hasOct(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch with octave (note pitch or interval)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="isNotePitch"></a>

## isNotePitch(obj) ⇒ <code>Boolean</code>
Test if a given object is a note pitch

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="isIvlPitch"></a>

## isIvlPitch(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch interval

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | the object to test |

<a name="isPitchNotIvl"></a>

## isPitchNotIvl(obj) ⇒ <code>Boolean</code>
Test if a given object is a pitch, but not an interval

**Kind**: global function  

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

<a name="decode"></a>

## decode(p) ⇒ <code>Object</code>
Decode a pitch to its numeric properties

**Kind**: global function  

| Param | Type |
| --- | --- |
| p | <code>Pitch</code> | 

<a name="parseNote"></a>

## parseNote() ⇒ <code>Pitch</code>
Parse a note name

**Kind**: global function  

| Type |
| --- |
| <code>String</code> | 

<a name="isNoteStr"></a>

## isNoteStr() ⇒ <code>Boolean</code>
Test if the given string is a note name

**Kind**: global function  

| Type |
| --- |
| <code>String</code> | 

<a name="parseIvl"></a>

## parseIvl() ⇒ <code>Pitch</code>
Parses an interval name in shorthand notation

**Kind**: global function  

| Type |
| --- |
| <code>String</code> | 

<a name="isIvlPitchStr"></a>

## isIvlPitchStr() ⇒ <code>Boolean</code>
Test if the given string is an interval name

**Kind**: global function  

| Type |
| --- |
| <code>String</code> | 

<a name="toLetter"></a>

## toLetter() ⇒ <code>String</code>
Given a step number return the letter

**Kind**: global function  

| Type |
| --- |
| <code>Integer</code> | 

<a name="toAcc"></a>

## toAcc() ⇒ <code>String</code>
Given an alteration number, return the accidentals

**Kind**: global function  

| Type |
| --- |
| <code>Integer</code> | 

<a name="strNote"></a>

## strNote(n) ⇒ <code>String</code>
Given a pitch class or a pitch note, get the string in scientific
notation

**Kind**: global function  

| Param | Type |
| --- | --- |
| n | <code>Pitch</code> | 

<a name="strIvl"></a>

## strIvl(pitch) ⇒ <code>String</code>
Given an interval, get the string in scientific
notation

**Kind**: global function  

| Param | Type |
| --- | --- |
| pitch | <code>Pitch</code> | 

<a name="note"></a>

## note() ⇒ <code>String</code>
Given a string return a note string in scientific notation or null
if not valid string

**Kind**: global function  

| Type |
| --- |
| <code>String</code> | 

**Example**  
```js
['c', 'db3', '2', 'g+', 'gx4'].map(tonal.note)
// => ['C', 'Db3', null, null, 'G##4']
```
<a name="pc"></a>

## pc() ⇒ <code>String</code>
Get pitch class of a note. The note can be a string or a pitch array.

**Kind**: global function  
**Returns**: <code>String</code> - the pitch class  

| Type |
| --- |
| <code>String</code> &#124; <code>Pitch</code> | 

**Example**  
```js
tonal.pc('Db3') // => 'Db'
```
<a name="chroma"></a>

## chroma() ⇒ <code>Integer</code>
Return the chroma of a pitch.

**Kind**: global function  

| Type |
| --- |
| <code>String</code> &#124; <code>Pitch</code> | 

