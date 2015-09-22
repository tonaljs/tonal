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
    var source = sources.repo('lib', src.module, src.name + '.js')

    return MD.lines(
      MD.separator(),
      MD.h6(src.module + '/' + src.name),
      MD.line(),
      mdSignature(src),
      MD.line(),
      MD.line(src.jsdoc.description.full),

      MD.line(),
      MD.line(MD.bold('Arguments:')),
      MD.thead('Name', 'Type', 'Description'),
      src.findTags('param').map(mdParam),

      MD.line(),
      MD.line(MD.bold('Returns:')),
      MD.thead('Type', 'Description'),
      src.findTags('return').map(mdReturn),

      MD.line(),
      MD.line(MD.bold('Example:')),
      MD.code(example, 'js'),
      MD.line(MD.link(src.name + '.js', source))
    )
  }

  function mdSignature (src) {
    var params = src.findTags('param').map(function (tag) {
      return tag.name
    }).join(', ')
    var ret = _.first(_.pluck(src.findTags('return'), 'types'))
    return MD.h4(
      MD.join(src.name, '(', params, ')', ' → ', '{', ret, '}')
    )
  }

  function mdParam (param) {
    return MD.tbody(MD.code(param.name), param.types,
      param.description.replace(/^\s*-\s*/, ''))
  }

  function mdReturn (tag) {
    return MD.tbody(tag.types, tag.description)
  }

  function mdModuleIndex (module) {
    var files = sources.byModule[module]
    return MD.li(
      MD.bold(MD.link(_.capitalize(module), '#' + module + '-module')),
      '- ',
      files.map(mdFuncItem).join(', ')
    )
  }

  function mdFuncItem (src) {
    return MD.link(src.name, ('#' + src.module + src.name).toLowerCase())
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
