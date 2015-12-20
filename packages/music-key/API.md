## `key.parse`

Parse a key name

### Parameters

* `name` **`String`** the key name


### Examples

```js
var key = require('music-key')
key.parse('C major') // => ['C', 'major']
key.parse('fx MINOR') // => ['F##', 'minor']
key.parse('Ab mixolydian') // => ['Ab', 'mixolydian']
key.parse('f bebop') // => 'null'
```

Returns `Array` an array with the tonic and mode or null if not valid key


## `key.relative`

Get relative of a key

This function is currified, so it can be partially applied (see examples)

### Parameters

* `relative` **`String`** the name of the relative mode desired
* `key` **`String`** the key name


### Examples

```js
var key = require('music-key')
key.relative('minor', 'C major') // => 'A minor'
key.relative('major', 'A minor') // => 'C major'
key.relative('dorian', 'F major') // => 'G dorian'

// partially application
var minorOf = key.relative('minor')
minorOf('Bb major') // => 'G minor'
```

Returns `String` the relative key name or null if the key or the relative name
are not valid


