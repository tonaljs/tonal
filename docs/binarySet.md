# Binary set module


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
<h4 class="name" id="binarySets"><span class="type-signature"></span>binarySets<span class="signature">(filter)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Return all possible set binary set numbers</p>
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
<td class="name"><code>filter</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>(Optional) a filter function</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/binarySet/binarySets.js">binarySets.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/binarySet/binarySets.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of binary numbers. 2048 if no filter</p>
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
<pre class="prettyprint"><code>binarySets() // => ['1000000000', '1000000001', ...]</code></pre>
</dd>
<dt>
<h4 class="name" id="fromBinary"><span class="type-signature"></span>fromBinary<span class="signature">(binary)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Convert a binary set number to an intervals collection</p>
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
<td class="name"><code>binary</code></td>
<td class="type">
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
<a href="https://github.com/danigb/tonal/blob/master/lib/binarySet/toIntervals.js">toIntervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/binarySet/toIntervals.js#L16">lineno 16</a>
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
<pre class="prettyprint"><code>intervals('1P 2M') // => ['1P', '2M']
intervals(2773) // => ['1P', '2M', '3M']</code></pre>
</dd>
<dt>
<h4 class="name" id="toBinary"><span class="type-signature"></span>toBinary<span class="signature">(collection)</span><span class="type-signature"> &rarr; {String}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the binary set number of a collection of pitches or intervals</p>
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
<td class="name"><code>collection</code></td>
<td class="type">
<span class="param-type">Array</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>a collection of pitches or intervals</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/lib/binarySet/binarySet.js">binarySet.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/lib/binarySet/binarySet.js#L20">lineno 20</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a binary number</p>
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
<pre class="prettyprint"><code>toBinary('C D') // => '101000000000'
toBinary('C4 D8') // => '101000000000'
toBinary('1P 2M') // => '101000000000'
toBinary('1P 9M') // => '101000000000'
toBinary('1P 7M') // => '100000000001'</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->