import { pType, fifths, focts, height, isPC,
  asPitch, isIvlPitch, strPitch } from 'tonal-pitch'

function trBy (i, p) {
  var t = pType(p)
  if (!t) return null
  var f = fifths(i) + fifths(p)
  if (isPC(p)) return ['tnlp', [f]]
  var o = focts(i) + focts(p)
  if (t === 'note') return ['tnlp', [f, o]]
  var d = height(i) + height(p) < 0 ? -1 : 1
  return ['tnlp', [d * f, d * o], d]
}

/**
 * Transpose notes. Can be used to add intervals
 * @function
 */
export default function transpose (a, b) {
  if (arguments.length === 1) return (b) => transpose(a, b)
  var pa = asPitch(a)
  var pb = asPitch(b)
  var r = isIvlPitch(pa) ? trBy(pa, pb)
    : isIvlPitch(pb) ? trBy(pb, pa) : null
  return a === pa && b === pb ? r : strPitch(r)
}
