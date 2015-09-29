var fs = require('fs')

var mdINDEX = require('./mdINDEX')
var mdALL = require('./mdALL')
var mdModule = require('./mdModule')

function generateDocs (sources, path) {
  fs.writeFileSync(path + 'INDEX.md', mdINDEX(sources))
  fs.writeFileSync(path + 'DOCUMENTATION.md', mdALL(sources))

  sources.modules.forEach(function (module) {
    fs.writeFileSync(path + module + '.md', mdModule(sources, module))
  })
}

module.exports = generateDocs
