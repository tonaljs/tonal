
function prop (type, name) {
  return function (e) {
    var props = type(e)
    return props ? props[name] : null
  }
}

module.exports = prop
