# tonal-freq [![npm version](https://img.shields.io/npm/v/tonal-freq.svg)](https://www.npmjs.com/package/tonal-freq)

[![tonal](https://img.shields.io/badge/tonal-freq-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-freq` is a collection of functions to perform calculations related to frequencies.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-freq`

## API Reference

<dl>
<dt><a href="#toEqualTemp">toEqualTemp(ref)</a> ⇒ <code>function</code></dt>
<dd><p>Return a function that converts midi or notes names to frequency using
equal temperament.</p>
</dd>
<dt><a href="#toFreq">toFreq(note)</a> ⇒ <code>Float</code></dt>
<dd><p>Get the frequency of a pitch using equal temperament scale and A4 equal to 440Hz</p>
</dd>
<dt><a href="#fromEqualTemp">fromEqualTemp(ref)</a> ⇒ <code>function</code></dt>
<dd><p>Create a function that returns a midi number from a frequency using an
equal temperament and <code>ref</code> frequency as &#39;A4&#39; frequency.</p>
</dd>
<dt><a href="#midiFromFreq">midiFromFreq(freq)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get note from frequency using a equal temeperament scale and 440Hz as
freq reference</p>
</dd>
<dt><a href="#fromFreq">fromFreq(freq)</a> ⇒ <code>String</code></dt>
<dd><p>Get note name from frequency using an equal temperament scale with 440Hz
as reference</p>
</dd>
<dt><a href="#cents">cents(base, freq)</a> ⇒ <code>Float</code></dt>
<dd><p>Get difference in cents between two frequencies. The frequencies can be
expressed with hertzs or midi numbers or note names</p>
</dd>
</dl>

<a name="toEqualTemp"></a>

## toEqualTemp(ref) ⇒ <code>function</code>
Return a function that converts midi or notes names to frequency using
equal temperament.

**Kind**: global function  
**Returns**: <code>function</code> - the frequency calculator. It accepts midi numbers,
note names, pitches and returns a float.  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>Float</code> | the tuning reference |

**Example**  
```js
import { toEqualTemp } from 'tonal-freq'
const toFreq = toEqualTemp(444)
toFreq('A3') // => 222
```
<a name="toFreq"></a>

## toFreq(note) ⇒ <code>Float</code>
Get the frequency of a pitch using equal temperament scale and A4 equal to 440Hz

**Kind**: global function  
**Returns**: <code>Float</code> - the frequency in herzs  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>Number</code> &#124; <code>String</code> | the note name or midi number |

**Example**  
```js
import { toFreq } from 'tonal-freq'
toFreq('A4') // => 440
// using tonal
tonal.toFreq('C4') // => 261.6255653005986
```
<a name="fromEqualTemp"></a>

## fromEqualTemp(ref) ⇒ <code>function</code>
Create a function that returns a midi number from a frequency using an
equal temperament and `ref` frequency as 'A4' frequency.

**Kind**: global function  
**Returns**: <code>function</code> - a function that converts from frequency to midi  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>Float</code> | the frequency of A4 |

<a name="midiFromFreq"></a>

## midiFromFreq(freq) ⇒ <code>Integer</code>
Get note from frequency using a equal temeperament scale and 440Hz as
freq reference

**Kind**: global function  
**Returns**: <code>Integer</code> - midi number  

| Param | Type |
| --- | --- |
| freq | <code>Float</code> |

<a name="fromFreq"></a>

## fromFreq(freq) ⇒ <code>String</code>
Get note name from frequency using an equal temperament scale with 440Hz
as reference

**Kind**: global function  
**Returns**: <code>String</code> - note name  

| Param | Type |
| --- | --- |
| freq | <code>Float</code> |

<a name="cents"></a>

## cents(base, freq) ⇒ <code>Float</code>
Get difference in cents between two frequencies. The frequencies can be
expressed with hertzs or midi numbers or note names

**Kind**: global function  
**Returns**: <code>Float</code> - The difference in cents  

| Param | Type |
| --- | --- |
| base | <code>Float</code> &#124; <code>Integer</code> &#124; <code>String</code> |
| freq | <code>Float</code> &#124; <code>Integer</code> &#124; <code>String</code> |

**Example**  
```js
import { cents } from 'tonal-freq'
cents('C4', 261) // => -4.1444603457298985
```
