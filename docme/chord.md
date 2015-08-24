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
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(chord)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a chord name and returns the tonic (if any) and the chord type</p>
<p>The returned object has the properties:
- tonic: the tonic note or null if not specified
- type: the chord type</p>
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
<td class="name"><code>chord</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the chord string to be parsed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/key/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/key/parse.js#L16">lineno 16</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the chord object</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>parse('C#major') // => { tonic: 'C#', type: 'major' }
parse('minor') // => { tonic: null, type: 'minor' }</code></pre>
</dd>
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Create a list from a chord name</p>
<p>If the chord name contains the tonic, a note list is returned. If only the
chord type is given, you get an interval list.</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/key/chord.js">chord.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/key/chord.js#L5">lineno 5</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>list/dictionary</li>
</ul>
</dd>
</dl>
<pre class="prettyprint"><code>chord('M') // => ['P1', 'M3', 'P5']
chord('C7') // => ['C4', 'E4', 'G4', 'B4']</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->