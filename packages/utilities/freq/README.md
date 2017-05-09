<a name="module_freq"></a>

# freq
[![npm version](https://img.shields.io/npm/v/tonal-freq.svg)](https://www.npmjs.com/package/tonal-freq)
[![tonal](https://img.shields.io/badge/tonal-freq-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-freq` is a collection of functions to perform calculations related to frequencies.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
var freq = require('tonal-freq')
freq.toFreq('A4') // => 440
freq.note(440) // => 'A4'
freq.noteAndDetune(320) // => ['C4', 200]
```

## Install

[![npm install tonal-freq](https://nodei.co/npm/tonal-freq.png?mini=true)](https://npmjs.org/package/tonal-freq/)

## API Documentation


* [freq](#module_freq)
    * [`.eqTempFreq(ref, maxDecimals, note)`](#module_freq.eqTempFreq) ⇒ <code>Number</code>
    * [`.toFreq(note)`](#module_freq.toFreq) ⇒ <code>Float</code>
    * [`.eqTempFreqToMidi(tuning, freq)`](#module_freq.eqTempFreqToMidi) ⇒ <code>Number</code>
    * [`.toMidi(freq)`](#module_freq.toMidi) ⇒ <code>Number</code>
    * [`.note(freq, useSharps)`](#module_freq.note) ⇒ <code>String</code>
    * [`.cents(base, freq)`](#module_freq.cents) ⇒ <code>Integer</code>

<a name="module_freq.eqTempFreq"></a>

## `freq.eqTempFreq(ref, maxDecimals, note)` ⇒ <code>Number</code>
Return the equal tempered frequency of a note.

This function can be partially applied if note parameter is not present.

**Kind**: static method of <code>[freq](#module_freq)</code>  
**Returns**: <code>Number</code> - the frequency  

| Param | Type | Description |
| --- | --- | --- |
| ref | <code>Float</code> | the tuning reference |
| maxDecimals | <code>Integer</code> | (Optional) the maximum number of decimals (all by default) |
| note | <code>String</code> &#124; <code>Pitch</code> | the note to get the frequency from |

**Example**  
```js
eqTempFreq(444, 4, 'C3')
const toFreq = eqTempFreq(444, 2)
toFreq('A3') // => 222
```
<a name="module_freq.toFreq"></a>

## `freq.toFreq(note)` ⇒ <code>Float</code>
Get the frequency of note with 2 decimals precission using A4 440Hz tuning

This is an alias for: `eqTempFreq(440, 2, <note>)`

**Kind**: static method of <code>[freq](#module_freq)</code>  
**Returns**: <code>Float</code> - the frequency in herzs  

| Param | Type | Description |
| --- | --- | --- |
| note | <code>Number</code> &#124; <code>String</code> | the note name or midi number |

**Example**  
```js
freq.toFreq('A4') // => 440
freq.toFreq('C4') // => 261.63
```
<a name="module_freq.eqTempFreqToMidi"></a>

## `freq.eqTempFreqToMidi(tuning, freq)` ⇒ <code>Number</code>
Get the midi note from a frequency in equal temperament scale. You can
specify the number of decimals of the midi number.

**Kind**: static method of <code>[freq](#module_freq)</code>  
**Returns**: <code>Number</code> - the midi number  

| Param | Type | Description |
| --- | --- | --- |
| tuning | <code>Float</code> | (Optional) the reference A4 tuning (440Hz by default) |
| freq | <code>Number</code> | the frequency |

<a name="module_freq.toMidi"></a>

## `freq.toMidi(freq)` ⇒ <code>Number</code>
Get midi number from frequency with two decimals of precission.

This is an alisas for: `eqTempFreqToMidi(440, 2, <freq>)`

**Kind**: static method of <code>[freq](#module_freq)</code>  
**Returns**: <code>Number</code> - midi number  

| Param | Type |
| --- | --- |
| freq | <code>Float</code> | 

**Example**  
```js
freq.toMidi(361) // => 59.96
```
<a name="module_freq.note"></a>

## `freq.note(freq, useSharps)` ⇒ <code>String</code>
Get note name from frequency using an equal temperament scale with 440Hz
as reference

**Kind**: static method of <code>[freq](#module_freq)</code>  
**Returns**: <code>String</code> - note name  

| Param | Type | Description |
| --- | --- | --- |
| freq | <code>Float</code> |  |
| useSharps | <code>Boolean</code> | (Optional) set to true to use sharps instead of flats |

**Example**  
```js
freq.note(440) // => 'A4'
```
<a name="module_freq.cents"></a>

## `freq.cents(base, freq)` ⇒ <code>Integer</code>
Get difference in cents between two frequencies. The frequencies can be
expressed with hertzs or midi numbers or note names

**Kind**: static method of <code>[freq](#module_freq)</code>  
**Returns**: <code>Integer</code> - The difference in cents  

| Param | Type |
| --- | --- |
| base | <code>Float</code> &#124; <code>Integer</code> &#124; <code>String</code> | 
| freq | <code>Float</code> &#124; <code>Integer</code> &#124; <code>String</code> | 

**Example**  
```js
import { cents } from 'tonal-freq'
cents('C4', 261) // => -4
```
