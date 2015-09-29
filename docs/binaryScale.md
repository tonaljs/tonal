# Binary scale module

A binary scale is a 12 digit binary number where the first number is a `1`, and it's used to represent scales (or, in fact, any pitch class set). It's a handy representation to compare scales (and see if they are different spellings of the same scale, for example) or get scale properties like the biggest distance between scale degrees:

```js
var binaryScale = require('tonal/binaryScale')
// compare two scales
binaryScale.fromCollection('C D E G') === binaryScale.fromCollection('C D Fb Abb') // true
// get the biggest distance between scale degrees
binaryScale.props(binaryScale.fromCollection('C D E F G A B')).leap // => 2
```

The first time I've read about it was in the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by Rich Cochrane, chapter 18.

The following explanation is extracted from the book. (The book has a Creative Commons Usage Attribution-Noncommercial-No Derivative Works 3.0... thanks a lot Rich!)

> The major scale is `1 0 1 0 1 1 0 1 0 1 0 1`. This number (2773 in decimal) uniquely represents the Major scale. The method of representation is simple: each position, reading left to right, represents a note: 1, b2, 2 and so on. A `1` in that position means the note is included in the scale and a `0` means it is not included. So we have:

```
1   0   1   0   1   1    0   1   0   1   0   1
1  b2   2  b3   3   4   b5   5  b6   6  b7   7
```

### Filter scales

The first valid binary scale is `'100000000000'` (2048) and the last one is
`'111111111111'` (4095) so the total number of binary scales is 2048.

The way to get them all is with the function [`binary-scale/filter`](#binaryscalefilter).

If we define valid scales like [this](http://2012books.lardbucket.org/books/music-theory/s08-01-scales-and-scale-steps.html):

> five or more pitches arranged in sequential patterns of whole steps and half steps

we can get the all the valid scales binary numbers like this:

```js
binaryScale.filter(function (binary) {
  var props = binaryScale.props(binary)
  return props.length > 4 && props.leap < 2
}
```

## Function list

- [filter](#binaryscalefilter) -  Return all possible set binary set numbers
- [fromCollection](#binaryscalefromcollection) -  Get the binary set number of a collection of pitches or intervals
- [fromNumber](#binaryscalefromnumber) -  Get a binary scale (a 12 digit binary number) from a number.
- [intervals](#binaryscaleintervals) -  Get a intervals collection from a binary scale number
- [isValid](#binaryscaleisvalid) -  Check if a number is a valid binary scale
- [modes](#binaryscalemodes) -  Get the all the modes of a binary scale.
- [props](#binaryscaleprops) -  Get the properties of a binary scale.



## API

----
###### [binaryScale/filter](#binaryscale-module)



#### filter(filter) → {Array}



Return all possible set binary set numbers

__Arguments:__

Name|Type|Description
---|---|---
`filter`|Function|(Optional) a filter function


__Returns:__

Type|Description
---|---
Array|an array of binary numbers. 2048 if no filter


__Example:__

```js
binarySets() // => ['1000000000', '1000000001', ...]
```

Source: [binaryScale/filter.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/filter.js)
Test: [binaryScale/filterTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/filterTest.js)

----
###### [binaryScale/fromCollection](#binaryscale-module)



#### fromCollection(collection) → {String}



Get the binary set number of a collection of pitches or intervals

__Arguments:__

Name|Type|Description
---|---|---
`collection`|Array,String|a collection of pitches or intervals


__Returns:__

Type|Description
---|---
String|a binary number


__Example:__

```js
toBinary('C D') // => '101000000000'
toBinary('C4 D8') // => '101000000000'
toBinary('1P 2M') // => '101000000000'
toBinary('1P 9M') // => '101000000000'
toBinary('1P 7M') // => '100000000001'
```

Source: [binaryScale/fromCollection.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/fromCollection.js)
Test: [binaryScale/fromCollectionTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/fromCollectionTest.js)

----
###### [binaryScale/fromNumber](#binaryscale-module)



#### fromNumber(number) → {String}



Get a binary scale (a 12 digit binary number) from a number.

__Arguments:__

Name|Type|Description
---|---|---
`number`|String,Integer|the binary scale number


__Returns:__

Type|Description
---|---
String|a binary scale (12 digit binary number)


__Example:__

```js
fromNumber(0) // => '10000000000'
fromNumber(2773) // => '101011010101' (major scale)
```

Source: [binaryScale/fromNumber.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/fromNumber.js)
Test: [binaryScale/fromNumberTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/fromNumberTest.js)

----
###### [binaryScale/intervals](#binaryscale-module)



#### intervals(binary) → {Array}



Get a intervals collection from a binary scale number

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String|a binary scale number


__Returns:__

Type|Description
---|---
Array|An array of intervals


__Example:__

```js
intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']
```

Source: [binaryScale/intervals.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/intervals.js)
Test: [binaryScale/intervalsTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/intervalsTest.js)

----
###### [binaryScale/isValid](#binaryscale-module)



#### isValid() → {}



Check if a number is a valid binary scale

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__


Source: [binaryScale/isValid.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/isValid.js)
Test: [binaryScale/isValidTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/isValidTest.js)

----
###### [binaryScale/modes](#binaryscale-module)



#### modes(binary) → {Array}



Get the all the modes of a binary scale.

The modes are always ordered by number of steps so the first mode will be
always the cannonical mode (the mode that has the greatest possible number
of its larger steps at the beginning)

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String|the binary number


__Returns:__

Type|Description
---|---
Array|an array of binary scales ordered by steps length


__Example:__

```js
// Exactly same result for two modes
modes('101011010101') // => [ '101010110101', '101011010101', '101011010110', ...]
modes('101010110101') // => [ '101010110101', '101011010101', '101011010110', ...]
```

Source: [binaryScale/modes.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/modes.js)
Test: [binaryScale/modesTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/modesTest.js)

----
###### [binaryScale/props](#binaryscale-module)



#### props(binary) → {Array}



Get the properties of a binary scale.

The returned object has the following attributes:
- binary: a binary scale number
- decimal: decimal equivalent to the binary representation
- length: the number of notes of this scale
- steps: an array with the distance in semitones between the notes of the scale
- leap: the maximum distance between notes of the scale

__Arguments:__

Name|Type|Description
---|---|---
`binary`|String|the binary scale number


__Returns:__

Type|Description
---|---
Array|an array with the distances


__Example:__

```js
props('101011010101').decimal // => 2773 (major scale)
props('101011010101').length // => 7
props('101011010101').distances // => [ 2, 2, 1, 2, 2, 2, 1 ]
props('101011010101').leap // => 7
```

Source: [binaryScale/props.js](https://github.com/danigb/tonal/tree/master//lib/binaryScale/props.js)
Test: [binaryScale/propsTest.js](https://github.com/danigb/tonal/tree/master//test/binaryScale/propsTest.js)

