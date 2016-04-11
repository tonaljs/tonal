# scales

A scale dictionary. It's a hashmap of scale names mapped to an array of
intervals in shorthand notation or a string with other name (if it's an
alias)

**Examples**

```javascript
var scales = require('scale-dictionary')
scales['Maj7'] // => ['1', '3', '5', '7']
scale['maj7'] // => 'Maj7' (an alias)
Object.keys(scales) // all scale names
```
