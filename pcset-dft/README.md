<a name="module_PcsetDft"></a>

# PcsetDft
`tonal/pcset-dft` is a implementation of the Discrete Fourier Transform
applied to pitch class sets.

The DFT provides a kind of harmonic blueprint by which we may characterize a
pitch set (a chord, for example) and compare it to others in a way that
correspond to our perception of sounding similar.

David Lewin was the first to note the connection between the Fourier
transform and a chord’s harmonic content. Other theorists have incorporated
this mathematical technique into their work, including Vuza (1993),
Quinn (2006 and 2007), and Amiot (2007)

References:
- [1] [Set-Class Similarity, Voice Leading, and the Fourier Transform (Dmitri Tymoczko)](http://dmitri.mycpanel.princeton.edu/files/publications/fourier.pdf)
- [2] [Continuous Harmonic Spaces (Clifton Callender)]()

__This module is not included in the Tonal facade__, the only way
to import it is by using ES6 modules

**Example**  
```js
import PcsetDft from 'tonal/pcswet-dft'
PcsetDft.spectra(["C", "E", "G#"]) // => [3, 0, 0, 3, 0, 0, 3]
```

* [PcsetDft](#module_PcsetDft)
    * [`.dft(notes)`](#module_PcsetDft.dft) ⇒ <code>Array.&lt;number, number&gt;</code>
    * [`.spectra(notes)`](#module_PcsetDft.spectra) ⇒ <code>Array.&lt;number&gt;</code>
    * [`.distance(set1, set2)`](#module_PcsetDft.distance) ⇒

<a name="module_PcsetDft.dft"></a>

## `PcsetDft.dft(notes)` ⇒ <code>Array.&lt;number, number&gt;</code>
Get the Fourier components of a pitch class set

It applies the Discrete Fourier Transform to the pitch class set with
numbers from 0 to 6 (the _Niquist_ frequency: N / 2 where N is the number of
possible pitch classes)

**Kind**: static method of [<code>PcsetDft</code>](#module_PcsetDft)  
**Returns**: <code>Array.&lt;number, number&gt;</code> - the fourier components  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;string&gt;</code> | the notes or pitch class set |

**Example**  
```js
dft.dft('C E G#') // => [ [3, 0], [0, 0], [0, 0], [3, 0], [0, 0], [0, 0], [3, 0] ])
```
<a name="module_PcsetDft.spectra"></a>

## `PcsetDft.spectra(notes)` ⇒ <code>Array.&lt;number&gt;</code>
The spectra of pitch-class sets in twelve-tone equal temperament
is the magnitudes of the first six harmonics (in addition to harmonic zero)

**Kind**: static method of [<code>PcsetDft</code>](#module_PcsetDft)  
**Returns**: <code>Array.&lt;number&gt;</code> - the magnitudes of the dft  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;string&gt;</code> | the notes or pitch set |

**Example**  
```js
PcsetDft.spectra(["C", "E", "G#"]) // => [3, 0, 0, 3, 0, 0, 3]
```
<a name="module_PcsetDft.distance"></a>

## `PcsetDft.distance(set1, set2)` ⇒
A natural way to measure the distance between two spectra is to take
the Euclidean distance between their corresponding spectra

**Kind**: static method of [<code>PcsetDft</code>](#module_PcsetDft)  
**Returns**: number - the Euclidean distance between both  

| Param | Type | Description |
| --- | --- | --- |
| set1 | <code>String</code> \| <code>Array</code> | the first pitch class set or notes |
| set2 | <code>String</code> \| <code>Array</code> | the second pitch class set or notes |

**Example**  
```js
PcsetDft.distance(["C", "E", "G"], ["C", "Eb", "G"])) //=> 1.5307337294603596
```
