'use strict'

var nn = {}

nn.operation = require('./operation')
nn.note = require('./note')
nn.note.split = require('./note.split')
nn.note.parse = require('./note.parse')
nn.note.str = require('./note.str')
nn.interval = require('./interval')
nn.interval.parse = require('./interval.parse')
nn.interval.str = require('./interval.str')
nn.roman = {}
nn.roman.split = require('./roman.split')
nn.roman.parse = require('./roman.parse')
nn.parser = require('./parser')
nn.props = require('./props')
nn.props.array = require('./props.array')
nn.pitch = require('./pitch')
nn.pitch.parse = require('./pitch.parse')
nn.pitch.str = require('./pitch.str')

module.exports = nn
