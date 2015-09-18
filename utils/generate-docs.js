var fs = require('fs')
var join = require('path').join
var docme = require('docme')

var GITHUB = 'https://github.com/danigb/tonal/tree/master/lib'

// MARKDOWN
var MD = {
  h1: function (title) { return '# ' + title },
  link: function (name, url) { return '[' + name + '](' + url + ')' },
  thead: function () {
    var args = Array.prototype.slice.call(arguments)
    var sep = args.map(function () { return '---' })
    return args.join('|') + '\n' + sep.join('|') + '\n'
  },
  tbody: function () { return Array.prototype.slice.call(arguments).join('|') },
  line: function () { return Array.prototype.slice.call(arguments).join('') + '\n' },
  lines: function () { return Array.prototype.slice.call(arguments).join('\n') }
}

generateIndex('lib', 'docs/index.md')
// generate('lib', 'docs')

function generateIndex (lib, file) {
  var all = []
  modules(path(lib)).forEach(function (module) {
    if (['pitch', 'interval', 'set', 'scale', 'chord', 'key'].indexOf(module) === -1) return
    sources(path(lib, module)).forEach(function (file) {
      all.push({ name: file.slice(0, -3), module: module })
    })
  })
  console.log('Number of functions: ', all.length)
  var lines = all.sort(sorter('name')).map(function (src) {
    return MD.tbody(
      src.name,
      MD.link('source', [GITHUB, src.module, src.name + '.js'].join('/')),
      MD.link(src.module, [GITHUB, src.module].join('/'))
    )
  })

  var output = MD.lines(
    MD.h1('Function index'),
    MD.line('Number of functions: ', all.length),
    MD.thead('name', 'source', 'module')
  ) + lines.join('\n')
  fs.writeFileSync(path(file), output)
}

function sorter (key) {
  return function (a, b) {
    var x = a[key]
    var y = b[key]
    return ((x < y) ? -1 : ((x > y) ? 1 : 0))
  }
}

function modules (lib) {
  return fs.readdirSync(lib).filter(function (name) {
    return name.indexOf('.') === -1
  })
}
function sources (lib) {
  return fs.readdirSync(lib).filter(function (name) {
    return /\.js$/.test(name)
  })
}

function generate (lib, docs) {
  lib = path(lib)
  modules(lib).forEach(function (module) {
    docme('docs/' + module + '.md', { projectRoot: join(lib, module) }, null, function () {
      console.log('DOCME', module, 'done!')
    })
  })
}

function path (dir) {
  var args = Array.prototype.slice.call(arguments)
  return join.apply(null, [__dirname, '../'].concat(args))
}
