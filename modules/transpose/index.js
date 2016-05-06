import { isPitch, asPitch, height, isIvlPitch, strPitch } from 'tonal-pitch'

function trBy (i, p) {
  if (!isPitch(p)) return null
  var ie = i[1]
  var pe = p[1]
  var id = i[2]
  var pd = p[2] || 1
  var f = id * ie[0] + pd * pe[0]
  // is p a pitch class?
  if (pe.length === 1) return [ 'tnl-note', [f] ]
  var o = id * ie[1] + pd * pe[1]
  // is p a pitch note?
  if (p.length === 2) return [ 'tnl-note', [f, o] ]
  // else p is an interval
  var d = id * height(i) + pd * height(p) < 0 ? -1 : 1
  return [ 'tnl-ivl', [d * f, d * o], d ]
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
