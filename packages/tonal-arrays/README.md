# tonal-arrays [![npm version](https://img.shields.io/npm/v/tonal-arrays.svg)](https://www.npmjs.com/package/tonal-arrays)

[![tonal](https://img.shields.io/badge/tonal-arrays-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)

`tonal-arrays` is a module to create and manipulate collection of musical notes or intervals.

This is part of [tonal](https://www.npmjs.com/package/tonal):

You can install via npm: `npm i --save tonal-arrays`

## API Reference

<a name="asArr"></a>

##### asArr(source) ⇒ <code>Array</code>
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

##### map(fn, arr) ⇒ <code>Array</code>
Map an array with a function. Basically the same as the JavaScript standard
`array.map` but with two enhacements:
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
<a name="filter"></a>

##### filter(fn, arr) ⇒ <code>Array</code>
Filter an array with a function. Again, almost the same as JavaScript standard
filter function but:
- It accepts strings as arrays
- Can be partially applied

**Kind**: global function  

| Param | Type |
| --- | --- |
| fn | <code>function</code> |
| arr | <code>String</code> &#124; <code>Array</code> |

<a name="listFn"></a>

##### listFn(fn) ⇒ <code>function</code>
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
const octUp = listFn((p) => { p[2] = p[2] + 1; return p[2] })
octUp('C2 D2 E2') // => ['C3', 'D3', 'E3']
```
<a name="harmonizer"></a>

##### harmonizer(ivls) ⇒ <code>function</code>
Given an array of intervals, create a function that harmonizes a
note with this intervals.

**Kind**: global function  
**Returns**: <code>function</code> - The harmonizer  

| Param | Type | Description |
| --- | --- | --- |
| ivls | <code>Array</code> &#124; <code>String</code> | the array of intervals |

**Example**  
```js
import { harmonizer } from 'tonal-arrays'
var maj7 = harmonizer('P1 M3 P5 M7')
maj7('C') // => ['C', 'E', 'G', 'B']
```
<a name="harmonize"></a>

##### harmonize(ivl, note) ⇒ <code>Array</code>
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

##### sort(comp, arr)
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

##### shuffle(arr) ⇒ <code>Array</code>
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
