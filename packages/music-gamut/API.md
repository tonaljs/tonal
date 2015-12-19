## `gamut`

A gamut is a collection of intervals, pitch classes or notes.
Scales, chords, pitch sets are examples of gamuts.

### Parameters

* `source` **`String or Array`** a list of elements
* `operation` **`String or Function`** the operation to perfom


### Examples

```js
var gamut = require('music-gamut')
gamut('c2 bb fx blah') // => ['C2', 'Bb', 'F##', null]
```

Returns `Array` a list of pitches


## `gamut.operation`

Decorate a function to work with gamuts.

The function to decorate receives an array of pitches in
[array notation]()  and should return the desired transformed array.

### Parameters

* `fn` **`Function`** the function to decorate



Returns `Function` the decorated function


## `gamut.split`

Convert a source to an array. If the source is an array, return it.

Aside from an array itself, the source can be a
string with elements separated by spaces, commas or bars (`|`) or a single
element that will be wrapped inside an array

This function __does not perform any transformation__ of the array elements.
and __it always return an array, even if its empty__.

### Parameters

* `source` **`String or Array`** the source


### Examples

```js
split = require('music.kit/gamut.split')
split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
split() // => []
```

Returns `Array` the source as array


## `harmonizer`

Create an harmonizer






