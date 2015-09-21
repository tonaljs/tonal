var fs = require('fs')
var dox = require('dox')

module.exports = function (lib, modules) {
  var model = { modules: modules, ordered: [], byModule: {} }

  modules.forEach(function (module) {
    model.byModule[module] = []
    return fs.readdirSync(lib + '/' + module).filter(function (name) {
      return /\.js$/.test(name)
    }).forEach(function (file) {
      var src = buildModel(file, module, lib)
      model.ordered.push(src)
      model.byModule[module].push(src)
    })
  })
  model.ordered.sort(sorter('name'))
  return model
}

function buildModel (file, module, lib) {
  var src = { module: module, name: file.slice(0, -3) }
  src.jsdoc = dox.parseComments(fs.readFileSync([lib, module, file].join('/')).toString(), { raw: false })[0]

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
