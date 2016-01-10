## `gamut`

A gamut is a collection of intervals, pitch classes or notes.
Scales, chords, pitch sets are examples of gamuts.

With this function you can manipulate music gamuts in array notation.

### Parameters

* `operation` **`String or Function`** the operation to perfom
* `source` **`String or Array`** a list of elements


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


## `gamut.parse`

Given a gamut get its notes or intervals in [array notation]()

### Parameters

* `source` **`Array or String`** the notes or intervals


### Examples

```js
var gamut = require('music-gamut')
gamut.parse('C D E') // => [ [0], [2], [4] ]
```

Returns `Array` the notes or intervals in array notation


## `gamut.rotate`

Rotate the gamut

### Parameters

* `count` **`Integer`** the number of rotations
* `gamut` **`String or Array`** a list of notes or intervals


### Examples

```js
var rotate = require('music.kit/gamut/rotate')
rotate(1, 'C D E') // => ['D', 'E', 'C']
```

Returns `Array` the gamut rotated count times


## `gamut.select`

Select some elements from a gamut

### Parameters

* `numbers` **`String or Array`** a __1-based__ index of the elements
* `gamut` **`String or Array`** the notes or intervals


### Examples

```js
var gamut = require('tonal.gamut')
gamut.select('1 3 5', 'C D E F G A B') // => ['C', 'E', 'G']
```

Returns `Array` the selected elements


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
var G = require('music-gamut')
G.split('a | B C , Dmaj7') // => ['a', 'B', 'C', 'Dmaj7']
G.split() // => []
```

Returns `Array` the source as array


