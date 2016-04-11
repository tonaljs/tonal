# chords

A chord dictionary. It's a hashmap of names mapped to an array of
intervals in shorthand notation or a string with other name (if it's an
alias)

**Examples**

```javascript
var chords = require('chord-dictionary')
chords['Maj7'] // => ['1', '3', '5', '7']
chord['maj7'] // => 'Maj7' (an alias)
Object.keys(chords) // all chord names
```
