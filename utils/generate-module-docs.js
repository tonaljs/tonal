var fs = require('fs')
var docme = require('docme')

module.exports = function (modules, lib, docs) {
  modules.forEach(function (module) {
    var output = docs + '/' + module + '.md'
    docme(output, { projectRoot: lib + '/' + module }, null, function () {
      repairSourcePaths(output, module)
    })
  })
}

function repairSourcePaths (file, module) {
  console.log('Repair source links', module)
  var content = fs.readFileSync(file).toString()
  content = content.replace(/blob\/master/g, 'blob/master/lib/' + module)
  fs.writeFileSync(file, content)
}
