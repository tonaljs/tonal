(function () {
'use strict';

var i;
var stack = [];

function h(tag, data) {
  var arguments$1 = arguments;

  var node;
  var children = [];

  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments$1[i]);
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (i = node.length; i--; ) {
        stack.push(node[i]);
      }
    } else if (node != null && node !== true && node !== false) {
      if (typeof node === "number") {
        node = node + "";
      }
      children.push(node);
    }
  }

  return typeof tag === "string"
    ? {
        tag: tag,
        data: data || {},
        children: children
      }
    : tag(data, children)
}

var globalInvokeLaterStack = [];

function app(props) {
  var appState;
  var appView = props.view;
  var appActions = {};
  var appEvents = {};
  var appMixins = props.mixins || [];
  var appRoot = props.root || document.body;
  var element;
  var oldNode;
  var renderLock;

  appMixins.concat(props).map(function(mixin) {
    mixin = typeof mixin === "function" ? mixin(emit) : mixin;

    Object.keys(mixin.events || []).map(function(key) {
      appEvents[key] = (appEvents[key] || []).concat(mixin.events[key]);
    });

    appState = merge(appState, mixin.state);
    initialize(appActions, mixin.actions);
  });

  requestRender(
    (oldNode = emit("load", (element = appRoot.children[0]))) === element &&
      (oldNode = element = null)
  );

  return emit

  function initialize(actions, withActions, lastName) {
    Object.keys(withActions || []).map(function(key) {
      var action = withActions[key];
      var name = lastName ? lastName + "." + key : key;

      if (typeof action === "function") {
        actions[key] = function(data) {
          emit("action", { name: name, data: data });

          var result = emit("resolve", action(appState, appActions, data));

          return typeof result === "function" ? result(update) : update(result)
        };
      } else {
        initialize(actions[key] || (actions[key] = {}), action, name);
      }
    });
  }

  function render(cb) {
    element = patch(
      appRoot,
      element,
      oldNode,
      (oldNode = emit("render", appView)(appState, appActions)),
      (renderLock = !renderLock)
    );
    while ((cb = globalInvokeLaterStack.pop())) { cb(); }
  }

  function requestRender() {
    if (appView && !renderLock) {
      requestAnimationFrame(render, (renderLock = !renderLock));
    }
  }

  function update(withState) {
    if (typeof withState === "function") {
      return update(withState(appState))
    }
    if (withState && (withState = emit("update", merge(appState, withState)))) {
      requestRender((appState = withState));
    }
    return appState
  }

  function emit(name, data) {
    return (
      (appEvents[name] || []).map(function(cb) {
        var result = cb(appState, appActions, data);
        if (result != null) {
          data = result;
        }
      }),
      data
    )
  }

  function merge(a, b) {
    var obj = {};

    for (var i in a) {
      obj[i] = a[i];
    }

    for (var i in b) {
      obj[i] = b[i];
    }

    return obj
  }

  function getKey(node) {
    if (node && (node = node.data)) {
      return node.key
    }
  }

  function createElement(node, isSVG) {
    if (typeof node === "string") {
      var element = document.createTextNode(node);
    } else {
      var element = (isSVG = isSVG || node.tag === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
        : document.createElement(node.tag);

      if (node.data && node.data.oncreate) {
        globalInvokeLaterStack.push(function() {
          node.data.oncreate(element);
        });
      }

      for (var i in node.data) {
        setData(element, i, node.data[i]);
      }

      for (var i = 0; i < node.children.length; ) {
        element.appendChild(createElement(node.children[i++], isSVG));
      }
    }

    return element
  }

  function setData(element, name, value, oldValue) {
    if (name === "key") {
    } else if (name === "style") {
      for (var i in merge(oldValue, (value = value || {}))) {
        element.style[i] = value[i] || "";
      }
    } else {
      try {
        element[name] = value;
      } catch (_) {}

      if (typeof value !== "function") {
        if (value) {
          element.setAttribute(name, value);
        } else {
          element.removeAttribute(name);
        }
      }
    }
  }

  function updateElement(element, oldData, data) {
    for (var i in merge(oldData, data)) {
      var value = data[i];
      var oldValue = i === "value" || i === "checked" ? element[i] : oldData[i];

      if (value !== oldValue) {
        setData(element, i, value, oldValue);
      }
    }

    if (data && data.onupdate) {
      globalInvokeLaterStack.push(function() {
        data.onupdate(element, oldData);
      });
    }
  }

  function removeElement(parent, element, data) {
    if (data && data.onremove) {
      data.onremove(element);
    } else {
      parent.removeChild(element);
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.tag != null && node.tag === oldNode.tag) {
      updateElement(element, oldNode.data, node.data);

      isSVG = isSVG || node.tag === "svg";

      var len = node.children.length;
      var oldLen = oldNode.children.length;
      var oldKeyed = {};
      var oldElements = [];
      var keyed = {};

      for (var i = 0; i < oldLen; i++) {
        var oldElement = (oldElements[i] = element.childNodes[i]);
        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElement, oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < len) {
        var oldElement = oldElements[i];
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        if (keyed[oldKey]) {
          i++;
          continue
        }

        var newKey = getKey(newChild);

        var keyedNode = oldKeyed[newKey] || [];

        if (null == newKey) {
          if (null == oldKey) {
            patch(element, oldElement, oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], newChild, isSVG);
            i++;
          } else if (keyedNode[0]) {
            element.insertBefore(keyedNode[0], oldElement);
            patch(element, keyedNode[0], keyedNode[1], newChild, isSVG);
          } else {
            patch(element, oldElement, null, newChild, isSVG);
          }

          j++;
          keyed[newKey] = newChild;
        }
      }

      while (i < oldLen) {
        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);
        if (null == oldKey) {
          removeElement(element, oldElements[i], oldChild.data);
        }
        i++;
      }

      for (var i in oldKeyed) {
        var keyedNode = oldKeyed[i];
        var reusableNode = keyedNode[1];
        if (!keyed[reusableNode.data.key]) {
          removeElement(element, keyedNode[0], reusableNode.data);
        }
      }
    } else if (element && node !== element.nodeValue) {
      if (typeof node === "string" && typeof oldNode === "string") {
        element.nodeValue = node;
      } else {
        element = parent.insertBefore(
          createElement(node, isSVG),
          (nextSibling = element)
        );
        removeElement(parent, nextSibling, oldNode.data);
      }
    }

    return element
  }
}

var npmUrl = function (name) { return ("https://www.npmjs.com/package/" + name + "/"); };

var nodeiCo = function (name) { return ("https://nodei.co/npm/" + name + ".png?mini=true"); };

var Install = function (ref) {
  var name = ref.name;
  var packageName = ref.packageName;

  return (
  h( 'a', { href: npmUrl(packageName || "tonal-" + name) },
    h( 'img', { src: nodeiCo(packageName || "tonal-" + name) })
  )
);
};

var Props = function (ref) {
  var names = ref.names;
  var values = ref.values;

  return (
  h( 'table', null,
    h( 'thead', null,
      h( 'tr', null,
        names.map(function (name) { return (
          h( 'td', null,
            h( 'strong', null, name )
          )
        ); })
      )
    ),
    h( 'tbody', null,
      h( 'tr', null, values.map(function (value) { return h( 'td', null, value ); }) )
    )
  )
);
};

var TONICS = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B B# Cb".split(
  " "
);

var Selector = function (ref) {
  var id = ref.id;
  var label = ref.label;
  var route = ref.route;
  var oct = ref.oct;
  var tonics = ref.tonics; if ( tonics === void 0 ) tonics = TONICS;

  var o = oct !== 0 && !oct ? "" : oct;
  return (
    h( 'p', { id: id, class: "Selector" },
      label && h( 'label', null, label ),
      tonics.map(function (t) { return h( Link, { to: route(t + o) }, t + o); })
    )
  );
};

