const chordList = require("./data/chords2.json");

const ALIAS = [
  [/^Maj7/, "maj7"],
  [/^Maj7/, "M7"],
  [/^m7/, "_7"],
  [/^m7/, "_7"]
];

const withAlias = row => {
  const names = [];
  const len = row.length;
  for (let i = 1; i < len; i++) {
    const name = row[1];
    names.push(name);
    if (/^Maj7/.test(name)) {
      names.push(name.slice(4) + "maj7");
      names.push(name.slice(4) + "M7");
    } else if (/^m7/.test(name)) {
      names.push(name.slice(2) + "_7");
    }
  }
  return names;
};

export function dictionary(list) {
  const data = {};
  const names = [];
  list.forEach(row => {
    const ivls = row[0].split(" ");
    names.push(row[1]);
    const nameList = withAlias(row);
    nameList.forEach(name => {
      data[name] = ivls;
    });
  });
  names.sort().reverse();
  const allNames = Object.keys(data)
    .sort()
    .reverse();

  function dictionary(name) {
    return data[name];
  }
  dictionary.names = aliases => (aliases === true ? allNames : names).slice();
  return dictionary;
}
