# Chord module

Create chords by name and detect a chord by its pitches.

It uses a big .json dataset to get the chord intervals from the name.

## Chord function list

- [chord](#chordchord) -  Get a chord from a chord name. The chord is an array of pitches or intervals depending if a tonic is given or not.
- [extensions](#chordextensions) -  Given a chord type, get its extensions (same chord with more notes)
- [find](#chordfind) -  Get the chord name(s) of a collection of pitches
- [names](#chordnames) -  Get all known chord names
- [scaleNames](#chordscalenames) -  Given a chord type return its scale names
- [voicings](#chordvoicings) -  Get a voice (array of intervals) or a list of voicings for a given chord type



## API

----
###### [chord/chord](#chord-module)



#### chord(tonic, name) → {Array}



Get a chord from a chord name. The chord is an array of pitches or intervals
depending if a tonic is given or not.

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|(Optional) the tonic pitch
`name`|String|the chord name (may include the tonic)


__Returns:__

Type|Description
---|---
Array|an array of intervals or notes (if the tonic is provided)


__Example:__

```js
chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
chord('C', 'Maj7') // => ['C4', 'E4', 'G4', 'B4']
chord('7b5') // => ['1P', '3M', '5d', '7m']
chord(null, '7b5') // => ['1P', '3M', '5d', '7m']
```

Source: [chord/chord.js](https://github.com/danigb/tonal/tree/master/lib/chord/chord.js)
Test: [chord/chordTest.js](https://github.com/danigb/tonal/tree/master/test/chord/chordTest.js)

----
###### [chord/extensions](#chord-module)



#### extensions(type) → {Array}



Given a chord type, get its extensions (same chord with more notes)

__Arguments:__

Name|Type|Description
---|---|---
`type`|String|the chord type


__Returns:__

Type|Description
---|---
Array|an array with all the chord types that extends the given ones


__Example:__

```js
extensions('Maj7') // => ['M13', 'M13#11', 'M7#11', ...]
```

Source: [chord/extensions.js](https://github.com/danigb/tonal/tree/master/lib/chord/extensions.js)
Test: [chord/extensionsTest.js](https://github.com/danigb/tonal/tree/master/test/chord/extensionsTest.js)

----
###### [chord/find](#chord-module)



#### find(pitches) → {Array}



Get the chord name(s) of a collection of pitches

__Arguments:__

Name|Type|Description
---|---|---
`pitches`|String,Array|the pitch collection


__Returns:__

Type|Description
---|---
Array|an array of the chord names that has that pitches


__Example:__

```js
find('G2 E3 C4') // => ['CM/G', 'Em#5/G']
```

Source: [chord/find.js](https://github.com/danigb/tonal/tree/master/lib/chord/find.js)
Test: [chord/findTest.js](https://github.com/danigb/tonal/tree/master/test/chord/findTest.js)

----
###### [chord/names](#chord-module)



#### names() → {Array}



Get all known chord names

__Arguments:__

Name|Type|Description
---|---|---


__Returns:__

Type|Description
---|---
Array|array with all the known names


__Example:__

```js
names() => ['major', 'minor', ....]
```

Source: [chord/names.js](https://github.com/danigb/tonal/tree/master/lib/chord/names.js)
Test: [chord/namesTest.js](https://github.com/danigb/tonal/tree/master/test/chord/namesTest.js)

----
###### [chord/scaleNames](#chord-module)



#### scaleNames(tonic, chord) → {Array}



Given a chord type return its scale names

__Arguments:__

Name|Type|Description
---|---|---
`tonic`|String|(Optional) the chord tonic
`chord`|String|the chord name


__Returns:__

Type|Description
---|---
Array|an array of scale names or an empty array if no scale names found


__Example:__

```js
scaleNames('D', 'M7b5') // => ['D4 lydian', 'Ab4 locrian pentatonic' ]
scaleNames('DM7b5') // => ['D4 lydian', 'Ab4 locrian pentatonic']
scaleNames('M7b5') // => ['P1 lydian', '5d locrian pentatonic']
scaleNames('Bbmaj7') // => ['Bb4 major', 'Bb4 lydian', 'F5 major pentatonic', 'D5 bebop minor', ...]
```

Source: [chord/scaleNames.js](https://github.com/danigb/tonal/tree/master/lib/chord/scaleNames.js)
Test: [chord/scaleNamesTest.js](https://github.com/danigb/tonal/tree/master/test/chord/scaleNamesTest.js)

----
###### [chord/voicings](#chord-module)



#### voicings(chordType, voiceName) → {Array}



Get a voice (array of intervals) or a list of voicings for a given chord type

__Arguments:__

Name|Type|Description
---|---|---
`chordType`|String|the type of the chord
`voiceName`|String|(Optional) the voice name


__Returns:__

Type|Description
---|---
Array|an array of intervals (if voiceName is provided and it's a valid voice) or an array of strings with voice names (if voiceName is not given)


__Example:__

```js
voicings('Maj7') // => ['left-hand-A', 'left-hand-B',..]
voicings('Maj7', 'left-hand-A') // => ['3M', '5P', '7M']
```

Source: [chord/voicings.js](https://github.com/danigb/tonal/tree/master/lib/chord/voicings.js)
Test: [chord/voicingsTest.js](https://github.com/danigb/tonal/tree/master/test/chord/voicingsTest.js)

