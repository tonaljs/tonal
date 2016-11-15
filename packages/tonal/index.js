
import * as Note from 'tonal-note'
export var note = Note

import * as Ivl from 'tonal-interval'
export var ivl = Ivl

import * as Midi from 'tonal-midi'
export var midi = Midi

import * as Not from 'tonal-notation'
export var notation = Not

import * as Prog from 'tonal-progression'
export var progression = Prog

import * as Son from 'tonal-sonority'
export var sonority = Son

export {
  toEqualTemp, toFreq, midiFromFreq, fromFreq, cents, fromEqualTemp
} from 'tonal-freq'

export {
  transpose, trFifths
} from 'tonal-transpose'

export {
  interval, semitones
} from 'tonal-distance'

export {
  scaleFilter
} from 'tonal-filter'

export {
  asArr, map, filter, listFn, harmonizer, harmonize, harmonics,
  rotate, rotateAsc, select, sort, shuffle, compact, cMap
} from 'tonal-array'

import * as Range from 'tonal-range'
export var range = Range

import * as Scale from 'tonal-scale'
export var scale = Scale

import * as Chord from 'tonal-chord'
export var chord = Chord
