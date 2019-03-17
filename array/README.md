<a name="module_Array"></a>

# Array
Tonal array utilities. Sort notes by pitch, remove duplicates,
create ranges with notes or numbers.

## Usage

**Example**  
```js
import Array from 'tonal/array';
Array.sort(["f", "a", "c"])
```
**Example**  
```js
const Tonal = require("tonal")
Tonal.Array.range(1, 4)

## API
```

* [Array](#module_Array)
    * [`.range(from, to)`](#module_Array.range) ⇒ <code>Array.&lt;number&gt;</code>
    * [`.rotate(times, array)`](#module_Array.rotate) ⇒ <code>Array</code>
    * [`.compact(array)`](#module_Array.compact) ⇒ <code>Array</code>
    * [`.sort(notes)`](#module_Array.sort) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.sortedUniq(array)`](#module_Array.sortedUniq) ⇒ <code>Array.&lt;string&gt;</code>
    * [`.shuffle(array)`](#module_Array.shuffle) ⇒ <code>Array</code>
    * [`.permutations(array)`](#module_Array.permutations) ⇒ <code>Array.&lt;Array&gt;</code>

<a name="module_Array.range"></a>

## `Array.range(from, to)` ⇒ <code>Array.&lt;number&gt;</code>
Create a numeric range

**Kind**: static method of [<code>Array</code>](#module_Array)  

| Param | Type |
| --- | --- |
| from | <code>number</code> | 
| to | <code>number</code> | 

**Example**  
```js
Array.range(-2, 2) // => [-2, -1, 0, 1, 2]
Array.range(2, -2) // => [2, 1, 0, -1, -2]
```
<a name="module_Array.rotate"></a>

## `Array.rotate(times, array)` ⇒ <code>Array</code>
Rotates a list a number of times. It"s completly agnostic about the
contents of the list.

**Kind**: static method of [<code>Array</code>](#module_Array)  
**Returns**: <code>Array</code> - the rotated array  

| Param | Type | Description |
| --- | --- | --- |
| times | <code>Integer</code> | the number of rotations |
| array | <code>Array</code> |  |

**Example**  
```js
Array.rotate(1, [1, 2, 3]) // => [2, 3, 1]
```
<a name="module_Array.compact"></a>

## `Array.compact(array)` ⇒ <code>Array</code>
Return a copy of the array with the null values removed

**Kind**: static method of [<code>Array</code>](#module_Array)  

| Param | Type |
| --- | --- |
| array | <code>Array</code> | 

**Example**  
```js
Array.compact(["a", "b", null, "c"]) // => ["a", "b", "c"]
```
<a name="module_Array.sort"></a>

## `Array.sort(notes)` ⇒ <code>Array.&lt;string&gt;</code>
Sort an array of notes in ascending order. Pitch classes are listed
before notes. Any string that is not a note is removed.

**Kind**: static method of [<code>Array</code>](#module_Array)  
**Returns**: <code>Array.&lt;string&gt;</code> - sorted array of notes  

| Param | Type |
| --- | --- |
| notes | <code>Array.&lt;string&gt;</code> | 

**Example**  
```js
Array.sort(['c2', 'c5', 'c1', 'c0', 'c6', 'c'])
// => ['C', 'C0', 'C1', 'C2', 'C5', 'C6']
Array.sort(['c', 'F', 'G', 'a', 'b', 'h', 'J'])
// => ['C', 'F', 'G', 'A', 'B']
```
<a name="module_Array.sortedUniq"></a>

## `Array.sortedUniq(array)` ⇒ <code>Array.&lt;string&gt;</code>
Get sorted notes with duplicates removed. Pitch classes are listed
before notes.

**Kind**: static method of [<code>Array</code>](#module_Array)  
**Returns**: <code>Array.&lt;string&gt;</code> - unique sorted notes  

| Param | Type |
| --- | --- |
| array | <code>Array.&lt;string&gt;</code> | 

**Example**  
```js
Array.sortedUniq(['a', 'b', 'c2', '1p', 'p2', 'c2', 'b', 'c', 'c3' ])
// => [ 'C', 'A', 'B', 'C2', 'C3' ]
```
<a name="module_Array.shuffle"></a>

## `Array.shuffle(array)` ⇒ <code>Array</code>
Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.

**Kind**: static method of [<code>Array</code>](#module_Array)  
**Returns**: <code>Array</code> - the array shuffled  

| Param | Type |
| --- | --- |
| array | <code>Array</code> | 

**Example**  
```js
Array.shuffle(["C", "D", "E", "F"]) // => [...]
```
<a name="module_Array.permutations"></a>

## `Array.permutations(array)` ⇒ <code>Array.&lt;Array&gt;</code>
Get all permutations of an array
http://stackoverflow.com/questions/9960908/permutations-in-javascript

**Kind**: static method of [<code>Array</code>](#module_Array)  
**Returns**: <code>Array.&lt;Array&gt;</code> - an array with all the permutations  

| Param | Type | Description |
| --- | --- | --- |
| array | <code>Array</code> | the array |

**Example**  
```js
Array.permutations(["a", "b", "c"])) // =>
[
  ["a", "b", "c"],
  ["b", "a", "c"],
  ["b", "c", "a"],
  ["a", "c", "b"],
  ["c", "a", "b"],
  ["c", "b", "a"]
]
```
