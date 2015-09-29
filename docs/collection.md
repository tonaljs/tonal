# Collection module

Functions to work with a collection of pitches or intervals.

### Resources

Dive into the world of pitch class sets:

- http://www.mta.ca/pc-set/pc-set_new/pages/introduction/toc.html
- http://composertools.com/Theory/PCSets/

## Collection function list

- [dictionary](#collectiondictionary) -  A dictionary is a function that, given a name, returns an array of intervals. And given a fileter function it returns all the names filtered by that function.
- [harmonize](#collectionharmonize) -  Create a collection of pitches by transposing a tonic by a collection of intervals
- [intervals](#collectionintervals) -  Get the intervals of a collection of pitches starting from a tonic
- [mode](#collectionmode) -  Get the mode of a collection of pitches.
- [modes](#collectionmodes) -  Return all modes of a collection of notes
- [pitchSet](#collectionpitchset) -  Create a set of pitch classes (ordered by frequency) from a collection
- [rotate](#collectionrotate) -  Rotate a collection
- [toArray](#collectiontoarray) -  Return an array (collection) of anything. If the source is an array, return it unaltered. If its an string, split it and anything else is wrapped to an array.
- [triad](#collectiontriad) -  Get a triad from a collection of notes, a simplistic implementation.



## API

----
###### [collection/dictionary](#collection-module)



#### dictionary(data, aliases) → {Function}



A dictionary is a function that, given a name, returns an array of intervals.
And given a fileter function it returns all the names filtered by that function.

The returned function has the following signature:
`fn({String|Function}) -> {Array<Intervals>}` (see examples)

__Arguments:__

Name|Type|Description
---|---|---
`data`|HashMap|the hashmap data
`aliases`|HashMap|(Optional) the aliases hashmap


__Returns:__

Type|Description
---|---
Function|a dictionary


__Example:__

```js
chords = dictionary({'Maj7': '1P 3M 5P 7M'}, {'M7': 'Maj7'})
chords('Maj7') // => ['1P', '3M', '5P', '7M']
chords('M7') // => ['1P', '3M', '5P', '7M']
chords(function(c) { return c[1] === '3M' }) // => ['Maj7']
```

Source: [collection/dictionary.js](https://github.com/danigb/tonal/tree/master/lib/collection/dictionary.js)
Test: [collection/dictionaryTest.js](https://github.com/danigb/tonal/tree/master/test/collection/dictionaryTest.js)

----
###### [collection/harmonize](#collection-module)



#### harmonize(tonic, intervals, pitchClassOnly) → {Array}



Create a collection of pitches by transposing a tonic by a collection of intervals

This is a shortcut to create and invoke an harmonizer

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|the tonic
`intervals`|String,Array|a collection of intervals
`pitchClassOnly`|boolean|if true, the returned pitches don't include octave information


__Returns:__

Type|Description
---|---
Array|a collection of pitches


__Example:__

```js
harmonize('C2', ['P1 P5']) // => ['C2', 'G2']
```

Source: [collection/harmonize.js](https://github.com/danigb/tonal/tree/master/lib/collection/harmonize.js)
Test: [collection/harmonizeTest.js](https://github.com/danigb/tonal/tree/master/test/collection/harmonizeTest.js)

----
###### [collection/intervals](#collection-module)



#### intervals(pitches) → {Array}



Get the intervals of a collection of pitches starting from a tonic

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array|the pitch collection


__Returns:__

Type|Description
---|---
Array|the intervals 
TODO: better implementation, tests


__Example:__

```js
intervals(['C', 'D', 'Eb']) // => ['1P', '2M', '3m']
intervals('Bb', ['C', 'D', 'Eb']) // => ['2M', '3M', '4P']
```

Source: [collection/intervals.js](https://github.com/danigb/tonal/tree/master/lib/collection/intervals.js)
Test: [collection/intervalsTest.js](https://github.com/danigb/tonal/tree/master/test/collection/intervalsTest.js)

----
###### [collection/mode](#collection-module)



#### mode(name, num) → {Array}



Get the mode of a collection of pitches.

__Arguments:__

Name|Type|Description
---|---|---
`name`|String|the scale name
`num`|Integer|the mode number (1-based index)


__Returns:__

Type|Description
---|---
Array|the set of the mode


__Example:__

```js
mode('C major', 2) // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
```

Source: [collection/mode.js](https://github.com/danigb/tonal/tree/master/lib/collection/mode.js)
Test: [collection/modeTest.js](https://github.com/danigb/tonal/tree/master/test/collection/modeTest.js)

----
###### [collection/modes](#collection-module)



#### modes(pitchSet) → {Array}



Return all modes of a collection of notes

__Arguments:__

Name|Type|Description
---|---|---
`pitchSet`|Array,String|the pitch set


__Returns:__

Type|Description
---|---
Array|an array of arrays with the set rotated set.length times


__Example:__

```js
modes('C D E') // => [[ 'C', 'D', 'E' ], [ 'D', 'E', 'C' ], [ 'E', 'C', 'D' ]]
```

Source: [collection/modes.js](https://github.com/danigb/tonal/tree/master/lib/collection/modes.js)
Test: [collection/modesTest.js](https://github.com/danigb/tonal/tree/master/test/collection/modesTest.js)

----
###### [collection/pitchSet](#collection-module)



#### pitchSet(pitches, first) → {Array}



Create a set of pitch classes (ordered by frequency) from a collection

The pitch classes are ordered by frequency starting from the first note
of the given collection

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|Array,String|the collection of pitches
`first`|String|(Optional) the first pitch class of the set (or the first pitch class of the collection if not given)


__Returns:__

Type|Description
---|---
Array|a pitch set


__Example:__

```js
pitchSet('D E G G A E') // => ['D', 'E', 'G', 'A']
pitchSet('D3 Db3 C3 D3') // => ['D', 'Db', 'C']
pitchSet('D3 Db3 C3 D3', 'C') // => ['C', 'Db', 'Db', 'C']
```

Source: [collection/pitchSet.js](https://github.com/danigb/tonal/tree/master/lib/collection/pitchSet.js)
Test: [collection/pitchSetTest.js](https://github.com/danigb/tonal/tree/master/test/collection/pitchSetTest.js)

----
###### [collection/rotate](#collection-module)



#### rotate(times, array) → {Array}



Rotate a collection

__Arguments:__

Name|Type|Description
---|---|---
`times`|Integer|
`array`|String,Array|the source (se toArray)


__Returns:__

Type|Description
---|---
Array|the rotated array


__Example:__

```js
rotate(1, 'A B C') // => ['B', 'C', 'A']
```

Source: [collection/rotate.js](https://github.com/danigb/tonal/tree/master/lib/collection/rotate.js)
Test: [collection/rotateTest.js](https://github.com/danigb/tonal/tree/master/test/collection/rotateTest.js)

----
###### [collection/toArray](#collection-module)



#### toArray(source) → {Array}



Return an array (collection) of anything. If the source is an array, return it
unaltered. If its an string, split it and anything else is wrapped to an array.

__Arguments:__

Name|Type|Description
---|---|---
`source`|Array,String,Object|the source


__Returns:__

Type|Description
---|---
Array|an array


__Example:__

```js
// a toArray is an array of events
toArray(['A', 'B', 'C']) // => ['A', 'B', 'C']
toArray('A B C') // => ['A', 'B', 'C']
toArray('A | b | C') // => ['A', 'B', 'C']
toArray('A , b , C') // => ['A', 'B', 'C']
toArray(2) // => [ 2 ]
```

Source: [collection/toArray.js](https://github.com/danigb/tonal/tree/master/lib/collection/toArray.js)
Test: [collection/toArrayTest.js](https://github.com/danigb/tonal/tree/master/test/collection/toArrayTest.js)

----
###### [collection/triad](#collection-module)



#### triad(set, len) → {}



Get a triad from a collection of notes, a simplistic implementation.

__Arguments:__

Name|Type|Description
---|---|---
`set`|String,Array|the pitch class set
`len`|Integer|the number of notes of the triad (3 by default)


__Returns:__

Type|Description
---|---


__Example:__

```js
triad(scale('C major')) // => ['C', 'E', 'G']
triad(scale('C major'), 5) // => ['C', 'E', 'G', 'B', 'D']
```

Source: [collection/triad.js](https://github.com/danigb/tonal/tree/master/lib/collection/triad.js)
Test: [collection/triadTest.js](https://github.com/danigb/tonal/tree/master/test/collection/triadTest.js)

