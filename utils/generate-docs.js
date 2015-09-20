var fs = require('fs')
var join = require('path').join
var docme = require('docme')
var markdown = require('./markdown')
var dox = require('dox')

var GITHUB = 'https://github.com/danigb/tonal/tree/master'
var MODULES = ['pitch', 'interval', 'set', 'scale', 'chord', 'key', 'fifths']

var CODE = buildSourceModel('lib')

fs.writeFileSync(path('docs/INDEX.md'), markdownIndex(CODE))
generate('lib', 'docs')

function buildSourceModel (lib) {
  var code = { files: [], modules: {} }

  MODULES.forEach(function (module) {
    code.modules[module] = []
    return fs.readdirSync(path(lib, module)).filter(function (name) {
      return /\.js$/.test(name)
    }).forEach(function (file) {
      var model = {
        name: file.slice(0, -3),
        module: module,
        jsdoc: dox.parseComments(fs.readFileSync(path(lib, module, file)).toString(), { raw: false })[0]
      }
      code.files.push(model)
      code.modules[module].push(model)
    })
  })
  code.files.sort(sorter('name'))
  return code
}

function markdownIndex (sources) {
  return markdown(function (md) {
    return md.lines(
      md.h1('Function index'),
      md.line('Number of functions: ', sources.files.length),
      md.thead('name', 'description', 'module', 'source'),
      sources.files.map(function (src) {
        return md.tbody(
          md.bold(src.name),
          src.jsdoc.description.summary,
          md.link(src.module, [GITHUB, 'docs', src.module + '.md'].join('/')),
          md.link(src.name + '.js', [GITHUB, 'lib', src.module, src.name + '.js'].join('/'))
        )
      }).join('')
    )
  })
}

function sorter (key) {
  return function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
}

function generate (lib, docs) {
  lib = path(lib)
  MODULES.forEach(function (module) {
    docme('docs/' + module + '.md', { projectRoot: join(lib, module) }, null, function () {
      repairSourcePaths(module)
    })
  })
}

function repairSourcePaths (module) {
  console.log('Repair source links', module)
  var file = path('docs', module + '.md')
  var content = fs.readFileSync(file).toString()
  content = content.replace(/blob\/master/g, 'blob/master/lib/' + module)
  fs.writeFileSync(file, content)
}

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}
