var MD = require('./markdown')
var _ = require('lodash')

module.exports = function (sources) {
  function linkToModule (module) {
    return sources.repo('docs', module + '.md')
  }
  function mdModuleIndex (module) {
    var files = sources.byModule[module]
    return MD.li(
      MD.bold(MD.link(_.capitalize(module), linkToModule(module))),
      '- ',
      files.map(mdFunctionLink).join(', ')
    )
  }

  function mdFunctionLink (src) {
    return MD.link(src.name, sources.repo('docs', src.module + '.md' +
      ('#' + src.module + src.name).toLowerCase()))
  }

  return MD.lines(
    MD.h1('Tonal functions'),
    MD.line('Tonal is a collection of js functions to work with tonal elements of music.'),
    MD.line('Tonal functions are grouped by modules.'),
    MD.line(),
    MD.h3('Modules summary'),
    sources.modules.map(mdModuleIndex).join(''),
    MD.line()
  )
}
