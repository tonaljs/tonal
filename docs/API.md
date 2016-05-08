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
<dt><a href="#letter">letter()</a> ⇒ <code>String</code></dt>
<dd><p>Return the letter of a pitch</p>
</dd>
<dt><a href="#isMidi">isMidi(num)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if the given number is a valid midi note number</p>
</dd>
<dt><a href="#midi">midi(pitch)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get midi number for a pitch</p>
</dd>
<dt><a href="#fromMidi">fromMidi(midi)</a> ⇒ <code>String</code></dt>
<dd><p>Given a midi number, returns a note name. The altered notes will have
flats.</p>
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
<dt><a href="#asArr">asArr(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string by spaces (or commas or bars). Always returns an array, even if its empty</p>
</dd>
<dt><a href="#map">map(fn, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Map a list with a function</p>
<p>Can be partially applied.</p>
</dd>
<dt><a href="#filter">filter(fn, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Filter a list with a function</p>
<p>Can be partially applied.</p>
</dd>
<dt><a href="#listFn">listFn()</a></dt>
<dd><p>Decorates a function to work with lists in pitch array notation</p>
</dd>
<dt><a href="#harmonizer">harmonizer(list)</a> ⇒ <code>function</code></dt>
<dd><p>Create an harmonizer: a function that given a note returns a list of notes.</p>
</dd>
<dt><a href="#harmonize">harmonize(list, pitch)</a> ⇒ <code>Array</code></dt>
<dd><p>Harmonizes a list with a pitch</p>
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

<a name="letter"></a>

## letter() ⇒ <code>String</code>
Return the letter of a pitch

**Kind**: global function  

| Type |
| --- |
| <code>String</code> &#124; <code>Pitch</code> | 

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
<a name="fromMidi"></a>

## fromMidi(midi) ⇒ <code>String</code>
Given a midi number, returns a note name. The altered notes will have
flats.

**Kind**: global function  
**Returns**: <code>String</code> - the note name  

| Param | Type | Description |
| --- | --- | --- |
| midi | <code>Integer</code> | the midi note number |

**Example**  
```js
tonal.fromMidi(61) // => 'Db4'
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
<a name="asArr"></a>

## asArr(source) ⇒ <code>Array</code>
Split a string by spaces (or commas or bars). Always returns an array, even if its empty

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>String</code> &#124; <code>Array</code> &#124; <code>Object</code> | the thing to get an array from |

<a name="map"></a>

## map(fn, list) ⇒ <code>Array</code>
Map a list with a function

Can be partially applied.

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| list | <code>String</code> &#124; <code>Array</code> | 

<a name="filter"></a>

## filter(fn, list) ⇒ <code>Array</code>
Filter a list with a function

Can be partially applied.

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 
| list | <code>String</code> &#124; <code>Array</code> | 

<a name="listFn"></a>

## listFn()
Decorates a function to work with lists in pitch array notation

**Kind**: global function  
<a name="harmonizer"></a>

## harmonizer(list) ⇒ <code>function</code>
Create an harmonizer: a function that given a note returns a list of notes.

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>String</code> &#124; <code>Array</code> | 

<a name="harmonize"></a>

## harmonize(list, pitch) ⇒ <code>Array</code>
Harmonizes a list with a pitch

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>String</code> &#124; <code>Array</code> | 
| pitch | <code>String</code> &#124; <code>Pitch</code> | 

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
