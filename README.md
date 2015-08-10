# tonal

Tonal is a modular, functional (but currently __experimental__) music theory library. It provides lot of functions to create and manipulate musical entities:

```js
var transpose = require('tonal/transpose')
transpose('M2', 'f#4') // => 'G#4'
```

It's modular because you can require just what you need. The library is still big, but your dependencies can be tiny.

It's modular because all the library is built using functions with no side effects, just data-in, data-out. Notes and intervals are represented by strings. No objects. Functions are isolated, simpler and easily tested.

__This is alpha software__, if you need a stable music theory library in javascript you can use [teoria](https://github.com/saebekassebil/teoria)

## What

The library functions are divided in some different areas:

- __notes__: parseNote, freq, midi, transpose, enharmonics, pitchClass
- __intervals__: parseInterval, intervalNames, intervalNumber, invertInterval, distance
- __scales__:
- __chords__:

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

The more I code music entities, the more I understand the relations between them.

Also, I want a complete library, where I can model all what I learn, with some esoteric features like interval classes, binary scales and weird stuff. That's not possible if its not modular.

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

## Documentation

You can read the [generated documentation]

## References

The binary representation of the scales are based on the book 

## License

MIT License
