const data = require("../dictionary/data/scales.json");

const out = {};

Object.keys(data).forEach(name => {
  const [intervals, names] = data[name];
  out[intervals] = [name, ...(names || [])];
});

console.log("module.exports = {");
Object.keys(out)
  .sort((a, b) => a.length - b.length)
  .forEach(name => {
    console.log(`"${name}":`, out[name], ",");
  });
console.log("};");
