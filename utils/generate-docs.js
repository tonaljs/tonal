var fs = require('fs')
var path = require('path')
var doxdox = require('doxdox')

generate('lib', 'docs')
generate('incubation/lib', 'docs/incubation')

function generate (lib, docs) {
  var libPath = path.join(__dirname, '../', lib)
  var docsPath = path.join(__dirname, '../', docs)
  var modules = fs.readdirSync(libPath).filter(function (name) {
    return name.indexOf('.') === -1
  })

  modules.forEach(function (name) {
    var input = path.join(libPath, name)
    var config = { title: name, description: '', layout: 'markdown' }
    var output = path.join(docsPath, name + '.md')
    doxdox.parseInput(input, config).then(function (content) {
      console.log('Generated: ' + output)
      fs.writeFileSync(output, content, 'utf8');
    })
  })
}
