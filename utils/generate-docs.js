var fs = require('fs')
var join = require('path').join
var doxdox = require('doxdox')
var docme = require('docme')

generate('lib', 'docs')
generate('incubation/lib', 'docs/incubation')

function generate (lib, docs) {
  var libPath = join(__dirname, '../', lib)
  var docsPath = join(__dirname, '../', docs)
  var modules = fs.readdirSync(libPath).filter(function (name) {
    return name.indexOf('.') === -1
  })

  modules.forEach(function (name) {
    docme('docme/' + name + '.md', { projectRoot: join(libPath, name) }, null, function () {
      console.log('DOCME', name, 'done!')
    })
  })

  // doxdox
  modules.forEach(function (name) {
    var input = join(libPath, name)
    var config = { title: name, description: '', layout: 'markdown' }
    var output = join(docsPath, name + '.md')
    doxdox.parseInput(input, config).then(function (content) {
      console.log('Generated: ' + output)
      fs.writeFileSync(output, content, 'utf8');
    })
  })
}
