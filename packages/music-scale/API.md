# scale

Create a scale from a name or intervals and tonic

**Parameters**

-   `source` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the scale name, scale intervals or scale notes
-   `tonic` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the tonic of the scale

**Examples**

```javascript
var scale = require('music-scale')
// get scale from type and tonic
scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
// get scale from intervals and tonic
scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
// partially applied
var major = scale('major')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
// part of tonal
tonal.scale('major', 'A')
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the list of notes

## get

Get scale notes by scale name

**Parameters**

-   `name` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the complete scale name (with tonic)

**Examples**

```javascript
// get scale from name
scale.get('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
// part of tonal
tonal.scale.get('C2 bebop')
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** scale notes

## names

Return the available scale names

**Parameters**

-   `aliases` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true to include aliases

**Examples**

```javascript
tonal.scale.names() // => ['maj7', ...]
```
