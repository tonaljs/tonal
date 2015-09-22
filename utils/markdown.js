var _ = require('lodash')
var slice = Array.prototype.slice

var markdown = {
  h1: function (title) { return '# ' + title + '\n' },
  h2: function (title) { return '## ' + title + '\n' },
  h3: function (title) { return '### ' + title + '\n' },
  h4: function (title) { return '#### ' + title + '\n' },
  h6: function (title) { return '###### ' + title + '\n' },
  li: function () {
    var text = _.flatten(slice.call(arguments), true).join(' ')
    return '- ' + text + '\n'
  },
  separator: function () { return '----' },

  // INLINE
  bold: function (text) { return '__' + text + '__' },
  link: function (name, url) { return '[' + name + '](' + url + ')' },

  join: function () { return _.flatten(slice.call(arguments), true).join('') },
  line: function () {
    return arguments.length ? Array.prototype.slice.call(arguments).join(' ') + '\n' : '\n'
  },
  lines: function () {
    return _.flatten(slice.call(arguments)).join('\n') + '\n'
  },

  code: function (code, lang) {
    if (!code || code === '') return ''
    return arguments.length === 1
      ? '`' + code + '`'
      : '```' + lang + '\n' + code + '\n' + '```' + '\n'
  },

  // TABLES
  thead: function () {
    var args = Array.prototype.slice.call(arguments)
    var sep = args.map(function () { return '---' })
    return args.join('|') + '\n' + sep.join('|')
  },
  tbody: function () { return Array.prototype.slice.call(arguments).join('|') }
}

module.exports = markdown
