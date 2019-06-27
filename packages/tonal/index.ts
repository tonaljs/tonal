export {
  Pitch,
  NoteCoordinates,
  IntervalCoordinates,
  encode,
  decode
} from "./src/pitch";

export {
  note,
  tokenize as tokenizeNote,
  NoteName,
  Note,
  NoteProps,
  PcName,
  altToAcc,
  coordToNote
} from "./src/note";

export {
  interval,
  tokenize as tokenizeInterval,
  IntervalName,
  Interval,
  coordToInterval
} from "./src/interval";

export { transpose, distance } from "./src/distance";
