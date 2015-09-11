# Harmonizer module


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
<h4 class="name" id="areIntervals"><span class="type-signature"></span>areIntervals<span class="signature">(array)</span><span class="type-signature"> &rarr; {Boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Check if is an array of intervals</p>
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
<td class="name"><code>array</code></td>
<td class="type">
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the array to check</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/intervals.js">intervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/intervals.js#L36">lineno 36</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>true if its an array of intervals</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Boolean</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="harmonizer"><span class="type-signature"></span>harmonizer<span class="signature">(intervals)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create an harmonizer from a interval list: a function that returns an array of notes
from a note</p>
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
<td class="name"><code>intervals</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the intervals to use</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/harmonizer.js">harmonizer.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/harmonizer.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the harmonizer function</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">function</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="intervals"><span class="type-signature"></span>intervals<span class="signature">(source)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get an array of intervals given a string, an integer or an Array</p>
<p>The source can be one of the following forms:
- An array of intervals (they are returned without modification)
- A string with a intervals separated by a space
- A string with a binay representation
- A decimal (that is converted to a binary representation)</p>
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
<td class="name"><code>source</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>an interval list in any of its valid forms</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/intervals.js">intervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/intervals.js#L22">lineno 22</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>An array of intervals</p>
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
<pre class="prettyprint"><code>intervals('P1 M2') // => ['P1', 'M2']
intervals(2773) // => ['P1', 'M2', 'M3']</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