var Code = function (ref) {
  var lines = ref.lines;

  return (
  h( 'pre', null,
    h( 'code', null, lines.join("\n") )
  )
);
};

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-note.svg)](https://www.npmjs.com/package/tonal-note)
 * [![tonal](https://img.shields.io/badge/tonal-note-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-note` is a collection of functions to manipulate musical notes in scientific notation
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * ## Usage
 *
 * ```js
 * import * as note from 'tonal-note'
 * // or const note = require('tonal-note')
 * note.name('bb2') // => 'Bb2'
 * note.chroma('bb2') // => 10
 * note.midi('a4') // => 69
 * note.freq('a4') // => 440
 * note.oct('G3') // => 3
 * 
 * // part of tonal
 * const tonal = require('tonal')
 * tonal.note.midi('d4') // => 62
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-note](https://nodei.co/npm/tonal-note.png?mini=true)](https://npmjs.org/package/tonal-note/)
 *
 * ## API Documentation
 *
 * @module note
 */

var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/;

function tokenize(str) {
  var m = REGEX.exec(str);
  if (!m) { return null; }
  return [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]];
}

var NO_NOTE = Object.freeze({
  pc: null,
  name: null,
  step: null,
  alt: null,
  oct: null,
  chroma: null,
  midi: null
});

var SEMI = [0, 2, 4, 5, 7, 9, 11];
var properties = function (str) {
  var tokens = tokenize(str);
  if (tokens === null || tokens[3] !== "") { return NO_NOTE; }
  var letter = tokens[0];
  var acc = tokens[1];
  var oct = tokens[2];
  var p = { letter: letter, acc: acc };
  p.pc = p.letter + p.acc;
  p.name = p.pc + oct;
  p.step = (p.letter.charCodeAt(0) + 3) % 7;
  p.alt = p.acc[0] === "b" ? -p.acc.length : p.acc.length;
  p.oct = oct.length ? +oct : null;
  p.chroma = (SEMI[p.step] + p.alt + 120) % 12;
  p.midi = p.oct !== null ? SEMI[p.step] + p.alt + 12 * (p.oct + 1) : null;
  return Object.freeze(p);
};

var cache = {};
function props(str) {
  if (typeof str !== "string") { return NO_NOTE; }
  return cache[str] === undefined ? (cache[str] = properties(str)) : cache[str];
}

/**
 * Test if the given string is a note
 * @param {String} name 
 * @return {boolean}
 */
var isNote = function (str) { return props(str) !== NO_NOTE; };

/**
 * Given a note name, return the note name or null if not valid note.
 * The note name will ALWAYS have the letter in upercase and accidentals
 * using # or b
 * 
 * Can be used to test if a string is a valid note name.
 *
 * @function
 * @param {Pitch|string}
 * @return {string}
 *
 * @example
 * const note = require('tonal-note')
 * note.name('cb2') // => 'Cb2'
 * ['c', 'db3', '2', 'g+', 'gx4'].map(note.name) // => ['C', 'Db3', null, null, 'G##4']
 */
var name = function (str) { return props(str).name; };

/**
 * Get pitch class of a note. The note can be a string or a pitch array.
 *
 * @function
 * @param {string|Pitch}
 * @return {string} the pitch class
 * @example
 * tonal.pc('Db3') // => 'Db'
 * tonal.map(tonal.pc, 'db3 bb6 fx2') // => [ 'Db', 'Bb', 'F##']
 */
var pc$1 = function (str) { return props(str).pc; };

/**
 * Get the note midi number
 * (an alias of tonal-midi `toMidi` function)
 *
 * @function
 * @param {string|Number} note - the note to get the midi number from
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * note.midi('C4') // => 60
 * note.midi(60) // => 60
 * @see midi.toMidi
 */
var midi = function (note) { return props(note).midi || +note || null; };

var midiToFreq = function (midi) { return typeof midi === "number" ? Math.pow(2, (midi - 69) / 12) * 440 : null; };

/**
 * Get the frequency of a note
 *
 * @function
 * @param {string|Number} note - the note name or midi note number
 * @return {Number} the frequency
 * @example
 * note.freq('A4') // => 440
 * note.freq(69) // => 440
 */
var freq = function (note) { return midiToFreq(props(note).midi) || midiToFreq(note); };

var L2 = Math.log(2);
var L440 = Math.log(440);
/**
 * Get the midi number from a frequency in hertz. The midi number can
 * contain decimals (with two digits precission)
 * 
 * @param {Number} frequency
 * @return {Number}
 * @example
 * note.freqToMidi(220)); //=> 57;
 * note.freqToMidi(261.62)); //=> 60;
 * note.freqToMidi(261)); //=> 59.96;
 */
var freqToMidi = function (freq) {
  var v = 12 * (Math.log(freq) - L440) / L2 + 69;
  return Math.round(v * 100) / 100;
};

/**
 * Return the chroma of a note. The chroma is the numeric equivalent to the
 * pitch class, where 0 is C, 1 is C# or Db, 2 is D... 11 is B
 *
 * @param {string} note - the note name
 * @return {Integer} the chroma number
 * @example
 * const note = require('tonal-note')
 * note.chroma('Cb') // => 11
 * ['C', 'D', 'E', 'F'].map(note.chroma) // => [0, 2, 4, 5]
 */
var chroma = function (str) { return props(str).chroma; };

/**
 * Get the octave of the given pitch
 *
 * @function
 * @param {string} note - the note
 * @return {Integer} the octave or null if doesn't have an octave or not a valid note
 * @example
 * note.oct('C#4') // => 4
 * note.oct('C') // => null
 * note.oct('blah') // => undefined
 */
var oct = function (str) { return props(str).oct; };

/**
 * Get the note step: a number equivalent of the note letter. 0 means C and
 * 6 means B. This is different from `chroma` (see example)
 *
 * @function
 * @param {string} note - the note
 * @return {Integer} a number between 0 and 6 or null if not a note
 * @example
 * note.step('C') // => 0
 * note.step('Cb') // => 0
 * // usually what you need is chroma
 * note.chroma('Cb') // => 6
 */
var step = function (str) { return props(str).step; };

/**
 * Get the note alteration: a number equivalent to the accidentals. 0 means
 * no accidentals, negative numbers are for flats, positive for sharps
 *
 * @function
 * @param {string|Pitch} note - the note
 * @return {Integer} the alteration
 * @example
 * note.alt('C') // => 0
 * note.alt('C#') // => 1
 * note.alt('Cb') // => -1
 */
var alt = function (str) { return props(str).alt; };

var LETTERS = "CDEFGAB";
/**
 * Given a step number return it's letter (0 = C, 1 = D, 2 = E)
 * @param {number} step 
 * @return {string} the letter
 * @example
 * note.stepToLetter(3) // => "F"
 */
var stepToLetter = function (step) { return LETTERS[step]; };

var fillStr = function (s, n) { return Array(n + 1).join(s); };
var numToStr = function (num, op) { return (typeof num !== "number" ? "" : op(num)); };

/**
 * Given an alteration number, return the accidentals
 * @param {Number} alt 
 * @return {String}
 * @example
 * note.altToAcc(-3) // => 'bbb'
 */
var altToAcc = function (alt) { return numToStr(alt, function (alt) { return (alt < 0 ? fillStr("b", -alt) : fillStr("#", alt)); }); };

var build = function (ref) {
  var step = ref.step;
  var alt = ref.alt;
  var oct = ref.oct;

  var pc = stepToLetter(step) + altToAcc(alt);
  return oct === undefined ? pc : pc + oct;
};

var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");

/**
 * Given a midi number, returns a note name. The altered notes will have
 * flats unless explicitly set with the optional `useSharps` parameter.
 *
 * @function
 * @param {number} midi - the midi note number
 * @param [boolean] useSharps - (Optional) set to true to use sharps instead of flats
 * @return {string} the note name
 * @example
 * const note = require('tonal-note')
 * note.fromMidi(61) // => 'Db4'
 * note.fromMidi(61, true) // => 'C#4'
 * // it rounds to nearest note
 * note.fromMidi(61.7) // => 'D4'
 */
function fromMidi(num, sharps) {
  num = Math.round(num);
  var pcs = sharps === true ? SHARPS : FLATS;
  var pc = pcs[num % 12];
  var o = Math.floor(num / 12) - 1;
  return pc + o;
}


var note$1 = Object.freeze({
	tokenize: tokenize,
	props: props,
	isNote: isNote,
	name: name,
	pc: pc$1,
	midi: midi,
	midiToFreq: midiToFreq,
	freq: freq,
	freqToMidi: freqToMidi,
	chroma: chroma,
	oct: oct,
	step: step,
	alt: alt,
	stepToLetter: stepToLetter,
	altToAcc: altToAcc,
	build: build,
	fromMidi: fromMidi
});

var rotate$1 = function (times, arr) {
  var len = arr.length;
  var n = (times % len + len) % len;
  return arr.slice(n, len).concat(arr.slice(0, n));
};

var compact = function (arr) { return arr.filter(function (n) { return n === 0 || n; }); };

// a function that get note heights (with negative number for pitch classes)
var height = function (n) {
  var m = midi(n);
  return m !== null ? m : midi(n + "-100");
};

/**
 * Sort an array of notes in ascending order
 * 
 * @private
 * @param {String|Array} notes
 * @return {Array} sorted array of notes
 */
function sort(src) {
  return compact(src.map(name)).sort(function (a, b) { return height(a) > height(b); });
}

/**
 * Get sorted notes with duplicates removed
 * 
 * @private
 * @function
 * @param {Array} notes
 */
function unique(arr) {
  return sort(arr).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
}

/**
 * Randomizes the order of the specified array in-place, using the Fisher–Yates shuffle.
 *
 * @private
 * @function
 * @param {Array|String} arr - the array
 * @return {Array} the shuffled array
 *
 * @example
 * import * as array from 'tonal-array'
 * array.shuffle(["C", "D", "E", "F"])
 */
var shuffle = function (arr) {
  var i, t;
  var m = arr.length;
  while (m) {
    i = (Math.random() * m--) | 0;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
};

/**
 * Get all permutations of a list
 * http://stackoverflow.com/questions/9960908/permutations-in-javascript
 * 
 * @param {Array|Strng} list - the list
 * @return {Array<Array>} an array with all the permutations
 */
var permutations$1 = function (arr) {
  if (arr.length === 0) { return [[]]; }
  return permutations$1(arr.slice(1)).reduce(function(acc, perm) {
    return acc.concat(
      arr.map(function(e, pos) {
        var newPerm = perm.slice();
        newPerm.splice(pos, 0, arr[0]);
        return newPerm;
      })
    );
  }, []);
};

// ascending range
function ascR(b, n) {
  for (var a = []; n--; a[n] = n + b){  }
  return a;
}
// descending range
function descR(b, n) {
  for (var a = []; n--; a[n] = b - n){  }
  return a;
}

// create a range between a and b
function range(a, b) {
  return a === null || b === null
    ? []
    : a < b ? ascR(a, b - a + 1) : descR(a, a - b + 1);
}


var array = Object.freeze({
	rotate: rotate$1,
	compact: compact,
	sort: sort,
	unique: unique,
	shuffle: shuffle,
	permutations: permutations$1,
	range: range
});

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-interval.svg)](https://www.npmjs.com/package/tonal-interval)
 * [![tonal](https://img.shields.io/badge/tonal-interval-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-interval` is a collection of functions to create and manipulate music intervals.
 *
 * The intervals are strings in shorthand notation. Two variations are supported:
 *
 * - standard shorthand notation: type and number, for example: 'M3', 'd-4'
 * - inverse shorthand notation: number and then type, for example: '3M', '-4d'
 *
 * The problem with the standard shorthand notation is that some strings can be
 * parsed as notes or intervals, for example: 'A4' can be note A in 4th octave
 * or an augmented four. To remove ambiguity, the prefered notation in tonal is the
 * inverse shortand notation.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * ## Usage
 *
 * ```js
 * import * as interval from 'tonal-interval'
 * // or const interval = require('tonal-interval')
 * interval.semitones('4P') // => 5
 * interval.invert('3m') // => '6M'
 * interval.simplify('9m') // => '2m'
 * ```
 *
 * ## Install
 *
 * [![npm install tonal-interval](https://nodei.co/npm/tonal-interval.png?mini=true)](https://npmjs.org/package/tonal-interval/)
 *
 * ## API Documentation
 *
 * @module interval
 */
// shorthand tonal notation (with quality after number)
var IVL_TNL = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
// standard shorthand notation (with quality before number)
var IVL_STR = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
var REGEX$1 = new RegExp("^" + IVL_TNL + "|" + IVL_STR + "$");
var SIZES = [0, 2, 4, 5, 7, 9, 11];
var TYPES = "PMMPPMM";
var CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

var tokenize$1 = function (str) {
  var m = REGEX$1.exec(str);
  return m === null ? null : m[1] ? [m[1], m[2]] : [m[4], m[3]];
};

var NO_IVL = Object.freeze({
  name: null,
  num: null,
  q: null,
  step: null,
  alt: null,
  dir: null,
  type: null,
  simple: null,
  semitones: null,
  chroma: null,
  ic: null
});

var fillStr$1 = function (s, n) { return Array(Math.abs(n) + 1).join(s); };

var qToAlt = function (type, q) {
  if (q === "M" && type === "M") { return 0; }
  if (q === "P" && type === "P") { return 0; }
  if (q === "m" && type === "M") { return -1; }
  if (/^A+$/.test(q)) { return q.length; }
  if (/^d+$/.test(q)) { return type === "P" ? -q.length : -q.length - 1; }
  return null;
};

var altToQ = function (type, alt) {
  if (alt === 0) { return type === "M" ? "M" : "P"; }
  else if (alt === -1 && type === "M") { return "m"; }
  else if (alt > 0) { return fillStr$1("A", alt); }
  else if (alt < 0) { return fillStr$1("d", type === "P" ? alt : alt + 1); }
  else { return null; }
};

var numToStep = function (num) { return (Math.abs(num) - 1) % 7; };

var properties$1 = function (str) {
  var t = tokenize$1(str);
  if (t === null) { return NO_IVL; }
  var p = { num: +t[0], q: t[1] };
  p.step = numToStep(p.num);
  p.type = TYPES[p.step];
  if (p.type === "M" && p.q === "P") { return NO_IVL; }

  p.name = "" + p.num + p.q;
  p.dir = p.num < 0 ? -1 : 1;
  p.simple = p.num === 8 || p.num === -8 ? p.num : p.dir * (p.step + 1);
  p.alt = qToAlt(p.type, p.q);
  p.oct = Math.floor((Math.abs(p.num) - 1) / 7);
  p.semitones = p.dir * (SIZES[p.step] + p.alt + 12 * p.oct);
  p.chroma = ((p.dir * (SIZES[p.step] + p.alt)) % 12 + 12) % 12;
  p.ic = CLASSES[p.chroma];
  return Object.freeze(p);
};

var cache$1 = {};
/**
 * Get interval properties. It returns an object with:
 *
 * - name: name
 * - num: number
 * - q: quality
 * - step: step 
 * - alt: alteration
 * - dir: direction (1 ascending, -1 descending)
 * - type: "P" or "M" for perfectable or majorable
 * - simple: the simplified number
 * - semitones: the size in semitones
 * - chroma: the interval chroma
 * - ic: the interval class
 *
 * @function
 * @param {String} interval - the interval
 * @return {Object} the interval in the form [number, alt]
 */
function props$1(str) {
  if (typeof str !== "string") { return NO_IVL; }
  return cache$1[str] || (cache$1[str] = properties$1(str));
}

/**
 * Get the number of the interval 
 *
 * @function
 * @param {String} interval - the interval
 * @return {Integer} 
 * @example
 * interval.num('m2') // => 2
 * interval.num('P9') // => 9
 * interval.num('P-4') // => -4
 */
var num = function (str) { return props$1(str).num; };

/**
 * Get interval name. Can be used to test if it's an interval. It accepts intervals
 * as pitch or string in shorthand notation or tonal notation. It returns always
 * intervals in tonal notation.
 *
 * @function
 * @param {String} interval - the interval string or array
 * @return {String} the interval name or null if not valid interval
 * @example
 * interval.name('m-3') // => '-3m'
 * interval.name('3') // => null
 */
var name$1 = function (str) { return props$1(str).name; };

/**
 * Get interval type. Can be perfectable (1, 4, 5) or majorable (2, 3, 6, 7)
 * It does NOT return the actual quality.
 *
 * @function
 * @param {String} interval
 * @return {String} 'P' for perfectables, 'M' for majorables or null if not
 * valid interval
 * @example
 * interval.type('5A') // => 'P'
 */
var type = function (str) { return props$1(str).type; };

/**
 * Get size in semitones of an interval
 * 
 * @function
 * @param {String} ivl
 * @return {Integer} the number of semitones or null if not an interval
 * @example
 * import { semitones } from 'tonal-interval'
 * semitones('P4') // => 5
 * // or using tonal
 * tonal.interval.semitones('P5') // => 7
 */
var semitones = function (str) { return props$1(str).semitones; };

/**
 * Get the chroma of the interval. The chroma is a number between 0 and 7
 * that represents the position within an octave (pitch set)
 * 
 * @function
 * @param {String} str 
 * @return {Number}
 */
var chroma$1 = function (str) { return props$1(str).chroma; };

/**
 * Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
 * number of a given interval.
 *
 * In musical set theory, an interval class is the shortest distance in
 * pitch class space between two unordered pitch classes
 *
 * As paramter you can pass an interval in shorthand notation, an interval in
 * array notation or the number of semitones of the interval
 *
 * @function
 * @param {String|Integer} interval - the interval or the number of semitones
 * @return {Integer} A value between 0 and 6
 *
 * @example
 * interval.ic('P8') // => 0
 * interval.ic('m6') // => 4
 * ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
 */
var ic = function (str) { return props$1(str).ic; };

/**
 * Given a interval property object, get the interval name
 *
 * The properties must contain a `num` *or* `step`, and `alt`:
 * 
 * - num: the interval number
 * - step: the interval step (overrides the num property)
 * - alt: the interval alteration
 * - oct: (Optional) the number of octaves
 * - dir: (Optional) the direction
 * 
 * @function
 * @param {Object} props - the interval property object
 *
 * @return {String} the interval name
 * @example
 * interval.build({ step: 1, alt: -1, oct: 0, dir: 1 }) // => "1d"
 * interval.build({ num: 9, alt: -1 }) // => '9m'
 */
var build$1 = function (ref) {
  if ( ref === void 0 ) ref = {};
  var num = ref.num;
  var step = ref.step;
  var alt = ref.alt;
  var oct = ref.oct; if ( oct === void 0 ) oct = 1;
  var dir = ref.dir;

  if (step !== undefined) { num = step + 1 + 7 * oct; }
  if (num === undefined) { return null; }

  var d = dir < 0 ? "-" : "";
  var type = TYPES[numToStep(num)];
  return d + num + altToQ(type, alt);
};

/**
 * Get the simplified version of an interval.
 *
 * @function
 * @param {String} interval - the interval to simplify
 * @return {String} the simplified interval
 *
 * @example
 * interval.simplify('9M') // => '2M'
 * ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'].map(interval.simplify)
 * // => [ '8P', '2M', '3M', '4P', '5P', '6M', '7M', '8P' ]
 * interval.simplify('2M') // => '2M'
 * interval.simplify('-2M') // => '7m'
 */
var simplify = function (str) {
  var p = props$1(str);
  if (p === NO_IVL) { return null; }
  return p.simple + p.q;
};

/**
 * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
 * of an interval.
 *
 * @function
 * @param {String} interval - the interval to invert in interval shorthand
 * notation or interval array notation
 * @return {String} the inverted interval
 *
 * @example
 * interval.invert('3m') // => '6M'
 * interval.invert('2M') // => '7m'
 */
var invert = function (str) {
  var p = props$1(str);
  if (p === NO_IVL) { return null; }
  var step = (7 - p.step) % 7;
  var alt = p.type === "P" ? -p.alt : -(p.alt + 1);
  return build$1({ step: step, alt: alt, oct: p.oct, dir: p.dir });
};

// interval numbers
var IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
// interval qualities
var IQ = "P m M m M P d P m M m M".split(" ");

/**
 * Get interval name from semitones number. Since there are several interval
 * names for the same number, the name it's arbitraty, but deterministic.
 * 
 * @function
 * @param {Integer} num - the number of semitones (can be negative)
 * @return {String} the interval name
 * @example
 * import { fromSemitones } from 'tonal-interval'
 * fromSemitones(7) // => '5P'
 * // or using tonal
 * tonal.fromSemitones(-7) // => '-5P'
 */
var fromSemitones = function (num) {
  var d = num < 0 ? -1 : 1;
  var n = Math.abs(num);
  var c = n % 12;
  var o = Math.floor(n / 12);
  return d * (IN[c] + 7 * o) + IQ[c];
};


var interval = Object.freeze({
	tokenize: tokenize$1,
	props: props$1,
	num: num,
	name: name$1,
	type: type,
	semitones: semitones,
	chroma: chroma$1,
	ic: ic,
	build: build$1,
	simplify: simplify,
	invert: invert,
	fromSemitones: fromSemitones
});

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-distance.svg)](https://www.npmjs.com/package/tonal-distance)
 * [![tonal](https://img.shields.io/badge/tonal-distance-yellow.svg)](https://github.com/danigb/tonal/tree/master/packages/tonal/distance)
 * 
 * Transpose notes by intervals and find distances between notes
 *
 * @example
 * // using ES6 import
 * import { interval, semitones, transpose } from 'tonal-distance'
 * semitones('C' ,'D') // => 2
 * interval('C4', 'G4') // => '5P'
 * transpose('C4', 'P5') // => 'G4'
 *
 * // included in tonal facade
 * const tonal = require('tonal');
 * tonal.distance.transpose('C4', 'P5')
 * tonal.distance.transposeBy('P5', 'C4')
 * 
 * @module distance
 */
// Map from letter step to number of fifths starting from 'C':
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
var FIFTHS = [0, 2, 4, -1, 1, 3, 5];

// Given a number of fifths, return the octaves they span
var fOcts = function (f) { return Math.floor(f * 7 / 12); };

// Get the number of octaves it span each step
var FIFTH_OCTS = FIFTHS.map(fOcts);

var encode$1 = function (ref) {
  var step$$1 = ref.step;
  var alt$$1 = ref.alt;
  var oct$$1 = ref.oct;
  var dir = ref.dir; if ( dir === void 0 ) dir = 1;

  var f = FIFTHS[step$$1] + 7 * alt$$1;
  if (oct$$1 === null) { return [dir * f]; }
  var o = oct$$1 - FIFTH_OCTS[step$$1] - 4 * alt$$1;
  return [dir * f, dir * o];
};

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ['F', 'C', 'G', 'D', 'A', 'E', 'B'] we have:
var STEPS = [3, 0, 4, 1, 5, 2, 6];

// Return the number of fifths as if it were unaltered
function unaltered(f) {
  var i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
}

var decode$1 = function (f, o, dir) {
  var step$$1 = STEPS[unaltered(f)];
  var alt$$1 = Math.floor((f + 1) / 7);
  if (o === undefined) { return { step: step$$1, alt: alt$$1, dir: dir }; }
  var oct$$1 = o + 4 * alt$$1 + FIFTH_OCTS[step$$1];
  return { step: step$$1, alt: alt$$1, oct: oct$$1, dir: dir };
};

var memo = function (fn, cache) {
  if ( cache === void 0 ) cache = {};

  return function (str) { return cache[str] || (cache[str] = fn(str)); };
};

var encoder = function (props$$1) { return memo(function (str) {
    var p = props$$1(str);
    return p.name === null ? null : encode$1(p);
  }); };

var encodeNote = encoder(props);
var encodeIvl = encoder(props$1);

/**
 * Transpose a note by an interval. The note can be a pitch class.
 * 
 * This function can be partially applied.
 * 
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranpose } from 'tonal-distance'
 * transpose('d3', '3M') // => 'F#3'
 * // it works with pitch classes
 * transpose('D', '3M') // => 'F#'
 * // can be partially applied
 * ['C', 'D', 'E', 'F', 'G'].map(transpose('M3)) // => ['E', 'F#', 'G#', 'A', 'B']
 */
function transpose(note, interval) {
  if (arguments.length === 1) { return function (i) { return transpose(note, i); }; }
  var n = encodeNote(note);
  var i = encodeIvl(interval);
  if (n === null || i === null) { return null; }
  var tr = n.length === 1 ? [n[0] + i[0]] : [n[0] + i[0], n[1] + i[1]];
  return build(decode$1(tr[0], tr[1]));
}

/**
 * Transpose a pitch class by a number of perfect fifths. 
 * 
 * It can be partially applied.
 *
 * @function
 * @param {String} pitchClass - the pitch class 
 * @param {Integer} fifhts - the number of fifths
 * @return {String} the transposed pitch class
 * 
 * @example
 * import { trFifths } from 'tonal-transpose'
 * [0, 1, 2, 3, 4].map(trFifths('C')) // => ['C', 'G', 'D', 'A', 'E']
 * // or using tonal
 * tonal.trFifths('G4', 1) // => 'D'
 */

function trFifths(note, fifths) {
  if (arguments.length === 1) { return function (f) { return trFifths(note, f); }; }
  var n = encodeNote(note);
  if (n === null) { return null; }
  return build(decode$1(n[0] + fifths));
}

/**
 * Get the distance in fifths between pitch classes
 * 
 * Can be partially applied.
 * 
 * @param {String} to - note or pitch class
 * @param {String} from - note or pitch class 
 */
function fifths(from, to) {
  if (arguments.length === 1) { return function (to) { return fifths(from, to); }; }
  var f = encodeNote(from);
  var t = encodeNote(to);
  if (t === null || f === null) { return null; }
  return t[0] - f[0];
}

/**
 * The same as transpose with the arguments inverted.
 * 
 * Can be partially applied.
 * 
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranposeBy } from 'tonal-distance'
 * transposeBy('3m', '5P') // => '7m'
 */
function transposeBy(interval, note) {
  if (arguments.length === 1) { return function (n) { return transpose(n, interval); }; }
  return transpose(note, interval);
}

var isDescending = function (e) { return e[0] * 7 + e[1] * 12 < 0; };
var decodeIvl = function (i) { return isDescending(i) ? decode$1(-i[0], -i[1], -1) : decode$1(i[0], i[1], 1); };

function addIntervals(ivl1, ivl2, dir) {
  var i1 = encodeIvl(ivl1);
  var i2 = encodeIvl(ivl2);
  if (i1 === null || i2 === null) { return null; }
  var i = [i1[0] + dir * i2[0], i1[1] + dir * i2[1]];
  return build$1(decodeIvl(i));
}

/**
 * Add two intervals 
 * 
 * Can be partially applied.
 * 
 * @param {String} interval1
 * @param {String} interval2
 * @return {String} the resulting interval
 * @example
 * import { add } from 'tonal-distance'
 * add('3m', '5P') // => '7m'
 */
function add(ivl1, ivl2) {
  if (arguments.length === 1) { return function (i2) { return add(ivl1, i2); }; }
  return addIntervals(ivl1, ivl2, 1);
}

/**
 * Subtract two intervals
 * 
 * Can be partially applied
 * 
 * @param {String} minuend
 * @param {String} subtrahend
 * @return {String} interval diference
 */
function subtract(ivl1, ivl2) {
  if (arguments.length === 1) { return function (i2) { return add(ivl1, i2); }; }
  return addIntervals(ivl1, ivl2, -1);
}

/**
 * Find the interval between two pitches. It works with pitch classes 
 * (both must be pitch classes and the interval is always ascending)
 * 
 * Can be partially applied
 *
 * @param {String} from - distance from
 * @param {String} to - distance to
 * @return {String} the interval distance
 *
 * @example
 * import { interval } from 'tonal-distance'
 * interval('C2', 'C3') // => 'P8'
 * interval('G', 'B') // => 'M3'
 * 
 * // or use tonal
 * var tonal = require('tonal')
 * tonal.distance.interval('M2', 'P5') // => 'P4'
 */
function interval$1(from, to) {
  if (arguments.length === 1) { return function (t) { return interval$1(from, t); }; }
  var f = encodeNote(from);
  var t = encodeNote(to);
  if (f === null || t === null || f.length !== t.length) { return null; }
  var d =
    f.length === 1
      ? [t[0] - f[0], -Math.floor((t[0] - f[0]) * 7 / 12)]
      : [t[0] - f[0], t[1] - f[1]];
  return build$1(decodeIvl(d));
}

/**
 * Get the distance between two notes in semitones
 * 
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from 'tonal-distance'
 * semitones('C3', 'A2') // => -3
 * // or use tonal
 * tonal.distance.semitones('C3', 'G3') // => 7
 */
function semitones$1(from, to) {
  if (arguments.length === 1) { return function (t) { return semitones$1(from, t); }; }
  var f = props(from);
  var t = props(to);
  return f.midi !== null && t.midi !== null
    ? t.midi - f.midi
    : f.chroma !== null && t.chroma !== null
      ? (t.chroma - f.chroma + 12) % 12
      : null;
}


var distance = Object.freeze({
	transpose: transpose,
	trFifths: trFifths,
	fifths: fifths,
	transposeBy: transposeBy,
	addIntervals: addIntervals,
	add: add,
	subtract: subtract,
	interval: interval$1,
	semitones: semitones$1
});

var arguments$1 = arguments;
/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 * [![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-key` is a collection of functions to query about tonal keys.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * const key = require('tonal-key')
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 * key.relative('minor', 'C major') // => 'A minor'
 *
 * @module key
 */
var MODES = "major dorian phrygian lydian mixolydian minor locrian ionian aeolian".split(
  " "
);
var NUMS = [0, 1, 2, 3, 4, 5, 6, 0, 5];
var NOTES = "C D E F G A B".split(" ");
var CHORDS = "Maj7 m7 m7 Maj7 7 m7 m7b5".split(" ");
var FIFTHS$1 = [0, 2, 4, -1, 1, 3, 5, 0, 3];

var modenum = function (mode) { return NUMS[MODES.indexOf(mode)]; };

/**
 * Get a list of valid mode names. The list of modes will be always in
 * increasing order (ionian to locrian)
 *
 * @function
 * @param {Boolean} alias - true to get aliases names
 * @return {Array} an array of strings
 * @example
 * key.modes() // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
 * // 'mixolydian', 'aeolian', 'locrian' ]
 * key.modes(true) // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
 * // 'mixolydian', 'aeolian', 'locrian', 'major', 'minor' ]
 */
var modeNames = function (aliases) { return aliases === true ? MODES.slice() : MODES.slice(0, 7); };

/**
 * Create a major key from alterations
 * 
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 * @example
 * var key = require('tonal-key')
 * key.fromAlter(2) // => 'D major'
 */
var fromAlter = function (i) { return trFifths("C", i) + " major"; };

var names = function (alt$$1) {
  if ( alt$$1 === void 0 ) alt$$1 = 4;

  alt$$1 = Math.abs(alt$$1);
  var result = [];
  for (var i = -alt$$1; i <= alt$$1; i++) { result.push(fromAlter(i)); }
  return result;
};

var NO_KEY = Object.freeze({
  name: null,
  tonic: null,
  mode: null,
  modenum: null,
  intervals: [],
  scale: [],
  alteration: null,
  accidentals: null
});

var properties$2 = function (name$$1) {
  var p = tokenize$2(name$$1);
  if (p[0] === null) { return NO_KEY; }
  var k = { tonic: p[0], mode: p[1] };
  k.name = k.tonic + " " + k.mode;
  k.modenum = modenum(k.mode);
  var cs = rotate$1(k.modenum, NOTES);
  k.intervals = cs.map(interval$1(cs[0]));
  k.scale = k.intervals.map(transpose(k.tonic));
  k.alteration = fifths("C", k.tonic) - FIFTHS$1[MODES.indexOf(k.mode)];
  k.accidentals = altToAcc(k.alteration);
  return Object.freeze(k);
};

var memo$1 = function (fn, cache) {
  if ( cache === void 0 ) cache = {};

  return function (str) { return cache[str] || (cache[str] = fn(str)); };
};

/**
 * Return the a key properties object with the following information:
 *
 * - name: name
 * - tonic: key tonic
 * - mode: key mode
 * - modenum: mode number (0 major, 1 dorian, ...)
 * - intervals: the scale intervals
 * - scale: the scale notes
 * - alteration: alteration number
 * - accidentals: accidentals 
 *
 * @function
 * @param {String} name - the key name
 * @return {Object} the key properties object or null if not a valid key
 * @example
 * var key = require('tonal-key')
 * key.props('C3 dorian') // => { tonic: 'C', mode: 'dorian', ... }
 */
var props$2 = memo$1(properties$2);

/**
 * Get scale of a key
 *
 * @function
 * @param {String|Object} key
 * @return {Array} the key scale
 * @example
 * key.scale('A major') // => [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ]
 * key.scale('Bb minor') // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab' ]
 * key.scale('C dorian') // => [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ]
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 */
var scale = function (str) { return props$2(str).scale; };

/**
 * Get key alteration. The alteration is a number indicating the number of
 * sharpen notes (positive) or flaten notes (negative)
 * 
 * @function
 * @param {String|Integer} key
 * @return {Integer}
 * @example
 * var key = require('tonal-keys')
 * key.alteration('A major') // => 3
 */
var alteration = function (str) { return props$2(str).alteration; };

/**
 * Get key accidentals: a string with sharps or flats
 * 
 * @function
 * @param {String} key
 * @return {String}
 * @example
 * import * as key from 'tonal-keys'
 * key.accidentals('A major') // => "###"
 */
var accidentals = function (str) { return props$2(str).accidentals; };

/**
 * Get a list of the altered notes of a given key. The notes will be in
 * the same order than in the key signature.
 * 
 * @function
 * @param {String} key - the key name
 * @return {Array}
 * @example
 * var key = require('tonal-keys')
 * key.alteredNotes('Eb major') // => [ 'Bb', 'Eb', 'Ab' ]
 */
var alteredNotes = function (name$$1) {
  var alt$$1 = props$2(name$$1).alteration;
  if (alt$$1 === null) { return null; }
  return alt$$1 === 0
    ? []
    : alt$$1 > 0
      ? range(1, alt$$1).map(trFifths("B"))
      : range(-1, alt$$1).map(trFifths("F"));
};

/**
 * Get key chords
 * 
 * @function
 * @param {String} name - the key name
 * @return {Array}
 * @example
 * key.chords("A major") // => ["AMaj7", "Bm7", "C#m7", "DMaj7", ..,]
 */
var chords = function (str) {
  var p = props$2(str);
  if (!p.name) { return []; }
  var chords = rotate$1(p.modenum, CHORDS);
  return p.scale.map(function (tonic, i) { return tonic + chords[i]; });
};

/**
 * Get secondary dominant key chords
 * 
 * @function
 * @param {String} name - the key name
 * @return {Array}
 * @example
 * key.secDomChords("A major") // => ["E7", "F#7", ...]
 */

var secDomChords = function (name$$1) {
  var p = props$2(name$$1);
  if (!p.name) { return []; }
  return p.scale.map(function (t) { return transpose(t, "P5") + "7"; });
};

/**
 * Get relative of a key. Two keys are relative when the have the same
 * key signature (for example C major and A minor)
 *
 * It can be partially applied.
 *
 * @function
 * @param {String} mode - the relative destination
 * @param {String} key - the key source
 * @example
 * key.relative('dorian', 'B major') // => 'C# dorian'
 * // partial application
 * var minor = key.relative('minor')
 * minor('C major') // => 'A minor'
 * minor('E major') // => 'C# minor'
 */
var relative = function (mode, key) {
  if (arguments$1.length === 1) { return function (key) { return relative(mode, key); }; }
  var num = modenum(mode.toLowerCase());
  if (num === undefined) { return null; }
  var k = props$2(key);
  if (k.name === null) { return null; }
  return trFifths(k.tonic, FIFTHS$1[num] - FIFTHS$1[k.modenum]) + " " + mode;
};

/**
 * Split the key name into its components (pitch class tonic and mode name)
 * 
 * @function
 * @param {String} name 
 * @return {Array} an array in the form [tonic, key]
 * @example
 * key.tokenize('C major') // => ['C', 'major']
 */
var tokenize$2 = function (name$$1) {
  var p = tokenize(name$$1);
  p[3] = p[3].toLowerCase();
  if (p[0] === "" || MODES.indexOf(p[3]) === -1) { return [null, null]; }
  return [p[0] + p[1], p[3]];
};


var key = Object.freeze({
	modeNames: modeNames,
	fromAlter: fromAlter,
	names: names,
	props: props$2,
	scale: scale,
	alteration: alteration,
	accidentals: accidentals,
	alteredNotes: alteredNotes,
	chords: chords,
	secDomChords: secDomChords,
	relative: relative,
	tokenize: tokenize$2
});

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-pcset.svg?style=flat-square)](https://www.npmjs.com/package/tonal-pcset)
 * [![tonal](https://img.shields.io/badge/tonal-pcset-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-pcset` is a collection of functions to work with pitch class sets, oriented
 * to make comparations (isEqual, isSubset, isSuperset)
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * You can install via npm: `npm i --save tonal-pcset`
 *
 * ```js
 * var pcset = require('tonal-pcset')
 * pcset.isEqual('c2 d5 e6', 'c6 e3 d1') // => true
 * ```
 *
 * ## API documentation
 *
 * @module pcset
 */
var chr = function (str) { return chroma(str) || chroma$1(str) || 0; };
var pcsetNum = function (set) { return parseInt(chroma$2(set), 2); };
var compact$1 = function (arr) { return arr.filter(function (x) { return x; }); };

/**
 * Get chroma of a pitch class set. A chroma identifies each set uniquely.
 * It's a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch class set
 * @return {String} a binary representation of the pitch class set
 * @example
 * pcset.chroma(["C", "D", "E"]) // => '1010100000000'
 */
function chroma$2(set) {
  if (isChroma(set)) { return set; }
  if (!Array.isArray(set)) { return ""; }
  var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  set.map(chr).forEach(function (i) {
    b[i] = 1;
  });
  return b.join("");
}

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with '0'
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with '0'
 * @return {Array<String>} an array with all the modes of the chroma
 *
 * @example
 * pcset.modes(["C", "D", "E"]).map(pcset.intervals)
 */
function modes(set, normalize) {
  normalize = normalize !== false;
  var binary = chroma$2(set).split("");
  return compact$1(
    binary.map(function(_, i) {
      var r = rotate$1(i, binary);
      return normalize && r[0] === "0" ? null : r.join("");
    })
  );
}

var REGEX$2 = /^[01]{12}$/;
/**
 * Test if the given string is a pitch class set chroma.
 * @param {String} chroma - the pitch class set chroma
 * @return {Boolean} true if its a valid pcset chroma
 * @example
 * pcset.isChroma('101010101010') // => true
 * pcset.isChroma('101001') // => false
 */
function isChroma(set) {
  return REGEX$2.test(set);
}

var IVLS = "1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M".split(" ");
/**
 * Given a pcset (notes or chroma) return it's intervals
 * @param {String|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * pcset.intervals('1010100000000') => ["1P", "2M", "3M"]
 */
function intervals$1(set) {
  if (!isChroma(set)) { return []; }
  return compact$1(
    set.split("").map(function(d, i) {
      return d === "1" ? IVLS[i] : null;
    })
  );
}

/**
 * Test if two pitch class sets are identical
 *
 * @param {Array|String} set1 - one of the pitch class sets
 * @param {Array|String} set2 - the other pitch class set
 * @return {Boolean} true if they are equal
 * @example
 * pcset.isEqual('c2 d3', 'c5 d2') // => true
 */
function isEqual(s1, s2) {
  if (arguments.length === 1) { return function (s) { return isEqual(s1, s); }; }
  return chroma$2(s1) === chroma$2(s2);
}

/**
 * Test if a pitch class set is a subset of another
 *
 * @param {Array|String} test - the set to test
 * @param {Array|String} set - the base set to test against
 * @return {Boolean} true if the test set is a subset of the set
 * @example
 * pcset.subset('c d e', 'C2 D4 D5 C6') // => true
 */
function isSubset(test, set) {
  test = pcsetNum(test);
  return (test & pcsetNum(set)) === test;
}

/**
 * Test if a pitch class set is a superset
 *
 * @param {Array|String} test - the set to test
 * @param {Array|String} set - the base set to test against
 * @return {Boolean} true if the test set is a superset of the set
 * @example
 * pcset.isSuperset('c d e', 'C2 D4 F4 D5 E5 C6') // => true
 */
function isSuperset(test, set) {
  test = pcsetNum(test);
  return (test | pcsetNum(set)) === test;
}

/**
 * Test if a given pitch class set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pcset
 * @example
 * pcset.includes('c d e', 'C4') // => true
 * pcset.includes('c d e', 'C#4') // => false
 */
function includes(set, note) {
  if (arguments.length > 1) { return includes(set)(note); }
  set = chroma$2(set);
  return function(note) {
    return set[chr(note)] === "1";
  };
}

/**
 * Filter a list with a pitch class set
 *
 * @param {Array|String} set - the pitch class set notes
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * pcset.filter(c d e', 'c2 c#2 d2 c3 c#3 d3') // => [ 'c2', 'd2', 'c3', 'd3' ])
 * pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ 'c2', 'c3' ])
 */
function filter(set, notes) {
  if (arguments.length === 1) { return function (n) { return filter(set, n); }; }
  return notes.filter(includes(set));
}


var pcset = Object.freeze({
	chroma: chroma$2,
	modes: modes,
	isChroma: isChroma,
	intervals: intervals$1,
	isEqual: isEqual,
	isSubset: isSubset,
	isSuperset: isSuperset,
	includes: includes,
	filter: filter
});

var chromatic = ["1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M"];
var lydian = ["1P 2M 3M 4A 5P 6M 7M"];
var major = ["1P 2M 3M 4P 5P 6M 7M",["ionian"]];
var mixolydian = ["1P 2M 3M 4P 5P 6M 7m",["dominant"]];
var dorian = ["1P 2M 3m 4P 5P 6M 7m"];
var aeolian = ["1P 2M 3m 4P 5P 6m 7m",["minor"]];
var phrygian = ["1P 2m 3m 4P 5P 6m 7m"];
var locrian = ["1P 2m 3m 4P 5d 6m 7m"];
var altered = ["1P 2m 3m 3M 5d 6m 7m",["super locrian","diminished whole tone","pomeroy"]];
var iwato = ["1P 2m 4P 5d 7m"];
var hirajoshi = ["1P 2M 3m 5P 6m"];
var kumoijoshi = ["1P 2m 4P 5P 6m"];
var pelog = ["1P 2m 3m 5P 6m"];
var prometheus = ["1P 2M 3M 4A 6M 7m"];
var ritusen = ["1P 2M 4P 5P 6M"];
var scriabin = ["1P 2m 3M 5P 6M"];
var piongio = ["1P 2M 4P 5P 6M 7m"];
var augmented = ["1P 2A 3M 5P 5A 7M"];
var neopolitan = ["1P 2m 3m 4P 5P 6m 7M"];
var diminished = ["1P 2M 3m 4P 5d 6m 6M 7M"];
var egyptian = ["1P 2M 4P 5P 7m"];
var oriental = ["1P 2m 3M 4P 5d 6M 7m"];
var spanish = ["1P 2m 3M 4P 5P 6m 7m",["phrygian major"]];
var flamenco = ["1P 2m 3m 3M 4A 5P 7m"];
var balinese = ["1P 2m 3m 4P 5P 6m 7M"];
var persian = ["1P 2m 3M 4P 5d 6m 7M"];
var bebop = ["1P 2M 3M 4P 5P 6M 7m 7M"];
var enigmatic = ["1P 2m 3M 5d 6m 7m 7M"];
var ichikosucho = ["1P 2M 3M 4P 5d 5P 6M 7M"];
var sdata = {
	chromatic: chromatic,
	lydian: lydian,
	major: major,
	mixolydian: mixolydian,
	dorian: dorian,
	aeolian: aeolian,
	phrygian: phrygian,
	locrian: locrian,
	altered: altered,
	iwato: iwato,
	hirajoshi: hirajoshi,
	kumoijoshi: kumoijoshi,
	pelog: pelog,
	prometheus: prometheus,
	ritusen: ritusen,
	scriabin: scriabin,
	piongio: piongio,
	augmented: augmented,
	neopolitan: neopolitan,
	diminished: diminished,
	egyptian: egyptian,
	oriental: oriental,
	spanish: spanish,
	flamenco: flamenco,
	balinese: balinese,
	persian: persian,
	bebop: bebop,
	enigmatic: enigmatic,
	ichikosucho: ichikosucho,
	"melodic minor": ["1P 2M 3m 4P 5P 6M 7M"],
	"melodic minor second mode": ["1P 2m 3m 4P 5P 6M 7m"],
	"lydian augmented": ["1P 2M 3M 4A 5A 6M 7M"],
	"lydian dominant": ["1P 2M 3M 4A 5P 6M 7m",["lydian b7"]],
	"melodic minor fifth mode": ["1P 2M 3M 4P 5P 6m 7m",["hindu","mixolydian b6M"]],
	"locrian #2": ["1P 2M 3m 4P 5d 6m 7m"],
	"locrian major": ["1P 2M 3M 4P 5d 6m 7m",["arabian"]],
	"major pentatonic": ["1P 2M 3M 5P 6M",["pentatonic"]],
	"lydian pentatonic": ["1P 3M 4A 5P 7M",["chinese"]],
	"mixolydian pentatonic": ["1P 3M 4P 5P 7m",["indian"]],
	"locrian pentatonic": ["1P 3m 4P 5d 7m",["minor seven flat five pentatonic"]],
	"minor pentatonic": ["1P 3m 4P 5P 7m"],
	"minor six pentatonic": ["1P 3m 4P 5P 6M"],
	"minor hexatonic": ["1P 2M 3m 4P 5P 7M"],
	"flat three pentatonic": ["1P 2M 3m 5P 6M",["kumoi"]],
	"flat six pentatonic": ["1P 2M 3M 5P 6m"],
	"major flat two pentatonic": ["1P 2m 3M 5P 6M"],
	"whole tone pentatonic": ["1P 3M 5d 6m 7m"],
	"ionian pentatonic": ["1P 3M 4P 5P 7M"],
	"lydian #5P pentatonic": ["1P 3M 4A 5A 7M"],
	"lydian dominant pentatonic": ["1P 3M 4A 5P 7m"],
	"minor #7M pentatonic": ["1P 3m 4P 5P 7M"],
	"super locrian pentatonic": ["1P 3m 4d 5d 7m"],
	"in-sen": ["1P 2m 4P 5P 7m"],
	"vietnamese 1": ["1P 3m 4P 5P 6m"],
	"vietnamese 2": ["1P 3m 4P 5P 7m"],
	"prometheus neopolitan": ["1P 2m 3M 4A 6M 7m"],
	"major blues": ["1P 2M 3m 3M 5P 6M"],
	"minor blues": ["1P 3m 4P 5d 5P 7m",["blues"]],
	"composite blues": ["1P 2M 3m 3M 4P 5d 5P 6M 7m"],
	"augmented heptatonic": ["1P 2A 3M 4P 5P 5A 7M"],
	"dorian #4": ["1P 2M 3m 4A 5P 6M 7m"],
	"lydian diminished": ["1P 2M 3m 4A 5P 6M 7M"],
	"whole tone": ["1P 2M 3M 4A 5A 7m"],
	"leading whole tone": ["1P 2M 3M 4A 5A 7m 7M"],
	"harmonic minor": ["1P 2M 3m 4P 5P 6m 7M"],
	"lydian minor": ["1P 2M 3M 4A 5P 6m 7m"],
	"neopolitan minor": ["1P 2m 3m 4P 5P 6m 7M"],
	"neopolitan major": ["1P 2m 3m 4P 5P 6M 7M",["dorian b2"]],
	"neopolitan major pentatonic": ["1P 3M 4P 5d 7m"],
	"romanian minor": ["1P 2M 3m 5d 5P 6M 7m"],
	"double harmonic lydian": ["1P 2m 3M 4A 5P 6m 7M"],
	"harmonic major": ["1P 2M 3M 4P 5P 6m 7M"],
	"double harmonic major": ["1P 2m 3M 4P 5P 6m 7M",["gypsy"]],
	"hungarian minor": ["1P 2M 3m 4A 5P 6m 7M"],
	"hungarian major": ["1P 2A 3M 4A 5P 6M 7m"],
	"spanish heptatonic": ["1P 2m 3m 3M 4P 5P 6m 7m"],
	"todi raga": ["1P 2m 3m 4A 5P 6m 7M"],
	"malkos raga": ["1P 3m 4P 6m 7m"],
	"kafi raga": ["1P 3m 3M 4P 5P 6M 7m 7M"],
	"purvi raga": ["1P 2m 3M 4P 4A 5P 6m 7M"],
	"bebop dominant": ["1P 2M 3M 4P 5P 6M 7m 7M"],
	"bebop minor": ["1P 2M 3m 3M 4P 5P 6M 7m"],
	"bebop major": ["1P 2M 3M 4P 5P 5A 6M 7M"],
	"bebop locrian": ["1P 2m 3m 4P 5d 5P 6m 7m"],
	"minor bebop": ["1P 2M 3m 4P 5P 6m 7m 7M"],
	"mystery #1": ["1P 2m 3M 5d 6m 7m"],
	"minor six diminished": ["1P 2M 3m 4P 5P 6m 6M 7M"],
	"ionian augmented": ["1P 2M 3M 4P 5A 6M 7M"],
	"lydian #9": ["1P 2m 3M 4A 5P 6M 7M"],
	"six tone symmetric": ["1P 2m 3M 4P 5A 6M"]
};

var M = ["1P 3M 5P",["Major",""]];
var M13 = ["1P 3M 5P 7M 9M 13M",["maj13","Maj13"]];
var M6 = ["1P 3M 5P 13M",["6"]];
var M69 = ["1P 3M 5P 6M 9M",["69"]];
var M7add13 = ["1P 3M 5P 6M 7M 9M"];
var M7b5 = ["1P 3M 5d 7M"];
var M7b6 = ["1P 3M 6m 7M"];
var M7b9 = ["1P 3M 5P 7M 9m"];
var M7sus4 = ["1P 4P 5P 7M"];
var M9 = ["1P 3M 5P 7M 9M",["maj9","Maj9"]];
var M9b5 = ["1P 3M 5d 7M 9M"];
var M9sus4 = ["1P 4P 5P 7M 9M"];
var Madd9 = ["1P 3M 5P 9M",["2","add9","add2"]];
var Maj7 = ["1P 3M 5P 7M",["maj7","M7"]];
var Mb5 = ["1P 3M 5d"];
var Mb6 = ["1P 3M 13m"];
var Msus2 = ["1P 2M 5P",["add9no3","sus2"]];
var Msus4 = ["1P 4P 5P",["sus","sus4"]];
var addb9 = ["1P 3M 5P 9m"];
var m = ["1P 3m 5P"];
var m11 = ["1P 3m 5P 7m 9M 11P",["_11"]];
var m11b5 = ["1P 3m 7m 12d 2M 4P",["h11","_11b5"]];
var m13 = ["1P 3m 5P 7m 9M 11P 13M",["_13"]];
var m6 = ["1P 3m 4P 5P 13M",["_6"]];
var m69 = ["1P 3m 5P 6M 9M",["_69"]];
var m7 = ["1P 3m 5P 7m",["minor7","_","_7"]];
var m7add11 = ["1P 3m 5P 7m 11P",["m7add4"]];
var m7b5 = ["1P 3m 5d 7m",["half-diminished","h7","_7b5"]];
var m9 = ["1P 3m 5P 7m 9M",["_9"]];
var m9b5 = ["1P 3m 7m 12d 2M",["h9","-9b5"]];
var mMaj7 = ["1P 3m 5P 7M",["mM7","_M7"]];
var mMaj7b6 = ["1P 3m 5P 6m 7M",["mM7b6"]];
var mM9 = ["1P 3m 5P 7M 9M",["mMaj9","-M9"]];
var mM9b6 = ["1P 3m 5P 6m 7M 9M",["mMaj9b6"]];
var mb6M7 = ["1P 3m 6m 7M"];
var mb6b9 = ["1P 3m 6m 9m"];
var o = ["1P 3m 5d",["mb5","dim"]];
var o7 = ["1P 3m 5d 13M",["diminished","m6b5","dim7"]];
var o7M7 = ["1P 3m 5d 6M 7M"];
var oM7 = ["1P 3m 5d 7M"];
var sus24 = ["1P 2M 4P 5P",["sus4add9"]];
var madd4 = ["1P 3m 4P 5P"];
var madd9 = ["1P 3m 5P 9M"];
var cdata = {
	M: M,
	M13: M13,
	M6: M6,
	M69: M69,
	M7add13: M7add13,
	M7b5: M7b5,
	M7b6: M7b6,
	M7b9: M7b9,
	M7sus4: M7sus4,
	M9: M9,
	M9b5: M9b5,
	M9sus4: M9sus4,
	Madd9: Madd9,
	Maj7: Maj7,
	Mb5: Mb5,
	Mb6: Mb6,
	Msus2: Msus2,
	Msus4: Msus4,
	addb9: addb9,
	m: m,
	m11: m11,
	m11b5: m11b5,
	m13: m13,
	m6: m6,
	m69: m69,
	m7: m7,
	m7add11: m7add11,
	m7b5: m7b5,
	m9: m9,
	m9b5: m9b5,
	mMaj7: mMaj7,
	mMaj7b6: mMaj7b6,
	mM9: mM9,
	mM9b6: mM9b6,
	mb6M7: mb6M7,
	mb6b9: mb6b9,
	o: o,
	o7: o7,
	o7M7: o7M7,
	oM7: oM7,
	sus24: sus24,
	madd4: madd4,
	madd9: madd9,
	"4": ["1P 4P 7m 10m",["quartal"]],
	"5": ["1P 5P"],
	"7": ["1P 3M 5P 7m",["Dominant","Dom"]],
	"9": ["1P 3M 5P 7m 9M",["79"]],
	"11": ["1P 5P 7m 9M 11P"],
	"13": ["1P 3M 5P 7m 9M 13M",["13_"]],
	"64": ["5P 8P 10M"],
	"M#5": ["1P 3M 5A",["augmented","maj#5","Maj#5","+","aug"]],
	"M#5add9": ["1P 3M 5A 9M",["+add9"]],
	"M13#11": ["1P 3M 5P 7M 9M 11A 13M",["maj13#11","Maj13#11","M13+4","M13#4"]],
	"M6#11": ["1P 3M 5P 6M 11A",["M6b5","6#11","6b5"]],
	"M69#11": ["1P 3M 5P 6M 9M 11A"],
	"M7#11": ["1P 3M 5P 7M 11A",["maj7#11","Maj7#11","M7+4","M7#4"]],
	"M7#5": ["1P 3M 5A 7M",["maj7#5","Maj7#5","maj9#5","M7+"]],
	"M7#5sus4": ["1P 4P 5A 7M"],
	"M7#9#11": ["1P 3M 5P 7M 9A 11A"],
	"M9#11": ["1P 3M 5P 7M 9M 11A",["maj9#11","Maj9#11","M9+4","M9#4"]],
	"M9#5": ["1P 3M 5A 7M 9M",["Maj9#5"]],
	"M9#5sus4": ["1P 4P 5A 7M 9M"],
	"11b9": ["1P 5P 7m 9m 11P"],
	"13#11": ["1P 3M 5P 7m 9M 11A 13M",["13+4","13#4"]],
	"13#9": ["1P 3M 5P 7m 9A 13M",["13#9_"]],
	"13#9#11": ["1P 3M 5P 7m 9A 11A 13M"],
	"13b5": ["1P 3M 5d 6M 7m 9M"],
	"13b9": ["1P 3M 5P 7m 9m 13M"],
	"13b9#11": ["1P 3M 5P 7m 9m 11A 13M"],
	"13no5": ["1P 3M 7m 9M 13M"],
	"13sus4": ["1P 4P 5P 7m 9M 13M",["13sus"]],
	"69#11": ["1P 3M 5P 6M 9M 11A"],
	"7#11": ["1P 3M 5P 7m 11A",["7+4","7#4","7#11_","7#4_"]],
	"7#11b13": ["1P 3M 5P 7m 11A 13m",["7b5b13"]],
	"7#5": ["1P 3M 5A 7m",["+7","7aug","aug7"]],
	"7#5#9": ["1P 3M 5A 7m 9A",["7alt","7#5#9_","7#9b13_"]],
	"7#5b9": ["1P 3M 5A 7m 9m"],
	"7#5b9#11": ["1P 3M 5A 7m 9m 11A"],
	"7#5sus4": ["1P 4P 5A 7m"],
	"7#9": ["1P 3M 5P 7m 9A",["7#9_"]],
	"7#9#11": ["1P 3M 5P 7m 9A 11A",["7b5#9"]],
	"7#9#11b13": ["1P 3M 5P 7m 9A 11A 13m"],
	"7#9b13": ["1P 3M 5P 7m 9A 13m"],
	"7add6": ["1P 3M 5P 7m 13M",["67","7add13"]],
	"7b13": ["1P 3M 7m 13m"],
	"7b5": ["1P 3M 5d 7m"],
	"7b6": ["1P 3M 5P 6m 7m"],
	"7b9": ["1P 3M 5P 7m 9m"],
	"7b9#11": ["1P 3M 5P 7m 9m 11A",["7b5b9"]],
	"7b9#9": ["1P 3M 5P 7m 9m 9A"],
	"7b9b13": ["1P 3M 5P 7m 9m 13m"],
	"7b9b13#11": ["1P 3M 5P 7m 9m 11A 13m",["7b9#11b13","7b5b9b13"]],
	"7no5": ["1P 3M 7m"],
	"7sus4": ["1P 4P 5P 7m",["7sus"]],
	"7sus4b9": ["1P 4P 5P 7m 9m",["susb9","7susb9","7b9sus","7b9sus4","phryg"]],
	"7sus4b9b13": ["1P 4P 5P 7m 9m 13m",["7b9b13sus4"]],
	"9#11": ["1P 3M 5P 7m 9M 11A",["9+4","9#4","9#11_","9#4_"]],
	"9#11b13": ["1P 3M 5P 7m 9M 11A 13m",["9b5b13"]],
	"9#5": ["1P 3M 5A 7m 9M",["9+"]],
	"9#5#11": ["1P 3M 5A 7m 9M 11A"],
	"9b13": ["1P 3M 7m 9M 13m"],
	"9b5": ["1P 3M 5d 7m 9M"],
	"9no5": ["1P 3M 7m 9M"],
	"9sus4": ["1P 4P 5P 7m 9M",["9sus"]],
	"m#5": ["1P 3m 5A",["m+","mb6"]],
	"m11A 5": ["1P 3m 6m 7m 9M 11P"],
	"m7#5": ["1P 3m 6m 7m"],
	"m9#5": ["1P 3m 6m 7m 9M"],
	"+add#9": ["1P 3M 5A 9A"]
};

/**
 * @private
 * [![npm version](https://img.shields.io/npm/v/tonal-dictionary.svg)](https://www.npmjs.com/package/tonal-dictionary)
 * [![tonal](https://img.shields.io/badge/tonal-dictionary-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-dictionary` contains a dictionary of musical scales and chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * const dictionary= require('tonal-dictionary')
 * dictionary.chord('Maj7') // => ['1P', '3M', '5P', '7M']
 *
 * @module dictionary
 */
var dictionary = function (raw) {
  var keys = Object.keys(raw).sort();
  var data = [];
  var index = [];

  var add = function (name, ivls, chroma) {
    data[name] = ivls;
    index[chroma] = index[chroma] || [];
    index[chroma].push(name);
  };

  keys.forEach(function (key) {
    var ivls = raw[key][0].split(" ");
    var alias = raw[key][1];
    var chr = chroma$2(ivls);

    add(key, ivls, chr);
    if (alias) { alias.forEach(function (a) { return add(a, ivls, chr); }); }
  });
  var allKeys = Object.keys(data).sort();

  var dict = function (name) { return data[name]; };
  dict.names = function (p) {
    if (typeof p === "string") { return (index[p] || []).slice(); }
    else { return (p === true ? allKeys : keys).slice(); }
  };
  return dict;
};

var combine = function (a, b) {
  var dict = function (name) { return a(name) || b(name); };
  dict.names = function (p) { return a.names(p).concat(b.names(p)); };
  return dict;
};

/**
 * A dictionary of scales.
 *
 * @private
 * @function
 * @param {String} name
 * @return {Array} intervals
 * @example
 * import { scale } from 'tonal-dictionary'
 * scale('major') // => ["1P", "2M", ...]
 * scale.names(); // => ["major", ...]
 */
var scale$2 = dictionary(sdata);
/**
 * A dictionary of chords.
 *
 * @private
 * @function
 * @param {String} name
 * @return {Array} intervals
 * @example
 * import { chord } from 'tonal-dictionary'
 * chord('Maj7') // => ["1P", "3M", ...]
 * chord.names(); // => ["Maj3", ...]
 */
var chord = dictionary(cdata);
var pcset$1 = combine(scale$2, chord);

/**
 * A scale is a collection of pitches in ascending or descending order.
 *
 * This module provides functions to get and manipulate scales.
 *
 * @example
 * scale.notes('Ab bebop') // => [ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'G' ]
 * scale.names() => ['major', 'minor', ...]
 * scale.detect('f5 d2 c5 b5 a2 e4 g') // => [ 'C major', 'D dorian', 'E phrygian', 'F lydian', 'G mixolydian', 'A aeolian', 'B locrian'])
 * @module scale
 */
var NO_SCALE = Object.freeze({
  name: null,
  intervals: [],
  names: [],
  chroma: null,
  setnum: null
});

var properties$3 = function (name$$1) {
  var intervals = scale$2(name$$1);
  if (!intervals) { return NO_SCALE; }
  var s = { intervals: intervals, name: name$$1 };
  s.chroma = chroma$2(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = scale$2.names(s.chroma);
  return Object.freeze(s);
};

var memoize = function (fn, cache) { return function (str) { return cache[str] || (cache[str] = fn(str)); }; };

/**
 * Get scale properties. It returns an object with:
 * - name: the scale name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the scale intervals
 * - chroma:  scale croma (see pcset)
 * - setnum: scale chroma number
 *
 * @function
 * @param {String} name - the scale name (without tonic)
 * @return {Object} 
 */
var props$3 = memoize(properties$3, {});

/**
 * Return the available scale names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the scale names
 *
 * @example
 * const scale = require('tonal-scale')
 * scale.names() // => ['maj7', ...]
 */
var names$1 = scale$2.names;

/**
 * Given a scale name, return its intervals. The name can be the type and
 * optionally the tonic (which is ignored)
 *
 * It retruns an empty array when no scale found
 *
 * @function
 * @param {String} name - the scale name (tonic and type, tonic is optional)
 * @return {Array<String>} the scale intervals if is a known scale or an empty
 * array if no scale found
 * @example
 * scale.intervals('major') // => [ '1P', '2M', '3M', '4P', '5P', '6M', '7M' ]
 */
var intervals = function (name$$1) {
  var p = tokenize$3(name$$1);
  return props$3(p[1]).intervals;
};

/**
 * Get the notes (pitch classes) of a scale. 
 *
 * Note that it always returns an array, and the values are only pitch classes.
 *
 * @function
 * @param {String} tonic 
 * @param {String} name - the scale name
 * @return {Array} a pitch classes array
 * 
 * @example
 * scale.notes("C", 'major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes("C4", 'major') // => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
 * scale.notes("A4", "no-scale") // => []
 * scale.notes("blah", "major") // => []
 */
function notes(nameOrTonic, name$$1) {
  var p = tokenize$3(nameOrTonic);
  name$$1 = name$$1 || p[1];
  return intervals(name$$1).map(transpose(p[0]));
}

/**
 * Check if the given name is a known scale from the scales dictionary
 * 
 * @function
 * @param {String} name - the scale name
 * @return {Boolean}
 */
function exists(name$$1) {
  var p = tokenize$3(name$$1);
  return scale$2(p[1]) !== undefined;
}

/**
 * Given a string with a scale name and (optionally) a tonic, split 
 * that components.
 * 
 * It retuns an array with the form [ name, tonic ] where tonic can be a 
 * note name or null and name can be any arbitrary string 
 * (this function doesn't check if that scale name exists)
 *
 * @function
 * @param {String} name - the scale name
 * @return {Array} an array [tonic, name]
 * @example
 * scale.tokenize('C mixolydean') // => ["C", "mixolydean"]
 * scale.tokenize('anything is valid') // => [null, "anything is valid"]
 * scale.tokenize() // => [null, null]
 */
function tokenize$3(str) {
  if (typeof str !== "string") { return [null, null]; }
  var i = str.indexOf(" ");
  var tonic = name(str.substring(0, i)) || name(str);
  var name$$1 = tonic !== null ? str.substring(tonic.length + 1) : str;
  return [tonic, name$$1.length ? name$$1 : null];
}

/**
 * Find mode names of a scale
 * 
 * @function
 * @param {String} name - scale name
 */
var modeNames$1 = function (name$$1) {
  var ivls = intervals(name$$1);

  return modes(ivls).map(function (chroma$$1) {
    return scale$2.names(chroma$$1)[0];
  });
};

/**
 * Get all chords that fits a given scale
 * 
 * @function
 * @param {String} name
 */
var chords$1 = function (name$$1) {
  var ivls = intervals(name$$1);
  return chord.names().filter(function (name$$1) { return isSubset(chord(name$$1), ivls); });
};

/**
 * Given an array of notes, return the scale: a pitch class set starting from 
 * the first note of the array
 * 
 * @function
 * @param {Array} notes 
 * @return {Array}
 */
var toScale = function (notes) {
  var pcset = compact(notes.map(pc$1));
  if (!pcset.length) { return pcset; }
  var tonic = pcset[0];
  var scale = unique(pcset);
  return rotate$1(scale.indexOf(tonic), scale);
};

/**
 * Find all scales than extends the given one
 * 
 * @function
 * @param {String} name 
 */
var extensions = function (name$$1) {
  var ivls = intervals(name$$1);
  if (!ivls.length) { return []; }
  return scale$2.names().filter(function (name$$1) { return isSuperset(scale$2(name$$1), ivls); });
};

var detect = function (notes) {
  notes = toScale(notes);
  var modes$$1 = modes(notes);
  if (modes$$1.length < 2) { throw Error("It should have at least two notes"); }

  var results = [];

  names$1().forEach(function (name$$1) {
    var p = props$3(name$$1);
    modes$$1.forEach(function (mode, i) {
      if (isSubset(mode, p.chroma)) { results.push([notes[i], name$$1]); }
    });
  });

  return results;
};


var scale$1 = Object.freeze({
	props: props$3,
	names: names$1,
	intervals: intervals,
	notes: notes,
	exists: exists,
	tokenize: tokenize$3,
	modeNames: modeNames$1,
	chords: chords$1,
	toScale: toScale,
	extensions: extensions,
	detect: detect
});

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-chord.svg)](https://www.npmjs.com/package/tonal-chord)
 * [![tonal](https://img.shields.io/badge/tonal-chord-yellow.svg)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-chord` is a collection of functions to manipulate musical chords
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * const chord = require('tonal-chord')
 * chord.notes('CMaj7') // => ['C', 'E', 'G', 'B']
 *
 * @module chord
 */
/**
 * Return the available chord names
 *
 * @function
 * @param {boolean} aliases - true to include aliases
 * @return {Array} the chord names
 *
 * @example
 * import * as chord from 'tonal-chord'
 * chord.names() // => ['maj7', ...]
 */
var names$2 = chord.names;

var NO_CHORD = Object.freeze({
  name: null,
  names: [],
  intervals: [],
  chroma: null,
  setnum: null
});

var properties$4 = function (name$$1) {
  var intervals = chord(name$$1);
  if (!intervals) { return NO_CHORD; }
  var s = { intervals: intervals, name: name$$1 };
  s.chroma = chroma$2(intervals);
  s.setnum = parseInt(s.chroma, 2);
  s.names = chord.names(s.chroma);
  return s;
};

var memo$2 = function (fn, cache) {
  if ( cache === void 0 ) cache = {};

  return function (str) { return cache[str] || (cache[str] = fn(str)); };
};

/**
 * Get chord properties. It returns an object with :
 * - name: the chord name
 * - names: a list with all possible names (includes the current)
 * - intervals: an array with the chord intervals
 * - chroma:  chord croma (see pcset)
 * - setnum: chord chroma number
 * 
 * @function
 * @param {String} name - the chord name (without tonic)
 * @return {Object}
 */
var props$4 = memo$2(properties$4);

/**
 * Get chord intervals. It always returns an array
 * 
 * @function
 * @param {String} name - the chord name (optionally a tonic and type)
 * @return {Array<String>} a list of intervals or null if the type is not known
 */
var intervals$2 = function (name$$1) { return props$4(tokenize$4(name$$1)[1]).intervals; };

/**
 * Get the chord notes of a chord. This function accepts either a chord name
 * (for example: 'Cmaj7') or a list of notes.
 *
 * It always returns an array, even if the chord is not found.
 *
 * @function
 * @param {String} nameOrTonic - name of the chord or the tonic
 * @return [String] name - (Optional) name if the first parameter is the tonic
 *
 * @example
 * chord.notes('Cmaj7') // => ['C', 'E', 'G', 'B']
 * chord.notes('C', 'maj7') // => ['C', 'E', 'G', 'B']
 */
function notes$1(nameOrTonic, name$$1) {
  var p = tokenize$4(nameOrTonic);
  name$$1 = name$$1 || p[1];
  return intervals$2(name$$1).map(transpose(p[0]));
}

/**
 * Check if a given name correspond to a chord in the dictionary
 * 
 * @function
 * @param {String} name
 * @return {Boolean}
 * @example
 * chord.exists('CMaj7') // => true
 * chord.exists('Maj7') // => true
 * chord.exists('Ablah') // => false
 */
var exists$1 = function (name$$1) { return chord(tokenize$4(name$$1)[1]) !== undefined; };

/**
 * Tokenize a chord name. It returns an array with the tonic and chord type 
 * If not tonic is found, all the name is considered the chord name.
 *
 * This function does NOT check if the chord type exists or not. It only tries
 * to split the tonic and chord type.
 *
 * @function
 * @param {String} name - the chord name
 * @return {Array} an array with [type, tonic]
 * @example
 * chord.tokenize('Cmaj7') // => [ 'C', 'maj7' ]
 * chord.tokenize('C7') // => [ 'C', '7' ]
 * chord.tokenize('mMaj7') // => [ null, 'mMaj7' ]
 * chord.tokenize('Cnonsense') // => [ 'C', 'nonsense' ]
 */
function tokenize$4(name$$1) {
  var p = tokenize(name$$1);
  if (!p) { return [null, name$$1]; }

  // 6 and 7 is consider part of the chord
  if (p[0] !== "" && (p[2][0] === "6" || p[2][0] === "7")) {
    return [p[0] + p[1], p[2] + p[3]];
  } else {
    return [p[0] + p[1] + p[2], p[3]];
  }
}


var chord$1 = Object.freeze({
	names: names$2,
	props: props$4,
	intervals: intervals$2,
	notes: notes$1,
	exists: exists$1,
	tokenize: tokenize$4
});

/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 * [![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-key` is a collection of functions to work with pitch class sets, oriented
 * to make comparations (isEqual, isSubset, isSuperset)
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 * The `tonal` module is a facade to the rest of the modules. They are namespaced,
 * so for example to use `pc` function from `tonal-note` you have to write:
 * `tonal.note.pc`
 *
 * It exports the following modules:
 * - note
 * - interval
 * - distance
 * - scale
 * - chord
 * - pcset
 * - key
 *
 * @example
 * var tonal = require('tonal')
 * tonal.distance.transpose(tonal.note.pc('C#2'), 'M3') // => 'E#'
 * tonal.chord.notes('Dmaj7') // => ['D', 'F#', 'A', 'C#']
 *
 * @module tonal
 */
var tonal = { array: array, note: note$1, interval: interval, distance: distance, key: key, scale: scale$1, chord: chord$1, pcset: pcset };


var tonal$1 = Object.freeze({
	array: array,
	note: note$1,
	interval: interval,
	distance: distance,
	key: key,
	scale: scale$1,
	chord: chord$1,
	pcset: pcset,
	default: tonal
});

var BASE_URL = "https://github.com/danigb/tonal/tree/master/packages/";
var apiUrl = function (modName, fnName) { return BASE_URL + modName + "#module_" + modName + "." + fnName; };

var Function = function (ref) {
  var module = ref.module;
  var name$$1 = ref.name;

  return (
  h( 'dt', null,
    h( 'code', null,
      h( 'a', { class: "api", href: apiUrl(module, name$$1), target: "_blank" },
        module, ".", name$$1
      )
    )
  )
);
};

var API = function (ref) {
  var module = ref.module;

  return [
  h( 'h3', null, "API" ),
  h( 'dl', null,
    Object.keys(tonal$1[module])
      .sort()
      .map(function (n) { return h( Function, { module: module, name: n }); })
  )
];
};

var npmUrl$1 = function (name$$1) { return ("https://www.npmjs.com/package/" + name$$1 + "/"); };
var nodeiCo$1 = function (name$$1) { return ("https://nodei.co/npm/" + name$$1 + ".png?mini=true"); };

var Npm = function (ref) {
  var name$$1 = ref.name;
  var packageName = ref.packageName;

  return (
  h( 'p', null,
    h( 'a', { href: npmUrl$1(packageName || "tonal-" + name$$1) },
      h( 'img', { src: nodeiCo$1(packageName || "tonal-" + name$$1) })
    )
  )
);
};

var API$1 = function (ref) {
  var module = ref.module;
  var api = ref.api;

  return (
  h( 'div', { class: "API" },
    h( Npm, { packageName: "tonal-" + module }),
    api !== false ? h( API, { module: module }) : null
  )
);
};

var note = note$1;

var OCTS = [1, 2, 3, 4, 5, 6];

var toStr = function (o) { return (o === null ? "null" : o); };
var toFixed = function (dec, num$$1) { return typeof num$$1 === "number" ? num$$1.toFixed(dec) : "null"; };
var toJson = function (o) { return JSON.stringify(o, null, 2); };
var toName = function (n) { return (n ? '"' + n + '"' : "null"); };

var NoteProperties = function (ref) {
  var tonic = ref.tonic;

  return (
    h( 'div', null,
      h( 'h3', null, "Properties" ),
      h( Code, {
        lines: [
          ("note.props(" + (toName(tonic)) + ") // => " + (toJson(note.props(tonic)))),
          ("note.step(" + (toName(tonic)) + ") //=> " + (toStr(note.step(tonic)))),
          ("note.alt(" + (toName(tonic)) + ") //=> " + (toStr(note.alt(tonic)))),
          ("note.oct(" + (toName(tonic)) + ") //=> " + (toStr(note.oct(tonic)))),
          ("note.chroma(" + (toName(tonic)) + ") //=> " + (toStr(note.chroma(tonic))))
        ] })
    )
  );
};

var NoteMidiFreq = function (ref) {
  var tonic = ref.tonic;

  var freq$$1 = note.freq(tonic);
  var midi$$1 = note.midi(tonic);
  return (
    h( 'div', null,
      h( 'h3', null, "Midi and frequency" ),
      h( Code, {
        lines: [
          ("note.midi(\"" + tonic + "\") => " + midi$$1),
          ("note.fromMidi(" + midi$$1 + ") => " + tonic),
          ("note.freq(\"" + tonic + "\") => " + (toStr(freq$$1))),
          ("note.fromFreq(" + (toFixed(2, freq$$1)) + ") => " + tonic)
        ] })
    )
  );
};

var NoteInfo = function (ref) {
  var tonic = ref.tonic;

  var ref$1 = note.props(tonic);
  var pc = ref$1.pc;
  var oct$$1 = ref$1.oct;
  var chroma$$1 = ref$1.chroma;
  var freq$$1 = note.freq(tonic);
  var midi$$1 = note.midi(tonic);

  return (
    h( 'div', null,
      h( 'h4', null, "note" ),
      h( 'h1', { class: "note" }, tonic),
      h( Props, {
        names: ["Pitch Class", "Octave", "Chroma", "Frequency", "Midi"], values: [
          pc,
          oct$$1,
          chroma$$1,
          freq$$1 ? freq$$1.toFixed(2) + "Hz" : "",
          freq$$1 ? midi$$1 : ""
        ] })
    )
  );
};

var NoteSelector = function (ref) {
  var tonic = ref.tonic;

  var pc = note.pc(tonic);

  return [
    h( Selector, {
      label: "Change note:", oct: note.oct(tonic), route: function (t) { return ["note", t]; } }),
    h( Selector, {
      label: "Change octave:", tonics: [pc].concat(OCTS.map(function (o) { return pc + o; })), route: function (t) { return ["note", t]; } })
  ];
};

var Note = function (ref) {
  var tonic = ref.tonic;

  tonic = note.name(tonic);
  return (
    h( 'div', { class: "row Note" },
      h( 'div', { class: "column column-67" },
        h( NoteInfo, { tonic: tonic }),
        h( NoteSelector, { tonic: tonic }),
        h( NoteProperties, { tonic: tonic }),
        h( NoteMidiFreq, { tonic: tonic })
      ),
      h( 'div', { class: "column column-67" },
        h( API$1, { module: "note" })
      )
    )
  );
};

var TONICS$1 = "C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B B# Cb".split(
  " "
);

var Notes = function (ref) {
  return (
    h( 'div', { class: "row Note" },
      h( 'div', { class: "column column-67" },
        h( 'h1', null, "Notes" ),
        h( 'table', null,
          h( 'tbody', null,
            TONICS$1.map(function (t) { return (
              h( 'tr', null,
                h( 'td', null,
                  h( 'strong', null,
                    h( Link, { to: ["note", t] }, t)
                  )
                ),
                [2, 3, 4, 5].map(function (o) { return (
                  h( 'td', null,
                    h( Link, { to: ["note", t + o] }, t + o)
                  )
                ); })
              )
            ); })
          )
        )
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: "note" })
      )
    )
  );
};

var INTERVALS = "1p 2m 2M 3m 3M 4P 5P 6m 6M 7m 7M 8P".split(" ");
var NUMS$1 = range(1, 15);

var Ivl = function (props$$1) {
  var ivl = build$1(props$$1);
  return h( Link, { to: ["interval", ivl] }, ivl);
};

var Intervals = function (ref) {
  return (
    h( 'div', { class: "Note row" },
      h( 'div', { class: "column column-67" },
        h( 'h1', null, "Intervals" ),
        h( 'table', null,
          h( 'tbody', null,
            NUMS$1.map(function (num$$1) { return (
              h( 'tr', null,
                h( 'td', null,
                  h( Ivl, { num: num$$1, alt: -1 })
                ),
                h( 'td', null,
                  h( 'strong', null,
                    h( Ivl, { num: num$$1, alt: 0 })
                  )
                ),
                h( 'td', null,
                  h( Ivl, { num: num$$1, alt: 1 })
                )
              )
            ); })
          )
        )
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: "interval" })
      )
    )
  );
};

var val = function (t) { return t === undefined
    ? "undefined"
    : t === null ? "null" : typeof t === "string" ? ("\"" + t + "\"") : t; };

var arr = function (arr) { return "[" + arr.map(val).join(", ") + "]"; };

var json = function (o) { return JSON.stringify(o, null, 2); };

var INTERVALS$1 = "1P 2m 2M 3m 3M 4P 5P 6m 6M 7m 7M 8P".split(" ");

var IntervalInfo = function (ref) {
  var interval$$1 = ref.interval;

  return (
  h( 'div', null,
    h( 'h4', null, "interval" ),
    h( 'h1', null, interval$$1 ),
    h( 'h3', null, "semitones: ", semitones(interval$$1),
      h( 'br', null ), "inversion: ", invert(interval$$1)
    )
  )
);
};

var Interval = function (ref) {
  var interval$$1 = ref.interval;

  var props$$1 = props$1(interval$$1);
  var simple = simplify(interval$$1);
  var inversion = invert(interval$$1);
  return (
    h( 'div', { class: "row Note" },
      h( 'div', { class: "column column-67" },
        h( IntervalInfo, { interval: interval$$1 }),
        h( Selector, {
          label: "Change interval:", route: function (t) { return ["interval", t]; }, tonics: INTERVALS$1 }),
        h( 'h3', null, "Properties" ),
        h( Code, {
          lines: [
            ("interval.props(" + (val(interval$$1)) + ") // => " + (json(props$$1))),
            ("interval.simplify(" + (val(interval$$1)) + ") // => " + (val(simple))),
            ("interval.invert(" + (val(interval$$1)) + ") // => " + (val(inversion)))
          ] })
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: "interval" })
      )
    )
  );
};

var CircleSet = function (ref) {
  var size = ref.size; if ( size === void 0 ) size = 80;
  var offset = ref.offset; if ( offset === void 0 ) offset = 0;
  var chroma = ref.chroma; if ( chroma === void 0 ) chroma = "0";
  var type = ref.type; if ( type === void 0 ) type = "set";

  var center = size / 2;
  var strokeWidth = size * 0.1;
  var radius = size / 2 - strokeWidth / 2;
  // const circumference = 2 * Math.PI * radius;
  var radians = 2 * Math.PI / chroma.length;
  var points = chroma.split("").reduce(function (points, value, i) {
    if (value === "1") {
      points.push(center + radius * Math.cos((offset + i - 3) * radians));
      points.push(center + radius * Math.sin((offset + i - 3) * radians));
    }
    return points;
  }, []);

  var classNames = "Circle " + type;

  return (
    h( 'svg', {
      class: classNames, width: size, height: size, viewBox: ("0 0 " + size + " " + size) },
      h( 'circle', { class: "background", cx: center, cy: center, r: radius }),
      h( 'circle', { class: "tonic", cx: points[0], cy: points[1], r: 2 }),
      h( 'polygon', { class: "overlay", points: points.join(" ") })
    )
  );
};

/* global Soundfont */
var ac = new AudioContext();
console.log(Soundfont);
var piano = null;

Soundfont.instrument(ac, "acoustic_grand_piano").then(function (inst) {
  piano = inst;
});

var centered = function (tonic) {
  var pc = tonal.note.pc(tonic);
  var oct$$1 = pc[0] === "A" || pc[0] === "B" ? 3 : 4;
  return pc + oct$$1;
};

var buildScale = function (tonic, intervals$$1) {
  var scale$$1 = intervals$$1.map(tonal.distance.transpose(centered(tonic)));
  var rev = scale$$1.slice().reverse();
  scale$$1.push(tonal.distance.transpose(scale$$1[0], "P8"));
  return scale$$1.concat(rev);
};

var buildChord = function (tonic, intervals$$1) {
  return intervals$$1.map(tonal.distance.transpose(centered(tonic)));
};

var player = function (tonic, intervals$$1, type$$1) {
  if (!piano) { return; }
  var notes$$1 =
    type$$1 === "scale"
      ? buildScale(tonic, intervals$$1)
      : buildChord(tonic, intervals$$1);
  var events = notes$$1.map(function (note, i) { return ({
    time: type$$1 === "chord" ? 0 : i * 0.5,
    note: note
  }); });

  piano.stop(ac.currentTime);
  piano.schedule(ac.currentTime, events);
};

var Row = function (ref) {
  var tonic = ref.tonic;
  var name$$1 = ref.name;
  var type$$1 = ref.type;
  var sep = ref.sep;
  var size = ref.size;

  var intervals$$1 = tonal$1[type$$1].intervals(name$$1);
  var setchroma = chroma$2(intervals$$1);
  var notes$$1 = tonal$1[type$$1].notes(tonic, name$$1);
  return (
    h( 'tr', null,
      h( 'td', null,
        h( CircleSet, {
          size: size, chroma: setchroma, offset: chroma(tonic) })
      ),
      h( 'td', null,
        h( Link, { to: [type$$1, name$$1, tonic] },
          tonic ? tonic + sep + name$$1 : name$$1
        )
      ),
      h( 'td', null, (tonic ? notes$$1 : intervals$$1).join(" ") ),
      h( 'td', null,
        tonic ? (
          h( 'button', {
            class: "button button-clear small", onclick: function () { return player(tonic, intervals$$1, type$$1); } }, "Play")
        ) : null
      )
    )
  );
};

var PitchSetList = function (ref) {
  var type$$1 = ref.type;
  var names$$1 = ref.names;
  var tonic = ref.tonic;
  var size = ref.size; if ( size === void 0 ) size = 40;
  var sep = ref.sep; if ( sep === void 0 ) sep = " ";

  return (
    h( 'table', null,
      h( 'thead', null,
        h( 'tr', null,
          h( 'td', null, " " ),
          h( 'td', null, " " ),
          h( 'td', null, " " ),
          h( 'td', null, " " )
        )
      ),
      h( 'tbody', null,
        names$$1.map(function (name$$1) { return (
          h( Row, { type: type$$1, tonic: tonic, name: name$$1, size: size, sep: sep })
        ); })
      )
    )
  );
};

var PitchSetNames = function (ref) {
  var tonic = ref.tonic;
  var names$$1 = ref.names;
  var title = ref.title;
  var type$$1 = ref.type;
  return (
    h( 'div', { class: "row " + title },
      h( 'div', { class: "Main column column-67" },
        h( 'h1', null, tonic ? title + " in " + tonic : title ),
        h( Selector, { label: "Choose tonic:", route: function (t) { return [type$$1 + "s", t]; } }),

        h( PitchSetList, {
          names: names$$1, type: type$$1, tonic: tonic, sep: type$$1 === "chord" ? "" : " " })
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: type$$1 })
      )
    )
  );
};

var NAMES = names$1()
  .sort(
    function (a, b) { return intervals(a).length - intervals(b).length; }
  );

var Scales = function (ref) {
  var tonic = ref.tonic;

  return (
  h( PitchSetNames, {
    title: "Scales", type: "scale", packageName: "tonal-scale", tonic: tonic, names: NAMES })
);
};

/* global Vex */
var ref = Vex.Flow;
var Renderer = ref.Renderer;
var Formatter = ref.Formatter;
var W = 512;
var H = 120;

var draw = function (key$$1, notes$$1) { return function (canvas) {
  var renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
  var ctx = renderer.getContext();
  ctx.clearRect(0, 0, W, H);
  var stave = new Vex.Flow.Stave(0, 0, W - 5);
  stave.addClef("treble").setContext(ctx);
  if (key$$1) { stave.addKeySignature(key$$1); }

  stave.draw();

  Formatter.FormatAndDraw(
    ctx,
    stave,
    notes$$1.map(function(n) {
      var ref = props(n);
      var letter = ref.letter;
      var acc = ref.acc;
      var oct$$1 = ref.oct;

      var note = new Vex.Flow.StaveNote({
        keys: [letter + "/" + oct$$1],
        duration: "q"
      });
      if (acc) { note.addAccidental(0, new Vex.Flow.Accidental(acc)); }
      return note;
    })
  );
}; };

var Score = function (ref) {
  var notes$$1 = ref.notes;
  var key$$1 = ref.key;

  return (
    h( 'div', { className: "Score" },
      h( 'canvas', {
        width: W, height: H, oncreate: draw(key$$1, notes$$1), onupdate: draw(key$$1, notes$$1) })
    )
  );
};

var Stave = function (ref) {
  var tonic = ref.tonic;
  var name$$1 = ref.name;
  var type$$1 = ref.type;

  var pc = tonal.note.pc(tonic);
  var oct$$1 = pc[0] === "A" || pc[0] === "B" ? 3 : 4;
  var intervals$$1 = tonal[type$$1].intervals(name$$1);
  var notes$$1 = intervals$$1.map(tonal.distance.transpose(pc + oct$$1));
  return [
    h( 'p', null,
      h( 'label', null, "Notes:" ),
      intervals$$1.map(tonal.distance.transpose(pc)).join(" ")
    ),
    h( Score, { notes: notes$$1 }),
    h( 'button', { class: "button", onclick: function () { return player(tonic, intervals$$1, type$$1); } }, "Play")
  ];
};

var PitchSetInfo = function (ref) {
  var tonic = ref.tonic;
  var name$$1 = ref.name;
  var type$$1 = ref.type;

  var intervals$$1 = tonal[type$$1].intervals(name$$1);
  var notes$$1 = tonal[type$$1].notes(name$$1, tonic);
  var offset = tonal.note.chroma(tonic) || 0;
  var sep = type$$1 === "chord" ? "" : " ";

  return (
    h( 'div', null,
      h( 'h4', null, type$$1 ),
      h( 'h1', null, tonic ? tonic + sep + name$$1 : tonic ),
      h( 'p', null,
        h( Selector, { label: "Change tonic: ", route: function (t) { return [type$$1, name$$1, t]; } })
      ),

      h( CircleSet, {
        size: 160, offset: offset, chroma: tonal.pcset.chroma(intervals$$1) }),
      h( 'p', null,
        h( 'label', null, "Intervals: " ),
        intervals$$1.join(" ")
      ),

      tonic ? h( Stave, { type: type$$1, tonic: tonic, name: name$$1 }) : "",

      h( Code, {
        lines: [
          ("tonal." + type$$1 + ".exists(\"" + name$$1 + "\"); // => " + (tonal[type$$1].exists(name$$1))),
          ("tonal." + type$$1 + ".intervals(\"" + name$$1 + "\"); // => " + (arr(intervals$$1))),
          ("tonal." + type$$1 + ".notes(" + (val(tonic)) + ", \"" + name$$1 + "\" ); // => " + (arr(
            notes$$1
          )))
        ] })
    )
  );
};

var ScaleModes = function (ref) {
  var name$$1 = ref.name;
  var tonic = ref.tonic;

  var modes$$1 = modeNames$1(name$$1);
  var tonics = notes(name$$1, tonic);
  return (
    h( 'div', null,
      h( 'h2', null, "Scale modes" ),
      h( Code, {
        lines: [("tonal.scale.modes(" + (val(name$$1)) + "); // => " + (arr(modes$$1)))] })
    )
  );
};

var Scale = function (ref) {
  var tonic = ref.tonic;
  var name$$1 = ref.name;

  return (
    h( 'div', { class: "row Scale" },
      h( 'div', { class: "column column-67" },
        h( PitchSetInfo, { type: "scale", name: name$$1, tonic: tonic }),
        h( ScaleModes, { name: name$$1, tonic: tonic }),

        h( 'h2', null, "Scale chords" ),
        chords$1({ name: name$$1 }),
        h( Code, {
          lines: [
            ("tonal.scale.chords(\"" + name$$1 + "\"); // => " + (arr(
              chords$1(name$$1)
            )))
          ] })
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: "scale" })
      )
    )
  );
};

var NAMES$1 = names$2()
  .sort(
    function (a, b) { return props$4(a).intervals.length -
      props$4(b).intervals.length; }
  );

console.log("joder", NAMES$1);

var Chords = function (ref) {
  var tonic = ref.tonic;

  return (
  h( PitchSetNames, {
    title: "Chords", type: "chord", packageName: "tonal-chord", tonic: tonic, names: NAMES$1 })
);
};

var Chord = function (ref) {
  var tonic = ref.tonic;
  var name$$1 = ref.name;

  return (
    h( 'div', { class: "row Chord" },
      h( 'div', { class: "column column-67" },
        h( PitchSetInfo, { type: "chord", name: name$$1, tonic: tonic })
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: "scale" })
      )
    )
  );
};

var ALTS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

var path = function (key$$1) { return (key$$1 + " key").split(" ").reverse(); };

var KeyRow = function (ref) {
  var key$$1 = ref.key;

  var minor = relative("minor", key$$1);
  return (
    h( 'tr', null,
      h( 'td', null, accidentals(key$$1) ),
      h( 'td', null,
        h( Link, { to: path(key$$1) }, key$$1)
      ),
      h( 'td', null,
        h( Link, { to: path(minor) }, minor)
      )
    )
  );
};

var Keys = function (ref) { return (
  h( 'div', { class: "row Keys" },
    h( 'div', { class: "column column-67" },
      h( 'h1', null, "Keys" ),
      h( 'table', null,
        h( 'thead', null,
          h( 'tr', null,
            h( 'td', null, "Accidentals" ),
            h( 'td', null, "Major" ),
            h( 'td', null, "Minor" )
          )
        ),
        h( 'tbody', null,
          ALTS.map(function (alt$$1) { return h( KeyRow, { key: fromAlter(alt$$1) }); })
        )
      )
    ),
    h( 'div', { class: "column column-33" },
      h( API$1, { module: "key" })
    )
  )
); };

var KeyChords = function (ref) {
  var keyName = ref.keyName;

  return (
  h( 'div', null,
    h( 'h3', null, "Chords for ", keyName ),
    h( 'table', null,
      h( 'tbody', null,
        h( 'tr', null, chords(keyName).map(function (chord) { return h( 'td', null, chord ); }) ),
        h( 'tr', null,
          secDomChords(keyName).map(function (chord) { return h( 'td', null, chord ); })
        )
      )
    )
  )
);
};

var KeyRelatives = function (ref) {
  var keyName = ref.keyName;

  return (
  h( 'div', null,
    h( 'h3', null, "Relatives" ),
    h( 'table', null,
      h( 'tbody', null,
        modeNames().map(function (name$$1) { return (
          h( 'tr', null,
            h( 'td', null, relative(name$$1, keyName) )
          )
        ); })
      )
    )
  )
);
};

var Key = function (ref) {
  var mode = ref.mode;
  var tonic = ref.tonic;

  var keyName = tonic + " " + mode;
  var props$$1 = props$2(keyName);
  var scale$$1 = scale(keyName);
  var oct$$1 = scale$$1[0][0] === "A" || scale$$1[0][0] === "B" ? 3 : 4;
  var notes$$1 = props$$1.intervals.map(transpose(scale$$1[0] + oct$$1));
  var major = relative("major", keyName);
  return (
    h( 'div', { className: "row Key" },
      h( 'div', { class: "column column-67" },
        h( 'h1', null,
          tonic, " ", mode
        ),
        h( Props, {
          names: ["Accidentals", "Relative major", "Altered Notes"], values: [
            accidentals(keyName),
            major,
            alteredNotes(keyName).join(" ")
          ] }),
        h( Score, { key: props$2(major).tonic, notes: notes$$1 }),

        h( 'h3', null, "Properties" ),
        h( Code, {
          lines: [
            ("tonal.key.scale(\"" + keyName + "\") // => " + (arr(notes$$1))),
            ("tonal.key.props(\"" + keyName + "\") // => " + (json(props$$1)))
          ] }),
        h( KeyChords, { keyName: keyName }),
        h( KeyRelatives, { keyName: keyName })
      ),
      h( 'div', { class: "column column-33" },
        h( API$1, { module: "key" })
      )
    )
  );
};

var Tonal = function (ref) { return (
  h( 'div', { class: "Welcome" },
    h( 'h1', null, "tonal" ),
    h( Install, { packageName: "tonal" }),
    h( Code, {
      lines: [
        'import * as tonal from "tonal";',
        'tonal.note.freq("A4") // => 440',
        'tonal.note.midi("A4") // => 69'
      ] }),
    h( 'pre', null ),
    h( 'h3', null,
      h( Link, { to: ["notes"] }, "Notes")
    ),
    h( 'h3', null,
      h( Link, { to: ["intervals"] }, "Intervals")
    ),
    h( 'h3', null,
      h( Link, { to: ["scales"] }, "Scales")
    ),
    h( 'h3', null,
      h( Link, { to: ["chords"] }, "Chords")
    ),
    h( 'h3', null,
      h( Link, { to: ["keys"] }, "Keys")
    )
  )
); };

var encode = function (paths) { return "#/" +
  paths
    .filter(function (n) { return typeof n === "string"; })
    .map(function (n) { return n.replace(/ /g, "_"); })
    .join("/"); };

var decode = function (route) { return route.split("/").map(function (n) { return n.replace(/_/g, " "); }); };

var Link = function (ref, children) {
  var to = ref.to;

  return h( 'a', { href: encode(to) }, children);
};

var View = function (ref) {
  var route = ref.route;

  switch (route[0]) {
    case "notes":
      return h( Notes, null );
    case "note":
      return h( Note, { tonic: route[1] });
    case "intervals":
      return h( Intervals, null );
    case "interval":
      return h( Interval, { interval: route[1] });
    case "scales":
      return h( Scales, { tonic: route[1] });
    case "scale":
      return h( Scale, { name: route[1], tonic: route[2] });
    case "chords":
      return h( Chords, { tonic: route[1] });
    case "chord":
      return h( Chord, { name: route[1], tonic: route[2] });
    case "keys":
      return h( Keys, null );
    case "key":
      return h( Key, { mode: route[1], tonic: route[2] });
    default:
      return h( Tonal, null );
  }
};

var Router = function (ref) {
  var route = ref.route;

  return h( View, { route: route });
};

app({
  state: {
    route: []
  },
  view: function (state) { return (
    h( 'div', { class: "container" },
      h( 'div', { class: "row" },
        h( 'div', { class: "column-100" },
          h( 'p', { id: "top" },
            h( Link, { to: ["tonal"] }, "tonal"), " | ", h( Link, { to: ["notes"] }, "notes"), " | ", h( Link, { to: ["intervals"] }, "intervals"), " | ", h( Link, { to: ["scales"] }, "scales"), " | ", h( Link, { to: ["chords"] }, "chords"), " | ", h( Link, { to: ["keys"] }, "keys")
          )
        )
      ),
      h( Router, { route: state.route })
    )
  ); },
  actions: {
    route: function (state, actions, data) {
      return { route: decode(data) };
    }
  },
  events: {
    load: function (state, actions) {
      console.log("load!");
      window.onhashchange = function () {
        actions.route(location.hash.slice(2));
      };
      window.onhashchange();
    }
  }
});

}());
