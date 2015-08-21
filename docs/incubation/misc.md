# misc 




## fifths(step) 

Get the relation between a note and the number of steps in the
cycle of fifths (with root in C)




### Parameters

- **step** `Integer` `String`   - if it's an integer, returns the note step after moving `step` steps in the cycle. If it's a step string, returns the number
of steps starting from 'C' to the given step




### Examples

```javascript
var cycle = require('tonal/cycle-of-fifths')
cycle(0) // => 'C'
cycle(1) // => 'G'
cycle(-1) // => 'F'
cycle('C') // => 0
cycle('G') // => 1
cycle('F') // => -1
cycle('C2') // => undefined
```


### Returns


- `String` `Integer`   - the note name or the number of steps (depending of the param)




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
