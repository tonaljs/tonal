function id (x) { return x }

export function fromName (parse, raw, name) {
  if (arguments.length > 2) return fromName(parse, raw)(name)
  var data = Object.keys(raw).reduce(function (d, k) {
    // add intervals
    d[k] = raw[k][0].split(' ').map(parse || id)
    // add alias
    if (raw[k][1]) raw[k][1].forEach(function (a) { d[a] = d[k] })
    return d
  }, {})
  return function (n) {
    return data[n]
  }
}

export function names (raw, alias) {
  if (arguments.length > 1) return names(raw)(alias)
  var main = Object.keys(raw)
  var aliases = main.reduce(function (a, k) {
    if (raw[k][1]) raw[k][1].forEach(function (n) { a.push(n) })
    return a
  }, [])
  return function (alias) {
    return alias ? main.concat(aliases) : main.slice()
  }
}
