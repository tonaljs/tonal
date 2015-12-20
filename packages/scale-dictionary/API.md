## `scale`

A scale dictionary. Get scale from a scale name and a tonic.

The dictionary has a `names` property with all scale names.

### Parameters

* `name` **`String`** the scale name


### Examples

```js
// get scale data
var scale = require('scale-dictionary')
scale('Ab major') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]
scale('major', 'Ab') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]
// get scale intervals
scale('major', false) // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
```
```js
// get it from aliases, binary or decimal numbers
scale('major') === scale('ionian') === scale('101011010101') === scale(2773)
```
```js
// get scale names
scale.names // => ['major', 'dorian', ...]
```



