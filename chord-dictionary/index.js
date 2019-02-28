import data from "./data";

/**
 * @module ChordDictionary
 */
const keys = Object.keys;
const map = fn => keys(data).map(fn);
const build = (init, fn) =>
  keys(data).reduce((acc, key) => {
    fn(acc, key, data[key]);
    return acc;
  }, init);

let _names, _abbrvs, _aliases, _alias, _intervals;
/**
 * Get chord names
 * @function
 */
export function names() {
  _names = _names || map(key => data[key][0]).filter(x => x);
  return _names.slice();
}

export function abbreviations() {
  _abbrvs = _abbrvs || map(key => data[key][1].split(" ")[0]);
  return _abbrvs.slice();
}

export function aliases() {
  _aliases =
    _aliases ||
    build([], (aliases, key, value) => {
      value[1].split(" ").forEach(alias => aliases.push(alias));
    });
  return _aliases.slice();
}

export function alias(name) {
  _alias =
    _alias ||
    build({}, (alias, key, value) => {
      const [fullname, str] = value;
      const abbrevs = str.split(" ");
      alias[fullname] = abbrevs;
      abbrevs.forEach(abb => (alias[abb] = abbrevs));
    });
  return _alias[name] || [];
}

export function intervals(name) {
  _intervals =
    _intervals ||
    build({}, (all, key, value) => {
      const intervals = key.split(" ");
      const [fullname, abbrevs] = value;
      all[fullname] = intervals;
      abbrevs.split(" ").forEach(abb => (all[abb] = intervals));
    });
  return _intervals[name] || [];
}
