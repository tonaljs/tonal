var MD = require('./markdown')
var _ = require('lodash')

function linkToModule (module) {
  return '#' + module.toLowerCase() + '-module'
}

function mdReadme (readme) {
  return readme ? readme.replace(/^# .*/m, '') : ''
}

module.exports = function (sources) {
  function mdModule (module) {
    var files = sources.byModule[module]
    return MD.lines(
      MD.h2(_.capitalize(module + ' module')),
      MD.line(),
      MD.link('Back to top', '#tonal-functions'),
      MD.line(),
      mdReadme(sources.readmes[module]),
      MD.h3('Function list'),
      files.map(mdFunctionSummary).join(''),
      MD.line(),
      MD.h3('API'),
      files.map(mdFunction)
    )
  }

  function mdFunctionSummary (src) {
    var summary = src.jsdoc.description.summary.replace('\n', ' ')
    return MD.li(mdFunctionLink(src), '- ', summary)
  }

  function mdFunction (src) {
    var examples = src.findTags('example')
    var example = examples.length ? examples[0]['string'] : ''
    var source = sources.repo('lib', src.module, src.name + '.js')
    var test = sources.repo('test', src.module, src.name + 'Test.js')

    return MD.lines(
      MD.separator(),
      MD.h6(MD.link(src.module + '/' + src.name, linkToModule(src.module))),
      MD.line(),
      mdSignature(src),
      MD.line(),
      MD.line(src.jsdoc.description.full),

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
      MD.join('Source: ', MD.link(src.module + '/' + src.name + '.js', source)),
      MD.join('Test: ', MD.link(src.module + '/' + src.name + 'Test.js', test))
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
      MD.bold(MD.link(_.capitalize(module), linkToModule(module))),
      '- ',
      files.map(mdFunctionLink).join(', ')
    )
  }

  function mdFunctionLink (src) {
    return MD.link(src.name, ('#' + src.module + src.name).toLowerCase())
  }

  return MD.lines(
    MD.h1('Tonal functions'),
    MD.line('A list of', MD.link('all functions', sources.repo('docs/INDEX.md')), 'available grouped by modules.'),
    MD.line(),
    MD.line(MD.bold('Module summary')),
    sources.modules.map(mdModuleIndex).join(''),
    sources.modules.map(mdModule).join('\n')
  )
}
