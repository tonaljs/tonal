/**
 * @license
 * Presto - A canvas based music notation system
 * Copyright 2015 Maurits Lamers
 *
 * Presto is licensed under the MIT License.
 * Presto uses the Lilypond Emmentaler font, which is licensed under the SIL Open Font License
 * See http://scripts.sil.org/OFL
 *
 * Portions of Presto are from SproutCore Costello, which is also licensed under the MIT license.
 *
 * SproutCore Costello -- Property Observing Library
 * Copyright ©2006-2011, Strobe Inc. and contributors.
 * Portions copyright ©2008-2011 Apple Inc. All rights reserved.
 *
 * ==========================================================================
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 * For more information about SproutCore, visit http://www.sproutcore.com
 *
 * ==========================================================================
 *
 */
/*globals Presto, console*/

/*
 * This file is the base of Presto, and borrows from the runtime framework of SproutCore.
 * SproutCore Costello -- Property Observing Library
 * Copyright ©2006-2011, Strobe Inc. and contributors.
 * Portions copyright ©2008-2011 Apple Inc. All rights reserved.
 * http://www.spoutcore.com
 * http://github.com/sproutcore
 */

Presto = {};

Presto._baseMixin = function (override) {
  var args = Array.prototype.slice.call(arguments, 1),
  // copy reference to target object
      target = args[0] || {},
      idx = 1,
      length = args.length,
      options, copy, key;

  // Handle case where we have only one item... extend Presto
  if (length === 1) {
    target = this || {};
    idx = 0;
  }

  for (; idx < length; idx++) {
    if (!(options = args[idx])) continue;
    for (key in options) {
      if (!options.hasOwnProperty(key)) continue;
      copy = options[key];
      if (target === copy) continue; // prevent never-ending loop
      if (copy !== undefined && (override || (target[key] === undefined))) target[key] = copy;
    }
    // Manually copy toString() because some JS engines do not enumerate it
    // (such as IE8)
    if (options.hasOwnProperty('toString')) target.toString = options.toString;
  }

  return target;
};

Presto.mixin = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(true);
  return Presto._baseMixin.apply(this, args);
};


Presto.mixin({

  K: function () {},

  beget: function (obj) {
    if (obj === null || obj === undefined) return null;
    var K = Presto.K;
    K.prototype = obj;
    var ret = new K();
    K.prototype = null; // avoid leaks
    if (typeof obj.didBeget === "function") ret = obj.didBeget(ret);
    return ret;
  },

  _detect_base: function _detect_base (func, parent, name) {
    return function invoke_superclass_method() {
      var base = parent[name];

      //@if(debug)
      if (!base) {
        throw new Error("Developer Error: No '" + name + "' method was found on the superclass");
      }
      //@endif

      // NOTE: It is possible to cache the base, so that the first
      // call to sc_super will avoid doing the lookup again. However,
      // since the cost of the extra method dispatch is low and is
      // only incurred on sc_super, but also creates another possible
      // weird edge-case (when a class is enhanced after first used),
      // we'll leave it off for now unless profiling demonstrates that
      // it's a hotspot.
      //if(base && func === base) { func.base = function () {}; }
      //else { func.base = base; }

      return base.apply(this, arguments);
    };
  },

  _object_extend: function _object_extend (base, ext, proto) {
    //@if(debug)
    if (!ext) { throw new Error("Developer Error: Presto.Object.extend expects a non-null value.  Did you forget to 'sc_require' something?  Or were you passing a Protocol to extend() as if it were a mixin?"); }
    //@endif
    // set _kvo_cloned for later use
    //base._kvo_cloned = null;

    // get some common vars
    var key, cur,
      K = Presto.K;

    // setup arrays for bindings, observers, and properties.  Normally, just
    // save the arrays from the base.  If these need to be changed during
    // processing, then they will be cloned first.
    var value;

    // outlets are treated a little differently because you can manually
    // name outlets in the passed in hash. If this is the case, then clone
    // the array first.


    // now copy properties, add superclass to func.
    for (key in ext) {

      if (key === '_kvo_cloned') continue; // do not copy

      // avoid copying builtin methods
      if (!ext.hasOwnProperty(key)) continue;

      // get the value.
      value = ext[key];


      if (value && (value instanceof Function)) {

        // add super to funcs.  Be sure not to set the base of a func to
        // itself to avoid infinite loops.
        if (!value.superclass && (value !== (cur = base[key]))) {
          value.superclass = cur || K;
          value.base = proto ? Presto._detect_base(value, proto, key) : cur || K;
        }
      }
      // copy property
      base[key] = value;
    }

    // Manually set base on toString() because some JS engines (such as IE8) do
    // not enumerate it
    if (ext.hasOwnProperty('toString')) {
      key = 'toString';
      // get the value.  use concats if defined
      value = ext[key];
      if (!value.superclass && (value !== (cur = base[key]))) {
        value.superclass = value.base = cur || K;
      }
      // copy property
      base[key] = value;
    }

    return base;
  },

  _uuid: 0,

  guidKey: '_guid',

  generateGuid: function (obj, prefix) {
    var ret = (prefix + (Presto._uuid++));
    if (obj) obj[this.guidKey] = ret;
    return ret;
  },

  guidFor: function (obj) {
    if (!obj._guid) {
      return Presto.generateGuid(obj, "pr");
    }
    else return obj._guid;
  },

  fmt: function (string, args) {
    var i = 0;
    return string.replace(/%@([0-9]+)?/g, function(match, index) {
      index = index ? parseInt(index, 10) - 1 : i++;
      if(args[index]!==undefined) return args[index];
      else return "";
    });
  },

  warn: function (string) {
    console.log("WARNING: " + string);
  }

});

Presto.mixin(String, {
  fmt: function() {
    return Presto.fmt(this, arguments);
  }
});

Presto.Object = function (props) {
  this.__sc_super__ = Presto.Object.prototype;
  return this._object_init(props);
};

Presto.mixin(Presto.Object, {

  mixin: function () {
    var len = arguments.length, loc;
    for (loc = 0; loc < len; loc++) Presto.mixin(this, arguments[loc]);
    return this;
  },

  superclass: null,

  /**
    Creates a new subclass of the receiver, adding any passed properties to
    the instance definition of the new class.  You should use this method
    when you plan to create several objects based on a class with similar
    properties.

    Init:

    If you define an init() method, it will be called when you create
    instances of your new class.  Since SproutCore uses the init() method to
    do important setup, you must be sure to always call arguments.callee.base.apply(this,arguments) somewhere
    in your init() to allow the normal setup to proceed.

    @param {Hash} props the methods of properties you want to add
    @returns {Class} A new object class
  */
  extend: function () {

    // build a new constructor and copy class methods.  Do this before
    // adding any other properties so they are not overwritten by the copy.
    var prop, ret = function (props) {
      this.__sc_super__ = ret.prototype;
      return this._object_init(props);
    };
    for (prop in this) {
      if (!this.hasOwnProperty(prop)) continue;
      ret[prop] = this[prop];
    }

    // manually copy toString() because some JS engines do not enumerate it
    if (this.hasOwnProperty('toString')) ret.toString = this.toString;

    // now setup superclass, guid
    ret.superclass = this;
    ret.__sc_super__ = this.prototype;

    // setup new prototype and add properties to it
    var base = (ret.prototype = Presto.beget(this.prototype)),
        idx, len = arguments.length;

    for (idx = 0; idx < len; idx++) {
      Presto._object_extend(base, arguments[idx], ret.__sc_super__);
    }
    base.constructor = ret; // save constructor

    return ret;
  },

  create: function () {
    var C = this, ret = new C(arguments);

    return ret;
  },

  isClass: true
});

Presto.Object.prototype = {

  _object_init: function (extensions) {
    // apply any new properties
    var idx,
      len = (extensions) ? extensions.length : 0;
    for (idx = 0; idx < len; idx++) { Presto._object_extend(this, extensions[idx], this.__sc_super__); }
    this.init(); // call real init

    // Call 'initMixin' methods to automatically setup modules.
    var inits = this.initMixin;
    len = (inits) ? inits.length : 0;
    for (idx = 0; idx < len; idx++) inits[idx].call(this);

    return this; // done!
  },

  mixin: function () {
    var idx, len = arguments.length, init;
    for (idx = 0; idx < len; idx++) Presto._object_extend(this, arguments[idx]);

    // Call initMixin
    for (idx = 0; idx < len; idx++) {
      init = arguments[idx].initMixin;
      if (init) init.call(this);
    }
    return this;
  },

  init: function () {
    return this;
  },

  isObject: true,

  get: function (key) {
    var ret = this[key];
    if (ret === undefined) {
      return this.unknownProperty(key);
    }
    if (ret && ret instanceof Function) {
      return ret.call(this, key);
    }
    else return ret;
  },

  set: function (key, value) {
    var prop = this[key];
    if (prop && prop instanceof Function) {
      prop.call(this, key, value);
    }
    else this[key] = value;
  },

  unknownProperty: function (key, value) {
    if (value !== undefined) { this[key] = value; }
    return value;
  },
};

Presto.Object.prototype.constructor = Presto.Object;

/**
 * Presto.Array, an array solution which still is a real array, but has extra methods
 * and which works without having to extend the global Array prototype
 *
 * Short explanation how this works and why this works:
 * Object.create(Array.prototype) => creates a new clean object using Array.prototype. It is not a real array though
 *                                   yet, it is just an object with the Array.prototype.
 * Array.apply(ret)               => Applies the Array constructor on the freshly created Object, making it into a real
 *                                   array which supports the array subscript notation
 *
 * Result is an Object which acts like an Array, which depends on Array.prototype, but which is not the global Array
 * and consequently can be extended without having those extensions leaking into the global prototype.
 */
Presto.Array = function (opts) {
  // perhaps this should be new Object(Array.prototype) for older browsers,
  // but it seems to me to be pretty unlikely to be necessary, as we require a canvas
  // element anyway.
  var ret = Object.create(Array.prototype);

  if (opts && opts[0] && Array.isArray(opts[0])) {
    ret = Array.apply(ret); // make ret into an array
    // copy contents
    opts[0].forEach(function (o, i) {
      ret[i] = o;
    });
  }
  else { // apply normal
    ret = (Array.apply(ret, opts) || ret);
  }

  // different way of including the functions on the prototype, as this is _MUCH_ faster.
  var proto = Presto.Array.prototype;
  for (var key in proto) {
    ret[key] = proto[key];
  }

  //Presto.mixin(ret, Presto.Array.prototype);
  return ret;
};

Presto.Array.prototype.constructor = Presto.Array;

Presto.Reducers = {

  /**
    Call this method from your unknownProperty() handler to implement
    automatic reduced properties.  A reduced property is a property that
    collects its contents dynamically from your array contents.  Reduced
    properties always begin with "@".  Getting this property will call
    reduce() on your array with the function matching the key name as the
    processor.

    The return value of this will be either the return value from the
    reduced property or undefined, which means this key is not a reduced
    property.  You can call this at the top of your unknownProperty handler
    like so:

      unknownProperty: function (key, value) {
        var ret = this.handleReduceProperty(key, value);
        if (ret === undefined) {
          // process like normal
        }
      }

    @param {String} key the reduce property key

    @param {Object} value a value or undefined.

    @param {Boolean} generateProperty only set to false if you do not want
      an optimized computed property handler generated for this.  Not common.

    @returns {Object} the reduced property or undefined
  */
  reducedProperty: function (key, value, generateProperty) {

    if (!key || typeof key !== "string" || key.charAt(0) !== '@') return undefined; // not a reduced property

    // get the reducer key and the reducer
    var matches = key.match(/^@([^(]*)(\(([^)]*)\))?$/);
    if (!matches || matches.length < 2) return undefined; // no match

    var reducerKey = matches[1]; // = 'max' if key = '@max(balance)'
    var reducerProperty = matches[3]; // = 'balance' if key = '@max(balance)'
    reducerKey = "reduce" + reducerKey.slice(0, 1).toUpperCase() + reducerKey.slice(1);
    var reducer = this[reducerKey];

    // if there is no reduce function defined for this key, then we can't
    // build a reducer for it.
    if (typeof reducer !== "function") return undefined;

    // if we can't generate the property, just run reduce
    if (generateProperty === false) {
      return this.reduce.call(this, reducer, null, reducerProperty);
    }

    // and reduce anyway...
    return this.reduce.call(this, reducer, null, reducerProperty);
  },

  /**
    Reducer for @max reduced property.

    @param {Object} previousValue The previous value in the enumerable
    @param {Object} item The current value in the enumerable
    @param {Number} index The index of the current item in the enumerable
    @param {String} reducerProperty (Optional) The property in the enumerable being reduced

    @returns {Object} reduced value
  */
  reduceMax: function (previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = item.get ? item.get(reducerProperty) : item[reducerProperty];
    }
    if (previousValue === null) return item;
    return (item > previousValue) ? item : previousValue;
  },

  /**
    Reduces an enumerable to the max of the items in the enumerable. If
    reducerProperty is passed, it will reduce that property. Otherwise, it will
    reduce the item itself.

    @param {Object} previousValue The previous value in the enumerable
    @param {Object} item The current value in the enumerable
    @param {Number} index The index of the current item in the enumerable
    @param {String} reducerProperty (Optional) The property in the enumerable being reduced

    @returns {Object} reduced value
  */
  reduceMaxObject: function (previousItem, item, index, e, reducerProperty) {

    // get the value for both the previous and current item.  If no
    // reducerProperty was supplied, use the items themselves.
    var previousValue = previousItem, itemValue = item;
    if (reducerProperty) {
      if (item) {
        itemValue = item.get ? item.get(reducerProperty) : item[reducerProperty];
      }

      if (previousItem) {
        previousValue = previousItem.get ? previousItem.get(reducerProperty) : previousItem[reducerProperty];
      }
    }
    if (previousValue === null) return item;
    return (itemValue > previousValue) ? item : previousItem;
  },

  /**
    Reduces an enumerable to the min of the items in the enumerable. If
    reducerProperty is passed, it will reduce that property. Otherwise, it will
    reduce the item itself.

    @param {Object} previousValue The previous value in the enumerable
    @param {Object} item The current value in the enumerable
    @param {Number} index The index of the current item in the enumerable
    @param {String} reducerProperty (Optional) The property in the enumerable being reduced

    @returns {Object} reduced value
  */
  reduceMin: function (previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = item.get ? item.get(reducerProperty) : item[reducerProperty];
    }
    if (previousValue === null) return item;
    return (item < previousValue) ? item : previousValue;
  },

  /**
    Reduces an enumerable to the max of the items in the enumerable. If
    reducerProperty is passed, it will reduce that property. Otherwise, it will
    reduce the item itself.

    @param {Object} previousValue The previous value in the enumerable
    @param {Object} item The current value in the enumerable
    @param {Number} index The index of the current item in the enumerable
    @param {String} reducerProperty (Optional) The property in the enumerable being reduced

    @returns {Object} reduced value
  */
  reduceMinObject: function (previousItem, item, index, e, reducerProperty) {

    // get the value for both the previous and current item.  If no
    // reducerProperty was supplied, use the items themselves.
    var previousValue = previousItem, itemValue = item;
    if (reducerProperty) {
      if (item) {
        itemValue = item.get ? item.get(reducerProperty) : item[reducerProperty];
      }

      if (previousItem) {
        previousValue = previousItem.get ? previousItem.get(reducerProperty) : previousItem[reducerProperty];
      }
    }
    if (previousValue === null) return item;
    return (itemValue < previousValue) ? item : previousItem;
  },

  /**
    Reduces an enumerable to the average of the items in the enumerable. If
    reducerProperty is passed, it will reduce that property. Otherwise, it will
    reduce the item itself.

    @param {Object} previousValue The previous value in the enumerable
    @param {Object} item The current value in the enumerable
    @param {Number} index The index of the current item in the enumerable
    @param {String} reducerProperty (Optional) The property in the enumerable being reduced

    @returns {Object} reduced value
  */
  reduceAverage: function (previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = item.get ? item.get(reducerProperty) : item[reducerProperty];
    }
    var ret = (previousValue || 0) + item;
    var len = e.get ? e.get('length') : e.length;
    if (index >= len - 1) ret = ret / len; //avg after last item.
    return ret;
  },

  /**
    Reduces an enumerable to the sum of the items in the enumerable. If
    reducerProperty is passed, it will reduce that property. Otherwise, it will
    reduce the item itself.

    @param {Object} previousValue The previous value in the enumerable
    @param {Object} item The current value in the enumerable
    @param {Number} index The index of the current item in the enumerable
    @param {String} reducerProperty (Optional) The property in the enumerable being reduced

    @returns {Object} reduced value
  */
  reduceSum: function (previousValue, item, index, e, reducerProperty) {
    if (reducerProperty && item) {
      item = item.get ? item.get(reducerProperty) : item[reducerProperty];
    }
    return (previousValue === null) ? item : previousValue + item;
  }
};

Presto.mixin(Presto.Array.prototype, Presto.Reducers, {

  /**
    Retrieves the named value on each member object.  This is more efficient
    than using one of the wrapper methods defined here.  Objects that
    implement SC.Observable will use the get() method, otherwise the property
    will be accessed directly.

    @param {String} key the key to retrieve
    @returns {Array} extracted values
  */
  getEach: function (key) {
    var ret = this.map(function (next) {
      return next ? (next.get ? next.get(key) : next[key]) : null;
    }, this);
    return Presto.Array.create(ret);
  },

  /**
    Sets the value on the named property for each member.  This is more
    efficient than using other methods defined on this helper.  If the object
    implements SC.Observable, the value will be changed to set(), otherwise
    it will be set directly.  null objects are skipped.

    @param {String} key the key to set
    @param {Object} value the object to set
    @returns {Object} receiver
  */
  setEach: function (key, value) {
    this.forEach(function (next) {
      if (next) {
        if (next.set) next.set(key, value);
        else next[key] = value;
      }
    }, this);
    return this;
  },

  /**
    Returns an array with just the items with the matched property.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    Note: null, undefined, false and the empty string all evaulate to false.

    @param {String} key the property to test
    @param {String} value optional value to test against.
    @returns {Array} filtered array
  */
  filterProperty: function (key, value) {
    var len = this.length,
        ret = Presto.Array.create(),
        idx, item, cur;
    // Although the code for value and no value are almost identical, we want to make as many decisions outside
    // the loop as possible.
    if (value === undefined) {
      for (idx = 0; idx < len; idx++) {
        item = this[idx];
        cur = item ? (item.get ? item.get(key) : item[key]) : null;
        if (!!cur) ret.push(item);
      }
    } else {
      for (idx = 0; idx < len; idx++) {
        item = this[idx];
        cur = item ? (item.get ? item.get(key) : item[key]) : null;
        if (cur === value) ret.push(item);
      }
    }
    return ret;
  },

  /**
    Returns an the first item with a property matching the passed value.  You
    can pass an optional second argument with the target value.  Otherwise
    this will match any property that evaluates to true.

    This method works much like the more generic find() method.

    @param {String} key the property to test
    @param {String} value optional value to test against.
    @returns {Object} found item or null
  */
  findProperty: function (key, value) {
    var len = this.length;
    var found = false, ret = null, next, cur;
    for (var idx = 0; idx < len && !found; idx += 1) {
      next = this[idx];
      cur = next ? (next.get ? next.get(key) : next[key]) : null;
      found = (value === undefined) ? !!cur : cur === value;
      if (found) ret = next;
    }
    next = null;
    return ret;
  },

  /**
    Returns true if the passed property resolves to true for all items in the
    enumerable.  This method is often simpler/faster than using a callback.

    @param {String} key the property to test
    @param {String} value optional value to test against.
    @returns {Boolean} whether every property is the same
  */
  everyProperty: function (key, value) {
    var len = this.length;
    var ret = true;
    for (var idx = 0;ret && (idx < len);idx++) {
      var next = this[idx];
      var cur = next ? (next.get ? next.get(key) : next[key]) : null;
      ret = (value === undefined) ? !!cur : cur === value;
    }
    return ret;
  },

  /**
    Returns YES if the passed property resolves to true for any item in the
    enumerable.  This method is often simpler/faster than using a callback.

    @param {String} key the property to test
    @param {String} value optional value to test against.
    @returns {Boolean} YES
  */
  someProperty: function (key, value) {
    var len = this.get ? this.get('length') : this.length;
    var ret  = false;
    var last = null;
    for (var idx = 0; !ret && (idx < len); idx++) {
      var next = this[idx]
      var cur = next ? (next.get ? next.get(key) : next[key]) : null;
      ret = (value === undefined) ? !!cur : cur === value;
      if (ret) return ret; // fast path
    }
    return ret;  // return the invert
  },

  get: function (key) {
    var ret = this[key];
    if (ret === undefined) {
      return this.unknownProperty(key);
    }
    if (ret && ret instanceof Function) {
      return ret.call(this, key);
    }
    else return ret;
  },

  unknownProperty: function (key, value) {
    if (value !== undefined) {
      this[key] = value;
    }
    else {
      return this.reducedProperty(key, value);
    }
    return value;
  },

  /**
   * Wrapper around splice
   * @param  {Number} index of element to be removed
   * @return {}       the object removed
   */
  removeAt: function (index) { // remove element at a certain index
    return this.splice(index, 1);
  }

});

Presto.mixin(Presto.Array, {
  create: function () {
    var C = this;

    return new C(arguments);
  }
});



/*globals Presto, console*/

