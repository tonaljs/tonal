# tonal

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides lot of functions to create and manipulate musical entities:

```js
var transpose = require('tonal/transpose')
transpose('M2', 'f#4') // => 'G#4'
```

## Why

First of all, because I want to learn. The more I code music entities, the more I understand the relations between them.

Also, I want a complete library (where I can model all what I learn) and that's not possible if its not modular.

## Usage

You can install it using npm: `npm i --save tonal` and although you can require the whole library:

```js
var tonal = require('tonal')
tonal.tranpose('P5', 'C')
```

The idea is that you only require the required methods:

```js
var transpose = require('tonal/transpose')
tranpose('P5', 'C')
```


## API

### Notes

#### parseNote(string)

Parse a note string a return an object with the following properties:

- pc: the [pitch class](https://en.wikipedia.org/wiki/Pitch_class). __Always uppercase__
- acc: the [note accidentals](https://en.wikipedia.org/wiki/Musical_note#Accidentals)
- oct: the octave, as an integer. __Always present__, 4 if not present in the string

#### midi(note)

Returns the midi number of the given note. The note param can be a note string or a note object.

#### freq(note, [, tuning = 440])

#### enharmonics(note [, pitchClass])

#### midiNoteName(midiNumber)

### pitchClass(note[, steps])

### Intervals

#### parseInterval(string)

#### invertInterval(interval)

#### distance(origNote, destNote)

#### diatonicNumber()

#### intervalNames([semitones])


## License

MIT License
