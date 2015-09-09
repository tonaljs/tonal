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
<h4 class="name" id="fifths"><span class="type-signature"></span>fifths<span class="signature">(step)</span><span class="type-signature"> &rarr; {String|Integer}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the relation between a pitch and the number of steps in the
cycle of fifths (with root in C)</p>
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
<td class="name"><code>step</code></td>
<td class="type">
<span class="param-type">Integer</span>
|
<span class="param-type">String</span>
</td>
<td class="description last"><p>if it's an integer, returns the pitch step after
moving <code>step</code> steps in the cycle. If it's a step string, returns the number
of steps starting from 'C' to the given step</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/fifths.js">fifths.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/fifths.js#L24">lineno 24</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<ul>
<li>the pitch name or the number of steps (depending of the param)</li>
</ul>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>var cycle = require('tonal/cycle-of-fifths')
cycle(0) // => 'C'
cycle(1) // => 'G'
cycle(-1) // => 'F'
cycle('C') // => 0
cycle('G') // => 1
cycle('F') // => -1
cycle('C2') // => undefined</code></pre>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->