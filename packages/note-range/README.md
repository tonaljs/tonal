# note-range

Create ranges of notes:

```js
var range = require('note-range')
range('C2', 'C4') // => ['C2', 'Db2', 'D2', ..., 'C4']
range('C4', 'C2') // => ['C4', 'B3', 'Bb3', ..., 'C2']
```
