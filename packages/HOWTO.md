
## How to...

This is a detailed how to of what can be done with tonal.

The code examples shows both requiring each tonal package or using the tonal facade. To use the tonal facade you must require `tonal` library:

```js
var tonal = require('tonal')
```

### Work with notes and midi

Notes in `tonal` are just strings with notes in scientific notation. Midi numbers are integers from 0 to 127.

#### ... convert between midi and note names?

[![tonal](https://img.shields.io/badge/tonal-note--midi-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-midi)
[![npm](https://img.shields.io/npm/v/note-midi.svg)](https://www.npmjs.com/package/note-midi)

Get midi from note:

```js
var midi = require('note-midi')
midi('A4') // => 69
// or
tonal.note.midi('c2') // => 36
```

Get note from midi:

```js
var note = require('midi-note')
note(69) // => 'A4'
// or
tonal.midi.note(36) // => 'C2'
```

#### ... get frequency of a note?

[![tonal](https://img.shields.io/badge/tonal-note--freq-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/note-freq)
[![npm](https://img.shields.io/npm/v/note-freq.svg)](https://www.npmjs.com/package/note-freq)

```js
var freq = require('note-freq')
freq(440, 'A3') // => 220
// partially applied
var tempered = freq(440)
tempered('A2') // => 110
// or
tonal.note.freq(440, 'C2')
```

It works for midi too:

```js
tempered(69) // => 440
// or
tonal.note.freq(440, 69) // => 440
```

#### ... get note enharmonics?

[![tonal](https://img.shields.io/badge/tonal-enharmonics-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/enharmonics)
[![npm](https://img.shields.io/npm/v/enharmonics.svg)](https://www.npmjs.com/package/enharmonics)

```js
var enharmonics = require('enharmonics')
enharmonics('B#') // => [ 'A###', 'B#', 'C' ]
// or
tonal.enharmonics('B#')
```

#### ... simplify note name?

Select the less altered note from each enharmonics:

```js
enharmonics.simplify('B#3') // => 'C4'
// or
tonal.enharmonics.simplify('B#3') // => 'C4'
```
