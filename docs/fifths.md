# Fifths module

Generate line of cycle of fifths, and calculate distances in fifths

```js
var distance = require('tonal/fifths/distance')
distance('F', 'C') // => -1
```

## Resources

- The line of fifths by David Temperley: http://www.theory.esm.rochester.edu/temperley/papers/temperley-ma00.pdf

## Functions API


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
<h4 class="name" id="byFifths"><span class="type-signature"></span>byFifths<span class="signature">(from)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get a comparator function to sort a collection of pitch classes</p>
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
<td class="description last"><p>(Optional) the base pitch</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/fifths/byFifths.js">byFifths.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/fifths/byFifths.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a comparator function</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">function</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>['C#', 'G#', 'F#'].sort(byFifths()) // => ['F#', 'C#', 'D#']</code></pre>
</dd>
<dt>
<h4 class="name" id="fifths"><span class="type-signature"></span>fifths<span class="signature">(pitch, from)</span><span class="type-signature"> &rarr; {Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Return the number of fifths between two pitch classes.</p>
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
<td class="name"><code>pitch</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the pitch to calc the fifths distance to</p></td>
</tr>
<tr>
<td class="name"><code>from</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>(Optional) the pitch to calc the fifths distance from
(C if not specified)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/fifths/fifths.js">fifths.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/fifths/fifths.js#L23">lineno 23</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the number fifths between the two pitches</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Integer</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>fifths('C') // => 0
fifths('G') // => 1
fifths('D') // => 2
fifths('F') // => -1
fifths('Bb') // => -2
fifths('A', 'D') // => 1
fifths('C4', 'C2') // => 0</code></pre>
</dd>
<dt>
<h4 class="name" id="transpose"><span class="type-signature"></span>transpose<span class="signature">(pitchClass, number)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Transpose a pitch class by a number of fifths</p>
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
<td class="name"><code>pitchClass</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the pitch class to be transposed</p></td>
</tr>
<tr>
<td class="name"><code>number</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the number of fifths (can be negative)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/fifths/transpose.js">transpose.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/fifths/transpose.js#L19">lineno 19</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the transposed pitch class</p>
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
<pre class="prettyprint"><code>transpose('C', 2) // => 'D'
transpose('C5', -2) // => 'Bb'</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
