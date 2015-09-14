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

## Functions
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
<h4 class="name" id="semitones
Get the semitones of a interval"><span class="type-signature"></span>semitones
Get the semitones of a interval<span class="type-signature"></span></h4>
</dt>
<dd>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/semitones.js">semitones.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/semitones.js#L5">lineno 5</a>
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
<a href="https://github.com/danigb/tonal/blob/master/add.js">add.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/add.js#L14">lineno 14</a>
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
<h4 class="name" id="build"><span class="type-signature"></span>build<span class="signature">(interval, alter, oct)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Get an interval properties from a string or a number, and optinally alterations
and octave.</p>
<p>The aclterations and octave parameters will have precedence over the string interval</p>
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
<td class="name"><code>alter</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the interval alteration (0 is perfect or major)</p></td>
</tr>
<tr>
<td class="name"><code>oct</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the octaves, 0 by default</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/build.js">build.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/build.js#L30">lineno 30</a>
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
<pre class="prettyprint"><code>build('M2') // => { name: 'M2', ... }
build('M2', 1) // => { name: 'A2', ... }
build(1) // => { name: 'P1', ... }
build(1, 1) // => { name: 'A1', ... }
build(1, 1, 2) // => { name: 'A8', ... }
build(-1, 1, 2) // => { name: 'A-8', ... }
build(-2, -1, 2) // => { name: 'm-9', ... }</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/harmonize.js">harmonize.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/harmonize.js#L18">lineno 18</a>
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
<h4 class="name" id="invert"><span class="type-signature"></span>invert<span class="signature">(interval, ascending)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Invert an interval</p>
<p>Get the <a href="https://en.wikipedia.org/wiki/Interval_(music">inversion</a>#Inversion)
of an interval.</p>
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
<a href="https://github.com/danigb/tonal/blob/master/invert.js">invert.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/invert.js#L20">lineno 20</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>simple('M9') // => 'M2'
simple('M-10') // => 'M-3'
simple('P-11', true) // => 'P4'</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/isInterval.js">isInterval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/isInterval.js#L13">lineno 13</a>
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
<a href="https://github.com/danigb/tonal/blob/master/opposite.js">opposite.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/opposite.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>opposite('M2') // => 'M-2'
opposite('P-8') // => 'P8'</code></pre>
</dd>
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Get interval properties</p>
<p>Probably you will want to use <code>interval/build</code> instead.</p>
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
- semitones: the size of the interval in semitones</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/props.js">props.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/props.js#L13">lineno 13</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>interval/build</li>
</ul>
</dd>
</dl>
<pre class="prettyprint"><code>var props = require('tonal/interval/props')
props('-5P') // => { name: '-5P', quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
props('9m') // => { name: '9m', quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }</code></pre>
</div>
</article>
</section>
<section>
<article>
<div class="container-overview">
<div class="description"><p>Simplify an interval</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/simplify.js">simplify.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/simplify.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>simplify('M9') // => 'M2'
simplify('M-9') // => 'M-2'
simplify('M-9', true) // => 'M2'</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
