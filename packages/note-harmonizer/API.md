# harmonize

Harmonize a note using a collection of intervals or notes.

The tonic must be
a pitch (with or without octave) or false to get the intervals

This function is currified, so you can partially apply the function passing
one parameter instead of two (see example)

**Parameters**

-   `source` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the list of intervals or notes
-   `tonic` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the tonic of the chord or null to get the intervals

**Examples**

```javascript
var harmonize = require('note-harmonize')
harmonize('1 3 5 6', 'G') // => ['G', 'B', 'D', 'E']
harmonize('G B D E', false) // => ['1P', '3M', '5P', '6M']

// create harmonizers:
var maj79 = harmonize('1 3 5 7 9')
maj79('A4') // => ['A4', 'C#5', 'E5', 'G#5', 'B5']
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the chord notes or intervals
