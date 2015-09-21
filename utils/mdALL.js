var MD = require('./markdown')
var _ = require('lodash')
var GITHUB = 'https://github.com/danigb/tonal/tree/master'

module.exports = function (sources) {
  return MD.lines(
    MD.h1('Tonal functions'),
    MD.line('A list of all functions available grouped by modules.'),
    MD.line(),
    sources.modules.map(markdonModule(sources)).join('\n')
  )
}

function markdonModule (sources) {
  return function (module) {
    return MD.lines(
      MD.h2(_.capitalize(module + ' module')),
      MD.line(),
      MD.line('Number of functions: ', sources.byModule[module].length),
      sources.byModule[module].map(markdownFunction).join('\n')
    )
  }
}

function markdownFunction (src) {
  var examples = src.findTags('example')
  var example = examples.length ? examples[0]['string'] : ''
  var summary = src.jsdoc.description.summary
  return MD.lines(
    MD.h4(src.module + '/' + src.name),
    MD.line(),
    MD.line(summary),
    MD.code(example, 'js'),
    MD.link(src.name + '.js', [GITHUB, 'lib', src.module, src.name + '.js'].join('/'))
  )
}
