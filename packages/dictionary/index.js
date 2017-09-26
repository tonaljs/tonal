import sdata from "./data/scales.json";
import cdata from "./data/chords.json";
import { chroma } from "tonal-pcset/index";

export const dictionary = raw => {
  const keys = Object.keys(raw).sort();
  const data = [];
  const index = [];

  const add = (name, ivls, chroma) => {
    data[name] = ivls;
    index[chroma] = index[chroma] || [];
    index[chroma].push(name);
  };

  keys.forEach(key => {
    const ivls = raw[key][0].split(" ");
    const alias = raw[key][1];
    const chr = chroma(ivls);

    add(key, ivls, chr);
    if (alias) alias.forEach(a => add(a, ivls, chr));
  });
  const allKeys = Object.keys(data).sort();

  const dict = name => data[name];
  dict.names = p => {
    if (typeof p === "string") return (index[p] || []).slice();
    else return (p === true ? allKeys : keys).slice();
  };
  return dict;
};

export const combine = (a, b) => {
  const dict = name => a(name) || b(name);
  dict.names = p => a.names(p).concat(b.names(p));
  return dict;
};

export const scale = dictionary(sdata);
export const chord = dictionary(cdata);
export const pcset = combine(scale, chord);
