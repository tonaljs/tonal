## `note.interval`

Get the interval between two pitches

If one or both are pitch classes, a simple ascending interval is returned

This function can be partially applied (see examples)

### Parameters

* `from` **`String`** the first note
* `to` **`String`** the second note


### Examples

```js
var interval = require('note-interval')
interval('C2', 'D3') // => '9M'
interval('D2', 'C2') // => '-2M'
interval('D', 'C') // => '7m'
```
```js
// partially applied
var fromC = interval('C')
fromC('D') // => '2M'
```

Returns `String` the interval between them


