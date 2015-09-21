
var markdown = {
  h1: function (title) { return '# ' + title },
  h4: function (title) { return '#### ' + title },
  bold: function (text) { return '__' + text + '__' },
  link: function (name, url) { return '[' + name + '](' + url + ')' },
  thead: function () {
    var args = Array.prototype.slice.call(arguments)
    var sep = args.map(function () { return '---' })
    return args.join('|') + '\n' + sep.join('|')
  },
  tbody: function () { return Array.prototype.slice.call(arguments).join('|') + '\n' },
  line: function () { return Array.prototype.slice.call(arguments).join('') + '\n' },
  lines: function () { return Array.prototype.slice.call(arguments).join('\n') },
  code: function (code, lang) {
    if (!code || code === '') return ''
    return arguments.length === 1
      ? '`' + code + '`'
      : '```' + lang + '\n' + code + '\n' + '```' + '\n'
  }
}

module.exports = markdown
