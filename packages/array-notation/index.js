
var A = {}
A.note = function (n) { A.note.str(A.note.parse(n)) }
A.note.regex = require('./note/regex')
A.note.parse = require('./note/parse')
A.note.str = require('./note/str')
A.interval = function (n) { A.interval.str(A.interval.parse(n)) }
A.interval.parse = require('./interval/parse')
A.interval.str = require('./interval/str')
A.pitch = function (n) { A.pitch.str(A.pitch.parse(n)) }
A.pitch.parse = require('./pitch/parse')
A.pitch.str = require('./pitch/str')
A.roman = function (n) { }
A.roman.regex = require('./roman/regex')
A.roman.parse = require('./roman/parse')
