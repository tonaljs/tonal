# Tonal documentation

This folder contains the documentation of tonal:

- The full documentation is here: https://github.com/danigb/tonal/blob/master/docs/DOCUMENTATION.md
- A function index is here: https://github.com/danigb/tonal/blob/master/docs/INDEX.md

## Library overview

Tonal is a collection of functions, grouped by modules. Each module has functions related to the same problem: pitch, chord, fifths are examples of modules.

At this moment you should require each function individually, for example: `var toMidi = require('tonal/pitch/toMidi')`. This has the adventage of reduce the dependencies to the minimum.

The most important function of each module (if any) is called the same as the module: `pitch/pitch`, `scale/scale`, and so on.
