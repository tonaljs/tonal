## Functions

<dl>
<dt><a href="#tokenize">tokenize(str)</a> ⇒ <code>Array</code></dt>
<dd><p>Split a string into tokens related to note parts.
It returns an array of strings <code>[letter, accidental, octave, modifier]</code></p>
<p>It always returns an array</p>
</dd>
<dt><a href="#note">note(note)</a> ⇒ <code>Object</code></dt>
<dd><p>Get note properties. It returns an object with the following information:</p>
<ul>
<li>name {string}: the note name. The letter is always in uppercase</li>
<li>letter {string}: the note letter, always in uppercase</li>
<li>acc {string}: the note accidentals</li>
<li>octave {Number}: the octave or null if not present</li>
<li>pc {string}: the pitch class (letter + accidentals)</li>
<li>step {Number}: number equivalent of the note letter. 0 means C ... 6 means B.</li>
<li>alt {Number}: number equivalent of accidentals (negative are flats, positive sharps)</li>
<li>chroma {Number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...</li>
<li>height {Number}: the note midi number but for any note including pitch classes (assumes oct is -100)</li>
<li>midi {Number}: the note midi number (from 0 to 127)</li>
<li>freq {Number}: the frequency using an equal temperament at 440Hz (undefined for pitch classes)</li>
</ul>
<p>This function <em>always</em> returns an object with all this properties, but if it&quot;s
not a valid note all properties will be null.</p>
<p>The returned object can&quot;t be mutated.</p>
</dd>
<dt><a href="#interval">interval(interval)</a> ⇒ <code>Object</code></dt>
<dd><p>Get interval properties. It returns an object with:</p>
<ul>
<li>name: the interval name</li>
<li>num: the interval number</li>
<li>type: &#39;perfectable&#39; or &#39;majorable&#39;</li>
<li>q: the interval quality (d, m, M, A)</li>
<li>dir: interval direction (1 ascending, -1 descending)</li>
<li>simple: the simplified number</li>
<li>semitones: the size in semitones</li>
<li>chroma: the interval chroma</li>
</ul>
</dd>
<dt><a href="#transpose">transpose(note, interval)</a> ⇒ <code>string</code></dt>
<dd><p>Transpose a note by an interval. The note can be a pitch class.</p>
<p>This function can be partially applied.</p>
</dd>
<dt><a href="#add">add(interval1, interval2)</a> ⇒ <code>string</code></dt>
<dd><p>Adds two intervals</p>
</dd>
<dt><a href="#substract">substract(minuendInterval, subtrahendInterval)</a> ⇒ <code>string</code></dt>
<dd><p>Subtracts two intervals</p>
</dd>
<dt><a href="#distance">distance(fromNote, toNote)</a> ⇒ <code>string</code></dt>
<dd><p>Find the interval distance between two notes or pitch classes.</p>
<p>To find distance between pitch classes, both notes must be pitch classes and
the interval is always ascending</p>
</dd>
</dl>

<a name="tokenize"></a>

## tokenize(str) ⇒ <code>Array</code>
Split a string into tokens related to note parts.It returns an array of strings `[letter, accidental, octave, modifier]`It always returns an array

**Kind**: global function  
**Returns**: <code>Array</code> - an array of note tokens  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```js
tokenize("C#2") // => ["C", "#", "2", ""]tokenize("Db3 major") // => ["D", "b", "3", "major"]tokenize("major") // => ["", "", "", "major"]tokenize("##") // => ["", "##", "", ""]tokenize() // => ["", "", "", ""]
```
<a name="note"></a>

## note(note) ⇒ <code>Object</code>
Get note properties. It returns an object with the following information:- name {string}: the note name. The letter is always in uppercase- letter {string}: the note letter, always in uppercase- acc {string}: the note accidentals- octave {Number}: the octave or null if not present- pc {string}: the pitch class (letter + accidentals)- step {Number}: number equivalent of the note letter. 0 means C ... 6 means B.- alt {Number}: number equivalent of accidentals (negative are flats, positive sharps)- chroma {Number}: number equivalent of the pitch class, where 0 is C, 1 is C# or Db, 2 is D...- height {Number}: the note midi number but for any note including pitch classes (assumes oct is -100)- midi {Number}: the note midi number (from 0 to 127)- freq {Number}: the frequency using an equal temperament at 440Hz (undefined for pitch classes)This function *always* returns an object with all this properties, but if it"snot a valid note all properties will be null.The returned object can"t be mutated.

**Kind**: global function  
**Returns**: <code>Object</code> - an object with the properties (or an object will all propertiesset to undefined if not valid note)  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>string</code> | the note name in scientific notation |

**Example**  
```js
import { note } from '@tonaljs/tonal'note("fx-3").name // => "F##-3"note("invalid").name // => undefinednote('').name // => undefinednote("C#3").oct // => 3note('C#').oct // => undefined
```
<a name="interval"></a>

## interval(interval) ⇒ <code>Object</code>
Get interval properties. It returns an object with:- name: the interval name- num: the interval number- type: 'perfectable' or 'majorable'- q: the interval quality (d, m, M, A)- dir: interval direction (1 ascending, -1 descending)- simple: the simplified number- semitones: the size in semitones- chroma: the interval chroma

**Kind**: global function  
**Returns**: <code>Object</code> - the interval in the form [number, alt]  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>string</code> | the interval name |

**Example**  
```js
import { interval } from '@tonaljs/tonal'interval('P5').semitones // => 7interval('m3').type // => 'majorable'
```
<a name="transpose"></a>

## transpose(note, interval) ⇒ <code>string</code>
Transpose a note by an interval. The note can be a pitch class.This function can be partially applied.

**Kind**: global function  
**Returns**: <code>string</code> - the transposed note  

| Param | Type |
| --- | --- |
| note | <code>string</code> | 
| interval | <code>string</code> | 

**Example**  
```js
import { tranpose } from "@tonaljs/tonal"transpose("d3", "3M") // => "F#3"transpose("D", "3M") // => "F#"["C", "D", "E", "F", "G"].map(pc => transpose(pc, "M3)) // => ["E", "F#", "G#", "A", "B"]
```
<a name="add"></a>

## add(interval1, interval2) ⇒ <code>string</code>
Adds two intervals

**Kind**: global function  
**Returns**: <code>string</code> - the added interval name  

| Param | Type |
| --- | --- |
| interval1 | <code>string</code> | 
| interval2 | <code>string</code> | 

**Example**  
```js
import { add } from "@tonaljs/tonal"add("3m", "5P") // => "7m"
```
<a name="substract"></a>

## substract(minuendInterval, subtrahendInterval) ⇒ <code>string</code>
Subtracts two intervals

**Kind**: global function  
**Returns**: <code>string</code> - the substracted interval name  

| Param | Type |
| --- | --- |
| minuendInterval | <code>string</code> | 
| subtrahendInterval | <code>string</code> | 

**Example**  
```js
import { substract } from '@tonaljs/tonal'substract('5P', '3M') // => '3m'substract('3M', '5P') // => '-3m'
```
<a name="distance"></a>

## distance(fromNote, toNote) ⇒ <code>string</code>
Find the interval distance between two notes or pitch classes.To find distance between pitch classes, both notes must be pitch classes andthe interval is always ascending

**Kind**: global function  
**Returns**: <code>string</code> - the name of the distance interval  

| Param | Type | Description |
| --- | --- | --- |
| fromNote | <code>string</code> | the note name to calculate distance from |
| toNote | <code>string</code> | the note name to calculate distance to |

**Example**  
```js
import { distance } from "@tonaljs/tonal"substract('5P', '3M') //=> '3m'substract('3M', '5P') //=> '-3m'
```
