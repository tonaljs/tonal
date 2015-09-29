# Fifths module

Fifths plays an important role in western music. This module contains functions to work with line and cycle of fiths, calculate distance in fifths, transpose by fifths and order pitches by fifths distances.

```js
var distance = require('tonal/fifths/distance')
distance('F', 'C') // => -1
```

### Resources

- The line of fifths by David Temperley: http://www.theory.esm.rochester.edu/temperley/papers/temperley-ma00.pdf

## Fifths function list

- [byFifths](#fifthsbyfifths) -  Get a comparator function to sort a collection of pitch classes by fifths
- [fifths](#fifthsfifths) -  Return the number of fifths between two pitch classes.
- [fifthsFrom](#fifthsfifthsfrom) -  Create a function to get fifths distance from a given note.
- [transpose](#fifthstranspose) -  Transpose a pitch class by a number of fifths



## API

----
###### [fifths/byFifths](#fifths-module)



#### byFifths(from) → {Function}



Get a comparator function to sort a collection of pitch classes by fifths

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|(Optional) the base pitch


__Returns:__

Type|Description
---|---
Function|a comparator function


__Example:__

```js
['C#', 'G#', 'F#'].sort(byFifths()) // => ['F#', 'C#', 'D#']
```

Source: [fifths/byFifths.js](https://github.com/danigb/tonal/tree/master/lib/fifths/byFifths.js)
Test: [fifths/byFifthsTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/byFifthsTest.js)

----
###### [fifths/fifths](#fifths-module)



#### fifths(pitch, from) → {Integer}



Return the number of fifths between two pitch classes.

__Arguments:__

Name|Type|Description
---|---|---
`pitch`|String|the pitch to calc the fifths distance to
`from`|String|(Optional) the pitch to calc the fifths distance from (C if not specified)


__Returns:__

Type|Description
---|---
Integer|the number fifths between the two pitches


__Example:__

```js
fifths('C') // => 0
fifths('G') // => 1
fifths('D') // => 2
fifths('F') // => -1
fifths('Bb') // => -2
fifths('A', 'D') // => 1
fifths('C4', 'C2') // => 0
```

Source: [fifths/fifths.js](https://github.com/danigb/tonal/tree/master/lib/fifths/fifths.js)
Test: [fifths/fifthsTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/fifthsTest.js)

----
###### [fifths/fifthsFrom](#fifths-module)



#### fifthsFrom(from) → {function}



Create a function to get fifths distance from a given note.

__Arguments:__

Name|Type|Description
---|---|---
`from`|String|the from note of the fifths distance


__Returns:__

Type|Description
---|---
function|the functtion to calculate distances


__Example:__

```js
['A', 'B', 'C'].map(fifthsFrom('G'))
```

Source: [fifths/fifthsFrom.js](https://github.com/danigb/tonal/tree/master/lib/fifths/fifthsFrom.js)
Test: [fifths/fifthsFromTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/fifthsFromTest.js)

----
###### [fifths/transpose](#fifths-module)



#### transpose(pitchClass, number) → {String}



Transpose a pitch class by a number of fifths

__Arguments:__

Name|Type|Description
---|---|---
`pitchClass`|String|the pitch class to be transposed
`number`|Integer|the number of fifths (can be negative)


__Returns:__

Type|Description
---|---
String|the transposed pitch class


__Example:__

```js
transpose('C', 2) // => 'D'
transpose('C5', -2) // => 'Bb'
```

Source: [fifths/transpose.js](https://github.com/danigb/tonal/tree/master/lib/fifths/transpose.js)
Test: [fifths/transposeTest.js](https://github.com/danigb/tonal/tree/master/test/fifths/transposeTest.js)

