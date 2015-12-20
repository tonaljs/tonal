## `chord`

A chord dictionary. Get chord data from a chord name.

### Parameters

* `name` **`String`** the chord name


### Examples

```js
// get chord data
var chord = require('chord-dictionary')
chord('Maj7') // => { name: 'Maj7', aliases: ['M7', 'maj7']
               //      intervals:  [ ...],
               //      binary: '100010010001', decimal: 2193 }
```
```js
// get it from aliases, binary or decimal numbers
chord('Maj7') === chord('M7') === chord('100010010001') === chord(2913)
```
```js
// get chord names
chord.names // => ['Maj7', 'm7', ...]
```



