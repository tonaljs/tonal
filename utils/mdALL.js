var MD = require('./markdown')
var _ = require('lodash')

module.exports = function (sources) {
  function mdModule (module) {
    return MD.lines(
      MD.h2(_.capitalize(module + ' module')),
      MD.line(),
      MD.line('Number of functions: ', sources.byModule[module].length),
      sources.byModule[module].map(mdFunction).join('\n')
    )
  }

  function mdFunction (src) {
    var examples = src.findTags('example')
    var example = examples.length ? examples[0]['string'] : ''
    var summary = src.jsdoc.description.summary
    var source = sources.repo('lib', src.module, src.name + '.js')

    return MD.lines(
      MD.h4(src.module + '/' + src.name),
      MD.line(),
      MD.line(summary),
      MD.code(example, 'js'),
      MD.line(MD.link(src.name + '.js', source))
    )
  }

  function mdModuleIndex (module) {
    var href = sources.repo('docs', 'ALL.md#' + module + '-module')
    return MD.item(MD.link(_.capitalize(module), href))
  }

  return MD.lines(
    MD.h1('Tonal functions'),
    MD.line('A list of', MD.link('all functions', sources.repo('docs/INDEX.md')), 'available grouped by modules.'),
    MD.line(),
    MD.line(MD.bold('Index of modules')),
    sources.modules.map(mdModuleIndex).join(''),
    sources.modules.map(mdModule).join('\n')
  )
}
