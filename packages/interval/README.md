<a name="module_interval"></a>

# interval
[![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
[![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-interval` is a collection of functions to create and manipulate music intervals.

The intervals are strings in shorthand notation. Two variations are supported:

- standard shorthand notation: type and number, for example: 'M3', 'd-4'
- inverse shorthand notation: number and then type, for example: '3M', '-4d'

The problem with the standard shorthand notation is that some strings can be
parsed as notes or intervals, for example: 'A4' can be note A in 4th octave
or an augmented four. To remove ambiguity, the prefered notation in tonal is the
inverse shortand notation.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

## Usage

```js
import * as interval from 'tonal-interval'
// or const interval = require('tonal-interval')
interval.semitones('4P') // => 5
interval.invert('3m') // => '6M'
interval.simplify('9m') // => '2m'
```

## Install

[![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)

## API Documentation


* [interval](#module_interval)
    * [`.props(interval)`](#module_interval.props) ⇒ <code>Object</code>
    * [`.num(interval)`](#module_interval.num) ⇒ <code>Integer</code>
    * [`.name(interval)`](#module_interval.name) ⇒ <code>String</code>
    * [`.type(interval)`](#module_interval.type) ⇒ <code>String</code>
    * [`.semitones(ivl)`](#module_interval.semitones) ⇒ <code>Integer</code>
    * [`.chroma(str)`](#module_interval.chroma) ⇒ <code>Number</code>
    * [`.ic(interval)`](#module_interval.ic) ⇒ <code>Integer</code>
    * [`.build(props)`](#module_interval.build) ⇒ <code>String</code>
    * [`.simplify(interval)`](#module_interval.simplify) ⇒ <code>String</code>
    * [`.invert(interval)`](#module_interval.invert) ⇒ <code>String</code>
    * [`.fromSemitones(num)`](#module_interval.fromSemitones) ⇒ <code>String</code>

<a name="module_interval.props"></a>

## `interval.props(interval)` ⇒ <code>Object</code>
Get interval properties. It returns an object with:

- name: name
- num: number
- q: quality
- step: step 
- alt: alteration
- dir: direction (1 ascending, -1 descending)
- type: "P" or "M" for perfectable or majorable
- simple: the simplified number
- semitones: the size in semitones
- chroma: the interval chroma
- ic: the interval class

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Object</code> - the interval in the form [number, alt]  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> | the interval |

<a name="module_interval.num"></a>

## `interval.num(interval)` ⇒ <code>Integer</code>
Get the number of the interval

**Kind**: static method of [<code>interval</code>](#module_interval)  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> | the interval |

**Example**  
```js
interval.num('m2') // => 2
interval.num('P9') // => 9
interval.num('P-4') // => -4
```
<a name="module_interval.name"></a>

## `interval.name(interval)` ⇒ <code>String</code>
Get interval name. Can be used to test if it's an interval. It accepts intervals
as pitch or string in shorthand notation or tonal notation. It returns always
intervals in tonal notation.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name or null if not valid interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> | the interval string or array |

**Example**  
```js
interval.name('m-3') // => '-3m'
interval.name('3') // => null
```
<a name="module_interval.type"></a>

## `interval.type(interval)` ⇒ <code>String</code>
Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)
It does NOT return the actual quality.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - 'P' for perfectables, 'M' for majorables or null if not
valid interval  

| Param | Type |
| --- | --- |
| interval | <code>String</code> | 

**Example**  
```js
interval.type('5A') // => 'P'
```
<a name="module_interval.semitones"></a>

## `interval.semitones(ivl)` ⇒ <code>Integer</code>
Get size in semitones of an interval

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Integer</code> - the number of semitones or null if not an interval  

| Param | Type |
| --- | --- |
| ivl | <code>String</code> | 

**Example**  
```js
import { semitones } from 'tonal-interval'
semitones('P4') // => 5
// or using tonal
tonal.interval.semitones('P5') // => 7
```
<a name="module_interval.chroma"></a>

## `interval.chroma(str)` ⇒ <code>Number</code>
Get the chroma of the interval. The chroma is a number between 0 and 7
that represents the position within an octave (pitch set)

**Kind**: static method of [<code>interval</code>](#module_interval)  

| Param | Type |
| --- | --- |
| str | <code>String</code> | 

<a name="module_interval.ic"></a>

## `interval.ic(interval)` ⇒ <code>Integer</code>
Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
number of a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes

As paramter you can pass an interval in shorthand notation, an interval in
array notation or the number of semitones of the interval

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>Integer</code> - A value between 0 and 6  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> \| <code>Integer</code> | the interval or the number of semitones |

**Example**  
```js
interval.ic('P8') // => 0
interval.ic('m6') // => 4
['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
```
<a name="module_interval.build"></a>

## `interval.build(props)` ⇒ <code>String</code>
Given a interval property object, get the interval name

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object</code> | the interval property object - num: the interval number - alt: the interval alteration - oct: the number of octaves - dir: the direction |

**Example**  
```js
interval.build({ step: 1, alt: -1, oct: 0, dir: 1 }) // => "1d"
```
<a name="module_interval.simplify"></a>

## `interval.simplify(interval)` ⇒ <code>String</code>
Get the simplified version of an interval.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the simplified interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> | the interval to simplify |

**Example**  
```js
interval.simplify('9M') // => '2M'
['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(interval.simplify)
// => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
interval.simplify('2M') // => '2M'
interval.simplify('-2M') // => '7m'
```
<a name="module_interval.invert"></a>

## `interval.invert(interval)` ⇒ <code>String</code>
Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
of an interval.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the inverted interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> | the interval to invert in interval shorthand notation or interval array notation |

**Example**  
```js
interval.invert('3m') // => '6M'
interval.invert('2M') // => '7m'
```
<a name="module_interval.fromSemitones"></a>

## `interval.fromSemitones(num)` ⇒ <code>String</code>
Get interval name from semitones number. Since there are several interval
names for the same number, the name it's arbitraty, but deterministic.

**Kind**: static method of [<code>interval</code>](#module_interval)  
**Returns**: <code>String</code> - the interval name  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Integer</code> | the number of semitones (can be negative) |

**Example**  
```js
import { fromSemitones } from 'tonal-interval'
fromSemitones(7) // => '5P'
// or using tonal
tonal.fromSemitones(-7) // => '-5P'
```
