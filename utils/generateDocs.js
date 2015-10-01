var fs = require('fs')

var mdFuncIndex = require('./mdFuncIndex')
var mdModule = require('./mdModule')
var mdModuleIndex = require('./mdModuleIndex')

var sources = require('./sourceModel')
var path = sources.root + 'docs/'

fs.writeFileSync(path + 'README.md', mdModuleIndex(sources) + mdFuncIndex(sources))

sources.modules.forEach(function (module) {
  fs.writeFileSync(path + module + '.md', mdModule(sources, module))
})
