
function prop (type, name) {
  return function (e) {
    return type(e)[name]
  }
}

module.exports = prop
