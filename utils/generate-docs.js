var fs = require('fs')
var join = require('path').join
var docme = require('docme')

generate('lib', 'docs')

function generate (lib, docs) {
  var libPath = join(__dirname, '../', lib)
  var modules = fs.readdirSync(libPath).filter(function (name) {
    return name.indexOf('.') === -1
  })

  modules.forEach(function (name) {
    docme('docs/' + name + '.md', { projectRoot: join(libPath, name) }, null, function () {
      console.log('DOCME', name, 'done!')
    })
  })
}
