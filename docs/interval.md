# Interval module

This module is for interval creation and modulation. It's probably you use interval string representations so you don't need anything from this.

## Interval string representation

In tonal a interval is a string with the following form: ([+-]?)(\d+)([dmPMA]) where the first part is the direction (optional), then the interval number and the quality. Valid intervals are: `'3M'`, `'-5P'`, `'7m'`

If you need an interval object properties, use `interval/props` function:

```js
var interval = require('interval/props')
interval('5P') // => { name: '5P', num: 5, quality: 'P', ...}
```

## Transform intervals

There are a bunch of methods to transform intervals:

```js
var simplify = require('interval/simplify')
simplify('9M') // => '2M'

var invert = require('interval/invert')
invert('2M') // => '7m'

var add = require('interval/add')
add('2M', '4P') // => '5P'
```

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="semitones"><span class="type-signature"></span>semitones<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the semitones of a interval</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/semitones.js">semitones.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/semitones.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>semitones('5P') // => 7</code></pre>
</dd>
</dl>
<dl>
<dt>
<h4 class="name" id="add"><span class="type-signature"></span>add<span class="signature">(interval1, interval2)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Add two intervals</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>interval1</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the first interval</p></td>
</tr>
<tr>
<td class="name"><code>interval2</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the second interval</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/add.js">add.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/add.js#L15">lineno 15</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the resulting interval</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">String</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>add('M2', 'M2') // => 'M3'</code></pre>
</dd>
<dt>
<h4 class="name" id="harmonize"><span class="type-signature"></span>harmonize<span class="signature">(tonic, intervals, pitchClassOnly)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Given a collection of intervals, and a tonic create a collection of pitches</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>tonic</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the tonic</p></td>
</tr>
<tr>
<td class="name"><code>intervals</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>a collection of intervals</p></td>
</tr>
<tr>
<td class="name"><code>pitchClassOnly</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="description last"><p>if true, the returned pitches don't include
octave information</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/harmonize.js">harmonize.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/harmonize.js#L18">lineno 18</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a collection of pitches</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>harmonize('C2', ['P1 P5']) // => ['C2', 'G2']</code></pre>
</dd>
<dt>
<h4 class="name" id="interval"><span class="type-signature"></span>interval<span class="signature">(interval, quality|alteration, oct)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get an interval properties from a string or a number, and optionally a quality
and octave.</p>
<p>The quality and octave parameters will override the given string interval</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the interval or the interval number
(can be negative to express descengin intervals)</p></td>
</tr>
<tr>
<td class="name"><code>quality|alteration</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the interval quality or
numberic alteration (0 is perfect or major). Can be null to avoid override the string</p></td>
</tr>
<tr>
<td class="name"><code>oct</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the octaves. If negative, the direction of
the interval is descendent. 0 by default.</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/interval.js">interval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/interval.js#L36">lineno 36</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>interval/props</li>
</ul>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>interval('2') // => '2M'
interval('2', 'm') // => '2m'
interval('2', 'a', 1) // => '9A'
interval('2', 'a', -1) // => '-9A'
interval('2', null, 1) // => '9M'
interval(-2, 'm', 1) // => '-9m'
interval(-2, -1, 1) // => '-9m'
interval(2, 'AA') // => '2AA'
interval(2, 'AAA') // => null</code></pre>
</dd>
<dt>
<h4 class="name" id="invert"><span class="type-signature"></span>invert<span class="signature">(interval, ascending)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_(music">inversion</a>#Inversion)
of an interval.</p>
<p>Notice that all inverted intervals are simple.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the interval to invert</p></td>
</tr>
<tr>
<td class="name"><code>ascending</code></td>
<td class="type">
<span class="param-type">Boolean</span>
</td>
<td class="description last"><p>(Optional) if true, the inverted interval will
be ascending, if false (by default) the direction will be the same as the
given interval</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/invert.js">invert.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/invert.js#L20">lineno 20</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>invert('M9') // => 'M2'
invert('M-10') // => 'M-3'
invert('P-11', true) // => 'P4'</code></pre>
</dd>
<dt>
<h4 class="name" id="isInterval"><span class="type-signature"></span>isInterval<span class="signature">(interval)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Test if a string is a valid interval</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the interval to be tested</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/isInterval.js">isInterval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/isInterval.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>true if its a valid interval</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>isInterval('blah') // false
isInterval('P5') // true
isInterval('P6') // false</code></pre>
</dd>
<dt>
<h4 class="name" id="opposite"><span class="type-signature"></span>opposite<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given an interval, return its opposite</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/opposite.js">opposite.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/opposite.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'</code></pre>
</dd>
<dt>
<h4 class="name" id="props"><span class="type-signature"></span>props<span class="signature">(name)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get interval properties</p>
<p>This method retuns an object with the following properties:
- name: the interval name
- quality: the quality (one of <code>dmPMA</code> for dimished, minor, perfect, major and
augmented respectively)
- num: diatonic number (a positive integer bigger that 0)
- alter: an integer with the alteration respect to 'P' or 'M' (depending on the type)
- dir: direction, 1 for ascending intervals, -1 for descending ones
- oct: the number of octaves (a positive integer)
- type: the interval type. 'P' for 'perfect', 'M' for major. This is not the
quality of the interval, just if it is perfectable or not.
- semitones: the size of the interval in semitones</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>name</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the name of the interval to be propsd</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/props.js">props.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/props.js#L36">lineno 36</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a interval object or null if not a valid interval</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var props = require('tonal/interval/props')
props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }</code></pre>
</dd>
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Simplify an interval</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/simplify.js">simplify.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/interval/simplify.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>simplify('9M') // => '2M'
simplify('-9M') // => '-2M'
simplify('-2M', true) // => '2M'</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
