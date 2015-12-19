## `set`

Create a set: a set is a list of uniq pitch classes or simplified intervals
in ascending pitch order

This is an alias of `gamut.set`

### Parameters

* `notes` **`String or Array`** the note list


### Examples

```js
var set = require('music.set/set')
set('E7 C2 e D5 c1') // => ['C', 'D', 'E']
set('11 10 9') // => [ '2M', '3M', '4P' ]
```

Returns  the set


## `set.binary`

Get a set binary number

A set binary number is a 12 digit binary, each digit representing a step
in the chromatic scale. For example, `101010000000` is `['1P', '2M', '3M']`

The set binary number is very useful to check if two sets are equal or
contains same intervals (regarding of note names)

### Parameters

* `source` **`String or Array or Array<Array>`** a gamut


### Examples

```js
var binary = require('tonal.set/binary')
binary('C2 E4 D3') // => '101010000000'
```

Returns `String` the binary number


## `set.fromBinary`

Get a set from a binary set number and (optionally) a tonic. If the tonic is
a note, you get a pitch set. If its false you get a interval set.

### Parameters

* `source` **`String or Array or Array<Array>`** the gamut
* `tonic` **`String`** the first note of the set or false to get the intervals


### Examples

```js
var fromBinary = require('tonal.set/fromBinary')
// use a 12 digit binary number:
fromBinary('101011010101', 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// or its decimal equivalent:
fromBinary(2773, 'C') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// get the interval set by passing `false` as tonic:
fromBinary(2773, false) // => ['1P', '2M', '3M', '4', '5', '6M', '7M']
```

Returns  the set pitch classes (note names without octaves)


