<a name="pcPitch"></a>

## pcPitch(fifhts) ⇒ <code>Pitch</code>
Create a pitch class in array notation

**Kind**: global function  
**Returns**: <code>Pitch</code> - the pitch in array notation  

| Param | Type | Description |
| --- | --- | --- |
| fifhts | <code>Integer</code> | the number of fifths from C |

<a name="notePitch"></a>

## notePitch(fifhts, octaves) ⇒ <code>Pitch</code>
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

<a name="isIvlStr"></a>

## isIvlStr() ⇒ <code>Boolean</code>
Test if the given string is an interval name

**Kind**: global function  

| Type |
| --- |
| <code>String</code> | 

<a name="parsePitch"></a>

## parsePitch() ⇒ <code>Pitch</code>
Parse a pitch (a pitch class, a note pitch or an interval)

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

<a name="chroma"></a>

## chroma() ⇒ <code>Integer</code>
Return the chroma of a pitch.

**Kind**: global function  

| Type |
| --- |
| <code>String</code> &#124; <code>Pitch</code> | 

