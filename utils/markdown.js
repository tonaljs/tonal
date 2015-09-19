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

module.exports = function (cb) {
  return cb(MD)
}
