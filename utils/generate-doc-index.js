var fs = require('fs')
var dox = require('dox')
var markdown = require('./markdown')

var GITHUB = 'https://github.com/danigb/tonal/tree/master'

module.exports = function (modules, lib, file) {
  fs.writeFileSync(file, markdownIndex(buildSourceModel(modules, lib)))
}

function markdownIndex (sources) {
  return markdown(function (md) {
    return md.lines(
      md.h1('Function index'),
      md.line('Number of functions: ', sources.files.length),
      md.thead('name', 'description', 'module', 'source'),
      sources.files.map(function (src) {
        var summary = src.jsdoc.description.summary
        var examples = findTags('example', src.jsdoc)
        var example = examples.length ? examples[0]['string'] : ''
        example = example.split('\n')[0]
        return md.tbody(
          md.bold(src.name),
          summary + md.code(example),
          md.link(src.module, [GITHUB, 'docs', src.module + '.md'].join('/')),
          md.link(src.name + '.js', [GITHUB, 'lib', src.module, src.name + '.js'].join('/'))
        )
      }).join('')
    )
  })
}

function findTags (type, jsdoc) {
  return jsdoc.tags.filter(function (tag) {
    return tag.type === type
  })
}

function buildSourceModel (modules, lib) {
  var code = { files: [], modules: {} }

  modules.forEach(function (module) {
    code.modules[module] = []
    return fs.readdirSync(lib + '/' + module).filter(function (name) {
      return /\.js$/.test(name)
    }).forEach(function (file) {
      var model = {
        name: file.slice(0, -3),
        module: module,
        jsdoc: dox.parseComments(fs.readFileSync([lib, module, file].join('/')).toString(), { raw: false })[0]
      }
      code.files.push(model)
      code.modules[module].push(model)
    })
  })
  code.files.sort(sorter('name'))
  return code
}

function sorter (key) {
  return function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
}
