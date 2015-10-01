'use strict'

var data = require('./chord-intervals.json')
var aliases = require('./chord-aliases.json')
var withAlias = require('../../_internal/withAlias')

// Return a hash with the scale intervals with aliases
module.exports = withAlias(data, aliases)
