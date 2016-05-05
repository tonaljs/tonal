'use strict';

var tonalNotes = require('tonal-notes');
var tonalDistances = require('tonal-distances');
var tonalMidi = require('tonal-midi');
var tonalFreq = require('tonal-freq');
var tonalArrays = require('tonal-arrays');
var tonalRanges = require('tonal-ranges');



exports.name = tonalNotes.name;
exports.pc = tonalNotes.pc;
exports.enharmonics = tonalNotes.enharmonics;
exports.simplify = tonalNotes.simplify;
exports.transpose = tonalDistances.transpose;
exports.tr = tonalDistances.tr;
exports.interval = tonalDistances.interval;
exports.distance = tonalDistances.distance;
exports.dist = tonalDistances.dist;
exports.fifthsFrom = tonalDistances.fifthsFrom;
exports.toMidi = tonalMidi.toMidi;
exports.fromMidi = tonalMidi.fromMidi;
exports.fromMidiSharps = tonalMidi.fromMidiSharps;
exports.toFreq = tonalFreq.toFreq;
exports.asArr = tonalArrays.asArr;
exports.map = tonalArrays.map;
exports.filter = tonalArrays.filter;
exports.listFn = tonalArrays.listFn;
exports.harmonizer = tonalArrays.harmonizer;
exports.harmonize = tonalArrays.harmonize;
exports.shuffle = tonalArrays.shuffle;
exports.midiRange = tonalRanges.midiRange;
exports.chromatic = tonalRanges.chromatic;
exports.cycleOfFifths = tonalRanges.cycleOfFifths;
exports.scaleRange = tonalRanges.scaleRange;