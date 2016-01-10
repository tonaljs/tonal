## `scale`

Create a scale from a name or intervals and tonic

### Parameters

* `source` **`Array`** the scale name, scale intervals or scale notes
* `tonic` **`String`** the tonic of the scale


### Examples

```js
var scale = require('music-scale')
```

Returns `Array` the list of notes


## `scale.names`

Get available scale names

### Parameters

* `aliases` **`Boolean`** if true, it returns the name aliases



Returns `Array` the available scale names


## `scale.props`

Get scale properties

### Parameters

* `name` **`String`** the scale name



Returns `Object` the scale properties


