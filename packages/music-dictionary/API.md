## `dictionary`

Create a musical dictionary. A musical dictionary is a function that given
a name (and optionally a tonic) returns an array of notes.

A dictionary is created from a HashMap. It maps a name to a string with
an interval list and, optionally, an alternative name list (see example)

Additionally, the dictionary has properties (see examples):

- data: a hash with the dictionary data
- names: an array with all the names
- aliases: an array with all the names including aliases
- source: the source of the dictionary

Each value of the data hash have the following properties:

- name: the name
- aliases: an array with the alternative names
- intervals: an array with the intervals
- steps: an array with the intervals in __array notation__
- binary: a binary representation of the set
- decimal: the decimal representation of the set

### Parameters

* `source` **`Hash`** the dictionary source


### Examples

```js
var dictionary = require('music-dictionary')
var chords = dictionary({'Maj7': ['1 3 5 7', ['M7']], 'm7': ['1 3b 5 7b'] })
chords('CMaj7') // => ['C', 'E', 'G', 'B']
chords('DM7') // => ['D', 'F#', 'A', 'C#']
chords('Bm7') // => ['B', 'D', 'F#', 'A']
```
```js
// dictionary data
chords.data['M7'] // => { name: 'Maj7', aliases: ['M7'],
                  //      intervals: ['1', '3', '5', '7'], steps: [ ...],
                  //      binary: '10010010001', decimal: 2193 }

// get chord by binary numbers
chords.data['100010010001'] === chords.data['Maj7']
chords.data[2193] === chords.data['Maj7']
```
```js
// available names
chords.names // => ['Maj7', 'm7']
chords.aliases // => ['Maj7', 'm7', 'M7']
```

Returns `Function` the dictionary


