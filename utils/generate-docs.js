var fs = require('fs')
var join = require('path').join
var docme = require('docme')

var GITHUB = 'https://github.com/danigb/tonal/tree/master'
var MODULES = ['pitch', 'interval', 'set', 'scale', 'chord', 'key']

// MARKDOWN
var MD = {
  h1: function (title) { return '# ' + title },
  link: function (name, url) { return '[' + name + '](' + url + ')' },
  thead: function () {
    var args = Array.prototype.slice.call(arguments)
    var sep = args.map(function () { return '---' })
    return args.join('|') + '\n' + sep.join('|')
  },
  tbody: function () { return Array.prototype.slice.call(arguments).join('|') + '\n' },
  line: function () { return Array.prototype.slice.call(arguments).join('') + '\n' },
  lines: function () { return Array.prototype.slice.call(arguments).join('\n') }
}

generateIndex('lib', 'docs/INDEX.md')
generate('lib', 'docs')

function generateIndex (lib, file) {
  var lines = []
  MODULES.forEach(function (module) {
    sources(path(lib, module)).forEach(function (file) {
      lines.push({ name: file.slice(0, -3), module: module })
    })
  })
  lines.sort(sorter('name'))
  console.log('Number of functions: ', lines.length)

  var output = MD.lines(
    MD.h1('Function index'),
    MD.line('Number of functions: ', lines.length),
    MD.thead('name', 'source', 'module'),
    lines.map(function (src) {
      return MD.tbody(
        src.name,
        MD.link('source', [GITHUB, 'lib', src.module, src.name + '.js'].join('/')),
        MD.link(src.module, [GITHUB, 'docs', src.module + '.md'].join('/'))
      )
    }).join('')
  )
  fs.writeFileSync(path(file), output)
}

function sorter (key) {
  return function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
}

function sources (path) {
  return fs.readdirSync(path).filter(function (name) {
    return /\.js$/.test(name)
  })
}

function generate (lib, docs) {
  lib = path(lib)
  MODULES.forEach(function (module) {
    docme('docs/' + module + '.md', { projectRoot: join(lib, module) }, null, function () {
      console.log('DOCME', module, 'done!')
    })
  })
}

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}
