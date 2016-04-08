## `note.freq`

Get the pitch frequency in herzs (with custom concert tuning) from a note
name or a midi number

This function is currified so it can be partially applied (see examples)

### Parameters

* `tuning` **`Float`** the frequency of A4 (null means 440)
* `note` **`String or Integer`** the note name or the midi number


### Examples

```js
var freq = require('note-freq')
freq(440, 'A3') // => 220
freq(444, 'A2') // => 111
// midi 57 is 'A3' note
freq(null, 57) // => 220
```
```js
// partially applied
var freq = require('note-freq')(440)
freq('a4') // => 440
```

Returns `Float` the frequency of the note


