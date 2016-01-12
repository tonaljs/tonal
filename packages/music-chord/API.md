## `chord`

Create chords either by name or by intervals

This function is currified

### Parameters

* `source` **`String`** the chord name, intervals or notes
* `tonic` **`String`** the chord tonic


### Examples

```js
var chord = require('music-chord')
// create chord from name
chord('Cmaj7') // => ['C', 'E', 'G', 'B']
chord('maj7', 'C') // => ['C', 'E', 'G', 'B']
```
```js
// partially applied
var maj7 = chord('maj7')
maj7('C') // => ['C', 'E', 'G', 'B']
```
```js
// create chord from intervals
chord('1 3 5 7', 'C') // => ['C', 'E', 'G', 'B']
```

Returns `Array` the chord notes


## `chord.names`

Get available chord names

### Parameters

* `aliases` **`Boolean`** if true, it returns the name aliases



Returns `Array` the available chord names


## `chord.props`

Get chord properties

### Parameters

* `name` **`String`** the chord name



Returns `Object` the chord properties