Presto.lilypondParser = {

  /**
   * regex to match a score block
   * @type {RegExp}
   */
  _scoreRegex: /\\score.+?\{([\s\S]*)\}/,

  /**
   * regex to match a staff block
   * @type {RegExp}
   */
  _staffRegex: /\\new\sStaff\s\{([\s\S]+)\}/,

  /**
   * regex to match a voice block
   * @type {RegExp}
   */
  _voiceRegex: /\\new\sVoice\s\{([\s\S]+)\}/,

  /**
   * regex to match the clef command
   * @type {RegExp}
   */
  _clefRegex: /\\clef (.+)/, //match 1 will be the clef name

  /**
   * regex to match a time signature
   * @type {RegExp}
   */
  _timeRegex: /\\time ([0-9])\/([1|2|4|8|16])/,

  /**
   * regex to match a key signature
   * @type {RegExp}
   */
  _keyRegex: /\\key (.+) (\\major|\\minor)/,

  /**
   * regex to match a parallel block
   * @type {RegExp}
   */
  _parallelRegex: /<<([\s\S]*)>>/,

  /**
   * regex to match (and parse) a note
   * @type {RegExp}
   */
  _noteRegex: /\b([a-g](?:es|is|s)?)([',]*)(16|2|4|8|1)*(\.*)?/,

  _restRegex: /\b[r|R](16|2|4|8|1)*(\.*)?/,

  /**
   * regex to match (and parse) a relative block
   * @type {RegExp}
   */
  _relativeRegex: /\\relative[\s\S]+?([a-g](?:es|is|s)?)([',]*)?[\s\S]*?\{([\s\S]+?)\}/,

  /**
   * regex to match (and parse) a chord
   * @type {RegExp}
   */
  _chordRegex: /<(.+)>([1|2|4|8|16]?)(\.*)/,

  /**
   * regex to match (and parse) a bar command
   * @type {RegExp}
   */
  _barRegex: /\\bar[\s\S]*?"(.+?)"/,


  parseLilypond: function (code) {
    var ret = {
      staffs: []
    }, score, staffs, parallel, voices;

    this._previousNote = null;
    score = this.findBlock("score", code);
    staffs = this.findBlock("Staff", code);
    if (score.length === 0 && staffs.length === 0) { // go to simple mode
      ret.staffs[0] = {
        notes: [[this.parseVoice(code)]]
      };
    }
    else {
      if (score.length === 0 && staffs.length > 0) {
        score = "\\score { " + code + "}";
      }
      else score = score[0].trim();
      parallel = this._parallelRegex.exec(score);
      //if (parallel) { // not sure why this is important, except perhaps
      //that staffs should otherwise be processed in parallel.
      //let's leave that for now
      staffs.forEach(function (s) {
        var r = {
          notes: []
        };
        s = this._staffRegex.exec(s)[1];
        var clef = this._clefRegex.exec(s);
        if (clef) {
          r.clef = clef[1];
          // remove clef from code
          s = s.slice(0, clef.index) + s.slice(clef.index + clef[0].length);
          s = s.trim();
        }
        var time = this._timeRegex.exec(s);
        if (time) {
          r.time = time[1] + "/" + time[2]; // done to prevent having unparseable values
          s = s.slice(0, time.index) + s.slice(time.index + time[0].length);
          s = s.trim();
        }
        var key = this._keyRegex.exec(s);
        if (key) {
          r.key = key[1];
          if (key[2]) {
            r.key += " " + key[2].slice(1);
          }
          s = s.slice(0, key.index) + s.slice(key.index + key[0].length);
          s = s.trim();
        }
        // try to detect relative outside a voice context
        var voiceIndex = s.indexOf("\\new Voice");
        voiceIndex = (voiceIndex === -1)? s.indexOf("\\context Voice") : voiceIndex;
        if (voiceIndex > -1) {
          var relIndex = s.indexOf("\\relative");
          if (relIndex > -1 && relIndex < voiceIndex) {
            throw new Error("relative cannot be used outside a Voice context");
          }
        }
        // then parsing of contents, which can be either relative, absolute or a mix
        parallel = this._parallelRegex.exec(s);
        if (parallel) { // we have parallel voices
          voices = [];
          this.findBlock("Voice", s).forEach(function (v) {
            v = this._voiceRegex.exec(v)[1];
            voices.push(this.parseVoice(v));
          }, this);
          r.notes.push(voices);
        }
        else {
          // still check for voice blocks
          if (this._voiceRegex.exec(s)) { // probably only one voice to be found...
            this.findBlock("Voice", s).forEach(function (v) {
              v = this._voiceRegex.exec(v)[1];
              r.notes.push([this.parseVoice(v)]);
            }, this);
          }
          else r.notes.push([this.parseVoice(s)]);
        }
        ret.staffs.push(r);
      }, this);
    }

    return ret;
  },

  /**
   * The voice context itself is not supported yet, but the contents of a staff can be
   * regarded as a voice context anyhow
   * @param  {String} voiceContent content of voice context
   * @return {Array}              hashes of notes
   */
  parseVoice: function (voiceContent) {
    //easiest is to create an array
    //this._previousNote = null;
    //var raw = [], ret = [], match, match2, prev, note, notesString;
    // first parse all relative blocks

    // thinking about this a bit more, and realizing chords are not supported now
    // and also are very difficult to add in this setup, this should be done differently
    var v = voiceContent;
    var ret = [];
    var len = v.length;
    var curItem, match, cmd, chord, next, note, endOfNote, tmpPrev;
    var prev = {
      length: 4
    };
    var inRelative = false;

    var spacings = ["", " ", "\t", "\n"];

    var obj = {
      name: "voice"
    };

    var findSpacer = function (voice, fromIndex) {
      var ret = voice.length;
      [" ", "\n", "\t", "~"].forEach(function (s) {
        var pos = voice.indexOf(s, fromIndex);
        ret = (pos < ret && pos !== -1)? pos : ret;
      });
      if (ret === voice.length) ret = -1; // not found any
      return ret;
    };

    for (var i = 0; i < len; i += 1) {
      curItem = v[i];
      if (spacings.indexOf(curItem) > -1) continue; // ignore all spacing
      if (curItem === "\\") { // command
        next = v.indexOf(" ", i);
        if (next === -1) throw new Error("Syntax error: no space after command?");
        cmd = v.slice(i, next).trim(); // till the next space and get rid of extra's such as newlines...
        switch (cmd) {
          case "\\relative":
            match = this._relativeRegex.exec(v.slice(i));
            if (!match) throw new Error("syntax error in relative");
            prev = this.parseNote(match[1] + match[2], null, 4);
            inRelative = true;
            i = v.indexOf(match[3], i); // skip to the content of the relative
            break; // set relative parsing on, and set prev
          case "\\voiceOne":
            obj.voiceNumber = 1;
            i += cmd.length;
            break;
          case "\\voiceTwo":
            obj.voiceNumber = 2;
            i += cmd.length;
            break;
          case "\\bar":
            match = this._barRegex.exec(v.slice(i));
            if (!match) throw new Error("syntax error in bar");
            i += match[0].length;
            break;
          case "\\clef":
            match = this._clefRegex.exec(v.slice(i));
            if (!match) throw new Error("syntax error in clef");
            i += match[0].length;
            break;
          default:
            i += cmd.length;
            break;
        }
        continue;
      }
      if (curItem === "}" && inRelative) {
        inRelative = false;
        continue;
      }
      if (curItem === "<" && v[i + 1] !== "<") { // chord
        next = v.indexOf(">", i);
        match = this._chordRegex.exec(v.slice(i));
        if (!match) {
          throw new Error("Chord syntax error");
        }
        if (inRelative) {
          chord = this.parseChord(match, prev);
          ret.push(chord);
          prev = chord[0];
        }
        else { // absolute mode, give the previous length...
          chord = this.parseChord(match, null, prev.length);
          prev = chord[0];
          ret.push(chord);
        }
        i += match[0].length;
        continue;
      }
      if (curItem === "|") { // ignore bar checks for now
        i += 1;
        continue;
      }
      // now find the first spacing, which is one of " ", "\n", "\t", or "~"
      endOfNote = findSpacer(v, i);
      if (endOfNote === i) continue; // don't try to parse a spacer
      // // normal notes we assume
      // endOfNote = v.indexOf(" ", i);

      if (endOfNote === -1) { // only one reason it seems: end of string
        endOfNote = v.length;
      }
      note = v.slice(i, endOfNote);
      if (inRelative) {
        if (prev.length === null) prev.length = 4; // default length
        // don't overwrite the previous note when the new note actually is a rest
        tmpPrev = this.parseNote(note, prev);
      }
      else {
        tmpPrev = this.parseNote(note, null, prev.length);
      }
      ret.push(tmpPrev);
      if (tmpPrev.name !== "rest") prev = tmpPrev;
      i += note.length;
    }

    obj.notes = ret;

    return obj;
  },

  _previousNote: null,

  /**
   * Parses a chord
   * @param  {String|Array} chord     Chord in either string or regex result
   * @param  {Note} reference reference tone in case of relative
   * @param {Number} reflength In case of absolute names, there is no reference, but there is a current length
   *                           because lilypond allows the length to be omitted in both relative and absolute mode
   * @return {Array}           array of notes
   */
  parseChord: function (chord, reference, reflength) {
    if (typeof chord === "string") {
      chord = this._chordRegex.exec(chord);
      if (!chord) throw new Error("Syntax error in chord");
    }
    var ret = [];
    var notes = chord[1];
    var length = parseInt(chord[2], 10) || (reference ? reference.length : null) || reflength;
    var dots = chord[3];
    var prev = reference;
    notes.split(" ").forEach(function (n) {
      if (!n) return;
      n = this.parseNote(n, prev, reflength);
      if (n) {
        if (!n.length) n.length = length;
        if (dots) n.dots = dots.length;
        if (reference) prev = n; // only provide prev when in relative mode
        ret.push(n);
      }
    }, this);
    return ret;
  },

  /**
   * Parses a note into a note hash
   * @param  {String} note      the note to parse
   * @param  {Hash} reference Optional: if given, it will take this as relative reference
   * @return {[type]}           [description]
   */
  parseNote: function (note, reference, prevLength) {
    // this regex gives us 4 groups:
    // match[1] => note name
    // match[2] => commas or apostrophes
    // match[3] => base length
    // match[4] => dots
    var noteNames = Presto.Note._noteNames;
    var noteName, octave, restMode = false, length, dots;
    var match = this._noteRegex.exec(note);

    if (!match) { // this could be a rest
      match = this._restRegex.exec(note);
      if (match) {
        noteName = "rest";
        length = match[1] ? parseInt(match[1], 10) : null;
        octave = reference? reference.octave: 0;
        restMode = true;
        if (match[2]) {
          dots = match[2].split("").length;
        }
      }
    }
    if (!match) {
      console.log('invalid note name?: ' + note);
      console.log(match);
      throw new Error("Expected note, but got something I don't understand: '" + note + "'");
    }
    if (!restMode) {
      noteName = match[1];
      if (reference && reference.name !== "rest") {
        var indexOfRef = noteNames.indexOf(reference.name[0]);
        var indexOfNote = noteNames.indexOf(noteName[0]);
        octave = reference.octave;
        //_noteNames: ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
        if (indexOfRef < indexOfNote) {
          if ((indexOfNote - indexOfRef) > 3) octave -= 1;
        }
        else if (indexOfNote < indexOfRef) {
          if (indexOfRef - indexOfNote > 3) octave += 1;
        }
      }
      else {
        if (reference && reference.name === "rest") octave = reference.octave;
        else octave = 0;
      }

      match[2].split("").forEach(function (c) {
        if (c === "'") octave += 1;
        if (c === ",") octave -= 1;
      });

      length = match[3] ? parseInt(match[3], 10) : null;
      if (match[4]) {
        dots = match[4].split("").length;
      }
    }

    if (!length) {
      if (reference) length = reference.length;
      else if (prevLength) {
        length = prevLength;
      }
    }

    var ret = {
      name: noteName,
      octave: octave,
      length: length,
      dots: dots
    };

    this._previousNote = ret;
    return ret;
  },

  // this need to be done a bit differently, as regex is only going to help us onto a certain level
  /**
   * findBlock will find a block of a certain type in string
   * @param  {String} blockType such as score, Staff etc
   * @param  {String} string    from which the block will be retrieved
   * @return {Array|null}       Array with text blocks with the content of the blockType, null if not found
   */
  findBlock: function (blockType, string) {
    // this means, we search for "\" + blockType, then take the first { and continue till we
    // find a } on the same level
    //debugger;
    var command, cmdIndex, ret = [], curBlock = "";
    if (blockType[0] !== "\\") {
      command = "\\" + blockType;
      cmdIndex = string.indexOf(command);
      if (cmdIndex === -1) {
        command = "\\new " + blockType;
        cmdIndex = string.indexOf(command);
        if (cmdIndex === -1) {
          return ret; // we cannot find anything
        }
      }
    }
    var rest = string.slice(cmdIndex);
    var level = 0, openAcc, closeAcc;
    while (rest.length > 0) {
      openAcc = rest.indexOf("{");
      closeAcc = rest.indexOf("}");
      if (openAcc > -1 && openAcc < closeAcc) {
        level += 1;
        curBlock += rest.slice(0, openAcc + 1);
        rest = rest.slice(openAcc + 1);
      }
      else if (closeAcc > -1) {
        level -= 1;
        curBlock += rest.slice(0, closeAcc + 1);
        rest = rest.slice(closeAcc + 1);
      }
      if (level === 0) {
        // end of block reached
        ret.push(curBlock);
        curBlock = "";
        cmdIndex = rest.indexOf(command);
        if (cmdIndex > -1) {
          rest = rest.slice(cmdIndex);
        }
        else rest = ""; // we're done
      }
      if (level === 0 && openAcc === -1 && closeAcc === -1) {
        // nothing left to do
        rest = "";
      }
    }
    return ret;
  }

};
/*globals Presto */

Presto.fetaFontInfo = {
  "rests.0" : 0xE100,
  "rests.1" : 0xE101,
  "rests.0o" : 0xE102,
  "rests.1o" : 0xE103,
  "rests.M3" : 0xE104,
  "rests.M2" : 0xE105,
  "rests.M1" : 0xE106,
  "rests.2" : 0xE107,
  "rests.2classical" : 0xE108,
  "rests.3" : 0xE109,
  "rests.4" : 0xE10A,
  "rests.5" : 0xE10B,
  "rests.6" : 0xE10C,
  "rests.7" : 0xE10D,
  "accidentals.sharp" : 0xE10E,
  "accidentals.sharp.arrowup" : 0xE10F,
  "accidentals.sharp.arrowdown" : 0xE110,
  "accidentals.sharp.arrowboth" : 0xE111,
  "accidentals.sharp.slashslash.stem" : 0xE112,
  "accidentals.sharp.slashslashslash.stemstem" : 0xE113,
  "accidentals.sharp.slashslashslash.stem" : 0xE114,
  "accidentals.sharp.slashslash.stemstemstem" : 0xE115,
  "accidentals.natural" : 0xE116,
  "accidentals.natural.arrowup" : 0xE117,
  "accidentals.natural.arrowdown" : 0xE118,
  "accidentals.natural.arrowboth" : 0xE119,
  "accidentals.flat" : 0xE11A,
  "accidentals.flat.arrowup" : 0xE11B,
  "accidentals.flat.arrowdown" : 0xE11C,
  "accidentals.flat.arrowboth" : 0xE11D,
  "accidentals.flat.slash" : 0xE11E,
  "accidentals.flat.slashslash" : 0xE11F,
  "accidentals.mirroredflat.flat" : 0xE120,
  "accidentals.mirroredflat" : 0xE121,
  "accidentals.mirroredflat.backslash" : 0xE122,
  "accidentals.flatflat" : 0xE123,
  "accidentals.flatflat.slash" : 0xE124,
  "accidentals.doublesharp" : 0xE125,
  "accidentals.rightparen" : 0xE126,
  "accidentals.leftparen" : 0xE127,
  "arrowheads.open.01" : 0xE128,
  "arrowheads.open.0M1" : 0xE129,
  "arrowheads.open.11" : 0xE12A,
  "arrowheads.open.1M1" : 0xE12B,
  "arrowheads.close.01" : 0xE12C,
  "arrowheads.close.0M1" : 0xE12D,
  "arrowheads.close.11" : 0xE12E,
  "arrowheads.close.1M1" : 0xE12F,
  "dots.dot" : 0xE130,
  "noteheads.uM2" : 0xE131,
  "noteheads.dM2" : 0xE132,
  "noteheads.sM1" : 0xE133,
  "noteheads.s0" : 0xE134,
  "noteheads.s1" : 0xE135,
  "noteheads.s2" : 0xE136,
  "noteheads.s0diamond" : 0xE137,
  "noteheads.s1diamond" : 0xE138,
  "noteheads.s2diamond" : 0xE139,
  "noteheads.s0triangle" : 0xE13A,
  "noteheads.d1triangle" : 0xE13B,
  "noteheads.u1triangle" : 0xE13C,
  "noteheads.u2triangle" : 0xE13D,
  "noteheads.d2triangle" : 0xE13E,
  "noteheads.s0slash" : 0xE13F,
  "noteheads.s1slash" : 0xE140,
  "noteheads.s2slash" : 0xE141,
  "noteheads.s0cross" : 0xE142,
  "noteheads.s1cross" : 0xE143,
  "noteheads.s2cross" : 0xE144,
  "noteheads.s2xcircle" : 0xE145,
  "noteheads.s0do" : 0xE146,
  "noteheads.d1do" : 0xE147,
  "noteheads.u1do" : 0xE148,
  "noteheads.d2do" : 0xE149,
  "noteheads.u2do" : 0xE14A,
  "noteheads.s0re" : 0xE14B,
  "noteheads.u1re" : 0xE14C,
  "noteheads.d1re" : 0xE14D,
  "noteheads.u2re" : 0xE14E,
  "noteheads.d2re" : 0xE14F,
  "noteheads.s0mi" : 0xE150,
  "noteheads.s1mi" : 0xE151,
  "noteheads.s2mi" : 0xE152,
  "noteheads.u0fa" : 0xE153,
  "noteheads.d0fa" : 0xE154,
  "noteheads.u1fa" : 0xE155,
  "noteheads.d1fa" : 0xE156,
  "noteheads.u2fa" : 0xE157,
  "noteheads.d2fa" : 0xE158,
  "noteheads.s0la" : 0xE159,
  "noteheads.s1la" : 0xE15A,
  "noteheads.s2la" : 0xE15B,
  "noteheads.s0ti" : 0xE15C,
  "noteheads.u1ti" : 0xE15D,
  "noteheads.d1ti" : 0xE15E,
  "noteheads.u2ti" : 0xE15F,
  "noteheads.d2ti" : 0xE160,
  "scripts.ufermata" : 0xE161,
  "scripts.dfermata" : 0xE162,
  "scripts.ushortfermata" : 0xE163,
  "scripts.dshortfermata" : 0xE164,
  "scripts.ulongfermata" : 0xE165,
  "scripts.dlongfermata" : 0xE166,
  "scripts.uverylongfermata" : 0xE167,
  "scripts.dverylongfermata" : 0xE168,
  "scripts.thumb" : 0xE169,
  "scripts.sforzato" : 0xE16A,
  "scripts.espr" : 0xE16B,
  "scripts.staccato" : 0xE16C,
  "scripts.ustaccatissimo" : 0xE16D,
  "scripts.dstaccatissimo" : 0xE16E,
  "scripts.tenuto" : 0xE16F,
  "scripts.uportato" : 0xE170,
  "scripts.dportato" : 0xE171,
  "scripts.umarcato" : 0xE172,
  "scripts.dmarcato" : 0xE173,
  "scripts.open" : 0xE174,
  "scripts.stopped" : 0xE175,
  "scripts.upbow" : 0xE176,
  "scripts.downbow" : 0xE177,
  "scripts.reverseturn" : 0xE178,
  "scripts.turn" : 0xE179,
  "scripts.trill" : 0xE17A,
  "scripts.upedalheel" : 0xE17B,
  "scripts.dpedalheel" : 0xE17C,
  "scripts.upedaltoe" : 0xE17D,
  "scripts.dpedaltoe" : 0xE17E,
  "scripts.flageolet" : 0xE17F,
  "scripts.segno" : 0xE180,
  "scripts.coda" : 0xE181,
  "scripts.varcoda" : 0xE182,
  "scripts.rcomma" : 0xE183,
  "scripts.lcomma" : 0xE184,
  "scripts.rvarcomma" : 0xE185,
  "scripts.lvarcomma" : 0xE186,
  "scripts.arpeggio" : 0xE187,
  "scripts.trill_element" : 0xE188,
  "scripts.arpeggio.arrow.M1" : 0xE189,
  "scripts.arpeggio.arrow.1" : 0xE18A,
  "scripts.trilelement" : 0xE18B,
  "scripts.prall" : 0xE18C,
  "scripts.mordent" : 0xE18D,
  "scripts.prallprall" : 0xE18E,
  "scripts.prallmordent" : 0xE18F,
  "scripts.upprall" : 0xE190,
  "scripts.upmordent" : 0xE191,
  "scripts.pralldown" : 0xE192,
  "scripts.downprall" : 0xE193,
  "scripts.downmordent" : 0xE194,
  "scripts.prallup" : 0xE195,
  "scripts.lineprall" : 0xE196,
  "scripts.caesura.curved" : 0xE197,
  "scripts.caesura.straight" : 0xE198,
  "flags.u3" : 0xE199,
  "flags.u4" : 0xE19A,
  "flags.u5" : 0xE19B,
  "flags.u6" : 0xE19C,
  "flags.u7" : 0xE19D,
  "flags.d3" : 0xE19E,
  "flags.ugrace" : 0xE19F,
  "flags.dgrace" : 0xE1A0,
  "flags.d4" : 0xE1A1,
  "flags.d5" : 0xE1A2,
  "flags.d6" : 0xE1A3,
  "flags.d7" : 0xE1A4,
  "clefs.C" : 0xE1A5,
  "clefs.C_change" : 0xE1A6,
  "clefs.F" : 0xE1A7,
  "clefs.F_change" : 0xE1A8,
  "clefs.G" : 0xE1A9,
  "clefs.G_change" : 0xE1AA,
  "clefs.percussion" : 0xE1AB,
  "clefs.percussion_change" : 0xE1AC,
  "clefs.tab" : 0xE1AD,
  "clefs.tab_change" : 0xE1AE,
  "timesig.C44" : 0xE1AF,
  "timesig.C22" : 0xE1B0,
  "pedal.*" : 0xE1B1,
  "pedal.M" : 0xE1B2,
  "pedal.." : 0xE1B3,
  "pedal.P" : 0xE1B4,
  "pedal.d" : 0xE1B5,
  "pedal.e" : 0xE1B6,
  "pedal.Ped" : 0xE1B7,
  "brackettips.up" : 0xE1B8,
  "brackettips.down" : 0xE1B9,
  "accordion.accDiscant" : 0xE1BA,
  "accordion.accDot" : 0xE1BB,
  "accordion.accFreebase" : 0xE1BC,
  "accordion.accStdbase" : 0xE1BD,
  "accordion.accBayanbase" : 0xE1BE,
  "accordion.accOldEE" : 0xE1BF,
  "rests.M3neomensural" : 0xE1C0,
  "rests.M2neomensural" : 0xE1C1,
  "rests.M1neomensural" : 0xE1C2,
  "rests.0neomensural" : 0xE1C3,
  "rests.1neomensural" : 0xE1C4,
  "rests.2neomensural" : 0xE1C5,
  "rests.3neomensural" : 0xE1C6,
  "rests.4neomensural" : 0xE1C7,
  "rests.M3mensural" : 0xE1C8,
  "rests.M2mensural" : 0xE1C9,
  "rests.M1mensural" : 0xE1CA,
  "rests.0mensural" : 0xE1CB,
  "rests.1mensural" : 0xE1CC,
  "rests.2mensural" : 0xE1CD,
  "rests.3mensural" : 0xE1CE,
  "rests.4mensural" : 0xE1CF,
  "noteheads.slneomensural" : 0xE1D0,
  "noteheads.sM3neomensural" : 0xE1D1,
  "noteheads.sM2neomensural" : 0xE1D2,
  "noteheads.sM1neomensural" : 0xE1D3,
  "noteheads.s0harmonic" : 0xE1D4,
  "noteheads.s2harmonic" : 0xE1D5,
  "noteheads.s0neomensural" : 0xE1D6,
  "noteheads.s1neomensural" : 0xE1D7,
  "noteheads.s2neomensural" : 0xE1D8,
  "noteheads.slmensural" : 0xE1D9,
  "noteheads.sM3mensural" : 0xE1DA,
  "noteheads.sM2mensural" : 0xE1DB,
  "noteheads.sM1mensural" : 0xE1DC,
  "noteheads.s0mensural" : 0xE1DD,
  "noteheads.s1mensural" : 0xE1DE,
  "noteheads.s2mensural" : 0xE1DF,
  "noteheads.s0petrucci" : 0xE1E0,
  "noteheads.s1petrucci" : 0xE1E1,
  "noteheads.s2petrucci" : 0xE1E2,
  "noteheads.svaticana.punctum" : 0xE1E3,
  "noteheads.svaticana.punctum.cavum" : 0xE1E4,
  "noteheads.svaticana.linea.punctum" : 0xE1E5,
  "noteheads.svaticana.linea.punctum.cavum" : 0xE1E6,
  "noteheads.svaticana.inclinatum" : 0xE1E7,
  "noteheads.svaticana.lpes" : 0xE1E8,
  "noteheads.svaticana.vlpes" : 0xE1E9,
  "noteheads.svaticana.upes" : 0xE1EA,
  "noteheads.svaticana.vupes" : 0xE1EB,
  "noteheads.svaticana.plica" : 0xE1EC,
  "noteheads.svaticana.vplica" : 0xE1ED,
  "noteheads.svaticana.epiphonus" : 0xE1EE,
  "noteheads.svaticana.vepiphonus" : 0xE1EF,
  "noteheads.svaticana.reverse.plica" : 0xE1F0,
  "noteheads.svaticana.reverse.vplica" : 0xE1F1,
  "noteheads.svaticana.inner.cephalicus" : 0xE1F2,
  "noteheads.svaticana.cephalicus" : 0xE1F3,
  "noteheads.svaticana.quilisma" : 0xE1F4,
  "noteheads.ssolesmes.incl.parvum" : 0xE1F5,
  "noteheads.ssolesmes.auct.asc" : 0xE1F6,
  "noteheads.ssolesmes.auct.desc" : 0xE1F7,
  "noteheads.ssolesmes.incl.auctum" : 0xE1F8,
  "noteheads.ssolesmes.stropha" : 0xE1F9,
  "noteheads.ssolesmes.stropha.aucta" : 0xE1FA,
  "noteheads.ssolesmes.oriscus" : 0xE1FB,
  "noteheads.smedicaea.inclinatum" : 0xE1FC,
  "noteheads.smedicaea.punctum" : 0xE1FD,
  "noteheads.smedicaea.rvirga" : 0xE1FE,
  "noteheads.smedicaea.virga" : 0xE1FF,
  "noteheads.shufnagel.punctum" : 0xE200,
  "noteheads.shufnagel.virga" : 0xE201,
  "noteheads.shufnagel.lpes" : 0xE202,
  "clefs.vaticana.do" : 0xE203,
  "clefs.vaticana.do_change" : 0xE204,
  "clefs.vaticana.fa" : 0xE205,
  "clefs.vaticana.fa_change" : 0xE206,
  "clefs.medicaea.do" : 0xE207,
  "clefs.medicaea.do_change" : 0xE208,
  "clefs.medicaea.fa" : 0xE209,
  "clefs.medicaea.fa_change" : 0xE20A,
  "clefs.neomensural.c" : 0xE20B,
  "clefs.neomensural.c_change" : 0xE20C,
  "clefs.petrucci.c1" : 0xE20D,
  "clefs.petrucci.c1_change" : 0xE20E,
  "clefs.petrucci.c2" : 0xE20F,
  "clefs.petrucci.c2_change" : 0xE210,
  "clefs.petrucci.c3" : 0xE211,
  "clefs.petrucci.c3_change" : 0xE212,
  "clefs.petrucci.c4" : 0xE213,
  "clefs.petrucci.c4_change" : 0xE214,
  "clefs.petrucci.c5" : 0xE215,
  "clefs.petrucci.c5_change" : 0xE216,
  "clefs.mensural.c" : 0xE217,
  "clefs.mensural.c_change" : 0xE218,
  "clefs.petrucci.f" : 0xE219,
  "clefs.petrucci.f_change" : 0xE21A,
  "clefs.mensural.f" : 0xE21B,
  "clefs.mensural.f_change" : 0xE21C,
  "clefs.petrucci.g" : 0xE21D,
  "clefs.petrucci.g_change" : 0xE21E,
  "clefs.mensural.g" : 0xE21F,
  "clefs.mensural.g_change" : 0xE220,
  "clefs.hufnagel.do" : 0xE221,
  "clefs.hufnagel.do_change" : 0xE222,
  "clefs.hufnagel.fa" : 0xE223,
  "clefs.hufnagel.fa_change" : 0xE224,
  "clefs.hufnagel.do.fa" : 0xE225,
  "clefs.hufnagel.do.fa_change" : 0xE226,
  "custodes.hufnagel.u0" : 0xE227,
  "custodes.hufnagel.u1" : 0xE228,
  "custodes.hufnagel.u2" : 0xE229,
  "custodes.hufnagel.d0" : 0xE22A,
  "custodes.hufnagel.d1" : 0xE22B,
  "custodes.hufnagel.d2" : 0xE22C,
  "custodes.medicaea.u0" : 0xE22D,
  "custodes.medicaea.u1" : 0xE22E,
  "custodes.medicaea.u2" : 0xE22F,
  "custodes.medicaea.d0" : 0xE230,
  "custodes.medicaea.d1" : 0xE231,
  "custodes.medicaea.d2" : 0xE232,
  "custodes.vaticana.u0" : 0xE233,
  "custodes.vaticana.u1" : 0xE234,
  "custodes.vaticana.u2" : 0xE235,
  "custodes.vaticana.d0" : 0xE236,
  "custodes.vaticana.d1" : 0xE237,
  "custodes.vaticana.d2" : 0xE238,
  "custodes.mensural.u0" : 0xE239,
  "custodes.mensural.u1" : 0xE23A,
  "custodes.mensural.u2" : 0xE23B,
  "custodes.mensural.d0" : 0xE23C,
  "custodes.mensural.d1" : 0xE23D,
  "custodes.mensural.d2" : 0xE23E,
  "accidentals.medicaeaM1" : 0xE23F,
  "accidentals.vaticanaM1" : 0xE240,
  "accidentals.vaticana0" : 0xE241,
  "accidentals.mensural1" : 0xE242,
  "accidentals.mensuralM1" : 0xE243,
  "accidentals.hufnagelM1" : 0xE244,
  "flags.mensuralu03" : 0xE245,
  "flags.mensuralu13" : 0xE246,
  "flags.mensuralu23" : 0xE247,
  "flags.mensurald03" : 0xE248,
  "flags.mensurald13" : 0xE249,
  "flags.mensurald23" : 0xE24A,
  "flags.mensuralu04" : 0xE24B,
  "flags.mensuralu14" : 0xE24C,
  "flags.mensuralu24" : 0xE24D,
  "flags.mensurald04" : 0xE24E,
  "flags.mensurald14" : 0xE24F,
  "flags.mensurald24" : 0xE250,
  "flags.mensuralu05" : 0xE251,
  "flags.mensuralu15" : 0xE252,
  "flags.mensuralu25" : 0xE253,
  "flags.mensurald05" : 0xE254,
  "flags.mensurald15" : 0xE255,
  "flags.mensurald25" : 0xE256,
  "flags.mensuralu06" : 0xE257,
  "flags.mensuralu16" : 0xE258,
  "flags.mensuralu26" : 0xE259,
  "flags.mensurald06" : 0xE25A,
  "flags.mensurald16" : 0xE25B,
  "flags.mensurald26" : 0xE25C,
  "timesig.mensural44" : 0xE25D,
  "timesig.mensural22" : 0xE25E,
  "timesig.mensural32" : 0xE25F,
  "timesig.mensural64" : 0xE260,
  "timesig.mensural94" : 0xE261,
  "timesig.mensural34" : 0xE262,
  "timesig.mensural68" : 0xE263,
  "timesig.mensural98" : 0xE264,
  "timesig.mensural48" : 0xE265,
  "timesig.mensural68alt" : 0xE266,
  "timesig.mensural24" : 0xE267,
  "timesig.neomensural44" : 0xE268,
  "timesig.neomensural22" : 0xE269,
  "timesig.neomensural32" : 0xE26A,
  "timesig.neomensural64" : 0xE26B,
  "timesig.neomensural94" : 0xE26C,
  "timesig.neomensural34" : 0xE26D,
  "timesig.neomensural68" : 0xE26E,
  "timesig.neomensural98" : 0xE26F,
  "timesig.neomensural48" : 0xE270,
  "timesig.neomensural68alt" : 0xE271,
  "timesig.neomensural24" : 0xE272,
  "scripts.ictus" : 0xE273,
  "scripts.uaccentus" : 0xE274,
  "scripts.daccentus" : 0xE275,
  "scripts.usemicirculus" : 0xE276,
  "scripts.dsemicirculus" : 0xE277,
  "scripts.circulus" : 0xE278,
  "scripts.augmentum" : 0xE279,
  "scripts.usignumcongruentiae" : 0xE27A,
  "scripts.dsignumcongruentiae" : 0xE27B,
  "dots.dotvaticana" : 0xE27C,
  "0": 0x030,
  "1": 0x031,
  "2": 0x032,
  "3": 0x033,
  "4": 0x034,
  "5": 0x035,
  "6": 0x036,
  "7": 0x037,
  "8": 0x038,
  "9": 0x039
};

Presto.fetaFontMetrics = {}; // will be filled on init and on resize
/*globals Presto*/

/*
Presto.Grob is the basic GRaphical OBject. It provides the basic relative positioning functionality,
as well as the support for containing other grobs.

Relative positioning is done against the parent, where in the end the top grob must have an absolute position.
In order for this to work, every grob has a x and y property, which indicate its relative position to the parent grob.

This system allows for a basic first round of creating a basic layout, which can then be finetuned.
The difficulty of such a system is that the aligning doesn't necessarily can be done through x and y, as that would mean
that everything would be left aligned. The system of music notation only needs horizontal aligning as the vertical position can
In order to deal with this, a grob can contain a align property, which

Because this system is also intended to be edited graphically and filled incrementally, the render phase of the system will create a
new representation in absolutely positioned elements. In order to do this, every grob needs to define its absolute version on the
renderDelegate property. While it is technically not really a render delegate, it is the closest approximation.

The advantage of doing the rendering this way is that grobs don't have to be aware of grobs directly around them.

*/
Presto.mixin({
  /**
   * Positioning modes
   */
  PMODE_RELATIVE: 'relative',
  PMODE_ABSOLUTE: 'absolute',

  _isValidCoordinate: function (c) {
    return (c !== undefined && c !== null);
  }
});


// base class for render delegates
/**
 * Base class for render delegates
 * @extends { Presto.Object }
 */
Presto.GrobRenderDelegate = Presto.Object.extend({
  /**
   * The Renderer gets 4 times a position, being x and y and absX and absY.
   * x and y represent the absolute position the parent thinks this grob should have.
   * relX and relY represent the position relative to the parent.
   * x and y are calculated as the absX + relX and absY + relY.
   * Reason that both are given is that sometimes there are more coordinates which needs moving
   * than just x and y. In normal use you can rely on x and y having the right position, and
   * in specific use, you can use the difference to check out how the rest needs to be moved as well
   * @type {Number}
   */
  x: null,
  y: null,
  relX: null,
  relY: null,

  positioningMode: Presto.PMODE_ABSOLUTE,

  render: function (context) {
    return this;
  }

});

/**
 * Grob, base class for all Graphical Objects
 * @extends {Presto.Object}
 */
Presto.Grob = Presto.Object.extend({
  /**
   * The horizontal position relative to the parent
   * @type {Number}
   */
  x: null,

  /**
   * The horizontal position relative to the parent
   * @type {Number}
   */
  y: null,

  /**
   * The parentGrob of this grob, currently unused
   * @type {Presto.Grob}
   */
  parentGrob: null,

  /**
   * childGrobs
   * @type {Presto.Array}
   */
  childGrobs: null,

  positioningMode: Presto.PMODE_RELATIVE,

  /**
   * If true, this will cause the rendering process will ignore the width of this grob
   * @type {Boolean}
   */
  ignoreWidth: null, // set to true if width has to be ignored

  /**
   * If true, the rendering process will not render this object, but only its childGrobs if present
   * @type {Boolean}
   */
  isContainer: false, // set to true when the grob should not render anything itself

  /**
   * if true, the render process should render this object, otherwise it should not
   * @type {Boolean}
   */
  isVisible: true,

  /**
   * Properties which need to be copied onto the render delegate
   * @type {Array}
   */
  renderProperties: null,

  /**
   * The default width of a grob is the total of the childgrobs
   * @return {Number} width of the child grobs in pixels, or 0 if none
   */
  width: function () {
    if (!this.childGrobs) return 0;
    var w = this.childGrobs.getEach('width');
    return w.get('@sum');
  },

  /**
   * render on a grob does two things: it will create a render delegate instance of itself (when needed)
   * and it will check whether it has childGrobs and render those as well
   * @param  {Number} refX Parents absX plus the internal xOffset
   * @param  {Number} refY Parents absY
   * @return {Array}       Array containing all the render delegate instances
   */
  render: function (refX, refY) {
    var ret = [];
    if (!Presto._isValidCoordinate(refX) || !Presto._isValidCoordinate(refY)) {
      throw new Error("Presto.Grob#render: invalid parent coordinates detected");
    }
    if (!this.isVisible) return;
    var curX = this.get('x');
    var curY = this.get('y');
    var absX = curX + refX;
    var absY = curY + refY;

    var xOffset = 0;
    if (this.renderDelegate && !this.isContainer) {
      var baseObj = {
        x: absX,
        y: absY,
        isVisible: this.isVisible,
        relX: curX,
        relY: curY
      };
      if (this.renderProperties && this.renderProperties instanceof Array) {
        this.renderProperties.forEach(function (rp) {
          baseObj[rp] = this.get(rp);
        }, this);
      }
      ret.push(this.renderDelegate.create(baseObj));
    }
    if (this.childGrobs && this.childGrobs.length > 0) {
      // TODO: it might be necessary to add something to xOffset in case or margins/padding
      //
      // this renders the child grobs, make sure that we adjust the positions properly
      this.childGrobs.forEach(function (cg) {
        ret = ret.concat(cg.render(absX + xOffset, absY));
        // not sure if the line below is a good idea...
        //if (!cg.ignoreWidth) xOffset += cg.get('width');
      });
    }
    return ret;
  },


  renderDelegate: Presto.GrobRenderDelegate,

  /**
   * Adds a childgrob to the current grob
   * @param {Presto.Grob} grob The grob required to be added
   */
  addChildGrob: function (grob) {
    if (!this.childGrobs) this.childGrobs = Presto.Array.create();
    if (!grob.parentGrob) grob.set('parentGrob', this);
    if (grob.x === null) grob.x = 0;
    if (!grob.score && this.score) grob.score = this.score;
    if (!grob.staff && this.staff) grob.staff = this.staff;
    this.childGrobs.push(grob);
    return this;
  },

  addChildGrobs: function (grobs) {
    if (grobs && grobs instanceof Array) {
      grobs.forEach(this.addChildGrob, this);
    }
    return this;
  }

});



// A GRaphical OBject: basic element which represents a simple layer of abstraction
// for positioning. It resembles the SproutCore layout hash, but then as an SC.Object
// and with auto-updating functionality
//
// In discussion with publickeating, this design needs to be reviewed.
// Reason is that it is not required to have all properties set at all times.
// - left has no meaning when right + width + right aligned
// - top + right aligned => right, top, width and height are required
//
// so, in the end it seems to be best to have a function called frame which returns the correct
// frame, and have everything (if required) depend on that.
//
// It is important to realize that some issues will remain, as the canvas element (for which
// this grob is intended to work) only has x and y as positioning system.
// What needs to be realized here as well is that this x and y do not necessarily represent the top and left
// of the Grob. For a note specifically, the x and y is the left / middle of the character.
//
// Actually, having observers on the properties is not going to work _ AT ALL _
// The problem being that the observers will only be triggered at the end of the runloop
// which is WAY too late for what we need here... ie something immediate
// So, computed properties would be _MUCH_ better, as they should be direct...
// there is another advantage with computed properties, as we can call them directly internally
// with extra arguments... however, when creating the grob, we cannot do left: 1, right: 1 as that would
// overwrite the computed property...
//
//
// no, much better is a separate function called adjust(prop, value) which we control
// saves all observers...
//
///*global Presto, console*/
// Presto.Grob = Presto.Object.extend({
//   x: null,
//   y: null,
//   height: null,
//   //width: null,
//   marginLeft: 0,
//   marginRight: 0,
//   marginTop: 0,
//   marginBottom: 0,
//   paddingLeft: null,
//   paddingRight: null,
//   paddingTop: null,
//   paddingBottom: null,

//   debugGrob: false, // draw a box with the outer limits of the grob, as well as a box with the margins

//   // the following property values define how the grob
//   // will deal with height and width adjustments.
//   // The default for both is ALIGN_CENTER, which means that:
//   // - when the height is reduced or enlarged, both the top and bottom will be adjusted equally (half of the change value)
//   // - when the width is reduced or enlarged, both left and right will be adjusted equally (half of the change value)
//   // Other supported values are
//   // - SC.ALIGN_LEFT and SC.ALIGN_RIGHT for horizontalAlign
//   //   - When set to SC.ALIGN_LEFT: if width is adjusted, the left value is not touched
//   //   - When set to SC.ALIGN_RIGHT: if width is adjusted, the right value is not touched
//   // - SC.ALIGN_TOP and SC.ALIGN_BOTTOM for verticalAlign
//   //   - When set to SC.ALIGN_TOP: if height is adjusted, the top value is not touched
//   //   - When set to SC.ALIGN_BOTTOM: if height is adjusted, the bottom value is not touched
//   horizontalAlign: SC.ALIGN_CENTER,
//   verticalAlign: SC.ALIGN_CENTER,

//   move: function (key, value) {
//     // function to move the object in a specific direction
//     // if (this._absoluteDisplayProperties.indexOf(key) === -1) {
//     //   console.log("WARNING: using CanvasMusic.Grob#move with margin or padding... Please use set...");
//     //   return this;
//     // }
//     //
//     var v = this.get(key) || 0;
//     return this.set(key, v + value);
//   },

//   positioningMode: null,

//   parentGrob: null, // attach to a parent object

//   init: function () {
//     arguments.callee.base.apply(this, arguments);
//     if (!this.positioningMode) this.set('positioningMode', CanvasMusic.Grob.PMODE_RELATIVE);
//   },

//   _absoluteDisplayProperties: ['x', 'y', 'height', 'width'],

//   _marginDisplayProperties: ['marginLeft', 'marginRight', 'marginTop', 'marginBottom' ],

//   _paddingDisplayProperties: [ 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'],

//   // this is a way to get the marginRight we have to take into account
//   previousMarginRight: function () {
//     var ret = 0;
//     var prevGrob = this.get('previousGrob');
//     if (prevGrob) ret = prevGrob.get('marginRight');
//     return ret;
//   }.property(),

//   previousGrob: function () {
//     var ret;
//     var parentChildGrobs = this.getPath('parentGrob.childGrobs');
//     if (parentChildGrobs) {
//       var prevIndex = parentChildGrobs.indexOf(this) - 1;
//       if (prevIndex >= 0) {
//         ret = parentChildGrobs.objectAt(prevIndex);
//       }
//     }
//     return ret;
//   }.property(),

//   previousFrame: function () {
//     //var ret = { x: 0, y: 0 };
//     var ret;
//     var prevGrob = this.get('previousGrob');
//     if (prevGrob) ret = prevGrob.get('frame');
//     return ret;
//   }.property(),

//   // frame will always return an absolute positioning
//   // which means a hash with x, y, height, width
//   // consequency also means coercing everything into this pattern
//   //
//   // What possibly goes wrong here is that the frame inside a column depends on all the widths and margins of all previous
//   // items set against the frame of the column.
//   frame: function () {
//     var absProps = this._absoluteDisplayProperties,
//         posMode = this.get('positioningMode'),
//         parentFrame, marginLeft, //prevMarginRight,
//         previousGrob, xOffset, ret = {};

//     //debugger;
//     // the pattern is to take the absolute properties first
//     if (posMode === CanvasMusic.Grob.PMODE_ABSOLUTE) {
//       absProps.forEach(function (p) {
//         ret[p] = this.get(p);
//       }, this);
//     }
//     else { // in relative mode...
//       // meaning that we have to adjust the absolute positions we get from the parent
//       // using the relative properties
//       // add the marginRight of the previous item to the current x position, as well as
//       // our marginLeft
//       //prevMarginRight = this.get('previousMarginRight');
//       marginLeft = this.get('marginLeft') || 0;
//       parentFrame = this.getPath('parentGrob.frame');
//       previousGrob = this.get('previousGrob');
//       var prevFrame;
//       //SC.Logger.log("parent of %@ is a %@, with frame %@".fmt(this, this.get('parentGrob'), SC.inspect(parentFrame)));

//       if (previousGrob) {
//         prevFrame = previousGrob.get('frame');
//         //SC.Logger.log("previousGrob of %@ is a %@ (skipwidth: %@), with frame %@".fmt(this, previousGrob, previousGrob.get('skipWidth'), SC.inspect(prevFrame)));
//       }
//       if (previousGrob && !previousGrob.get('skipWidth')) {
//         // this looks a bit weird, but the problem is that width already contains the previous margin left
//         // as well as the right one, so we need to take it out to prevent it from being counted twice
//         xOffset = prevFrame.x + prevFrame.width - prevFrame.marginLeft; // marginRight is already in the prevFrame.width
//       }
//       else {
//         xOffset = parentFrame.x || 0;
//       }
//       ret.x = xOffset + this.get('x') + marginLeft;
//       ret.y = parentFrame.y + this.get('y');
//       ret.height = this.get('height');
//       ret.width = this.get('width');
//       ret.marginLeft = this.get('marginLeft');
//       ret.marginRight = this.get('marginRight');
//       //ret.widthOfChildGrobs = this.get('widthOfChildGrobs')
//     }
//     if (this.debugGrob) SC.Logger.log("frame of %@ is %@".fmt(this, SC.inspect(ret)));
//     return ret;
//   }.property().cacheable(),

//   // for debugging purposes
//   relativeFrame: function () {
//     var props = this._displayProperties;
//     var ret = {};
//     props.forEach(function (p) {
//       ret[p] = this.get(p);
//     }, this);
//     return ret;
//   }.property(),

//   childGrobs: null,

//   widthOfChildGrobs: function () {
//     if (!this.childGrobs) return 0;
//     var ret = 0;
//     this.childGrobs.forEach(function (g) {
//       var w;
//       if (g.get('skipWidth')) {
//         w = 0;
//       }
//       else if (g.get('childGrobs')) {
//         w = g.get('widthOfChildGrobs');
//       }
//       else w = g.get('width');

//       ret += w + g.get('marginLeft') + g.get('marginRight');
//     });
//     return ret;
//   }.property('numberOfChildGrobs', 'skipWidth').cacheable(),

//   width: function () {
//     // the width of a grob is the width of the contents, and the marginLeft and marginRight
//     if (!this.get('skipWidth')) {
//       return this.get('widthOfChildGrobs') + this.get('marginLeft') + this.get('marginRight');
//     }
//     else return 0;
//   }.property('numberOfChildGrobs', 'marginLeft', 'marginRight', 'skipWidth').cacheable(),

//   autoAdjustOnAdd: false, //

//   addChildGrob: function (g) {
//     if (!this.childGrobs) this.childGrobs = [];
//     if (!g){
//       //SC.warn("CanvasMusic.Grob#addChildGrob: trying to add ")
//       return; // ignore undefined / null / false
//     }

//     if (!g.get('parentGrob')) {
//       g.set('parentGrob', this);
//     }

//     if (!g.get('cm')) {
//       g.set('cm', this.get('cm'));
//     }

//     // we assume that all childgrobs will be in horizontal alignment, unless it is specified
//     if (g.get('x') === null) {
//       if (this.childGrobs.length === 0) {
//         g.set('x', 0);
//         if (g.get('y') === null) g.set('y', 0);
//       }

//       // let's not do this automatically, it goes horribly wrong for vertically stacked things (such as staffs)
//       // because it starts adding up the widths of the staff lines...
//       // perhaps in a configurable way, but not like this...
//       //
//       // else if (this.childGrobs.length > 0 && relativeMode && g.autoAdjustOnAdd) {
//       //   //debugger;
//       //   // there are items in the child grobs, only adjust in relative mode!
//       //   var lastObj = this.childGrobs.lastObject();
//       //   // adjust left to the width + the margin of the last object
//       //   var diff = lastObj.get('width') + lastObj.get('marginLeft') + lastObj.get('marginRight');
//       //   g.move('x', diff);
//       // }
//       //
//     }

//     // if (g.get('width') && relativeMode && !g.skipWidth) {
//     //   this.set('width', this.get('width') + g.get('width'));
//     // }

//     var l = this.childGrobs.push(g);
//     this.set('numberOfChildGrobs', l);
//     return this;
//   },

//   // removeChildGrob: function (g) {
//   //   if (!this.childGrobs) return this;
//   //   // what functionality to provide here exactly?
//   //   // we usually would not have a reference, so a type would be rather more useful...
//   // },

//   // this should be implemented on a grob basis
//   render: function (context) {
//     var cG = this.get('childGrobs');
//     if (cG) {
//       cG.forEach(function (g) {
//         if (!g || !g.render) console.log(g);
//         g.render(context);
//       });
//     }
//     if (this.debugGrob) this._drawDebugFrame(context);
//     return this;
//   },

//   _drawDebugFrame: function (ctx) {
//     //debugger;
//     var origLineWidth = ctx.lineWidth;
//     var origStrokeStyle = ctx.strokeStyle;
//     var frame = this.get('frame');
//     var h = frame.height || 70; // default height
//     //ctx.beginPath();
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = "blue";
//     ctx.strokeRect(frame.x, frame.y, frame.width, h);
//     ctx.strokeStyle = "red";
//     ctx.strokeRect(frame.x + frame.marginLeft, frame.y, frame.width - frame.marginRight, h);
//     ctx.lineWidth = origLineWidth;
//     ctx.strokeStyle = origStrokeStyle;
//     ctx.font = "9pt Arial";
//     var dbgtext = SC.guidFor(this);
//     var w = frame.x + (frame.width - ctx.measureText(dbgtext).width) / 2;
//     ctx.fillText(dbgtext, w, frame.y);
//   },

//   toString: function () {
//     return "Presto.Grob %@".fmt(SC.guidFor(this));
//   }

// });


/*globals Presto*/

Presto.Symbol = Presto.Grob.extend({
  init: function () {
    if (!this.fontSize) {
      //Presto.warn("Presto.Symbol initialized without fontSize property!");
      this.fontSize = this.score.get('fontSize');
    }
    if (this.ignoreWidth) {
      this.width = 0;
    }
    else {
      var metrics = Presto.fetaFontMetrics[this.get('name')];
      if (!metrics) {
        Presto.warn("Presto.Symbol: no metrics found for " + this.name);
        this.width = 0;
      }
      else {
        this.width = metrics.width;
      }
    }
    if (!this.name) {
      throw new Error("cannot print an undefined symbol!");
    }
  },

  renderProperties: ['name', 'fontSize'],

  renderDelegate: Presto.GrobRenderDelegate.extend({
    render: function (context) {
      var fontSize = this.get('fontSize');
      var char = Presto.fetaFontInfo[this.get('name')];
      if (!char) Presto.warn("Presto.Symbol: cannot render symbol with unknown name: " + name);
      var font = fontSize + "pt Emmentaler26"; //   ctx.font = "32pt Emmentaler26";
      context.beginPath();
      context.font = font;
      context.fillText(char, this.x, this.y);
    }
  }),

  // toString: function () {
  //   return "CanvasMusic.Symbol %@, name: %@".fmt(SC.guidFor(this), this.get('name'));
  // }
});

/*globals Presto*/
Presto.Line = Presto.Grob.extend({
  color: 'black',

  /**
   * Thickness of the line
   * @type {Number}
   */
  lineWidth: null,

  toString: function () {
    return "Presto.Line %@";
  },

  /**
   * toX and toY are the coordinates to be used as end point of the line
   * @type {Number}
   */
  toX: null,
  toY: null,

  /**
   * a line should usually be ignored width wise
   * @type {Boolean}
   */
  ignoreWidth: true,

  renderProperties: ['toX', 'toY', 'lineWidth', 'color'],

  renderDelegate: Presto.GrobRenderDelegate.extend({
    render: function (context) {
      var lw    = this.get('lineWidth'),
          color = this.get('color');

      context.beginPath();
      if (lw) context.lineWidth = lw;
      if (color) context.color = color;
      context.moveTo(this.x, this.y);
      var diffX = this.x - this.relX;
      var diffY = this.y - this.relY;
      context.lineTo(this.toX + diffX, this.toY + diffY);
      context.stroke();
    }
  })
});

// CanvasMusic.Line = CanvasMusic.Grob.extend({
//   // height === thickness
//   //
//   color: 'black',

//   lineWidth: null,

//   toString: function () {
//     return "CanvasMusic.Line %@".fmt(SC.guidFor(this));
//   },

//   render: function (context) {
//     if (this.get('parentGrob').isBarline) debugger;
//     var frame = this.get('frame');
//     var lw = this.get('lineWidth');
//     context.beginPath();
//     if (lw) context.lineWidth = lw;
//     //context.color = this.get('color');

//     var x1 = frame.x, x2 = frame.x + frame.width;
//     var y1 = frame.y, y2 = frame.y + frame.height;

//     context.moveTo(frame.x, frame.y);
//     context.lineTo(frame.x + frame.width, frame.y + frame.height);
//     context.stroke();
//     //console.log("drawning line: " + SC.inspect(frame));
//     //console.log('drawing line from x1: %@, y1: %@, to x2: %@, y2: %@'.fmt(x1, y1, x2, y2));
//     //console.log('lineWidth: ' + lw);
//   }
// });
/*globals Presto*/


/**
 * Presto.Barline is as the name suggest very much like a line. It needs to be able to
 * do more though, so it is a Grob.
 */
Presto.Barline = Presto.Grob.extend({
  /**
   * Quack like a duck
   * @type {Boolean}
   */
  isBarline: true,

  /**
   * The type of barline to draw. See below.
   * @type {String}
   */
  type: null,

  toX: null,

  toY: null,

  init: function () {
    var t = this.get('type');
    switch (t) {
      case Presto.Barline.T_SINGLE:
        this.addSingleBarline();
        break;
    }
  },

  addSingleBarline: function () {
    this.addChildGrob(Presto.Line.create({
      x: 0,
      y: 1,
      toX: 0,
      toY: Math.abs(this.y - this.toY) + (this.staff.staffLineThickness * 2),
      lineWidth: 2,
      score: this.score
    }));
  }
});

Presto.mixin(Presto.Barline, {
  T_SINGLE: "singlebar",
  T_DOUBLE: "doublebar",
  T_END: "endbar",
  T_REPEAT_OPEN: "repeat_open",
  T_REPEAT_CLOSE: "repeat_close"
});

// /*globals CanvasMusic */
// CanvasMusic.Barline = CanvasMusic.Grob.extend({

//   type: null, // one of the types

//   marginLeft: function () {
//     //debugger;
//     //console.log('barline width: ' + this.get('width'));
//     return this.getPath('cm.size') / 2;
//   }.property(),

//   marginRight: function () {
//     //debugger;
//     //console.log('barline width: ' + this.get('width'));
//     return this.getPath('cm.size') / 2;
//   }.property(),

//   width: function () {
//     return this.get('marginRight') + this.get('marginLeft');
//   }.property(),

//   init: function () {
//     arguments.callee.base.apply(this, arguments);
//     var t = this.get('type');
//     var k = CanvasMusic.Barline;
//     var size = this.getPath('cm.size');
//     switch (t) {
//       case k.T_SINGLE:
//         this.addChildGrob(CanvasMusic.Line.create({
//           parentGrob: this,
//           parentStaff: this.get('parentStaff'),
//           cm: this.get('cm'),
//           lineWidth: size / 6,
//           y: this.get('y'),
//           skipWidth: true,
//           height: this.get('height')
//         }));
//         break;
//       case k.T_DOUBLE: break;
//       case k.T_END: break;
//       case k.T_REPEAT_OPEN: break;
//       case k.T_REPEAT_CLOSE: break;
//       default: throw new Error("CanvasMusic.Barline: undefined barline type: " + t);
//     }
//   },

//   toString: function () {
//     return "CanvasMusic.Barline %@".fmt(SC.guidFor(this));
//   },

//   isBarLine: true // quack like a duck...
// });

// SC.mixin(CanvasMusic.Barline, {
//   T_SINGLE: "singlebar",
//   T_DOUBLE: "doublebar",
//   T_END: "endbar",
//   T_REPEAT_OPEN: "repeat_open",
//   T_REPEAT_CLOSE: "repeat_close",

//   isBarline: function (name) {
//     var k = CanvasMusic.Barline;
//     if (!name) return false;
//     var validNames = [ k.T_SINGLE, k.T_DOUBLE, k.T_END, k.T_REPEAT_CLOSE, k.T_REPEAT_OPEN ];
//     return validNames.indexOf(name) > -1;
//   }
// });
/*globals Presto */

Presto.mixin({
  STEMDIRECTION_UP: "up",
  STEMDIRECTION_DOWN: "down"
});

/**
 * Presto.Stem is very much a Line, but as it also needs to be able to draw a
 * flag, it is a wrapper around Line.
 * @extends {Presto.Grob}
 */
Presto.Stem = Presto.Grob.extend({
  /**
   * Quack like a duck
   * @type {Boolean}
   */
  isStem: true,

  /**
   * Which flag should be attached to the stem
   * @type {String | null}
   */
  noteFlag: null,

  /**
   * To which horizontal coordinate the line should be drawn
   * @type {Number}
   */
  toX: null,

  /**
   * to which vertical coordinate the line should be drawn
   * @type {Number}
   */
  toY: null,

  /**
   * automatic calculation of the linewidth to use
   * @return {Number} staffsize / 3
   */
  lineWidth: function () {
    return this.score.get('size') / 3;
  },

  /**
   * The note will attach which direction the stem goes, which is important for where to insert the
   * note flag
   * @type {String}
   */
  stemDirection: null,

  init: function () {
    var noteFlag = this.noteFlag;
    var stemDirection = this.stemDirection;
    this.addChildGrob(Presto.Line.create({
      x: 0,
      y: -1,
      toX: 0,
      toY: this.toY,
      lineWidth: this.get('lineWidth')
    }));
    if (noteFlag) {
      this.addChildGrob(Presto.Symbol.create({
        x: 0,
        y: this.toY,
        name: noteFlag,
        score: this.score,
        staff: this.staff
      }));
    }

  }
});

/*globals Presto*/

//TODO: think about creating a mixin which can be used on plain objects to give them note parsing
//options without having to notate anything

/**
 * Presto.Note is the base class for a note. It contains everything related to a note,
 * including the note head, stem, accidental if necessary and dots
 * @extends { Presto.Grob }
 */
Presto.Note = Presto.Grob.extend({
  /**
   * Quack like a duck
   * @type {Boolean}
   */
  isNote: true,

  /**
   * Name of the note
   * @type {String}
   */
  name: null,

  /**
   * Octave of this note, 1 is first octave after central c
   * @type {Number}
   */
  octave: null,

  /**
   * the alteration of the note, -1 for flat, +1 for sharp
   * @type {Number}
   */
  alteration: null,

  /**
   * The alteration of the staff
   * @type {Number}
   */
  staffAlteration: null,

  /**
   * Basic length of the note, either 1, 2, 4, 8, 16
   * @type {Number}
   */
  length: null,

  /**
   * Amount of dots this note should have
   * @type {Number}
   */
  dots: null,

  /**
   * Should we display a natural?
   * @type {[type]}
   */
  natural: null,

  /**
   * Whether the stem direction should be up or down
   * @type {String}
   */
  stemDirection: null,

  /**
   * default line width for the stem
   * @type {Number}
   */
  stemLineWidth: 2,

  stemUp: function () {
    return this.get('stemDirection') === Presto.STEMDIRECTION_UP;
  },

  stemDown: function () {
    return this.get('stemDirection') === Presto.STEMDIRECTION_DOWN;
  },

  /**
   * Sets a default stem direction. Not very intelligent for now.
   * It also sets a stem direction on a whole note, but a whole note doesn't draw its stem
   */
  setDefaultStemDirection: function () {
    if (this.get('positionOnStaff') >= 0) {
      this.stemDirection = Presto.STEMDIRECTION_UP;
    }
    else this.stemDirection = Presto.STEMDIRECTION_DOWN;
    this._automaticStem = true; // flag to indicate that the stem was set to a default value
  },

  /**
   * Will flip the stem, will automatically remove the stem and re add it
   * @return {Presto.Note} this
   */
  flipStem: function () {
    if (this.get('stemUp')) this.stemDirection = Presto.STEMDIRECTION_DOWN;
    else this.stemDirection = Presto.STEMDIRECTION_UP;
    this.removeStem();
    this.addStem();
    return this;
  },

  /**
   * Hide the stem, false by default
   * @type {Boolean}
   */
  hideStem: false,

  /**
   * The staff to which this note belongs should be here
   * @type {Presto.Staff}
   */
  parentStaff: null,

  /**
   * When the staff sets the vertical offset, it will also set the position here
   * The position is 0 for middle, positive for lower, negative for higher.
   * The number is set in staffSpace units (which is half the distance between two staff lines)
   * @type {Number}
   */
  positionOnStaff: null,

  /**
   * Returns the root of the tone, name without accidentals
   * @return {String} root name of the tone
   */
  rootTone: function () {
    return this.get('name')[0];
  },


  /**
   * function to return the full length of a (dotted) note, where a dotted value
   * is calculated against the scale of 2, 4, 8, 16
   * A note length of 4 with dots will be smaller than 4. In order to keep the exponential scale
   * the dotted value will be expressed as a division against the original value
   * @param  {Hash} notehash the hash containing the note information
   * @return {Number}          Length value expressed as a factor on the exponential length scale
   */
  fullLength: function () {
    var l = this.length;
    if (!l) return 0;
    if (this.dots && this.dots > 0) {
      // dot 1 is half the value of the original, 1/2
      // dot 2 is half the value of the value added 1/4
      // dot 3 is half the value of the value added last time 1/8 ...etc
      var val = 1, wval = 1;
      for (var i = 0; i < this.dots; i += 1) {
        wval /= 2;
        val += wval;
      }
      l /= val; // rewrite the length as divided value of the original
    }
    return l;
  },

  /**
   * The width of a note is the width of its children
   * @return {Number} [Width in pixels]
   */
  width: function () {
    var ret = 0;
    //debugger;
    // this is not as easy as it looks
    // the width of a note is
    // the smallest x value (which can either be negative, zero or positive)
    // until the biggest x value...
    var smallest = 0, biggest = 0;
    this.childGrobs.forEach(function (cg) {
      if (!cg.ignoreWidth) {
        var w = cg.get('width');
        var x = cg.get('x');
        if (x < smallest) smallest = x;
        var sum = x + w;
        if (sum > biggest) biggest = sum;
      }
    }, this);
    ret = Math.abs(smallest) + biggest;
    return ret;
  },

  /**
   * Returns the note head type for this note
   * @return {String} character name for the note head
   */
  noteHead: function () { // can be overridden or extended if required
    var l = this.get('length');
    switch (l) {
      case 1:
        return "noteheads.s0"; // whole,
      case 2:
        return "noteheads.s1"; // half
      case 4:
        return "noteheads.s2"; // quarter
      case 8:
        return "noteheads.s2"; // quarter
      case 16:
        return "noteheads.s2"; // quarter
      default:
        throw new Error("Presto.Note#noteHead: Invalide length value");
    }
  },

  /**
   * Returns the type of note flag this note requires
   * @return {String | Boolean} character name of note flag, or false if none needed
   */
  noteFlag: function () {
    var l = this.get('length');
    var stemDirection = this.get('stemDirection');
    if (l < 8) return false;
    else {
      if (stemDirection === Presto.STEMDIRECTION_UP) {
        if (l === 8) return "flags.u3";
        if (l === 16) return "flags.u4";
      }
      if (stemDirection === Presto.STEMDIRECTION_DOWN) {
        if (l === 8) return "flags.d3";
        if (l === 16) return "flags.d4";
      }
    }
  },

  /**
   * calculates the alteration, and sets it to the note alteration propery, as well
   * as return that value
   * @return {Number} Alteration
   */
  calculateAlteration: function () {
    var name = this.get('name');
    var ret = 0; //Natural
    if (name.indexOf("is") > -1) {
      ret = (name.indexOf("sis") > -1) ? Presto.Note.ALT_DBLSHARP : Presto.Note.ALT_SHARP;
    }
    else if (name.indexOf("s") > -1 || name.indexOf("es") > -1) {
      ret = (name.indexOf("ses") > -1) ? Presto.Note.ALT_DBLFLAT : Presto.Note.ALT_FLAT;
    }
    this.alteration = ret;
    return ret;
  },

  /**
   * Calculate from the name whether this note has an accidental.
   *
   * @return {String|Boolean} false if none, otherwise it returns the character name
   */
  accidentalName: function () {
    // we need a system to look up which accidentals can be left out, because they either appear already
    // in the bar, or they are part of the key.
    // there also needs to be a forced natural / forced accidental
    // For now, simple deduction from the name
    var name = this.get('name'),
        glyphName = false;
    if (name.indexOf("is") > -1) { // something with sharp
      glyphName = (name.indexOf("sis") > -1) ? 'accidentals.doublesharp' : 'accidentals.sharp';
    }
    else if (name.indexOf("s") > -1 || name.indexOf("es") > -1) { // we have flat
      glyphName = (name.indexOf("ses") > -1 || name.indexOf("sas") > -1) ? 'accidentals.flatflat' : 'accidentals.flat';
    }
    return glyphName;
  },

  /**
   * If a note has an accidental, the grob containing the accidental is put here in order for the note column
   * to make adjustments
   * @type {Presto.Symbol}
   */
  accidental: null,

  /**
   * Adds the accidental to the current note, if required
   */
  addAccidental: function () {
    var whichAcc = this.get('accidentalName'),
        acc;

    if (!whichAcc) return this;
    acc = Presto.Symbol.create({
      x: 0,
      y: 0,
      name: whichAcc,
      score: this.score,
      staff: this.staff
    });
    acc.x = -acc.get('width') * 1.5;
    this.accidental = acc;
    this.addChildGrob(acc);
    return this;
  },

  // accidentals need to be revised a bit, because there are more options than just the
  // accidental belonging to the note name, not in the least when also one or more naturals are
  // required
  // Effectively, the best would be to have a resetAccidental, which first removes the current ones, then
  // insert the new ones.
  // Technically, it would even be better to have the staffAlteration
  // setup with the creation of the note itself, problem of course is that at the moment of creation
  // the note column doesn't know yet what the rootTone of this note will be
  //
  // rules:
  // - if the alteration is the same, check whether there is an accidental involved
  //   and if yes, remove it, unless isNatural is already set, because that means to leave it
  // - else, add naturals until either 0 is reached
  addAlterations: function () {
    var staffAlt = this.get('staffAlteration') || 0; // assume zero if not set
    var alt = this.alteration || this.calculateAlteration();
    var alterations = [];
    var i;
    var accs = [];
    if (staffAlt !== alt) { // only add something when necessary
      if (staffAlt < alt && staffAlt < 0) { // lower, add till note encountered or on 0
        for (i = staffAlt; i < 0; i += 1) {
          if (alt !== i) accs.push("accidentals.natural");
        }
      }
      else if (staffAlt > alt && staffAlt > 0) {
        for (i = staffAlt; i > 0; i -= 1) {
          if (alt !== i) accs.push("accidentals.natural");
        }
      }
      // in both cases: add the normal accidental when there is one
      if (alt !== 0) accs.push(this.get('accidentalName'));
    }
    // now insert the alterations
    var x = 0;
    accs.reverse().forEach(function (a) {
      var acc = Presto.Symbol.create({
        score: this.score,
        staff: this.staff,
        name: a,
        isAccidental: true
      });
      acc.x = x - (acc.get('width') * 1.5);
      x = acc.x;
      this.addChildGrob(acc);
      alterations.push(acc);
    }, this);
    this.alterations = Presto.Array.create(alterations);
  },

  init: function () {
    // look up the name, and set values
    var lang = this.score ? this.score.get('language') : "nl"; // default lang is nl
    var name = this.get('name');
    var h = Presto.Note.noteNames[lang][name];
    if (!h) throw new Error("invalid note name, or invalid language setting");
    // we could do a mixin, but it seems a bit overkill (and possible performance issues)
    // for just two properties.
    this.alteration = h.alteration;
    this.rootTone = h.rootName;
    // assume octave is set differently
    if (this.isPlaceholder) return;

    // the init runs the adding procedure in the same order as the elements are going to appear
    //this.addAccidental();
    this.addAlterations();
    this.addHelperLines(); // helper lines first, as they need to be overwritten
    this.addNoteHead();
    this.addStem();
    this.addDots();
  },

  /**
   * This function updates the layout of the note. Required because some elements can only be done after the
   * note object exists (adding the helper lines for example)
   */
  update: function () {
    // for now, we remove the childGrobs and rerun init,
    // rewrite if it turns out to be a bottle neck performance wise
    this.childGrobs = null;
    if (!this.stemDirection) this.setDefaultStemDirection();
    this.init();
  },

  /**
   * Function to add the note head to the note, and set the _noteHeadWidth property
   */
  addNoteHead: function () {
    var noteHead = this.get('noteHead');
    // y is set to zero, as the note object itself is already at the right vertical offset
    var symbol = Presto.Symbol.create({
      staff: this.staff,
      score: this.score,
      name: noteHead,
      fontSize: this.score.get('fontSize'),
      x: 0,
      y: 0
    });
    this._noteHeadWidth = symbol.get('width');
    this.addChildGrob(symbol);
  },

  /**
   * Function to add any dots to the note if required
   */
  addDots: function () {
    var dots = this.dots;
    if (!dots) return;

    if (typeof dots !== "number") throw new Error("Dots should be a number");

    var dotObj;
    var staffSize = this.score.get('size');
    var extraOffset = this._noteHeadWidth + staffSize;
    var verticalShift = (this.positionOnStaff % 2) ? 0 : -staffSize;

    for (var i = 0; i < dots; i += 1) {
      dotObj = Presto.Symbol.create({
        staff: this.staff,
        score: this.score,
        name: "dots.dot",
        x: extraOffset,
        y: verticalShift,
        ignoreWidth: true
      });
      extraOffset += dotObj.get('width');
      this.addChildGrob(dotObj);
    }
  },

  /**
   * private variable which is set by addNoteHead. The width of the notehead is used in a few calculations
   * such as determining the width of the helper lines (also note column uses it)
   * @type {Number}
   */
  _noteHeadWidth: null,

  /**
   * Function to add the helper lines to the note
   * The data on the helper lines has already been added by the noteColumn
   */
  addHelperLines: function () {
    var helperLines = this.helperLines;
    if (!helperLines) return; // nothing to do

    var helperLineWidth = this._noteHeadWidth / 4;

    helperLines.forEach(function (l) {
      this.addChildGrob(Presto.Line.create({
        x: -helperLineWidth,
        y: l.y,
        toX: this._noteHeadWidth + helperLineWidth,
        toY: l.y,
        lineWidth: 2
      }));
    }, this);
  },

  /**
   * Function to add a stem to the current note
   * This is very naive, assumes 5 lines:
   * below the five lines and positions
   *             --  -6
   * --------------- -4
   * --------------- -2
   * ---------------  0
   * ---------------  2
   * ---------------  4
   *
   *
   * Rules are:
   *   - the line starts at (0, 0), being the starting point of the note head
   *   - the length depends on the position on the staff:
   *   - with the stem down:
   *     - notehead is at pos > 4: length is 2 staff spaces
   *     - notehead is at (pos <= 4 && pos >= 0): interpolation (?)
   *     - notehead is at (pos < 0 && pos >= -7): 3 staff spaces
   *     - notehead is at pos < -7: length is pos(0) - notehead position
   *   - with the stem up: reversed (horizontal mirror)
   */
  addStem: function () {
    if (this.get('hideStem')) return; // nothing to do
    if (this.get('length') < 2) return; // longer than a half note, no stem
    var pos = this.get('positionOnStaff');
    var staff = this.staff;
    var staffSpace = this.score.get('size');
    var stemUp = this.get('stemUp');
    var stemLength;

    if (stemUp) pos *= -1;

    if (pos > 4) { // this implementation uses 5 staff spaces, because it looks a bit better
      stemLength = staff.calculateVerticalOffsetFor(pos + 5) - staff.calculateVerticalOffsetFor(pos);
    }
    else if (pos <= 4 && pos >= 0) {
      // not entirely happy with the outcome, as there is still a bit of a jump between the last one here
      // and the first one of the next series
      stemLength = staff.calculateVerticalOffsetFor(pos + 5) - staff.calculateVerticalOffsetFor(pos);
      stemLength += staffSpace * ((7 / 6) - ((1 / 6) * pos));
    }
    else if (pos < 0 && pos > -7) {
      stemLength = staff.calculateVerticalOffsetFor(pos + 7) - staff.calculateVerticalOffsetFor(pos);
    }
    else {
      stemLength = staff.calculateVerticalOffsetFor(0) - staff.calculateVerticalOffsetFor(pos);
    }

    // the position of the stem needs to be corrected for the linewidth, which is now hardcoded here
    var startX = stemUp ? this._noteHeadWidth - 2: this.x;
    var toY = stemUp ? stemLength * -1 : stemLength;

    this.addChildGrob(Presto.Stem.create({
      x: startX + 1, // offset to the right for stem
      y: stemUp ? -1: 1,
      toX: startX + 1,
      toY: toY, // perhaps here -1 to offset the -1 or +1 at y?
      score: this.score,
      staff: this.staff,
      stemDirection: this.get('stemDirection'),
      noteFlag: this.get('noteFlag')
    }));

  },

  /**
   * To remove the stem from the note object. This can happen when notes are combined in a note column
   * in case this is a bottleneck, it can be simplyfied
   */
  removeStem: function () {
    if (this.get('length') === 1) return this; // whole notes don't have stems
    var i = this.childGrobs.indexOf(this.childGrobs.findProperty('isStem'));
    this.childGrobs.removeAt(i);
  }

});

Presto.mixin(Presto.Note, {

  /**
   * Alteration enums
   * @type {Number}
   */
  ALT_DBLFLAT: -2,
  ALT_FLAT: -1,
  ALT_NATURAL: 0,
  ALT_SHARP: 1,
  ALT_DBLSHARP: 2,

  // all kinds of calculations with notes, such as intervals etc
  // use note instances if possible (?)

  _noteNames: ['c', 'd', 'e', 'f', 'g', 'a', 'b'],

  /**
   * Calculates the distance between two notes diatonically. Zero based.
   * @param  {Presto.Note} noteOne First note
   * @param  {Presto.Note} noteTwo Second note
   * @return {Number}         Zero-based distances between notes
   */
  //TODO: make this use the defined language
  distanceBetween: function (noteOne, noteTwo) {
    if (!noteOne.isNote || !noteTwo.isNote) {
      throw new Error("Presto.Note.distanceBetween: Please use note instances");
    }
    var nn = this._noteNames;
    var firstNote = noteOne.get('rootTone');
    var secondNote = noteTwo.get('rootTone');

    var noteDist = nn.indexOf(firstNote) - nn.indexOf(secondNote);
    var octDist = noteOne.get('octave') - noteTwo.get('octave');
    // for some reason I have to reverse the solution to be correct
    return (noteDist + (nn.length * octDist)) * -1;
  },

  /**
   * Returns the interval between two notes, name based. This means that a prime is 1 and an octave is 8
   * @param  {Presto.Note} noteOne first note
   * @param  {Presto.Note} noteTwo second note
   * @return {Number}         Number describing the interval
   */
  intervalBetween: function (noteOne, noteTwo) {
    //if (noteOne.get('noteId') === noteTwo.get('noteId')) return 1; // fast path for primes
    var dist = this.distanceBetween(noteOne, noteTwo); // solve the off by one for intervals
    if (dist > 0) dist += 1;
    if (dist < 0) dist -= 1;
    if (dist === 0) dist = 1;
    return dist;
  },

  /**
   * Allows checking whether the given note name is a valid name for a note
   * @param  {String}  name note name
   * @return {Boolean}      Whether the note name fits anything recognized as a note
   */
  isValidNoteName: function (name) {
    var notenames = Presto.Note._noteNames;
    var exts = ['is', 'es', 's'], ext;
    if (name) {
      if (notenames.indexOf(name[0]) > -1) {
        ext = name.slice(1);
        if (ext.length === 0) return true; // single note name
        if (exts.indexOf(name.slice(1)) > -1) return true;
      }
    }
    return false;
  },

  /**
   * validates the hash to be a note hash
   * @param  {Hash}  h hash to be tested
   * @return {Boolean}   does the hash describe a note?
   */
  isNoteHash: function (h) {
    if (h.name && h.octave !== undefined && h.length) {
      if (Presto.Note.isValidNoteName(h.name)) {
        return true;
      }
    }
    return false;
  }

});



/*globals Presto*/

/**
 * Note name definitions
 */

Presto.mixin(Presto.Note, {
  noteNames: {
    nl: {
      rootNotes: ['c', 'd', 'e', 'f', 'g', 'a', 'b'],
      ceses:  { octave: 0, rootName: "c", alteration: -2 },
      ces:    { octave: 0, rootName: "c", alteration: -1 },
      c:      { octave: 0, rootName: "c", alteration: 0 },
      cis:    { octave: 0, rootName: "c", alteration: 1 },
      cisis:  { octave: 0, rootName: "c", alteration: 2 },

      deses:  { octave: 0, rootName: "d", alteration: -2 },
      des:    { octave: 0, rootName: "d", alteration: -1 },
      d:      { octave: 0, rootName: "d", alteration: 0 },
      dis:    { octave: 0, rootName: "d", alteration: 1 },
      disis:  { octave: 0, rootName: "d", alteration: 2 },

      eses:   { octave: 0, rootName: "e", alteration: -2 },
      es:     { octave: 0, rootName: "e", alteration: -1 },
      e:      { octave: 0, rootName: "e", alteration: 0 },
      eis:    { octave: 0, rootName: "e", alteration: 1 },
      eisis:  { octave: 0, rootName: "e", alteration: 2 },

      feses:  { octave: 0, rootName: "f", alteration: -2 },
      fes:    { octave: 0, rootName: "f", alteration: -1 },
      f:      { octave: 0, rootName: "f", alteration: 0 },
      fis:    { octave: 0, rootName: "f", alteration: 1 },
      fisis:  { octave: 0, rootName: "f", alteration: 2 },

      geses:  { octave: 0, rootName: "g", alteration: -2 },
      ges:    { octave: 0, rootName: "g", alteration: -1 },
      g:      { octave: 0, rootName: "g", alteration: 0 },
      gis:    { octave: 0, rootName: "g", alteration: 1 },
      gisis:  { octave: 0, rootName: "g", alteration: 2 },

      ases:   { octave: 0, rootName: "a", alteration: -2 },
      as:     { octave: 0, rootName: "a", alteration: -1 },
      a:      { octave: 0, rootName: "a", alteration: 0 },
      ais:    { octave: 0, rootName: "a", alteration: 1 },
      aisis:  { octave: 0, rootName: "a", alteration: 2 },

      beses:  { octave: 0, rootName: "b", alteration: -2 },
      bes:    { octave: 0, rootName: "b", alteration: -1 },
      b:      { octave: 0, rootName: "b", alteration: 0 },
      bis:    { octave: 0, rootName: "b", alteration: 1 },
      bisis:  { octave: 0, rootName: "b", alteration: 2 },
    }
  }
});
/*globals Presto*/

/**
 * A rest class. It is a grob, not a symbol as rests can have dots as well
 * @extends {Presto.Grob}
 */
Presto.Rest = Presto.Grob.extend({
  /**
   * Quack like a duck
   * @type {Boolean}
   */
  isRest: true,

  /**
   * Length of the rest
   * @type {[type]}
   */
  length: null,

  /**
   * how many dots does the rest have?
   * @type {Number}
   */
  dots: null,

  /**
   * return the correct glyph for rest of a specific length
   * @return {String} character name
   */
  restGlyph: function () { // can be overridden or extended if required
    var l = this.get('length');
    switch (l) {
      case 1:
        return "rests.0"; // whole
      case 2:
        return "rests.1"; // half
      case 4:
        return "rests.2"; // quarter
      case 8:
        return "rests.3"; // eighth
      case 16:
        return "rests.4"; // sixteenth
    }
  },

  /**
   * function to return the full length of a (dotted) rest, where a dotted value
   * is calculated against the scale of 2, 4, 8, 16
   * A rest length of 4 with dots will be smaller than 4. In order to keep the exponential scale
   * the dotted value will be expressed as a division against the original value
   * @return {Number}          Length value expressed as a factor on the exponential length scale
   */
  fullLength: function () {
    var l = this.length;
    if (!l) return 0;
    if (this.dots && this.dots > 0) {
      // dot 1 is half the value of the original, 1/2
      // dot 2 is half the value of the value added 1/4
      // dot 3 is half the value of the value added last time 1/8 ...etc
      var val = 1, wval = 1;
      for (var i = 0; i < this.dots; i += 1) {
        wval /= 2;
        val += wval;
      }
      l /= val; // rewrite the length as divided value of the original
    }
    return l;
  },

  init: function () {
    var length = this.get('length'),
        numDots = this.get('dots'),
        glyph = this.get('restGlyph'),
        dotglyph, i, prevwidth;

    if (this.isPlaceholder) return;

    var symbol = Presto.Symbol.create({
      score: this.score,
      staff: this.staff,
      name: glyph,
      fontSize: this.score.get('fontSize')
    });

    if (length === 1) {
      // for some reason the whole rest needs an offset
      symbol.y = this.staff.calculateVerticalOffsetFor(-2);
    }

    this.addChildGrob(symbol);

    if (numDots) {
      prevwidth = symbol.get('width');
      for (i = 0; i < numDots; i += 1) {
        dotglyph = Presto.Symbol.create({
          name: 'dots.dot',
          x: prevwidth,
          score: this.score,
          staff: this.staff
        });
        this.addChildGrob(dotglyph);
        prevwidth += dotglyph.get('width');
      }
      dotglyph = null;
    }

  }

});

Presto.mixin(Presto.Rest, {

  isRestHash: function (h) {
    if (h.name === "rest" && h.length) {
      return true;
    }
    return false;
  }
});

// /*globals CanvasMusic*/

// CanvasMusic.Rest = CanvasMusic.Grob.extend({
//   isRest: true, // quack like a duck
//   length: null, // length of the rest
//   dots: null, // how many dots this rest should have
//   markup: null, // do we have markup on this note?
//   markupAlign: SC.ALIGN_CENTER, // default markup is centered
//   markupDown: false,
//   marginRight: function () {
//     var l = this.get('length');
//     if (l === 1) return 20;
//     else if (l === 2) return 0;
//     else if (l === 4) return 20;
//     else if (l === 8) return 20;
//     else if (l === 16) return 20;
//   }.property('length').cacheable(),

//   restGlyph: function () { // can be overridden or extended if required
//     var l = this.get('length');
//     switch (l) {
//       case 1:
//         return "rests.0"; // whole
//       case 2:
//         return "rests.1"; // half
//       case 4:
//         return "rests.2"; // quarter
//       case 8:
//         return "rests.3"; // eighth
//       case 16:
//         return "rests.4"; // sixteenth
//     }
//   }.property('length').cacheable(),

//   top: function () {
//     var pS = this.get('parentStaff');
//     var l = this.get('length');
//     if (l === 1) {
//       return pS.topOfStaffLineFor(4);
//     }
//     else {//if (l === 2) {
//       return pS.topOfStaffLineFor(3);
//     }

//   }.property('length').cacheable(),

//   init: function () {
//     //arguments.callee.base.apply(this, arguments);
//     this.calculateRest();
//   },

//   calculateRest: function () {

//     var top = this.get('top');
//     //var top = this.get('y'), i;
//     var i;
//     var mix = { cm: this.get('cm') };
//     var numDots = this.get('dots');
//     var restSymbol = CanvasMusic.Symbol.create(mix, {
//       name: this.get('restGlyph'),
//       y: top + 1
//     });
//     var restWidth = restSymbol.get('width');
//     this.addChildGrob(restSymbol);

//     // add dots
//     //
//     if (numDots && numDots > 0) {
//       for (i = 0; i < numDots; i += 1) {
//         this.addChildGrob(CanvasMusic.Symbol.create(mix, {
//           y: top + this.getPath('cm.size') * 0.5,
//           marginLeft: restWidth * (0.5 * (i + 1)),
//           name: "dots.dot",
//           autoAdjustOnAdd: true,
//           skipWidth: true
//         }));
//       }
//     }
//   },

//   width: function () {
//     return this.get('widthOfChildGrobs');
//   }.property()
// });
/*globals Presto*/


/**
 * Presto.Column is a way to get vertically stacked elements which can be horizontally moved as a block
 * @extends {Presto.Grob}
 */
Presto.Column = Presto.Grob.extend({
  /**
   * don't draw anything ourselves, just the contents
   * @type {Boolean}
   */
  isContainer: true,

  /**
   * Hook where the parent staff is put
   * @type {Presto.Staff}
   */
  parentStaff: null,

  /**
   * The width of a column is distance between the left most point and the rightmost point
   * @return {Number} Width of the column
   */
  width: function () {
    var w = this.childGrobs.getEach('width')
    return w.get('@max');
  }

});



/*globals Presto*/

Presto.TimeSignature = Presto.Column.extend({

  /**
   * Number of beats per bar
   * @type {Number}
   */
  numberOfBeatsPerBar: null,

  /**
   * What note represents one beat?
   * @type {Number}
   */
  beatType: null,

  /**
   * Force the use of numbers for certain types of time signature,
   * such as 2/2 and 4/4
   * @type {Boolean}
   */
  forceNumeric: false,

  init: function () {
    var forceNumeric = this.forceNumeric;
    var numBeats = this.get('numberOfBeatsPerBar');
    var beatType = this.get('beatType');
    var symbolicOption = (numBeats === 4 && beatType === 4) || (numBeats === 2 && beatType === 2);

    if (symbolicOption && !forceNumeric) {
      this.addSymbolic();
    }
    else this.addNumeric();

  },

  /**
   * add a numerical time signature
   */
  addNumeric: function () {
    var staffSpace = this.score.get('size');
    this.addChildGrob(Presto.Symbol.create({
      name: this.get('numberOfBeatsPerBar').toString(),
      y: 0 + this.staff.staffLineThickness,
      ignoreWidth: true,
      staff: this.staff,
      score: this.score
    }));
    this.addChildGrob(Presto.Symbol.create({
      name: this.get('beatType').toString(),
      y: staffSpace * 4 - this.staff.staffLineThickness,
      staff: this.staff,
      score: this.score
    }));
  },

  /**
   * add a symbolic time signature
   */
  addSymbolic: function () {
    var numBeats = this.get('numberOfBeatsPerBar');
    var beatType = this.get('beatType');

    var symbol = (numBeats === 2 && beatType === 2)? "timesig.C22" : "timesig.C44";

    this.addChildGrob(Presto.Symbol.create({
      name: symbol,
      staff: this.staff,
      score: this.score,
      x: 0,
      y: 2
    }));
  }

});
/*globals Presto, console*/

/**
 * A note column is a wrapper around one or more notes or rests, which also applies stacking
 */

Presto.NoteColumn = Presto.Column.extend({

  /**
   * Where notes should be put
   * @type {Array}
   */
  notes: null,

  /**
   * The smallest length of the notes in the column
   * @type {Number}
   */
  minimumDuration: 0,

  init: function () {
    var notes = this.notes;
    var staff = this.staff;
    // we assume notes have been set
    if (!notes) return;
    var mix = {
      staff: staff,
      score: this.score,
      parentGrob: this,
      x: 0,
      y: 0
    };
    notes.forEach(function (n) {
      var obj, notelen;
      if (Presto.Note.isNoteHash(n)) {
        obj = Presto.Note.create(mix, n);
        // retrieve root note + octave, and set proper y value
        staff.setVerticalOffsetFor(obj);
        // TODO: lilypond keeps a record of which octave the alteration took place, in order to place the right
        // accidental only when that note previously had a different alteration. This only takes into account the
        // key signature alteration, and doesn't take the accidentals properly into account
        obj.staffAlteration = this.staff.alterations[obj.get('rootTone')];
        obj.update(); // have the note reset itself
        notelen = staff._calculateLength(n);
        if (notelen > this.minimumDuration) this.minimumDuration = notelen;
        this.addChildGrob(obj);
      }
      else if (Presto.Rest.isRestHash(n)) {
        this.addChildGrob(Presto.Rest.create(mix, n));
        notelen = staff._calculateLength(n);
        if (notelen > this.minimumDuration) this.minimumDuration = notelen;
        //debugger;
      }
      else {
        console.log("Presto.NoteColumn: other hash types are not implemented yet");
      }
    }, this);
    var noteObjs = this.childGrobs.filterProperty('isNote');

    if (notes.length > 1) {
      this.applyStacking();
    }

    var min = 0;
    noteObjs.forEach(function (n) {
      var acc = n.get('alterations');
      if (acc) {
        var m = acc.getEach('x').get('@min');
        if (m < min) min = m;
      }
    });
    noteObjs.forEach(function (n) {
      n.x += Math.abs(min);
    });
    this.noteStartOffset = min;
    //
    //
    //     //check for accidentals
    // if (accidentals) { // should be always, but better double check
    //   // use the rootTone of the note to find the current alteration in the accidentals list
    //   // if the alteration is the same, tell the note to not display the accidental
    //   // if it is different, check whether a natural is necessary, and set the alteration of the
    //   // note to the alteration
    // }

  },

  // perhaps necessary when things have been added, to reset the stacking adjustments?
  _resetStacking: function () {

  },

  /**
   * private method to perform the accidental stacking
   * It takes the highest, then the lowest, starting at the outer limits, and walk in, taking octaves into account
   */
  _stackAccidentals: function (chord) {
    // needs adjusting for multiple accidentals...

    var sortedNotes = chord.filterProperty('alterations');

    // first sort by note height, heighest note first
    // var sortedNotes = notesWithAccidentals.sort(function (n1, n2) {
    //   if (n1.positionOnStaff > n2.positionOnStaff) return 1;
    //   else if (n1.positionOnStaff < n2.positionOnStaff) return -1;
    //   else return 0;
    // });

    var accidentalOrder = [];
    // now we sort it by taking the highest one, checking whether any octaves exist
    // function to search for octaves and add them to the accidentalOrder
    function addOctave (note) {
      sortedNotes.filter(function (sn) {
        return sn.get('rootTone') === note.get('rootTone');
      }).forEach(function (oct) {
        if (accidentalOrder.indexOf(oct) === -1) {
          accidentalOrder.push(oct);
        }
      });
    }

    sortedNotes.forEach(function (n, i) {
      // first the top
      if (accidentalOrder.indexOf(n) === -1) {
        accidentalOrder.push(n);
        addOctave(n);//now check whether any octaves exist, and add
      }
      // now the bottom
      var last = sortedNotes[sortedNotes.length - 1 - i]; // walk backward from the end
      if (accidentalOrder.indexOf(last) === -1) {
        accidentalOrder.push(last);
        addOctave(last);// also check for octaves here
      }
    });

    // in accidentalOrder we have the sorted list, where the top accidental is first
    // and any octaves are consecutive, start setting the offsets
    // what lilypond seems to do is to check the vertical distance between the
    // notes, and when the distance is > 4, no extra indentation is made
    //
    // TODO: This will have to be done differently: using the width and a possible extra
    // offset when the accidentals are too close
    var offsetIndex = 0, offset = 0, prev;
    var staffSpace = this.score.get('size');
    accidentalOrder.forEach(function (acc) {
      if (prev && acc.get('rootTone') !== prev.get('rootTone')) {
        offsetIndex += 1;
      }
      offset = offsetIndex * (staffSpace * 2);
      acc.alterations.forEach(function (a) {
        a.x -= offset;
      });
      prev = acc;
    });
    this.x += offset / 2; // create the extra space required by moving the note column
    this._offset = offset;
  },

  width: function () {
    // width of a note column is the minimum value of the accidental
    // var smallest = 0, biggest = 0;
    // this.childGrobs.forEach(function (cg) {
    //   var rightmost;
    //   if (cg.accidental) {
    //     if (cg.accidental.x < smallest) smallest = cg.accidental.x;
    //     rightmost = cg.get('width') + cg.accidental.x; //
    //     if (rightmost > biggest) biggest = rightmost;
    //   }
    //   else if (cg.get('width') > biggest) biggest = cg.get('width');
    // });
    // // now, the trick is that the width should count from 0, not from the
    // this.x += Math.abs(smallest);
    // return biggest + smallest;
    var w = this.childGrobs.getEach('width');
    //return w.get('@max') - (this._offset || 0); // correct for already performed offset
    return w.get('@max');
  },

  /**
   * Needs to be invoked in order to perform the proper stacking of notes (see explanation below)
   * @return {this} this
   */
  applyStacking: function () {
    var chord = this.childGrobs.filterProperty('isNote');

    // for all tasks we will need them sorted, top note first
    var sortedChord = chord.sort(function (n1, n2) {
      if (n1.positionOnStaff > n2.positionOnStaff) return 1;
      else if (n1.positionOnStaff < n2.positionOnStaff) return -1;
      else return 0;
    });
    //
    // three different tasks
    // first: accidentals,
    // second: primes,
    // third: seconds
    this._stackAccidentals(sortedChord);

    sortedChord.reverse().forEach(function (n, i) { // for the stacking we need a reverse order than for the accidentals
      var interval;
      var nextNote = chord[i + 1];
      if (nextNote) {
        interval = Math.abs(Presto.Note.intervalBetween(n, nextNote));
        if (interval === 2) {
          this._stackSecond(n, nextNote);
        }
        else if (interval === 1) {
          this._stackPrime(n, nextNote);
        }
      }
    }, this);

    //     chord.forEach(function (n, i) {
    //       var nextNote = chord.objectAt(i+1);
    //       n.set('skipWidth', true); // column, so don't count the width
    //       var interval;
    //       if (nextNote) {
    //         nextNote.set('skipWidth', true);
    //         interval = CanvasMusic.Note.intervalBetween(n, nextNote);
    //         if (interval === 2 || interval === -2) {
    //           this._stackSecond(n, nextNote);
    //         }
    //         else if (interval === 1) {
    //           this._stackPrime(n, nextNote);
    //         }
    //         else {
    //           if (n.get('stemDown')) {
    //             n.set('skipWidth', true);
    //             //nextNote.move('marginLeft', 1);
    //           }
    //           else {
    //             n.set('skipWidth', true);
    //             n.move('marginLeft', n.get('marginLeft'));
    //           }
    //         }
    //       }
    //     }, this);

    return this;
  },

  _stackSecond: function (bottomNote, topNote) {

    var notShifted = !bottomNote.get('isShifted') && !topNote.get('isShifted');

    if (topNote._automaticStem || bottomNote._automaticStem) {
      if (topNote.get('stemDown') && bottomNote.get('stemUp')) {
        topNote.flipStem().set('_automaticStem', false);
      }
    }

    if (topNote.get('stemUp') && bottomNote.get('stemDown')) {
      if (notShifted) {
        this._shiftNote(bottomNote, topNote.get('_noteHeadWidth'));
      }
    }
    else if (topNote.get('stemDown') && bottomNote.get('stemUp')) {
      //top note offset to the left (keep stems) === bottom note offset to the right
      if (notShifted) {
        this._shiftNote(bottomNote, topNote.get('_noteHeadWidth'));
      }
    }
    else if (topNote.get('stemDown') && bottomNote.get('stemDown')) {
      if (notShifted) {
        // topnote to the right, but buttom note loses stem
        this._shiftNote(topNote, (bottomNote.get('_noteHeadWidth')) - 1);
        bottomNote.removeStem();
      }
    }
    else if (topNote.get('stemUp') && bottomNote.get('stemUp')) {
      if (notShifted) {
        this._shiftNote(topNote, (bottomNote.get('_noteHeadWidth')) - 1);
        topNote.removeStem();
      }
    }
  },

  _shiftNote: function (note, amount) {
    note.x += amount;
    if (note.alterations){
      note.alterations.forEach(function (a) {
        a.x -= amount;
      });
    } //note.accidental.x -= amount;
    note.isShifted = true;
  },

  _stackPrime: function (firstNote, secondNote) { // doesn't matter up/down
    var firstLength = firstNote.get('length'),
        secondLength = secondNote.get('length'),
        firstWidth = firstNote._noteHeadWidth,
        secondWidth = secondNote._noteHeadWidth,
        firstIsNotShifted = !firstNote.get('isShifted'),
        secondIsNotShifted = !secondNote.get('isShifted');

    if (firstLength === 1 && secondLength === 1) { // two whole notes
      if (firstIsNotShifted && secondIsNotShifted) {
        this._shiftNote(secondNote, firstWidth);
      }
    }
    else if (firstLength === 1 || secondLength === 1) {
      if (firstLength === 1) { // first is a whole note
        if (secondIsNotShifted) {
          this._shiftNote(secondNote, firstWidth);
        }
      }
      else { // second is a whole note
        if (firstIsNotShifted) {
          this._shiftNote(firstNote, -secondWidth);
        }
      }
    }
    else {
      if (firstLength > 1 && secondLength > 1) { // both have stems
        if (firstNote.get('stemUp') && secondNote.get('stemUp')) {
          if (secondIsNotShifted) {
            this._shiftNote(secondNote, firstWidth);
            secondNote.removeStem();
          }
        }
        else if (firstNote.get('stemDown') && secondNote.get('stemDown')) {
          if (secondIsNotShifted) {
            this._shiftNote(secondNote, firstWidth);
            secondNote.removeStem();
          }
        }
      }
    }
  }

});


/*
    The stacking rules

    the rules are:
    - top accidental should be nearest
    - octave related accidentals should be vertically aligned (this does not work yet)
    - after that, working from outsides inwards, bottom first



*/


/*globals Presto, console */
Presto.Staff = Presto.Grob.extend({
  /**
   * Which key signature to display, defaults to "c"
   * This property can be changed during the notation process
   * @type {String}
   */
  key: "c",

  /**
   * Time signature, defaults to 4/4
   * This property can be changed during the notation process
   * @type {String}
   */
  time: "4/4",

  /**
   * Clef to use, default is treble clef
   * This property can be changed during the notation process
   * @type {String}
   */
  clef: "treble",

  /**
   * Whether to omit the clef, default is to show
   * @type {Boolean}
   */
  omitClef: false,

  /**
   * whether to omit the time signature, default is to show
   * if the time signature is omitted, the barlines are also not drawn
   * automatically
   * @type {Boolean}
   */
  omitTimeSignature: false,

  /**
   * Line thickness of staff lines
   * @type {Number}
   */
  staffLineThickness: 1,

  /**
   * the default positions of staff lines
   * @type {Array}
   */
  defaultLinePositions: [4, 2, 0, -2, -4],

  /**
   * in case you want to override the default line positions, set something here
   * @type {Array}
   */
  linePositions: null,

  /**
   * The information to put on this staff
   * @type {Array}
   */
  notes: null,

  init: function () {
    this._currentX = 0;
    this.addStaffLines();
    this.addClef();
    this.addKeySignature();
    this.addTimeSignature();
    this.setTopAndBottomOffsets();
  },

  /**
   * Function to add the staff lines
   * @returns { this }
   */
  addStaffLines: function () {
    var linePos = this.linePositions || this.defaultLinePositions;
    var lineWidth = this.staffLineThickness;
    var score = this.score;
    var staffSpace = this.score.get('size');
    linePos.forEach(function (l, i) {
      var y = (staffSpace * l) + (lineWidth * i);
      this.addChildGrob(Presto.Line.create({
        x: 0,
        y: y,
        lineWidth: lineWidth,
        toX: score.width, // for now
        toY: y,
        ignoreWidth: true,
        isStaffLine: true,
        lineIndex: y
      }));
    }, this);
    return this;
  },

  addClef: function () {
    if (this.omitClef) return;

    var clefName = this.get('clefName'),
        //mix = { score: this.score },
        staffSpace = this.score.get('size');

    var symbol = Presto.Symbol.create({
      score: this.score,
      fontSize: this.score.fontSize,
      name: clefName,
      x: staffSpace,
      //y: this.get('clefPosition') * staffSpace + this.staffLineThickness
      y: this.calculateVerticalOffsetFor(this.get('clefPosition')) + (this.staffLineThickness * 3)
    });


    this.addChildGrob(symbol);
    this._currentX += symbol.get('width') + (2 * staffSpace);
  },

  /**
   * Convenience method to retrieve the note the clef represents
   * @return {String} notename of clefNote
   */
  clefNote: function () {
    return Presto.Staff.clefs[this.get('clef')].clefNote;
  },

  /**
   * Convenience method to retrieve the staff position of the clef
   * @return {Number} distance from center of staff (which is 0) in staff spaces
   */
  clefPosition: function () {
    return Presto.Staff.clefs[this.get('clef')].clefPosition;
  },

  /**
   * Convenience method to retrieve the character name of the clef symbol
   * @return {String} character name of the clef symbol
   */
  clefName: function () {
    return Presto.Staff.clefs[this.get('clef')].clefName;
  },

  /**
   * private function to calculate the vertical offset for a specific position
   * and then cache it, so it can be looked up
   * @param  {Number} pos position on the staff, 0 is middle, negative is up, positive is down
   * @return {Number}     vertical offset in pixels, suitable for setting as y value
   */
  calculateVerticalOffsetFor: function (pos) {
    var cache = this._verticalOffsetCache;
    var size = this.score.get('size');
    var lineThickness = this.get('staffLineThickness');
    if (!cache) this._verticalOffsetCache = cache = {};
    if (cache[pos] === undefined) {
      cache[pos] = pos * size;
      cache[pos] -= Math.floor(pos / 2) * lineThickness;
    }
    return cache[pos];
  },

  /**
   * used by the key signature and setVerticalOffsetFor to figure out at what position a specific note
   * name should be put
   * @param  {String|Presto.Note} notename or note instance
   * @param {Number} octave optional: octave, when not called with a note instance
   * @return {Number}          Position in staff
   */
  calculateVerticalPositionFor: function (notename, octave) {
    var note;
    if (typeof notename === "string") {
      note = Presto.Note.create({ isPlaceholder: true, name: notename, octave: octave, length: 4 });
    }
    else note = notename;
    var cnote = this.get('clefNote');
    var cpos = this.get('clefPosition');
    var dist = Presto.Note.distanceBetween(note, cnote);
    var notePos = cpos + dist;
    return notePos;
  },

  _verticalOffsetCache: null,

  /**
   * Calculate/lookup the vertical offset for a note object and set it on the note object.
   * This also sets the number of helper lines on the note.
   * @param  {Presto.Note} note the note for which the vertical offset needs to be calculcated and set
   * @return {Presto.Note}      The adjusted note
   */
  setVerticalOffsetFor: function (note) {
    var notePos = this.calculateVerticalPositionFor(note);
    // from the notePos we can calculate the helperlines. We are going to do this very naively, by assuming
    // there will always be 5 lines, and the lines are at -4, -2, 0, 2, and 4
    note.y = this.calculateVerticalOffsetFor(notePos);
    note.positionOnStaff = notePos;
    var i;
    var helperLines = Presto.Array.create();
    if (notePos > 5) {
      for (i = 6; i <= notePos; i += 2) {
        helperLines.push({ y: this.calculateVerticalOffsetFor(i) - note.y });
      }
      note.helperLines = helperLines;
    }
    else if (notePos < -5) {
      for (i = -6; i >= notePos; i -= 2) {
        helperLines.push({ y: this.calculateVerticalOffsetFor(i) - note.y });
      }
      note.helperLines = helperLines;
    }
    if (note.y < this.maximumTopOffset) this.maximumTopOffset = this.calculateVerticalOffsetFor(notePos - 4);
    if (note.y > this.maximumBottomOffset) this.maximumBottomOffset = this.calculateVerticalOffsetFor(notePos + 4);
    return note;
  },

  /**
   * the maximum offset above the staff
   * @type {Number} size in pixels from the center
   */
  maximumTopOffset: 0,

  /**
   * the maximum offset below the staff
   * @type {Number} size in pixels from the center
   */
  maximumBottomOffset: 0,

  /**
   * Set the default maximum top and bottom offsets, as calculated by two spots above the staff and two below
   */
  setTopAndBottomOffsets: function () {
    this.maximumBottomOffset = this.calculateVerticalOffsetFor(8);
    this.maximumTopOffset = this.calculateVerticalOffsetFor(-8);
  },

  /**
   * Check validity of timeSignature as given by time, and split it into its components
   * @return {Hash} Hash with numberOfBeats and beatType properties
   */
  timeSignature: function () {
    var validBeatTypes = [1, 2, 4, 8, 16];
    var time = this.get('time');
    if (!time || (time.indexOf("/") === -1)) {
      throw new Error("Presto.Staff: Invalid time signature");
    }
    var sign = time.split("/");
    var numBeats = parseInt(sign[0], 10);
    var beatType = parseInt(sign[1], 10);
    if (validBeatTypes.indexOf(beatType) === -1) {
      throw new Error("Presto.Staff: Invalid beat type: " + beatType);
    }
    return {
      numberOfBeats: numBeats,
      beatType: beatType
    };
  },

  /**
   * Convenience method to return the number of beats per bar from the timeSignature
   * @return {Number} Number of beats
   */
  numberOfBeatsPerBar: function () {
    return this.get('timeSignature').numberOfBeats;
  },

  /**
   * Convenience method to return the beatType from the time signature
   * @return {Number} beat type
   */
  beatType: function () {
    return this.get('timeSignature').beatType;
  },

  /**
   * addKeySignature will put up here the current keySignature, which is an array of
   * note names. This is being used by setVerticalOffsetFor to add required naturals or accidentals
   * @type {Array}
   */
  keySignature: null,

  /**
   * add the current time signature, numbers only for the moment
   */
  addTimeSignature: function () {
    if (this.omitTimeSignature) return;
    var staffSpace = this.score.get('size');
    var c = Presto.TimeSignature.create({
      x: this._currentX,
      numberOfBeatsPerBar: this.get('numberOfBeatsPerBar'),
      beatType: this.get('beatType'),
      score: this.score,
      staff: this
    });
    this.addChildGrob(c);
    this._currentX += c.get('width') + (4 * staffSpace);
    return this;
  },

  /**
   * function to add the current key signature
   * there is no key cancellation yet
   */
  addKeySignature: function () {
    var staffSpace = this.score.get('size');
    var key = this.get('key');
    var baseNote, keySig;
    if (key) {
      key = key.trim().split(" ");
      baseNote = key[0];
      if (key.indexOf("minor") > -1) { // not supported yet
        keySig = Presto.Staff.clefs[this.get('clef')].keySignatures[baseNote];
      }
      else {
        keySig = Presto.Staff.clefs[this.get('clef')].keySignatures[baseNote];
      }
      keySig.forEach(function (k) {
        var name = k.slice(0, k.length - 1);
        var oct = parseInt(k.slice(k.length - 1), 10);
        // look up the alteration
        var noteDef = Presto.Note.noteNames.nl[name];
        var alt = noteDef.alteration;
        var pos = this.calculateVerticalPositionFor(name, oct);
        var accname;
        if (alt === 1) accname = "accidentals.sharp";
        else if (alt === -1) accname = "accidentals.flat";
        var symbol = Presto.Symbol.create({
          name: accname,
          score: this.score,
          staff: this,
          x: this._currentX,
          y: this.calculateVerticalOffsetFor(pos) + 2 // unclear why exactly the offset is 2 pixels off
        });
        this.addChildGrob(symbol);
        this._currentX += symbol.get('width');
      }, this);
      this.keySignature = keySig;
    }
    else {
      this.keySignature = Presto.Staff.clefs[this.get('clef')].keySignatures.c;
    }
    // always add a bit of space
    this._currentX += staffSpace * 2;
    this.resetAlterations(); // set the list with current accidentals
  },

  /**
   * This function resets the list with accidentals. This list is required in order to know which
   * notes are going to have accidentals or on which the accidental has to be omitted as they are
   * already part of the key signature. This function is run at the start of every bar as well
   * as when the key signature is added / set (alteration is a better term :) )
   */
  resetAlterations: function () {
    var names = Presto.Note.noteNames.nl.rootNotes;
    var keySig = this.get('keySignature');
    var l = {};
    names.forEach(function (rootName) {
      var acc;
      keySig.forEach(function (a) {
        if (a[0] === rootName) {
          acc = a;
        }
      });
      if (acc) {
        var n = Presto.Note.create({ isPlaceholder: true, name: acc.slice(0, acc.length - 1) });
        l[rootName] = n.get('alteration');
      }
      else {
        l[rootName] = 0;
      }
    });
    this.alterations = l;
  },

  /**
   * The list of current accidentals. It is set by resetAccidentals when a key signature is added as well
   * as at the start of a bar. The list is a hash with the root tones as keys and a number to indicate
   * the offset, where +0.5 is a single sharp, and -0.5 is a single flat.
   * This hash can be adjusted by a note column to indicate that a certain accidental has taken place, which
   * prevents other notes in the same bar to get accidentals
   * @type {Hash}
   */
  alterations: null,

  /**
   * private variable in which is kept the x value of the next element to be added
   * @type {[type]}
   */
  _currentX: null,

  /**
   * private variable to keep the current position of the cursors when notating
   * @type {Number}
   */
  _currentCursorAt: null,

  /**
   * When advanceCursor runs for the first time, it will generate a notation cache, which is a
   * sparse array with all events spaced out in the step size
   * @type {Presto.Array}
   */
  _notationCache: null,

  /**
   * function to calculate the length of a (dotted) note, where a dotted value
   * is calculated against the scale of 2, 4, 8, 16
   * A note length of 4 with dots will be smaller than 4. In order to keep the exponential scale
   * the dotted value will be expressed as a division against the original value
   * @param  {Hash} notehash the hash containing the note information
   * @return {Number}          Length value expressed as a factor on the exponential length scale
   */
  _calculateLength: function (notehash) {
    var l = notehash.length;
    if (!l) return 0;
    if (notehash.dots && notehash.dots > 0) {
      // dot 1 is half the value of the original, 1/2
      // dot 2 is half the value of the value added 1/4
      // dot 3 is half the value of the value added last time 1/8 ...etc
      var val = 1, wval = 1;
      for (var i = 0; i < notehash.dots; i += 1) {
        wval /= 2;
        val += wval;
      }
      l /= val; // rewrite the length as divided value of the original
    }
    return l;
  },

  // voices need to be unfolded and zipped, meaning that where in the voice definitions the
  // rhythmical streams are seperate, they have to be joined in order to notate them properly
  //
  _unfoldVoices: function (arrayOfVoices) {
    // we expect hashes in the form of { name: "voice", voiceNumber: 1, notes: [] }
    // where voiceNumber is optional
    var cursorSize = this.score.cursorSize;
    var voices = Presto.Array.create(arrayOfVoices);
    var numVoices = voices.length;
    // first make sparse arrays, while this is very similar to the generation of the
    // notation cache itself, I don't see atm how I can prevent code duplication
    var voiceNotes = Presto.Array.create();
    voices.forEach(function (v, i) {
      voiceNotes[i] = Presto.Array.create();
      v.notes.forEach(function (n) {
        var l;
        if (Array.isArray(n)) {
          l = Presto.Array.create(n.map(this._calculateLength)).get('@max');
        }
        else l = this._calculateLength(n);
        if (v.voiceNumber) {
          // the stem direction can be done by the note itself based on this
          n.voiceNumber = v.voiceNumber;
        }
        voiceNotes[i].push(n);
        voiceNotes[i].length += (cursorSize / l) - 1;
      }, this);
    }, this);

    // now all notes in rhythmical "order" in voiceNotes, now zip where
    // necessary and add to the cache
    var max = voiceNotes.getEach('length').get('@max');
    var w;
    for (var i = 0; i < max; i += 1) {
      w = [];
      for (var j = 0; j < numVoices; j += 1) {
        if (voiceNotes[j][i]) {
          w.push(voiceNotes[j][i]);
        }
      }
      if (w.length > 1) {
        this._addNoteEventToNotationCache(w);
      }
      else if (w.length === 1) {
        this._addNoteEventToNotationCache(w[0]); // only one note
      }
    }
  },

  /**
   * Add a note event to the notation cache. Needs to be separate, because if
   * voices are detected, it needs to be able to call itself in order to add
   * the unfolded voices to the cache
   * @param {Hash|Array} noteEvent note event or note events
   */
  _addNoteEventToNotationCache: function (noteEvent) {
    var curLength,
        cache = this._notationCache,
        cursorSize = this.score.cursorSize;

    if (Array.isArray(noteEvent)) {
      //check whether we have voices
      if (Presto.Array.prototype.someProperty.call(noteEvent, 'name', 'voice')) {
        this._unfoldVoices(noteEvent);
      }
      else {
        noteEvent = Presto.Array.create(noteEvent);
        // the smallest note has the biggest number
        curLength = Presto.Array.create(noteEvent.map(this._calculateLength)).get('@max');
      }
    }
    else curLength = this._calculateLength(noteEvent);
    if (curLength) { // ignore no-length events
      cache.push(noteEvent);
      cache.length += (cursorSize / curLength) - 1;
    }
  },

  /**
   * Function to generate the notation cache. This generates a sparse Presto.Array, where all events are spaced
   * with regard to the stepSize / cursorSize. Only rhythmical events are included.
   *
   * @return {Object} this
   */
  _generateNotationCache: function () {
    this._notationCache = Presto.Array.create();
    var n = this.get('notes');
    n.forEach(this._addNoteEventToNotationCache, this);
    this._numberOfEvents = this._notationCache.length;
    this._currentCursorAt = 0;
    return this;
  },

  /**
   * This function checks whether this staff should draw barlines and if yes, whether
   * the cursor passed a point at which a barline should be drawn. If also yes,
   * it will insert the barline
   */
  checkAndDrawBarline: function () {
    var numBeats = this.get('numberOfBeatsPerBar'),
        beatType = this.get('beatType'),
        cursorSize = this.score.get('cursorSize'),
        prevBarAt = this.get('_previousBarlineAt'),
        cursor = this._currentCursorAt;

    if (this.omitTimeSignature) return;
    // 4 * (16/4) => 16, 2*(16/2) => 16, 6 * (16/8) => 12
    var numCursorsPerBar = numBeats * (cursorSize / beatType);
    if (cursor - prevBarAt === numCursorsPerBar) {
      //this._currentX -= this.score.get('size');
      this.addChildGrob(Presto.Barline.create({
        x: this._currentX,
        y: this.calculateVerticalOffsetFor(-4),
        toX: this._currentX,
        toY: this.calculateVerticalOffsetFor(4),
        score: this.score,
        staff: this,
        type: Presto.Barline.T_SINGLE
      }));
      this._currentX += this.score.get('size') * 2;
      this._previousBarlineAt = cursor;
    }
  },

  _previousBarlineAt: 0,

  /**
   * The minimum amount in staff spaces to add when a note has been added
   * @type {Number}
   */
  minimumDurationSpace: 0,

  /**
   * Fixed amount of space in staff spaces to add when the duration doubles
   * @type {Number}
   */
  durationSpaceIncrement: 1.5,

  /**
   * Function to advance the current notation cursor. The staff will check whether it has something to notate for this
   * specific event, and if yes, it will return the notated object (often a Presto.NoteColumn, sometimes a simple Presto.Note)
   * @param  {Number} stepSize The stepsize with which the cursor should advance, usually omitted
   * @return {Object | null}  null when nothing notated, otherwise the object notated
   */
  advanceCursor: function (stepSize) {
    if (!this._notationCache) this._generateNotationCache();
    var cache = this._notationCache,
        cursorAt = this._currentCursorAt,
        staffSpace = this.score.get('size'),
        currentEvent;

    // first thing to do: check whether a barline should be drawn
    this.checkAndDrawBarline();

    if (cursorAt >= cache.length) {
      this.notationReady = true;
      return;
    }

    currentEvent = cache[cursorAt];
    if (!currentEvent) {
      this._currentCursorAt += 1;
      return;
    }

    // depending on the kind of event we get, we want to have a note column or a column
    // in what cases do we want a (normal) column?
    // - barline
    // - breathe mark
    // we need to detect whether the event is one or more notes, and if yes, create a note column with them
    //
    var ret = Presto.NoteColumn.create({
      notes: Array.isArray(currentEvent) ? currentEvent : [currentEvent],
      staff: this,
      score: this.score,
      x: this._currentX,
      y: this.staffLineThickness * 2 // this causes the y=0 value to be the middle of the staff
    });
    this.addChildGrob(ret);
    var w = ret.get('width');
    if (w === undefined) { // debugging
      window.RET = ret;
      console.log(ret);
      throw new Error("Object " + ret + " is returning undefined for width??");
    }
    //this._currentX += w + staffSpace * 3;
    this._currentX += w + (this.minimumDurationSpace * staffSpace);
    //debugger;
    var additionalSpace = (this.score.cursorSize / ret.minimumDuration) * this.durationSpaceIncrement;
    additionalSpace *= staffSpace / 2;
    this._currentX += additionalSpace;
    //this._currentX += (this.score.cursorSize / ret.minimumDuration) * this.durationSpaceIncrement * staffSpace;
    // add
    this._currentCursorAt += 1;
    // check the _currentX and if longer than the current staff lines, lengthen them
    this.childGrobs.filterProperty('isStaffLine').forEach(function (cg) {
      if (this._currentX > cg.toX) {
        cg.toX = this._currentX + 30;
      }
    }, this);
    return ret;
  }

});


Presto.mixin(Presto.Staff, {

  // information about clefs
  // we also define the key signatures here, in order not to have to calculate the octaves etc
  clefs: {
    treble: {
      clefNote: Presto.Note.create({
        name: "g",
        octave: 1,
        isPlaceholder: true
      }),
      clefPosition: 2, // one line under central line
      clefName: "clefs.G",
      keySignatures: {
        ces: ['bes1', 'es2', 'as1', 'des2', 'ges1', 'ces2', 'fes1'],
        ges: ['bes1', 'es2', 'as1', 'des2', 'ges1', 'ces2'],
        des: ['bes1', 'es2', 'as1', 'des2', 'ges1'],
        as:  ['bes1', 'es2', 'as1', 'des2'],
        es:  ['bes1', 'es2', 'as1' ],
        bes: ['bes1', 'es2'],
        f:   ['bes1'],
        c:   [],
        g:   ['fis2'],
        d:   ['fis2', 'cis2'],
        a:   ['fis2', 'cis2', 'gis1'],
        e:   ['fis2', 'cis2', 'gis1', 'dis2'],
        b:   ['fis2', 'cis2', 'gis2', 'dis2', 'ais1'],
        fis: ['fis2', 'cis2', 'gis2', 'dis2', 'ais1', 'eis2'],
        cis: ['fis2', 'cis2', 'gis2', 'dis2', 'ais1', 'eis2', 'bis1']
      }
    },
    bass: {
      clefNote: Presto.Note.create({
        name: "f",
        octave: 0,
        isPlaceholder: true
      }),
      clefPosition: -2,
      clefName: "clefs.F",
      keySignatures: {
        ces: ['bes-1', 'es0', 'as-1', 'des0', 'ges-1', 'ces0', 'fes0'],
        ges: ['bes-1', 'es0', 'as-1', 'des0', 'ges-1', 'ces0'],
        des: ['bes-1', 'es0', 'as-1', 'des0', 'ges-1'],
        as:  ['bes-1', 'es0', 'as-1', 'des0'],
        es:  ['bes-1', 'es0', 'as-1'],
        bes: ['bes-1', 'es0'],
        f:   ['bes-1'],
        c:   [],
        g:   ['fis0'],
        d:   ['fis0', 'cis0'],
        a:   ['fis0', 'cis0', 'gis0'],
        e:   ['fis0', 'cis0', 'gis0', 'dis0'],
        b:   ['fis0', 'cis0', 'gis0', 'dis0', 'ais0'],
        fis: ['fis0', 'cis0', 'gis0', 'dis0', 'ais0', 'eis0'],
        cis: ['fis0', 'cis0', 'gis0', 'dis0', 'ais0', 'eis0', 'bis-1']
      }
    }
  }

});


/* Web Font Loader v1.5.16 - (c) Adobe Systems, Google. License: Apache 2.0 */
;(function(window,document,undefined){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function k(a,b,c){k=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return k.apply(null,arguments)}var n=Date.now||function(){return+new Date};function q(a,b){this.K=a;this.w=b||a;this.G=this.w.document}q.prototype.createElement=function(a,b,c){a=this.G.createElement(a);if(b)for(var d in b)b.hasOwnProperty(d)&&("style"==d?a.style.cssText=b[d]:a.setAttribute(d,b[d]));c&&a.appendChild(this.G.createTextNode(c));return a};function r(a,b,c){a=a.G.getElementsByTagName(b)[0];a||(a=document.documentElement);a&&a.lastChild&&a.insertBefore(c,a.lastChild)}function ca(a,b){function c(){a.G.body?b():setTimeout(c,0)}c()}
function s(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function t(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function u(a){if("string"===typeof a.na)return a.na;var b=a.w.location.protocol;"about:"==b&&(b=a.K.location.protocol);return"https:"==b?"https:":"http:"}function v(a,b){var c=a.createElement("link",{rel:"stylesheet",href:b}),d=!1;c.onload=function(){d||(d=!0)};c.onerror=function(){d||(d=!0)};r(a,"head",c)}
function w(a,b,c,d){var e=a.G.getElementsByTagName("head")[0];if(e){var f=a.createElement("script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);window.setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function x(a,b){this.Y=a;this.ga=b};function y(a,b,c,d){this.c=null!=a?a:null;this.g=null!=b?b:null;this.D=null!=c?c:null;this.e=null!=d?d:null}var da=/^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;y.prototype.compare=function(a){return this.c>a.c||this.c===a.c&&this.g>a.g||this.c===a.c&&this.g===a.g&&this.D>a.D?1:this.c<a.c||this.c===a.c&&this.g<a.g||this.c===a.c&&this.g===a.g&&this.D<a.D?-1:0};y.prototype.toString=function(){return[this.c,this.g||"",this.D||"",this.e||""].join("")};
function z(a){a=da.exec(a);var b=null,c=null,d=null,e=null;a&&(null!==a[1]&&a[1]&&(b=parseInt(a[1],10)),null!==a[2]&&a[2]&&(c=parseInt(a[2],10)),null!==a[3]&&a[3]&&(d=parseInt(a[3],10)),null!==a[4]&&a[4]&&(e=/^[0-9]+$/.test(a[4])?parseInt(a[4],10):a[4]));return new y(b,c,d,e)};function A(a,b,c,d,e,f,g,h){this.N=a;this.m=h}A.prototype.getName=function(){return this.N};function B(a){this.a=a}var ea=new A("Unknown",0,0,0,0,0,0,new x(!1,!1));
B.prototype.parse=function(){var a;if(-1!=this.a.indexOf("MSIE")||-1!=this.a.indexOf("Trident/")){a=C(this);var b=z(D(this)),c=null,d=E(this.a,/Trident\/([\d\w\.]+)/,1),c=-1!=this.a.indexOf("MSIE")?z(E(this.a,/MSIE ([\d\w\.]+)/,1)):z(E(this.a,/rv:([\d\w\.]+)/,1));""!=d&&z(d);a=new A("MSIE",0,0,0,0,0,0,new x("Windows"==a&&6<=c.c||"Windows Phone"==a&&8<=b.c,!1))}else if(-1!=this.a.indexOf("Opera"))a:if(a=z(E(this.a,/Presto\/([\d\w\.]+)/,1)),z(D(this)),null!==a.c||z(E(this.a,/rv:([^\)]+)/,1)),-1!=this.a.indexOf("Opera Mini/"))a=
z(E(this.a,/Opera Mini\/([\d\.]+)/,1)),a=new A("OperaMini",0,0,0,C(this),0,0,new x(!1,!1));else{if(-1!=this.a.indexOf("Version/")&&(a=z(E(this.a,/Version\/([\d\.]+)/,1)),null!==a.c)){a=new A("Opera",0,0,0,C(this),0,0,new x(10<=a.c,!1));break a}a=z(E(this.a,/Opera[\/ ]([\d\.]+)/,1));a=null!==a.c?new A("Opera",0,0,0,C(this),0,0,new x(10<=a.c,!1)):new A("Opera",0,0,0,C(this),0,0,new x(!1,!1))}else/OPR\/[\d.]+/.test(this.a)?a=F(this):/AppleWeb(K|k)it/.test(this.a)?a=F(this):-1!=this.a.indexOf("Gecko")?
(a="Unknown",b=new y,z(D(this)),b=!1,-1!=this.a.indexOf("Firefox")?(a="Firefox",b=z(E(this.a,/Firefox\/([\d\w\.]+)/,1)),b=3<=b.c&&5<=b.g):-1!=this.a.indexOf("Mozilla")&&(a="Mozilla"),c=z(E(this.a,/rv:([^\)]+)/,1)),b||(b=1<c.c||1==c.c&&9<c.g||1==c.c&&9==c.g&&2<=c.D),a=new A(a,0,0,0,C(this),0,0,new x(b,!1))):a=ea;return a};
function C(a){var b=E(a.a,/(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/,1);if(""!=b)return/BB\d{2}/.test(b)&&(b="BlackBerry"),b;a=E(a.a,/(Linux|Mac_PowerPC|Macintosh|Windows|CrOS|PlayStation|CrKey)/,1);return""!=a?("Mac_PowerPC"==a?a="Macintosh":"PlayStation"==a&&(a="Linux"),a):"Unknown"}
function D(a){var b=E(a.a,/(OS X|Windows NT|Android) ([^;)]+)/,2);if(b||(b=E(a.a,/Windows Phone( OS)? ([^;)]+)/,2))||(b=E(a.a,/(iPhone )?OS ([\d_]+)/,2)))return b;if(b=E(a.a,/(?:Linux|CrOS|CrKey) ([^;)]+)/,1))for(var b=b.split(/\s/),c=0;c<b.length;c+=1)if(/^[\d\._]+$/.test(b[c]))return b[c];return(a=E(a.a,/(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/,2))?a:"Unknown"}
function F(a){var b=C(a),c=z(D(a)),d=z(E(a.a,/AppleWeb(?:K|k)it\/([\d\.\+]+)/,1)),e="Unknown",f=new y,f="Unknown",g=!1;/OPR\/[\d.]+/.test(a.a)?e="Opera":-1!=a.a.indexOf("Chrome")||-1!=a.a.indexOf("CrMo")||-1!=a.a.indexOf("CriOS")?e="Chrome":/Silk\/\d/.test(a.a)?e="Silk":"BlackBerry"==b||"Android"==b?e="BuiltinBrowser":-1!=a.a.indexOf("PhantomJS")?e="PhantomJS":-1!=a.a.indexOf("Safari")?e="Safari":-1!=a.a.indexOf("AdobeAIR")?e="AdobeAIR":-1!=a.a.indexOf("PlayStation")&&(e="BuiltinBrowser");"BuiltinBrowser"==
e?f="Unknown":"Silk"==e?f=E(a.a,/Silk\/([\d\._]+)/,1):"Chrome"==e?f=E(a.a,/(Chrome|CrMo|CriOS)\/([\d\.]+)/,2):-1!=a.a.indexOf("Version/")?f=E(a.a,/Version\/([\d\.\w]+)/,1):"AdobeAIR"==e?f=E(a.a,/AdobeAIR\/([\d\.]+)/,1):"Opera"==e?f=E(a.a,/OPR\/([\d.]+)/,1):"PhantomJS"==e&&(f=E(a.a,/PhantomJS\/([\d.]+)/,1));f=z(f);g="AdobeAIR"==e?2<f.c||2==f.c&&5<=f.g:"BlackBerry"==b?10<=c.c:"Android"==b?2<c.c||2==c.c&&1<c.g:526<=d.c||525<=d.c&&13<=d.g;return new A(e,0,0,0,0,0,0,new x(g,536>d.c||536==d.c&&11>d.g))}
function E(a,b,c){return(a=a.match(b))&&a[c]?a[c]:""};function G(a){this.ma=a||"-"}G.prototype.e=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.ma)};function H(a,b){this.N=a;this.Z=4;this.O="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.O=c[1],this.Z=parseInt(c[2],10))}H.prototype.getName=function(){return this.N};function I(a){return a.O+a.Z}function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.d=a;this.q=a.w.document.documentElement;this.Q=b;this.j="wf";this.h=new G("-");this.ha=!1!==b.events;this.F=!1!==b.classes}function J(a){if(a.F){var b=t(a.q,a.h.e(a.j,"active")),c=[],d=[a.h.e(a.j,"loading")];b||c.push(a.h.e(a.j,"inactive"));s(a.q,c,d)}K(a,"inactive")}function K(a,b,c){if(a.ha&&a.Q[b])if(c)a.Q[b](c.getName(),I(c));else a.Q[b]()};function ia(){this.C={}};function L(a,b){this.d=a;this.I=b;this.k=this.d.createElement("span",{"aria-hidden":"true"},this.I)}function M(a){r(a.d,"body",a.k)}
function N(a){var b;b=[];for(var c=a.N.split(/,\s*/),d=0;d<c.length;d++){var e=c[d].replace(/['"]/g,"");-1==e.indexOf(" ")?b.push(e):b.push("'"+e+"'")}b=b.join(",");c="normal";"o"===a.O?c="oblique":"i"===a.O&&(c="italic");return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+b+";"+("font-style:"+c+";font-weight:"+(a.Z+"00")+";")}
L.prototype.remove=function(){var a=this.k;a.parentNode&&a.parentNode.removeChild(a)};function O(a,b,c,d,e,f,g,h){this.$=a;this.ka=b;this.d=c;this.o=d;this.m=e;this.I=h||"BESbswy";this.v={};this.X=f||3E3;this.ca=g||null;this.H=this.u=this.t=null;this.t=new L(this.d,this.I);this.u=new L(this.d,this.I);this.H=new L(this.d,this.I);a=new H("serif",I(this.o));a=N(a);this.t.k.style.cssText=a;a=new H("sans-serif",I(this.o));a=N(a);this.u.k.style.cssText=a;a=new H("monospace",I(this.o));a=N(a);this.H.k.style.cssText=a;M(this.t);M(this.u);M(this.H);this.v.serif=this.t.k.offsetWidth;this.v["sans-serif"]=
this.u.k.offsetWidth;this.v.monospace=this.H.k.offsetWidth}var P={sa:"serif",ra:"sans-serif",qa:"monospace"};O.prototype.start=function(){this.oa=n();var a=new H(this.o.getName()+",serif",I(this.o)),a=N(a);this.t.k.style.cssText=a;a=new H(this.o.getName()+",sans-serif",I(this.o));a=N(a);this.u.k.style.cssText=a;Q(this)};function R(a,b,c){for(var d in P)if(P.hasOwnProperty(d)&&b===a.v[P[d]]&&c===a.v[P[d]])return!0;return!1}
function Q(a){var b=a.t.k.offsetWidth,c=a.u.k.offsetWidth;b===a.v.serif&&c===a.v["sans-serif"]||a.m.ga&&R(a,b,c)?n()-a.oa>=a.X?a.m.ga&&R(a,b,c)&&(null===a.ca||a.ca.hasOwnProperty(a.o.getName()))?S(a,a.$):S(a,a.ka):ja(a):S(a,a.$)}function ja(a){setTimeout(k(function(){Q(this)},a),50)}function S(a,b){a.t.remove();a.u.remove();a.H.remove();b(a.o)};function T(a,b,c,d){this.d=b;this.A=c;this.S=0;this.ea=this.ba=!1;this.X=d;this.m=a.m}function ka(a,b,c,d,e){c=c||{};if(0===b.length&&e)J(a.A);else for(a.S+=b.length,e&&(a.ba=e),e=0;e<b.length;e++){var f=b[e],g=c[f.getName()],h=a.A,m=f;h.F&&s(h.q,[h.h.e(h.j,m.getName(),I(m).toString(),"loading")]);K(h,"fontloading",m);h=null;h=new O(k(a.ia,a),k(a.ja,a),a.d,f,a.m,a.X,d,g);h.start()}}
T.prototype.ia=function(a){var b=this.A;b.F&&s(b.q,[b.h.e(b.j,a.getName(),I(a).toString(),"active")],[b.h.e(b.j,a.getName(),I(a).toString(),"loading"),b.h.e(b.j,a.getName(),I(a).toString(),"inactive")]);K(b,"fontactive",a);this.ea=!0;la(this)};
T.prototype.ja=function(a){var b=this.A;if(b.F){var c=t(b.q,b.h.e(b.j,a.getName(),I(a).toString(),"active")),d=[],e=[b.h.e(b.j,a.getName(),I(a).toString(),"loading")];c||d.push(b.h.e(b.j,a.getName(),I(a).toString(),"inactive"));s(b.q,d,e)}K(b,"fontinactive",a);la(this)};function la(a){0==--a.S&&a.ba&&(a.ea?(a=a.A,a.F&&s(a.q,[a.h.e(a.j,"active")],[a.h.e(a.j,"loading"),a.h.e(a.j,"inactive")]),K(a,"active")):J(a.A))};function U(a){this.K=a;this.B=new ia;this.pa=new B(a.navigator.userAgent);this.a=this.pa.parse();this.U=this.V=0;this.R=this.T=!0}
U.prototype.load=function(a){this.d=new q(this.K,a.context||this.K);this.T=!1!==a.events;this.R=!1!==a.classes;var b=new ha(this.d,a),c=[],d=a.timeout;b.F&&s(b.q,[b.h.e(b.j,"loading")]);K(b,"loading");var c=this.B,e=this.d,f=[],g;for(g in a)if(a.hasOwnProperty(g)){var h=c.C[g];h&&f.push(h(a[g],e))}c=f;this.U=this.V=c.length;a=new T(this.a,this.d,b,d);d=0;for(g=c.length;d<g;d++)e=c[d],e.L(this.a,k(this.la,this,e,b,a))};
U.prototype.la=function(a,b,c,d){var e=this;d?a.load(function(a,b,d){ma(e,c,a,b,d)}):(a=0==--this.V,this.U--,a&&0==this.U?J(b):(this.R||this.T)&&ka(c,[],{},null,a))};function ma(a,b,c,d,e){var f=0==--a.V;(a.R||a.T)&&setTimeout(function(){ka(b,c,d||null,e||null,f)},0)};function na(a,b,c){this.P=a?a:b+oa;this.s=[];this.W=[];this.fa=c||""}var oa="//fonts.googleapis.com/css";na.prototype.e=function(){if(0==this.s.length)throw Error("No fonts to load!");if(-1!=this.P.indexOf("kit="))return this.P;for(var a=this.s.length,b=[],c=0;c<a;c++)b.push(this.s[c].replace(/ /g,"+"));a=this.P+"?family="+b.join("%7C");0<this.W.length&&(a+="&subset="+this.W.join(","));0<this.fa.length&&(a+="&text="+encodeURIComponent(this.fa));return a};function pa(a){this.s=a;this.da=[];this.M={}}
var qa={latin:"BESbswy",cyrillic:"&#1081;&#1103;&#1046;",greek:"&#945;&#946;&#931;",khmer:"&#x1780;&#x1781;&#x1782;",Hanuman:"&#x1780;&#x1781;&#x1782;"},ra={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},sa={i:"i",italic:"i",n:"n",normal:"n"},ta=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
pa.prototype.parse=function(){for(var a=this.s.length,b=0;b<a;b++){var c=this.s[b].split(":"),d=c[0].replace(/\+/g," "),e=["n4"];if(2<=c.length){var f;var g=c[1];f=[];if(g)for(var g=g.split(","),h=g.length,m=0;m<h;m++){var l;l=g[m];if(l.match(/^[\w-]+$/)){l=ta.exec(l.toLowerCase());var p=void 0;if(null==l)p="";else{p=void 0;p=l[1];if(null==p||""==p)p="4";else var fa=ra[p],p=fa?fa:isNaN(p)?"4":p.substr(0,1);l=l[2];p=[null==l||""==l?"n":sa[l],p].join("")}l=p}else l="";l&&f.push(l)}0<f.length&&(e=f);
3==c.length&&(c=c[2],f=[],c=c?c.split(","):f,0<c.length&&(c=qa[c[0]])&&(this.M[d]=c))}this.M[d]||(c=qa[d])&&(this.M[d]=c);for(c=0;c<e.length;c+=1)this.da.push(new H(d,e[c]))}};function V(a,b){this.a=(new B(navigator.userAgent)).parse();this.d=a;this.f=b}var ua={Arimo:!0,Cousine:!0,Tinos:!0};V.prototype.L=function(a,b){b(a.m.Y)};V.prototype.load=function(a){var b=this.d;"MSIE"==this.a.getName()&&1!=this.f.blocking?ca(b,k(this.aa,this,a)):this.aa(a)};
V.prototype.aa=function(a){for(var b=this.d,c=new na(this.f.api,u(b),this.f.text),d=this.f.families,e=d.length,f=0;f<e;f++){var g=d[f].split(":");3==g.length&&c.W.push(g.pop());var h="";2==g.length&&""!=g[1]&&(h=":");c.s.push(g.join(h))}d=new pa(d);d.parse();v(b,c.e());a(d.da,d.M,ua)};function W(a,b){this.d=a;this.f=b;this.p=[]}W.prototype.J=function(a){var b=this.d;return u(this.d)+(this.f.api||"//f.fontdeck.com/s/css/js/")+(b.w.location.hostname||b.K.location.hostname)+"/"+a+".js"};
W.prototype.L=function(a,b){var c=this.f.id,d=this.d.w,e=this;c?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[c]=function(a,c){for(var d=0,m=c.fonts.length;d<m;++d){var l=c.fonts[d];e.p.push(new H(l.name,ga("font-weight:"+l.weight+";font-style:"+l.style)))}b(a)},w(this.d,this.J(c),function(a){a&&b(!1)})):b(!1)};W.prototype.load=function(a){a(this.p)};function X(a,b){this.d=a;this.f=b;this.p=[]}X.prototype.J=function(a){var b=u(this.d);return(this.f.api||b+"//use.typekit.net")+"/"+a+".js"};X.prototype.L=function(a,b){var c=this.f.id,d=this.d.w,e=this;c?w(this.d,this.J(c),function(a){if(a)b(!1);else{if(d.Typekit&&d.Typekit.config&&d.Typekit.config.fn){a=d.Typekit.config.fn;for(var c=0;c<a.length;c+=2)for(var h=a[c],m=a[c+1],l=0;l<m.length;l++)e.p.push(new H(h,m[l]));try{d.Typekit.load({events:!1,classes:!1})}catch(p){}}b(!0)}},2E3):b(!1)};
X.prototype.load=function(a){a(this.p)};function Y(a,b){this.d=a;this.f=b;this.p=[]}Y.prototype.L=function(a,b){var c=this,d=c.f.projectId,e=c.f.version;if(d){var f=c.d.w;w(this.d,c.J(d,e),function(e){if(e)b(!1);else{if(f["__mti_fntLst"+d]&&(e=f["__mti_fntLst"+d]()))for(var h=0;h<e.length;h++)c.p.push(new H(e[h].fontfamily));b(a.m.Y)}}).id="__MonotypeAPIScript__"+d}else b(!1)};Y.prototype.J=function(a,b){var c=u(this.d),d=(this.f.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return c+"//"+d+"/"+a+".js"+(b?"?v="+b:"")};
Y.prototype.load=function(a){a(this.p)};function Z(a,b){this.d=a;this.f=b}Z.prototype.load=function(a){var b,c,d=this.f.urls||[],e=this.f.families||[],f=this.f.testStrings||{};b=0;for(c=d.length;b<c;b++)v(this.d,d[b]);d=[];b=0;for(c=e.length;b<c;b++){var g=e[b].split(":");if(g[1])for(var h=g[1].split(","),m=0;m<h.length;m+=1)d.push(new H(g[0],h[m]));else d.push(new H(g[0]))}a(d,f)};Z.prototype.L=function(a,b){return b(a.m.Y)};var $=new U(this);$.B.C.custom=function(a,b){return new Z(b,a)};$.B.C.fontdeck=function(a,b){return new W(b,a)};$.B.C.monotype=function(a,b){return new Y(b,a)};$.B.C.typekit=function(a,b){return new X(b,a)};$.B.C.google=function(a,b){return new V(b,a)};this.WebFont||(this.WebFont={},this.WebFont.load=k($.load,$),this.WebFontConfig&&$.load(this.WebFontConfig));})(this,document);
/*globals Presto, console, WebFont*/

/*
  A score wraps a piece of notation and displays it onto a canvas element.
 */

Presto.Score = Presto.Object.extend({

  /**
   * The canvas element on which the score will be drawn
   * @type {[type]}
   */
  canvas: null,

  /**
   * The default fontSize in points
   * @type {[type]}
   */
  fontSize: 32,

  /**
   * The default staff space in pixels
   * @type {Number}
   */
  //size: 6,
  size: function () {
    return this._pt2px(this.get('fontSize'));
  },

  /**
   * Width of the canvas element
   * @type {Number}
   */
  width: null,

  /**
   * Height of the canvas element
   * @type {Number}
   */
  height: null,

  /**
   * cursorSize is the smallest rhythmical size allowed. It is also the step size with which the
   * notation will be parsed
   * @type {Number}
   */
  cursorSize: 16,

  /**
   * The language recognized for note names, currently "nl" and "en" are supported
   * @type {String}
   */
  language: "nl",

  autoAdjustCanvasSize: true,

  init: function () {
    var canvas = this.canvas;
    if (!canvas) {
      Presto.warn("Presto.Score: no canvas element set on init");
    }
    else {
      this._initCanvas();
    }

    this._rootGrob = Presto.Grob.create({
      x: 0,
      y: 0,
      isContainer: true,
      score: this
    });
  },

  /**
   * Function which parses the given array containing the musical information.
   * it will not start the parsing however before the font is loaded because of the size measurements.
   * If the font is not ready yet, it will set the notation hash to _parseArguments, which will indicate
   * the fontActive callback to parse that notation again.
   * @param  {Array} notation The notation which is a collection of staffs
   * @return {Presto.Score}          current instance
   */
  parse: function (notation) {
    if (!this.fontReady) {
      this._parseArguments = notation;
      return;
    }
    if (this._rootGrob) { // we are asked to parse again, remove rootgrob
      this._rootGrob.childGrobs = null;
    }
    var size = this.get('size');
    if (!size) throw new Error("No size set on Presto.Score");
    var staffDistance = this.staffDistance;
    if (!staffDistance) this.staffDistance = staffDistance = 16 * size;
    var vOffset = 4 * size;
    var s = this._staffs = Presto.Array.create(notation.staffs.map(function (s, i) {
      return Presto.Staff.create(s, {
        x: 0,
        y: vOffset + (i * staffDistance),
        width: this.get('width'),
        score: this
      });
    }, this));
    this._rootGrob.addChildGrobs(s);
    this._notate();
  },

  /**
   * This function will start the actual notation process. It walks through the notation in the smallest
   * rhythmical steps and aligns everything where necessary
   */
  _notate: function () {
    var staffs = this._staffs,
        maxEvents = 1, // default, walk through it once
        i, notatedObjects, max_x, next_x, max_noteOffset;

    var advanceStaff = function (s) {
      var ret = s.advanceCursor(1);
      if (s._numberOfEvents > maxEvents) { // TODO: document why this is necessary
        maxEvents = s._numberOfEvents;
      }
      return ret;
    };

    // var calculateMaxSpacing = function (obj) {
    //   var m;
    //   if (obj) {
    //     m = obj.get('x') + obj.get('width');
    //     max_x = (m > max_x)? m: max_x;
    //   }
    // };

    var adjustHorizontalSpacing = function (e) {
      if (e) {
        if (e.noteStartOffset && e.noteStartOffset !== max_noteOffset) {
          e.x += Math.abs(e.noteStartOffset) - Math.abs(max_noteOffset);
        }
        if (!e.noteStartOffset) {
          e.x = max_x + Math.abs(max_noteOffset);
        }
      }
    };

    // Stepping through all staffs at once. For every step all staffs are advanced.
    // When the staff has created a notation element, it will be returned.
    // When all staffs have been advanced, the elements will be aligned.
    // it is required to advance all staffs at least once
    for (i = 0; i < maxEvents; i += 1) {
      notatedObjects = Presto.Array.create(staffs.map(advanceStaff));
      next_x = staffs.getEach('_currentX').get('@max');
      max_x = notatedObjects.getEach('x').get("@max");
      max_noteOffset = notatedObjects.getEach('noteStartOffset').get('@min');
      notatedObjects.forEach(adjustHorizontalSpacing);
      staffs.setEach('_currentX', next_x);
      if (this.autoAdjustCanvasSize) {
        if (this.canvas.width < next_x) {
          this.canvas.width = next_x + 50;
        }
      }
      // notatedObjects.forEach(calculateMaxSpacing);
    }
    //console.log(staffs.getEach('y'));
    this._adjustStaffSpacing();
  },

  _adjustStaffSpacing: function () {
    // after everything has been notated, we need to check the vertical space of the staffs
    // the first staff is offset by a default value, against 0
    // The calculation checks whether the staff (assuming center 0) on y has enough space to display maxTop
    // what I need to compensate for is the relative position here and the maxTop which is calculated from 0
    var staffs = this._staffs;
    var staffSpace = this.get('size');
    var prevCenter = 0;
    staffs.forEach(function (s, i) {
      var nextStaff = staffs[i + 1];
      var maxTop = s.get('maximumTopOffset');
      var maxBottom = s.get('maximumBottomOffset');
      var diff = s.y + maxTop - prevCenter; // maxTop is negative by default
      if (diff < 0) {
        s.y += Math.abs(diff - (2 * staffSpace));
      } // headroom
      if (nextStaff) { // check whether the center of the next staff is far enough away to
        // maxBottom is positive by default, topOffset is negative, therefore both plus
        // idea is to take nextStaff center - top margin minus the current staff center plus bottom margin
        diff = (nextStaff.y - Math.abs(nextStaff.get('maximumTopOffset'))) - (s.y + maxBottom);
        if (diff < 0) {
          nextStaff.y += Math.abs(diff) + (2 * staffSpace);
        }
      }
      prevCenter = s.y;
    });
  },

  /**
   * This function will start the rendering on the canvas element.
   */
  render: function (x, y) {
    if (!this.fontReady) {
      this._suspendedRender = true;
      return;
    }
    // before rendering, blank the canvas element
    this.clear();
    x = x || 0;
    y = y || 0;
    var absPos = this._rootGrob.render(x, y);
    absPos.forEach(function (g) {
      g.render(this._ctx);
    }, this);
  },

  /**
   * Clear the canvas element
   */
  clear: function () {
    var canvas = this.canvas;
    this._ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  /* PRIVATE */

  /**
   * Initializes the canvas element and sets the 2D rendering context
   */
  _initCanvas: function () {
    var canvasElement;
    var canvas = this.canvas;
    if (typeof canvas === "string") { // we need to get the element
      canvasElement = document.getElementById(canvas);
      if (!canvasElement) throw new Error("Cannot find the canvas element with id " + canvas);
      this.canvas = canvas = canvasElement;
    }
    // check whether the style of the canvas element contains the font
    // canvas.style.fontFamily = 'Emmentaler26';
    // canvas.style.fontSize = this.fontSize + "pt";
    canvas.style.font = this.get('fontSize') + "pt Emmentaler26";
    this._ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    //this.initFontInfo();
  },

  /**
   * this function is called by the webfontloader callback to indicate that the font is loaded and that we are ready to render.
   *
   */
  fontIsReady: function () {
    this.initFontInfo();
    this.fontReady = true;
    if (this._parseArguments) {
      var notation = this._parseArguments;
      this._parseArguments = null;
      this.parse(notation);
    }
    if (this._suspendedRender) {
      this._suspendedRender = false;
      this.render();
    }
  },

  /**
   * indicator to internal functions whether the font is ready
   * @type {Boolean}
   */
  fontReady: false,

  /**
   * this property is set by #parse when it is called before the font is ready, to indicate that it should be called when
   * the font is ready, and containing its original arguments
   * @type {Boolean}
   */
  _parseArguments: false,

  /**
   * this property is set by #render when it is called before the font is ready, to indicate that it should be called when the
   * font is ready.
   * @type {Boolean}
   */
  _suspendedRender: false,

  /**
   * the rendering context
   * @type {Canvas.2DContext}
   */
  _ctx: null,

  /**
   * Function to calculate a size in pixels to a size in points
   * @param  {Number} val in pixels
   * @return {Number}     points
   */
  _px2pt: function (val) {
    return val * (16 / 3);
  },

  /**
   * Function to calculate a size in points to a size in pixels
   * @param  {Number} val in points
   * @return {Number}     pixels
   */
  _pt2px: function (val) {
    return val * (3 / 16);
  },

  /**
   * Initializes and caches all font information. Needs to be rerun after fontSize changes
   */
  initFontInfo: function () {
    if (Presto.fetaFontInfoBackup) { // we are re-initing, use the backup instead
      Presto.fetaFontInfo = Presto.fetaFontInfoBackup;
    }
    var fIB = Presto.fetaFontInfoBackup = {}; // make a backup
    var fI = Presto.fetaFontInfo;
    var fM = Presto.fetaFontMetrics;
    var ctx = this._ctx;
    ctx.font = this.get('fontSize') + "pt Emmentaler26";
    Object.keys(fI).forEach(function (k) {
      var code = fI[k];
      var val = String.fromCharCode(code);
      fIB[k] = code; // create backup
      fI[k] = val;
      fM[k] = ctx.measureText(val);
    });
  }

});


Presto.Score.mixin({
  /**
   * Convenience method to create a Score object from a canvas element
   * @param  {HTML CanvasElement} canvas the canvas element that should be used
   * @return {Presto.Score instance}        the instance of the Score object
   */
  from: function (canvas) {
    var s = Presto.Score.create({
      canvas: canvas
    });
    this._scores.push(s);
    return s;
  },

  /**
   * keeping a reference to score instances. This is done in order to trigger font initialization on the score
   * when the font is loaded.
   * @type {Array}
   */
  _scores: [],


  /**
   * This function is the callback for WebFontLoader and is triggered once for each font that's loaded. Attached but not used.
   */
  fontLoading: function (familyName, fvd) {
    //console.log("fontLoading");
    //console.log(arguments);
  },

  /**
   * this function is the active callback for WebFontLoader, and is triggered once for each font that is loaded. Attached and
   * @param  {String} familyName font family name
   * @param  {String} fvd        size etc
   */
  fontActive: function (familyName, fvd) {
    // console.log("fontActive");
    // console.log(arguments);
    // update every score instance and trigger the font info generation
    Presto.Score._scores.forEach(function (s) {
      s.fontIsReady();
    });
  },

  fontInactive: function (familyName, fvd) {
    console.log("fontInactive");
    console.log(arguments);
  }

});

// we have to perform a trick in order to force the webfont to load correctly
// we use the webfontloader.js from the webfontloader folder (which is taken from https://github.com/typekit/webfontloader)
WebFont.load({
  custom: {
    families: ['Emmentaler26']
  },
  fontloading: Presto.Score.fontLoading,
  fontactive: Presto.Score.fontActive,
  fontinactive: Presto.Score.fontInactive
});
