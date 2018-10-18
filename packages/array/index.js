import { props, name } from "tonal-note";
function ascR(b, n) {
    for (var a = []; n--; a[n] = n + b)
        ;
    return a;
}
function descR(b, n) {
    for (var a = []; n--; a[n] = b - n)
        ;
    return a;
}
export function range(a, b) {
    return a === null || b === null
        ? []
        : a < b ? ascR(a, b - a + 1) : descR(a, a - b + 1);
}
export function rotate(times, arr) {
    var len = arr.length;
    var n = (times % len + len) % len;
    return arr.slice(n, len).concat(arr.slice(0, n));
}
export var compact = function (arr) { return arr.filter(function (n) { return n === 0 || n; }); };
var height = function (name) {
    var m = props(name).midi;
    return m !== null ? m : props(name + "-100").midi;
};
export function sort(src) {
    return compact(src.map(name)).sort(function (a, b) { return height(a) > height(b); });
}
export function unique(arr) {
    return sort(arr).filter(function (n, i, a) { return i === 0 || n !== a[i - 1]; });
}
export var shuffle = function (arr, rnd) {
    if (rnd === void 0) { rnd = Math.random; }
    var i, t;
    var m = arr.length;
    while (m) {
        i = (rnd() * m--) | 0;
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
};
export var permutations = function (arr) {
    if (arr.length === 0)
        return [[]];
    return permutations(arr.slice(1)).reduce(function (acc, perm) {
        return acc.concat(arr.map(function (e, pos) {
            var newPerm = perm.slice();
            newPerm.splice(pos, 0, arr[0]);
            return newPerm;
        }));
    }, []);
};
