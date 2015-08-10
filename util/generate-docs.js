var extname = require('path').extname
var fs = require('fs')
var join = require('path').join
var dox = require('dox')

var root = join(__dirname, '../lib')
var files = fs.readdirSync(root)
files.forEach(function (name) {
  if (extname(name) === '.js') {
    json(name)
    markdown(name)
  }
})

function json (name) {
  var output = join(__dirname, '../docs', name + 'on')
  var code = fs.readFileSync(join(root, name)).toString()
  var data = dox.parseComments(code)[0]
  var content = JSON.stringify(data, null, 2)
  fs.writeFileSync(output, content, 'utf8')
}

function markdown (name) {
  var output = join(__dirname, '../docs', name.slice(0, -3) + '.md')
  var code = fs.readFileSync(join(root, name)).toString()
  var data = dox.parseComments(code)[0]
  if (data.ctx && data.ctx.type === 'function') {
    var content = convert(data)
    fs.writeFileSync(output, content, 'utf8')
  }
}

function convert (data) {
  var out = '# ' + data.ctx.name + '\n'
  return out
}
