var MD = require('./markdown')

var GITHUB = 'https://github.com/danigb/tonal/tree/master'

module.exports = function markdownIndex (sources) {
  return MD.lines(
    MD.h1('Function index'),
    MD.line('Number of functions: ', sources.ordered.length),
    MD.thead('name', 'description', 'module', 'source'),
    sources.ordered.map(markdownSourceRow)
  )
}

function markdownSourceRow (src) {
  var summary = src.jsdoc.description.summary
  var examples = src.findTags('example', src.jsdoc)
  var example = examples.length ? examples[0]['string'] : ''
  example = example.split('\n')[0]

  return MD.tbody(
    MD.bold(src.name),
    summary + MD.code(example),
    MD.link(src.module, [GITHUB, 'docs', src.module + '.md'].join('/')),
    MD.link(src.name + '.js', [GITHUB, 'lib', src.module, src.name + '.js'].join('/'))
  )
}
