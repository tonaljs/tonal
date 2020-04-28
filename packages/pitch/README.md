# @tonaljs/pitch ![tonal](https://img.shields.io/badge/@tonaljs-pitch-yellow.svg?style=flat-square) [![npm version](https://img.shields.io/npm/v/@tonaljs/pitch.svg?style=flat-square)](https://www.npmjs.com/package/@tonaljs/pitch)

> A notation agnostic representation of pitch

This package is only required if you're planning to add support for more pitch notations.

This package exports some type definitions of a data structure representing a pitch:

- `step`: number - The step number: 0 = C, 1 = D, ... 6 = B
- `alt`: number - Number of alterations: -2 = 'bb', -1 = 'b', 0 = '', 1 = '#', ...
- `oct`: number - Optional. The octave (undefined when is a coord class)
- `dir` 1 or -1 - Optional. Interval direction (undefined when is not an interval)
