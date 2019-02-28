import data from "./data";

/**
 * @module ScaleDictionary
 */

// cache
let _names, _aliases, _ivls, _alias;

const build = (init, fn) =>
  Object.keys(data).reduce((idx, key) => {
    fn(idx, key, data[key]);
    return idx;
  }, init);

export function names() {
  _names = _names || Object.keys(data).map(key => data[key][0]);
  return _names.slice();
}

export function aliases() {
  _aliases =
    _aliases ||
    Object.keys(data).reduce((alias, key) => [...alias, ...data[key]], []);
  return _aliases.slice();
}

export function alias(name) {
  _alias =
    _alias ||
    build({}, (idx, key, value) => {
      value.forEach(name => (idx[name] = value));
    });
  return _alias[name] || [];
}

export function intervals(name) {
  _ivls =
    _ivls ||
    build({}, (idx, key, value) => {
      const intervals = key.split(" ");
      value.forEach(name => (idx[name] = intervals));
    });
  return (_ivls[name] || []).slice();
}
