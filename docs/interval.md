# Interval module

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
<a href="https://github.com/danigb/tonal/blob/master/add.js#L15">lineno 15</a>
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
<h4 class="name" id="fromNotes"><span class="type-signature"></span>fromNotes<span class="signature">(from, to)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the interval between two notes</p>
<p>This is the function to calculate distances (expressed in intervals) for
two notes. An alias of this function is in <code>note/distance</code></p>
<p>This is an 'strict' function: if the notes are note valid, an
exception is thrown.</p>
<p>You can get a <em>curryfied</em> version of this function by passing only one
parameter. See examples below:</p>
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
<td class="name"><code>from</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>first note</p></td>
</tr>
<tr>
<td class="name"><code>to</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>second note</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/fromNotes.js">fromNotes.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/fromNotes.js#L26">lineno 26</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the interval between notes</p>
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
<pre class="prettyprint"><code>fromNotes('C', 'D') // => 'M2'
['C', 'D', 'Eb'].map(fromNotes('C')) // => ['P1', 'M2', 'm3']</code></pre>
</dd>
<dt>
<h4 class="name" id="generic"><span class="type-signature"></span>generic<span class="signature">(number)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<ul>
<li>Given an interval number, return its generic interval</li>
</ul>
<p>Probably you don't need this function. Use ´interval/parse´ to obtain the
generic number of an interval</p>
<p>The generic interval is an object with two properties:
- num: {Integer} the generic number
- perfectable: {Boolean} if the generic interval is perfectable or note</p>
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
<td class="name"><code>number</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the interval number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/generic.js">generic.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/generic.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the generic interval object</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="interval"><span class="type-signature"></span>interval<span class="signature">(num, alter, oct, descending)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Create a interval from its components</p>
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
<td class="name"><code>num</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the interval number</p></td>
</tr>
<tr>
<td class="name"><code>alter</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the interval alteration (0 is perfect or major)</p></td>
</tr>
<tr>
<td class="name"><code>oct</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) the octaves, 0 by default</p></td>
</tr>
<tr>
<td class="name"><code>descending</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="description last"><p>(Optional) create a descending interval (false
by default)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/interval.js">interval.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/interval.js#L24">lineno 24</a>
</li>
</ul></dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>interval(1) // => 'P1'
interval(1, 1) // => 'A1'
interval(1, 1, 2) // => 'A8'
interval(1, 1, 2, -1) // => 'A-8'
interval(2, -1, 2, -1) // => 'm-9'</code></pre>
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
<dt>
<h4 class="name" id="transpose"><span class="type-signature"></span>transpose<span class="signature">(interval, note)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Transpose a note by an interval</p>
<p>This is the principal function of interval module. You should be able to
transpose any note with any interval. (if not, is a bug ;-)</p>
<p>You can also get a currified version by passing one parameter instead
of two. For example, with <code>transpose('M2')</code> you get a function that transposes
any note by a 'M2' interval. The same way, with <code>transpose('C4')</code> you get
a function that transposes C4 to the given interval. See examples below.</p>
<p>This is an <em>strict</em> function: if note or interval are not valid, an exception
is thrown</p>
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
<td class="description last"><p>the interval to tranpose</p></td>
</tr>
<tr>
<td class="name"><code>note</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the note to be transposed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/transpose.js">transpose.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/transpose.js#L33">lineno 33</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the resulting note</p>
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
<pre class="prettyprint"><code>transpose('M2', 'E') // => 'F#4'
transpose('M-2', 'C') // => 'Bb3'
['C', 'D', 'E'].map(transpose('M2')) // => ['D4', 'E4', 'F#4']
['M2', 'm3', 'P-8'].map(tranapose('C')) // => ['D4', 'Eb4', 'C3']</code></pre>
</dd>
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Parse an interval and get its properties</p>
<p>Probably you will want to use <code>interval/interval</code> instead.</p>
<p>This method retuns an object with the following properties:
- name: the parsed interval
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
<a href="https://github.com/danigb/tonal/blob/master/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/parse.js#L13">lineno 13</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>interval/interval</li>
</ul>
</dd>
</dl>
<pre class="prettyprint"><code>var parse = require('tonal/interval/parse')
parse('P-5') // => {quality: 'P', dir: -1, num: 5, generic: 4, alter: 0, perfectable: true }
parse('m9') // => {quality: 'm', dir: 1, num: 9, generic: 1, alter: -1, perfectable: false }</code></pre>
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
<a href="https://github.com/danigb/tonal/blob/master/simple.js">simple.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/simple.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>simple('M9') // => 'M2'
simple('M-9') // => 'M-2'
simple('M-9', true) // => 'M2'</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
