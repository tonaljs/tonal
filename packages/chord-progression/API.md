## `chord.progression`

Get chord progression from a tonic and roman numerals chords

### Parameters

* `tonic` **`String`** the tonic
* `progression` **`Array or String`** the progression in roman numerals


### Examples

```js
var progression = require('chord-progression')
progression('C', 'I IIm7 V7') // => ['C', 'Dm7', 'G7']
```

Returns `Array` the chord progression


