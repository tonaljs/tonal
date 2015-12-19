## `key`

Create a key from a string. A key is a string with a tonic and a mode



### Examples

```js
key('C major') // => 'C major'
key('c Major') // => 'C major'
key('C') // => 'C major'
key('dbb miXolydian') // => 'Dbb mixolydian'
```



## `key.altNotes`

Get a list of altered notes in the appropriate order

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.altNotes('F major') // => ['Bb']
key.altNotes('Eb major') // => ['Bb', 'Eb', 'Ab']
key.altNotes('A major') // => ['F#', 'C#', 'G#']
```

Returns `Array` an array with the altered notes ordered or an empty array
if its not a valid key name


## `key.build`

Build a key from key name

### Parameters

* `name` **`String`** the key name


### Examples

```js
var key = require('music.key')
key('C major') // => ['C', 'major']
key('fx MINOR') // => ['F##', 'minor']
key('Ab mixolydian') // => ['Ab', 'mixolydian']
key('f bebop') // => 'null'
```

Returns `Array` an array with the tonic and mode or null if not valid key


## `key.chords`

Get chords of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.chords('C major') // => ['C', 'Dm', 'Em', 'F', 'G7', 'Am', 'Bo'
key.chords('major', false) // => ['C', 'Dm', ...]
```

Returns `Array` an array with the key chords


## `key.progression`

Get a chord progression from within a key

### Parameters

* `numerals` **`String or Array`** the roman numerals
* `key` **`String`** the key name





## `key.relative`

Get relative of a key

### Parameters

* `relative` **`String`** the name of the relative mode desired
* `key` **`String`** the key name


### Examples

```js
key.relative('minor', 'C major') // => 'A minor'
key.relative('major', 'A minor') // => 'C major'
key.relative('dorian', 'F major') // => 'G dorian'
```

Returns `String` the relative key name or null if the key or the relative name
are not valid


## `key.scale`





### Examples

```js
key.scale('C major') // => ['C', 'D', 'E', ...]
```



## `key.signature`

Get the number of alterations of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.signature('C major') // => 0
key.signature('F major') // => -1
key.signature('Eb major') // => -3
key.signature('A major') // => 3
key.signature('nonsense') // => null
```

Returns `Integer` the number of alterations or null if not valid key


## `key.signature`

Get signature of a key

### Parameters

* `name` **`String`** the key name


### Examples

```js
key.signature('F major') // => 'b'
key.signature('Eb major') // => 'bbb'
key.signature('A major') // => '###'
key.signature('C major') // => ''
key.signature('nonsense') // => null
```

Returns `String` a string with the alterations


