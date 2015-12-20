'use strict'

var N = {}
N.operation = require('./operation')

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

N.roman = {}
N.roman.regex = require('./roman/regex')
N.roman.parse = require('./roman/parse')

N.memoize = require('./lib/memoize')
N.propsToArray = require('./lib/props-to-arr')
N.arrayToProps = require('./lib/array-props')

module.exports = N
