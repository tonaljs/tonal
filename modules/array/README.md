# tonal-array [![npm version](https://img.shields.io/npm/v/tonal-array.svg)](https://www.npmjs.com/package/tonal-array)

[![tonal](https://img.shields.io/badge/tonal-array-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-array` is a collection of functions to create and manipulate arrays of notes or intervals.

This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.

You can install via npm: `npm i --save tonal-array`

## API Reference

<dl>
<dt><a href="#asArr">asArr(source)</a> ⇒ <code>Array</code></dt>
<dd><p>Convert anything to array. Speifically, split string separated by spaces,
commas or bars. The arrays are passed without modifications and the rest of
the objects are wrapped.</p>
<p>This function always returns an array (null or undefined values are converted
to empty arrays)</p>
<p>Thanks to this function, the rest of the functions of this module accepts
any object (or more useful: strings) as an array parameter.</p>
</dd>
<dt><a href="#map">map(fn, arr)</a> ⇒ <code>Array</code></dt>
<dd><p>Return a new array with the elements mapped by a function.
Basically the same as the JavaScript standard <code>array.map</code> but with
two enhacements:</p>
<ul>
<li>Arrays can be expressed as strings (see [asArr])</li>
<li>This function can be partially applied. This is useful to create <em>mapped</em>
versions of single element functions. For an excellent introduction of
the adventages <a href="https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html">read this</a></li>
</ul>
</dd>
<dt><a href="#cMap">cMap(fn, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Compact map: map an array with a function and remove nulls.
Can be partially applied.</p>
</dd>
<dt><a href="#compact">compact(list)</a> ⇒ <code>Array</code></dt>
<dd><p>Return a copy of the array with the null values removed</p>
</dd>
<dt><a href="#filter">filter(fn, arr)</a> ⇒ <code>Array</code></dt>
<dd><p>Filter an array with a function. Again, almost the same as JavaScript standard
filter function but:</p>
<ul>
<li>It accepts strings as arrays</li>
<li>Can be partially applied</li>
</ul>
</dd>
<dt><a href="#harmonics">harmonics(notes)</a> ⇒ <code>Array</code></dt>
<dd><p>Given a list of notes, return the distance from the first note to the rest.</p>
</dd>
<dt><a href="#harmonizer">harmonizer(ivls)</a> ⇒ <code>function</code></dt>
<dd><p>Given an array of intervals, create a function that harmonizes a
note with this intervals. Given a list of notes, return a function that
transpose the notes by an interval.</p>
</dd>
<dt><a href="#harmonize">harmonize(ivl, note)</a> ⇒ <code>Array</code></dt>
<dd><p>Harmonizes a note with an array of intervals. It&#39;s a layer of sintatic
sugar over <code>harmonizer</code>.</p>
</dd>
<dt><a href="#sort">sort(comp, arr)</a></dt>
<dd><p>Sort an array or notes or intervals. It uses the JavaScript standard sort
function.</p>
</dd>
<dt><a href="#shuffle">shuffle(arr)</a> ⇒ <code>Array</code></dt>
<dd><p>Randomizes the order of the specified array using the Fisher–Yates shuffle.</p>
</dd>
<dt><a href="#rotate">rotate(times, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Rotates a list a number of times. It&#39;s completly agnostic about the
contents of the list.</p>
</dd>
<dt><a href="#rotateAsc">rotateAsc(times, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Rotates an ascending list of pitches n times keeping the ascending property.
This functions assumes the list is an ascending list of pitches, and
transposes the them to ensure they are ascending after rotation.
It can be used, for example, to invert chords.</p>
</dd>
<dt><a href="#select">select(numbers, list)</a> ⇒ <code>Array</code></dt>
<dd><p>Select elements from a list.</p>
</dd>
<dt><a href="#listFn">listFn(fn)</a> ⇒ <code>function</code></dt>
<dd><p>Decorates a function to so it&#39;s first parameter is an array of pitches in
array notation. Also, if the return value is a pitch or an array of pitches
in array notation, it convert backs to strings.</p>
</dd>
</dl>

<a name="asArr"></a>

## asArr(source) ⇒ <code>Array</code>
Convert anything to array. Speifically, split string separated by spaces,
commas or bars. The arrays are passed without modifications and the rest of
the objects are wrapped.

This function always returns an array (null or undefined values are converted
to empty arrays)

Thanks to this function, the rest of the functions of this module accepts
any object (or more useful: strings) as an array parameter.

**Kind**: global function  
**Returns**: <code>Array</code> - the object as an array  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>\*</code> | the thing to get an array from |

**Example**  
```js
import { asArr } from 'tonal-arrays'
asArr('C D E F G') // => ['C', 'D', 'E', 'F', 'G']
```
<a name="map"></a>

## map(fn, arr) ⇒ <code>Array</code>
Return a new array with the elements mapped by a function.
Basically the same as the JavaScript standard `array.map` but with
two enhacements:

- Arrays can be expressed as strings (see [asArr])
- This function can be partially applied. This is useful to create _mapped_
versions of single element functions. For an excellent introduction of
the adventages [read this](https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function |
| arr | <code>Array</code> &#124; <code>String</code> | the array to be mapped |

**Example**  
```js
var arr = require('tonal-arr')
var toUp = arr.map(function(e) { return e.toUpperCase() })
toUp('a b c') // => ['A', 'B', 'C']
```
**Example**  
```js
var tonal = require('tonal')
tonal.map(tonal.transpose('M3'), 'C D E') // => ['E', 'F#', 'G#']
```
<a name="cMap"></a>

## cMap(fn, list) ⇒ <code>Array</code>
Compact map: map an array with a function and remove nulls.
Can be partially applied.

**Kind**: global function  
**See**: map  

| Param | Type |
| --- | --- |
| fn | <code>function</code> |
| list | <code>Array</code> &#124; <code>String</code> |

<a name="compact"></a>

## compact(list) ⇒ <code>Array</code>
Return a copy of the array with the null values removed

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>String</code> &#124; <code>Array</code> |

<a name="filter"></a>

## filter(fn, arr) ⇒ <code>Array</code>
Filter an array with a function. Again, almost the same as JavaScript standard
filter function but:
- It accepts strings as arrays
- Can be partially applied

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> |
| arr | <code>String</code> &#124; <code>Array</code> |

<a name="harmonics"></a>

## harmonics(notes) ⇒ <code>Array</code>
Given a list of notes, return the distance from the first note to the rest.

**Kind**: global function  
**Returns**: <code>Array</code> - the intervals  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array</code> &#124; <code>String</code> | the list of notes |

**Example**  
```js
tonal.harmonics('C E g') // => ['1P', '3M', '5P']
```
<a name="harmonizer"></a>

## harmonizer(ivls) ⇒ <code>function</code>
Given an array of intervals, create a function that harmonizes a
note with this intervals. Given a list of notes, return a function that
transpose the notes by an interval.

**Kind**: global function  
**Returns**: <code>function</code> - The harmonizer  

| Param | Type | Description |
| --- | --- | --- |
| ivls | <code>Array</code> &#124; <code>String</code> | the list of pitches |

**Example**  
```js
import { harmonizer } from 'tonal-arrays'
var maj7 = harmonizer('P1 M3 P5 M7')
maj7('C') // => ['C', 'E', 'G', 'B']
var C = harmonizer('C D E')
C('M3') // => ['E', 'G#', 'B']
```
<a name="harmonize"></a>

## harmonize(ivl, note) ⇒ <code>Array</code>
Harmonizes a note with an array of intervals. It's a layer of sintatic
sugar over `harmonizer`.

**Kind**: global function  
**Returns**: <code>Array</code> - the resulting notes  

| Param | Type | Description |
| --- | --- | --- |
| ivl | <code>String</code> &#124; <code>Array</code> | the array of intervals |
| note | <code>String</code> &#124; <code>Pitch</code> | the note to be harmonized |

**Example**  
```js
var tonal = require('tonal')
tonal.harmonise('P1 M3 P5 M7', 'C') // => ['C', 'E', 'G', 'B']
```
<a name="sort"></a>

## sort(comp, arr)
Sort an array or notes or intervals. It uses the JavaScript standard sort
function.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| comp | <code>Boolean</code> &#124; <code>function</code> | the comparator. `true` means use an ascending comparator, `false` a descending comparator, or you can pass a custom comparator (that receives pitches in array notation) |
| arr | <code>Array</code> &#124; <code>String</code> | the array of notes or intervals |

**Example**  
```js
import { sort } from 'tonal-arrays'
sort(true, 'D E C') // => ['C', 'D', 'E']
```
**Example**  
```js
var tonal = require('tonal')
tonal.sort(false, 'D E C') // => ['E', 'D', 'C']
```
<a name="shuffle"></a>

## shuffle(arr) ⇒ <code>Array</code>
Randomizes the order of the specified array using the Fisher–Yates shuffle.

**Kind**: global function  
**Returns**: <code>Array</code> - the shuffled array  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> &#124; <code>String</code> | the array |

**Example**  
```js
import { shuffle } from 'tonal-arrays'
```
**Example**  
```js
var tonal = require('tonal')
tonal.shuffle('C D E F')
```
<a name="rotate"></a>

## rotate(times, list) ⇒ <code>Array</code>
Rotates a list a number of times. It's completly agnostic about the
contents of the list.

**Kind**: global function  
**Returns**: <code>Array</code> - the rotated array  

| Param | Type | Description |
| --- | --- | --- |
| times | <code>Integer</code> | the number of rotations |
| list | <code>Array</code> &#124; <code>String</code> | the list to be rotated |

<a name="rotateAsc"></a>

## rotateAsc(times, list) ⇒ <code>Array</code>
Rotates an ascending list of pitches n times keeping the ascending property.
This functions assumes the list is an ascending list of pitches, and
transposes the them to ensure they are ascending after rotation.
It can be used, for example, to invert chords.

**Kind**: global function  
**Returns**: <code>Array</code> - the rotated array  

| Param | Type | Description |
| --- | --- | --- |
| times | <code>Integer</code> | the number of rotations |
| list | <code>Array</code> &#124; <code>String</code> | the list to be rotated |

<a name="select"></a>

## select(numbers, list) ⇒ <code>Array</code>
Select elements from a list.

**Kind**: global function  
**Returns**: <code>Array</code> - the selected elements (with nulls if not valid index)  

| Param | Type | Description |
| --- | --- | --- |
| numbers | <code>String</code> &#124; <code>Array</code> | a __1-based__ index of the elements |
| list | <code>String</code> &#124; <code>Array</code> | the list of pitches |

**Example**  
```js
import { select } from 'tonal-array'
select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
select('-1 0 1 2 3', 'C D') // => [ null, null, 'C', 'D', null ]
```
<a name="listFn"></a>

## listFn(fn) ⇒ <code>function</code>
Decorates a function to so it's first parameter is an array of pitches in
array notation. Also, if the return value is a pitch or an array of pitches
in array notation, it convert backs to strings.

**Kind**: global function  
**Returns**: <code>function</code> - the decorated function  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | the function to decorate |

**Example**  
```js
import { listFn } from 'tonal-arrays'
var octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
```
