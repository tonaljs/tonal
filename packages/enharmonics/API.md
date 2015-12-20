## `enharmonics.simplify`

Try to get a simpler enharmonic note name

### Parameters

* `note` **`String`** the note to simplify


### Examples

```js
var enharmonics = require('enharmonics')
enharmonics.simplify('B#3') // => 'C4'
```

Returns `String` the simplfiied note (can be the same)


## `note.enharmonics`

Get the enharmonics of a note. It returns an array of three elements: the
below enharmonic, the note, and the upper enharmonic

### Parameters

* `note` **`String`** the note to get the enharmonics from


### Examples

```js
enharmonics = require('enharmonics')
enharmonics('C') // => ['B#', 'C', 'Dbb']
enharmonics('A') // => ['G##', 'A', 'Bbb']
enharmonics('C#4') // => ['B##3', 'C#4' 'Db4']
enharmonics('Db') // => ['C#', 'Db', 'Ebbb'])
```

Returns `Array` an array of pitches ordered by distance to the given one


