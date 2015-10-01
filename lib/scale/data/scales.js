'use strict'

var data = require('./scale-intervals.json')
var aliases = require('./scale-aliases.json')
var withAlias = require('../../_internal/withAlias')

// Return a hash with the scale intervals with aliases
module.exports = withAlias(data, aliases)
