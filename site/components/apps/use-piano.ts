"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  audioTime,
  type Playback,
  type PlayOptions,
  playChords,
  playNotes,
  scheduleTimeline,
  stopAll,
  type TimedNotes,
} from "@/lib/piano";

export type PianoStatus = "idle" | "loading" | "ready" | "error";
export type { Playback };

// schedule the next turn of a loop this long before the current one ends
const LOOP_AHEAD = 0.4;

/**
 * Play notes with the piano, know whether its samples are loading, and follow
 * a timeline while it plays (`playing`): stop it, loop it, or change what it
 * plays without stopping (`updateSteps`).
 */
export function usePiano() {
  const [status, setStatus] = useState<PianoStatus>("idle");
  const [playing, setPlaying] = useState<Playback | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const current = useRef<{ steps: TimedNotes[]; playback: Playback } | null>(
    null,
  );
  // each run of the timeline, so a late promise of a stopped one is ignored
  const run = useRef(0);

  const track = useCallback((done: Promise<unknown>) => {
    setStatus((status) => (status === "ready" ? status : "loading"));
    done.then(
      () => setStatus("ready"),
      () => setStatus("error"),
    );
  }, []);

  const clear = useCallback(() => {
    run.current++;
    clearTimeout(timer.current);
    current.current = null;
    setPlaying(null);
  }, []);
  // leaving the page: the notes are scheduled ahead on a piano shared by every
  // page, so stop them too, or they keep sounding after a link is followed
  useEffect(
    () => () => {
      run.current++;
      clearTimeout(timer.current);
      void stopAll();
    },
    [],
  );

  // after a turn is scheduled: end it, or schedule the next turn of the loop
  const follow = useCallback((id: number, turnEnd: number) => {
    const delay = (turnEnd - LOOP_AHEAD - audioTime()) * 1000;
    timer.current = setTimeout(
      () => {
        if (id !== run.current || !current.current) return;
        const { steps, playback } = current.current;
        if (!playback.loop) {
          current.current = null;
          setPlaying(null);
          return;
        }
        // the next turn starts exactly when this one ends
        void scheduleTimeline(steps, { at: turnEnd, replace: false }).then(
          () => {
            if (id === run.current) follow(id, turnEnd + playback.duration);
          },
        );
      },
      Math.max(0, delay + (current.current?.playback.loop ? 0 : 400)),
    );
  }, []);

  // play steps from `from` seconds into them
  const start = useCallback(
    (steps: TimedNotes[], loop: boolean, from = 0) => {
      run.current++;
      clearTimeout(timer.current);
      const id = run.current;
      const scheduled = scheduleTimeline(steps, { from });
      track(scheduled);
      scheduled.then((timeline) => {
        if (id !== run.current) return;
        const playback = { ...timeline, loop };
        current.current = { steps, playback };
        setPlaying(playback);
        follow(id, timeline.start + timeline.duration);
      }, clear);
    },
    [track, clear, follow],
  );

  const play = useCallback(
    (notes: (string | number)[], options?: PlayOptions) => {
      if (!notes.length) return;
      clear();
      track(playNotes(notes, options));
    },
    [track, clear],
  );

  const playSequence = useCallback(
    (chords: (string | number)[][], gap?: number) => {
      if (!chords.length) return;
      clear();
      track(playChords(chords, gap));
    },
    [track, clear],
  );

  /** Play a timeline from its beginning, once or in a loop. */
  const playSteps = useCallback(
    (steps: TimedNotes[], { loop = false }: { loop?: boolean } = {}) => {
      if (!steps.length) return;
      start(steps, loop);
    },
    [start],
  );

  /**
   * While a timeline plays, change its steps (or its loop) without stopping:
   * what's left plays the new steps, from the same point. If the new steps
   * are shorter than that point, it stops (or, in a loop, wraps around).
   */
  const updateSteps = useCallback(
    (steps: TimedNotes[], { loop }: { loop?: boolean } = {}) => {
      const now = current.current;
      if (!now) return;
      const keepLoop = loop ?? !!now.playback.loop;
      const total = steps.reduce((sum, s) => sum + s.duration, 0);
      let from = audioTime() - now.playback.start;
      if (now.playback.loop) from %= now.playback.duration;
      if (keepLoop && total > 0) from %= total;
      if (!steps.length || from >= total) {
        clear();
        void stopAll();
        return;
      }
      start(steps, keepLoop, from);
    },
    [start, clear],
  );

  const stop = useCallback(() => {
    clear();
    void stopAll();
  }, [clear]);

  return {
    status,
    play,
    playSequence,
    playSteps,
    updateSteps,
    stop,
    playing,
  };
}
