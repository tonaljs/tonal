# Key module

At this moment, this module is a work in progress. 

## Function list

- [accidentals](#keyaccidentals) -  Given a key (number) returns the accidentals
- [alteredNotes](#keyalterednotes) -  Given a key, return the altered pitches
- [fromPitchSet](#keyfrompitchset) -  Given a pitch set, return its key
- [keyNumber](#keykeynumber) -  Get the key number (the number of sharps or flats) of a key
- [parse](#keyparse) -  Get the components of a key name
- [pitchSet](#keypitchset) -  Get the pitch class set from a key.
- [triads](#keytriads) -  Get the triads of



## API

----
###### [key/accidentals](#key-module)



#### accidentals() → {}



Given a key (number) returns the accidentals

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
accidentals('G major') // => '#'
accidentals('Eb minor') // => 'bbbbbb'
accidentals(3) // => '###'
accidentals(-2) // => 'bb'
```

Source: [key/accidentals.js](https://github.com/danigb/tonal/tree/master//lib/key/accidentals.js)
Test: [key/accidentalsTest.js](https://github.com/danigb/tonal/tree/master//test/key/accidentalsTest.js)

----
###### [key/alteredNotes](#key-module)



#### alteredNotes() → {}



Given a key, return the altered pitches

TODO: implementation

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
alteredNotes('D major') // => ['F#', 'C#']
alteredNotes(3) // => ['F#', 'C#', 'G#']
alteredNotes('bb') // => ['Bb', 'Eb']
```

Source: [key/alteredNotes.js](https://github.com/danigb/tonal/tree/master//lib/key/alteredNotes.js)
Test: [key/alteredNotesTest.js](https://github.com/danigb/tonal/tree/master//test/key/alteredNotesTest.js)

----
###### [key/fromPitchSet](#key-module)



#### fromPitchSet() → {}



Given a pitch set, return its key

TODO: implementation

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
fromPitchSet('C Bb F') // => -1
```

Source: [key/fromPitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/fromPitchSet.js)
Test: [key/fromPitchSetTest.js](https://github.com/danigb/tonal/tree/master//test/key/fromPitchSetTest.js)

----
###### [key/keyNumber](#key-module)



#### keyNumber(key) → {Integer}



Get the key number (the number of sharps or flats) of a key

The name can be a pitch class (and major key is supposed), a pitch class with
a 'major' or 'minor' appended, or a string with the accidentals

__Arguments:__

Name|Type|Description
---|---|---
`key`|String|the key (name, pitch or accidentals)


__Returns:__

Type|Description
---|---
Integer|the key number (alteration number)


__Example:__

```js
keyNumber('G major') // => 1
keyNumber('F major') // => -1
keyNumber('C') // => 0
keyNumber('Eb minor') // => -6
keyNumber('##') // => 2
keyNumber('bbb') // => -3
```

Source: [key/keyNumber.js](https://github.com/danigb/tonal/tree/master//lib/key/keyNumber.js)
Test: [key/keyNumberTest.js](https://github.com/danigb/tonal/tree/master//test/key/keyNumberTest.js)

----
###### [key/parse](#key-module)



#### parse() → {}



Get the components of a key name

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---


__Example:__

```js
parse('C minor') // => { tonic: 'C', type: 'minor'}
parse('C#') // => { tonic: 'C#', type: 'major'}
```

Source: [key/parse.js](https://github.com/danigb/tonal/tree/master//lib/key/parse.js)
Test: [key/parseTest.js](https://github.com/danigb/tonal/tree/master//test/key/parseTest.js)

----
###### [key/pitchSet](#key-module)



#### pitchSet(key) → {Array}



Get the pitch class set from a key.

__Arguments:__

Name|Type|Description
---|---|---
`key`|String|the key name


__Returns:__

Type|Description
---|---
Array|a pitch class set


__Example:__

```js
pitchSet('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
pitchSet('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

Source: [key/pitchSet.js](https://github.com/danigb/tonal/tree/master//lib/key/pitchSet.js)
Test: [key/pitchSetTest.js](https://github.com/danigb/tonal/tree/master//test/key/pitchSetTest.js)

----
###### [key/triads](#key-module)



#### triads(key) → {Array}



Get the triads of

__Arguments:__

Name|Type|Description
---|---|---
`key`|String|the key name


__Returns:__

Type|Description
---|---
Array|a pitch class set


__Example:__

```js
triads('g major') // => ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
triads('Eb minor') // => ['Eb', 'F', 'Gb', 'Ab', 'Bb', 'Cb', 'Db']
```

Source: [key/triads.js](https://github.com/danigb/tonal/tree/master//lib/key/triads.js)
Test: [key/triadsTest.js](https://github.com/danigb/tonal/tree/master//test/key/triadsTest.js)

