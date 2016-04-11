# chord

Create chords by chord name or chord intervals. The returned chord is an
array of notes or intervals (depending if you specified root or not).

This function is currified

**Parameters**

-   `source` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the chord type, intervals or notes
-   `tonic` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the chord tonic (or false to get intervals)

**Examples**

```javascript
var chord = require('music-chord')
// get chord notes using type and tonic
chord('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
// get chord intervals (tonic false)
chord('maj7', false) // => ['1P', '3M', '5P', '7M']
// partially applied
var maj7 = chord('maj7')
maj7('C') // => ['C', 'E', 'G', 'B']
// create chord from intervals
chord('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
// part of tonal
tonal.chord('m7', 'C') // => ['C', 'Eb', 'G', 'Bb']
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the chord notes

## get

Get chord notes from chord name

**Parameters**

-   `name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the chord name

**Examples**

```javascript
chord.get('C7') // => ['C', 'E', 'G', 'Bb']
// part of tonal
tonal.chord.get('C7')
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the chord notes

## names

Return the available chord names

**Parameters**

-   `aliases` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true to include aliases

**Examples**

```javascript
tonal.chord.names() // => ['maj7', ...]
```
