# tonal-interval [![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)

[![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-interval` is a collection of functions to create and manipulate music intervals.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-interval`

## API Reference

<dl>
<dt><a href="#ivlName">ivlName(ivl, the)</a></dt>
<dd><p>Get interval name. Can be used to test if it&#39;s an interval. It accepts intervals
as pitch or string in shorthand notation or tonal notation. It returns always
intervals in tonal notation.</p>
</dd>
<dt><a href="#semitones">semitones(ivl)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get size in semitones of an interval</p>
</dd>
<dt><a href="#fromSemitones">fromSemitones(num)</a> ⇒ <code>String</code></dt>
<dd><p>Get interval name from semitones number. Since there are several interval
names for the same number, the name it&#39;s arbitraty, but deterministic.</p>
</dd>
<dt><a href="#ic">ic(interval)</a> ⇒ <code>Integer</code></dt>
<dd><p>Get the <a href="https://en.wikipedia.org/wiki/Interval_class">interval class</a>
number of a given interval.</p>
<p>In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes</p>
<p>As paramter you can pass an interval in shorthand notation, an interval in
array notation or the number of semitones of the interval</p>
</dd>
<dt><a href="#itype">itype(interval)</a> ⇒ <code>String</code></dt>
<dd><p>Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)</p>
</dd>
<dt><a href="#invert">invert(interval)</a> ⇒ <code>String</code> | <code>Pitch</code></dt>
<dd><p>Get the <a href="https://en.wikipedia.org/wiki/Inversion_(music">inversion</a>#Intervals)
of an interval.</p>
</dd>
<dt><a href="#simplify">simplify(interval)</a> ⇒ <code>String</code> | <code>Array</code></dt>
<dd><p>Get the simplified version of an interval.</p>
</dd>
</dl>

<a name="ivlName"></a>

## ivlName(ivl, the)
Get interval name. Can be used to test if it's an interval. It accepts intervals
as pitch or string in shorthand notation or tonal notation. It returns always
intervals in tonal notation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>String</code> &#124; <code>Pitch</code> |  |
| the | <code>String</code> | interval name or null if not valid interval |

**Example**  
```js
import { ivlName } from 'tonal-interval'
ivlName('m-3') // => '-3m'
ivlName('3') // => null
// part of tonal
tonal.ivlName('blah') // => null
```
<a name="semitones"></a>

## semitones(ivl) ⇒ <code>Integer</code>
Get size in semitones of an interval

**Kind**: global function  
**Returns**: <code>Integer</code> - the number of semitones or null if not an interval  

| Param | Type |
| --- | --- |
| ivl | <code>String</code> &#124; <code>Pitch</code> |

**Example**  
```js
import { semitones } from 'tonal-interval'
semitones('P4') // => 5
// or using tonal
tonal.semitones('P5') // => 7
```
<a name="fromSemitones"></a>

## fromSemitones(num) ⇒ <code>String</code>
Get interval name from semitones number. Since there are several interval
names for the same number, the name it's arbitraty, but deterministic.

**Kind**: global function  
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
<a name="ic"></a>

## ic(interval) ⇒ <code>Integer</code>
Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
number of a given interval.

In musical set theory, an interval class is the shortest distance in
pitch class space between two unordered pitch classes

As paramter you can pass an interval in shorthand notation, an interval in
array notation or the number of semitones of the interval

**Kind**: global function  
**Returns**: <code>Integer</code> - A value between 0 and 6  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> &#124; <code>Integer</code> | the interval or the number of semitones |

**Example**  
```js
const ic = require('interval-class')
ic('P8') // => 0
ic('m6') // => 4
['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
```
<a name="itype"></a>

## itype(interval) ⇒ <code>String</code>
Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)

**Kind**: global function  
**Returns**: <code>String</code> - 'P' for perfectables, 'M' for majorables or null if not
valid interval  

| Param | Type |
| --- | --- |
| interval | <code>String</code> &#124; <code>Pitch</code> |

**Example**  
```js
tonal.itype('5A') // => 'P'
```
<a name="invert"></a>

## invert(interval) ⇒ <code>String</code> &#124; <code>Pitch</code>
Get the [inversion](https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
of an interval.

**Kind**: global function  
**Returns**: <code>String</code> &#124; <code>Pitch</code> - the inverted interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> &#124; <code>Pitch</code> | the interval to invert in interval shorthand notation or interval array notation |

**Example**  
```js
import { invert } from 'tonal-interval'
invert('3m') // => '6M'
// or using tonal
tonal.invert('2M') // => '7m'
```
<a name="simplify"></a>

## simplify(interval) ⇒ <code>String</code> &#124; <code>Array</code>
Get the simplified version of an interval.

**Kind**: global function  
**Returns**: <code>String</code> &#124; <code>Array</code> - the simplified interval  

| Param | Type | Description |
| --- | --- | --- |
| interval | <code>String</code> &#124; <code>Array</code> | the interval to simplify |

**Example**  
```js
import { simplify } from 'tonal-interval'
simplify('9M') // => '2M'
['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(simplify)
// => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
simplify('2M') // => '2M'
simplify('-2M') // => '7m'
// part of tonal
tonal.simplify('9m') // => '2m'
```
