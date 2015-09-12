# Time module

__This will be moved to scorejs library__

## API

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
<h4 class="name" id="timeMeter"><span class="type-signature"></span>timeMeter<span class="signature">(meter)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a time meter signature</p>
<p>The returned time meter object has the following properties:
- beats: number of beats per measure (integer)
- subdivision: the meter subdivision (4 or 8)
- measure: the length (in duration value) of the measure</p>
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
<td class="name"><code>meter</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="description last"><p>the string representing the time meter</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/time-meter.js">time-meter.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/time-meter.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a time meter object</p>
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
</dl>
</article>
</section>
</div><div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<div class="description"><p>Given a <a href="https://en.wikipedia.org/wiki/Note_value">note value</a> get its name</p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/duration-name.js">duration-name.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/duration-name.js#L3">lineno 3</a>
</li>
</ul></dd>
</dl>
<pre class="prettyprint"><code>var name = require('tonal/time/duration-name')
name(1/2 + 1/4)        // => 'h.'
name(1/4 + 1/2 + 1/8)  // => 'q..'</code></pre>
</div>
</article>
</section>
<section>
<article>
<div class="container-overview">
<div class="description"><p>Given a note duration name, get its <a href="https://en.wikipedia.org/wiki/Note_value">value</a></p></div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/duration-value.js">duration-value.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/duration-value.js#L3">lineno 3</a>
</li>
</ul></dd>
<dt class="tag-see">See:</dt>
<dd class="tag-see">
<ul>
<li>time/duration-name</li>
</ul>
</dd>
</dl>
<pre class="prettyprint"><code>var value = require('tonal/time/duration-value')
// You can convert from names to values:
value('long');          // => 4
value('double');         // => 2
value('whole');          // => 1
value('half');           // => 1/2
value('quarter');        // => 1/4
value('eighth');         // => 1/8
value('sixteenth');      // => 1/16
value('thirty-second');  // => 1/32
// From letter and dots to values:
value('h');   // => 1/2
value('h.');  // => dot: 1/2 + 1/4
value('h..'); // => double dot: 1/2 + 1/4 + 1/8
value('ht');  // => triplet: (1/2 + 1/ 2) / 3
value('q');   // => 1/4
value('q.');  // => dot: 1/4 + 1/8
value('q..'); // => double dot: 1/4 + 1/8 + 1/16
value('qt');  // => triplet: (1/4 + 1/4) / 3
// From number string to value:
value('2');   // => 1/2
value('2.');  // => dot: 1/2 + 1/4
value('2t');  // => triplet: (1/2 + 1/ 2) / 3
value('2..'); // => double dot: 1/2 + 1/4 + 1/8
value('4');   // => 1/4
value('4.');  // => dot: 1/4 + 1/8
value('4..'); // => double dot: 1/4 + 1/8 + 1/16
value('4t');  // => triplet: (1/4 + 1/4) / 3</code></pre>
</div>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
