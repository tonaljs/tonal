var fs = require('fs')
var path = require('path')
var doxdox = require('doxdox')

var modules = fs.readdirSync(path.join(__dirname, '../lib')).filter(function (name) {
  return name.indexOf('.') === -1
})

modules.forEach(function (name) {
  var input = path.join(__dirname, '../lib', name)
  var config = { title: name, description: '', layout: 'markdown' }
  var output = path.join(__dirname, '../docs/', name + '.md')
  doxdox.parseInput(input, config).then(function (content) {
    console.log('Generated: ' + name + '.md')
    fs.writeFileSync(output, content, 'utf8');
  })
})
