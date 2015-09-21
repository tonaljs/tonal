var fs = require('fs')
var dox = require('dox')

module.exports = function (mods, lib) {
  var model = { modules: mods, ordered: [], byModule: {} }

  mods.forEach(function (module) {
    model.byModule[module] = []
    return fs.readdirSync(lib + '/' + module).filter(function (name) {
      return /\.js$/.test(name)
    }).forEach(function (file) {
      var src = {
        name: file.slice(0, -3),
        module: module,
        jsdoc: dox.parseComments(fs.readFileSync([lib, module, file].join('/')).toString(), { raw: false })[0]
      }
      model.ordered.push(src)
      model.byModule[module].push(src)
    })
  })
  model.ordered.sort(sorter('name'))
  return model
}

function sorter (key) {
  return function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
}
