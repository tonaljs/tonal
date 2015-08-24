# List module

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
<h4 class="name" id="areIntervals"><span class="type-signature"></span>areIntervals<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a list, check it its a interval list</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/areIntervals.js">areIntervals.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/areIntervals.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="areIntervals"><span class="type-signature"></span>areIntervals<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Given a list, check it its a note list</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/areNotes.js">areNotes.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/areNotes.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="direction"><span class="type-signature"></span>direction<span class="signature">(list, direction)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Force the items to a list to be always ascending or descending by transposing
octaves (without changing the note order)</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the list</p></td>
</tr>
<tr>
<td class="name"><code>direction</code></td>
<td class="type">
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>(Optional) 1 to force ascending, -1 to force
descending (1 by default)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/direction.js">direction.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/direction.js#L20">lineno 20</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>a list in ascending or descending direction</p>
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
<pre class="prettyprint"><code>direction('C B A') // => ['C4', 'B5', 'A6']
direction('C B A', -1) // => ['C4', 'B4', 'A4']</code></pre>
</dd>
<dt>
<h4 class="name" id="isBinaryList"><span class="type-signature"></span>isBinaryList<span class="signature">(number)</span><span class="type-signature"> &rarr; {boolean}</span></h4>
</dt>
<dd>
<div class="description">
<p>Determine if a given number is a valid binary list number</p>
<p>A valid binary list is a binary number with two conditions:
- its 12 digit long
- starts with 1 (P1 interval)</p>
<p>The binary number can be expressed in decimal as well (i.e 2773)</p>
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
<span class="param-type">String</span>
</td>
<td class="description last"><p>the number to test</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/isBinary.js">isBinary.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/isBinary.js#L23">lineno 23</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>true if its a valid scale binary number</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">boolean</span>
</dd>
</dl>
<h5>Example</h5>
<pre class="prettyprint"><code>isBinary('101010101010') // => true
isBinary(2773) // => true
isBinary('001010101010') // => false (missing first 1)
isBinary('1001') // => false</code></pre>
</dd>
<dt>
<h4 class="name" id="list"><span class="type-signature"></span>list<span class="signature">(list)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get a list of notes or isInterval</p>
<p>This is the principal function to create lists. Basically does the same as
<code>list/parse</code> but if an array is given, it returns it without modification
or validation (so, only pass an array when you are sure that is a valid list)</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
</td>
<td class="description last"><p>the list to be parsed or passed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/list.js">list.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/list.js#L21">lineno 21</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array list of notes or intervals (or anything it you pass
an array to the function)</p>
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
<pre class="prettyprint"><code>list('c d# e5') // => ['C4', 'D#4', 'E5']
list('P1 m2') // => ['P1', 'm2']
list('bb2') // => ['Bb2']
list('101') // => ['P1', 'M2']
// to validate an array
list(['C#3', 'P2'].join(' ')) // => null</code></pre>
</dd>
<dt>
<h4 class="name" id="listDict"><span class="type-signature"></span>listDict<span class="signature">(data, parser)</span><span class="type-signature"> &rarr; {function}</span></h4>
</dt>
<dd>
<div class="description">
<p>Create a list dictionary from a hash map data and a name parser</p>
<p>A list dictionary is a function that generates lists from keys. It uses
a parser to remove the tonic (if present) from the key. Then look up
into the hash for a name and pass it to a list generator.</p>
<p>If the returned dictionary is called without arguments, a list of all keys
is returned</p>
<p>If the name is not found in the hash data, it throws an exception</p>
<p>The parser should receive one string and return an object with two string
properties:
- tonic: a note if any, or null
- type: (required) the key to lookfor</p>
<p>The scale/scale and chord/chord functions uses this to create a generator.</p>
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
<td class="name"><code>data</code></td>
<td class="type">
<span class="param-type">Hash</span>
</td>
<td class="description last"><p>the data hash (dictionary)</p></td>
</tr>
<tr>
<td class="name"><code>parser</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>a function that parses the name and returns
an object with tonic (if not present) and the name properties</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/dictionary.js">dictionary.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/dictionary.js#L36">lineno 36</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the list dictionary</p>
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
<pre class="prettyprint"><code>var listDict = require('tonal/data/listDict')
var scale = listDict({'major': 2773})
scale('C major') // => ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']
scale('major') // => ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7']
// get keys:
scale() // => ['major']</code></pre>
</dd>
<dt>
<h4 class="name" id="parse"><span class="type-signature"></span>parse<span class="signature">(list)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Parse a string to a note or interval list</p>
<p>The string can be notes or intervals separated by white spaces or a binary
or decimal representation of a interval list</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the string to be parsed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/parse.js">parse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/parse.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>an array of notes or intervals, null if not valid list</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="reverse"><span class="type-signature"></span>reverse<span class="signature">(list)</span><span class="type-signature"> &rarr; {Array}</span></h4>
</dt>
<dd>
<div class="description">
<p>Get the reverse (retrograde) of a list</p>
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
<td class="name"><code>list</code></td>
<td class="type">
<span class="param-type">String</span>
|
<span class="param-type">Array</span>
|
<span class="param-type">Integer</span>
</td>
<td class="description last"><p>the list to be reversed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/reverse.js">reverse.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/reverse.js#L13">lineno 13</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>The reversed list</p>
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
<pre class="prettyprint"><code>reverse('A B C') // => ['C', 'B', 'A']</code></pre>
</dd>
<dt>
<h4 class="name" id="rotate"><span class="type-signature"></span>rotate<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Rotate a list</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/danigb/tonal/blob/master/rotate.js">rotate.js</a>
<span>, </span>
<a href="https://github.com/danigb/tonal/blob/master/rotate.js#L11">lineno 11</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->
