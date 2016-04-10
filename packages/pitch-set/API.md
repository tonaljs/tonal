# pitchSet

Create a pitch set from a list of notes or intervals.
An pitch set is a collection of uniq notes or intervals sorted by frequency

If it's pitch set of pitch classes, the first note will be the first pitch
class of the set.

If it's a pitch set of intervals, the intervals are simplified and returned
in ascending size order

**Parameters**

-   `source` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the list of intervals or notes

**Examples**

```javascript
var pitchSet = require('pitch-set')

// pitch sets from notes (uses first note as tonic)
pitchSet('d2 c4 e3 f g6 a B c d5 e') // => ['D', 'E', 'F', 'G', 'A', 'B', 'C']
// simplified intervals ordered by size
pitchSet('1 2 3 8 9 10 11') // => [ '1P', '2M', '3M', '4P' ]
pitchSet('11 10 9') //=> [ '2M', '3M', '4P' ]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** the list of notes
