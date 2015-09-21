var fs = require('fs')
var dox = require('dox')

var GITHUB = 'https://github.com/danigb/tonal/tree/master/'

module.exports = function (lib, modules) {
  var sources = { modules: modules, ordered: [], byModule: {} }

  modules.forEach(function (module) {
    sources.byModule[module] = []
    return fs.readdirSync(lib + '/' + module).filter(function (name) {
      return /\.js$/.test(name)
    }).forEach(function (file) {
      var src = buildModel(file, module, lib)
      sources.ordered.push(src)
      sources.byModule[module].push(src)
    })
  })
  sources.ordered.sort(sorter('name'))
  modules.forEach(function (module) {
    sources.byModule[module].sort(sorter('name'))
  })

  sources.repo = function (path) {
    return [GITHUB].concat(Array.prototype.slice.call(arguments)).join('/')
  }
  return sources
}

function buildModel (file, module, lib) {
  var src = { module: module, name: file.slice(0, -3) }
  src.jsdoc = dox.parseComments(fs.readFileSync([lib, module, file].join('/')).toString(), { raw: true })[0]

  src.findTags = function (type) {
    return src.jsdoc.tags.filter(function (tag) {
      return tag.type === type
    })
  }
  return src
}

function sorter (key) {
  return function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
}
