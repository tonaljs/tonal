<a name="module_key"></a>

# key
_Key_ refers to the tonal system based on the major and minor scales. This is
is the most common tonal system, but tonality can be present in music
based in other scales or concepts.

This is a collection of functions related to keys.

**Example**  
```js
const key = require('tonal-key')
key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
key.relative('minor', 'C major') // => 'A minor'
```
