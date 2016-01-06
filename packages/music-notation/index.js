'use strict'

var N = {}
N.operation = require('./operation')

N.accidentals = {
  parse: require('./accidentals/parse'),
  str: require('./accidentals/str')
}

N.array = {
  fromProps: require('./array/from-props'),
  toProps: require('./array/to-props')
}

N.note = require('./note/note')
N.note.regex = require('./note/regex')
N.note.parse = require('./note/parse')
N.note.str = require('./note/str')

N.interval = require('./interval/interval')
N.interval.regex = require('./interval/regex')
N.interval.parse = require('./interval/parse')
N.interval.str = require('./interval/str')

N.pitch = require('./pitch/pitch')
N.pitch.parse = require('./pitch/parse')
N.pitch.str = require('./pitch/str')

N.roman = {
  regex: require('./roman/regex'),
  parse: require('./roman/parse')
}

N.memoize = require('./memoize')

module.exports = N
