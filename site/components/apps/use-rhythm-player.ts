"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DrumSound,
  drumsTime,
  loadDrums,
  playDrum,
  stopDrums,
} from "@/lib/drums";

export type DrumStatus = "idle" | "loading" | "ready" | "error";

/** A sound played on the steps of a pattern that have a 1. */
export type RhythmVoice = {
  pattern: number[];
  sound: DrumSound;
  velocity: number;
};

// schedule the steps that start in the next LOOKAHEAD seconds, every TICK ms:
// the audio clock keeps the time, the timer only has to wake up often enough
const LOOKAHEAD = 0.12;
const TICK = 25;

/**
 * Loop patterns of steps with drum sounds, with a clock that lives in the app
 * (tonal only describes the patterns). `update` changes what plays and how
 * fast without stopping; `step` is the step that sounds now, for a playhead.
 */
export function useRhythmPlayer() {
  const [status, setStatus] = useState<DrumStatus>("idle");
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const voices = useRef<RhythmVoice[]>([]);
  const stepSeconds = useRef(0.15);
  const next = useRef({ step: 0, time: 0 });
  const queue = useRef<{ step: number; time: number }[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  /** What to play (the first voice sets the length) and seconds per step. */
  const update = useCallback((list: RhythmVoice[], seconds: number) => {
    voices.current = list;
    stepSeconds.current = seconds;
  }, []);

  const schedule = useCallback(() => {
    const length = voices.current[0]?.pattern.length ?? 0;
    if (!length) return;
    while (next.current.time < drumsTime() + LOOKAHEAD) {
      const { time } = next.current;
      const at = next.current.step % length;
      for (const { pattern, sound, velocity } of voices.current) {
        if (pattern[at % pattern.length] === 1) {
          void playDrum(sound, { time, velocity });
        }
      }
      queue.current.push({ step: at, time });
      next.current = { step: at + 1, time: time + stepSeconds.current };
    }
  }, []);

  // the playhead: the last scheduled step whose time has come
  const animate = useCallback(() => {
    const now = drumsTime();
    let current: number | undefined;
    while (queue.current.length && queue.current[0].time <= now) {
      current = queue.current.shift()!.step;
    }
    if (current !== undefined) setStep(current);
    frame.current = requestAnimationFrame(animate);
  }, []);

  const halt = useCallback(() => {
    clearInterval(timer.current);
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    queue.current = [];
  }, []);

  const play = useCallback(() => {
    halt();
    setStatus((s) => (s === "ready" ? s : "loading"));
    loadDrums().then(
      () => {
        setStatus("ready");
        next.current = { step: 0, time: drumsTime() + 0.05 };
        schedule();
        timer.current = setInterval(schedule, TICK);
        frame.current = requestAnimationFrame(animate);
        setPlaying(true);
      },
      () => setStatus("error"),
    );
  }, [halt, schedule, animate]);

  const stop = useCallback(() => {
    halt();
    void stopDrums();
    setPlaying(false);
    setStep(null);
  }, [halt]);

  /** Play one sound now (when a step is switched on). */
  const hit = useCallback((sound: DrumSound) => {
    const done = playDrum(sound);
    setStatus((s) => (s === "ready" ? s : "loading"));
    done.then(
      () => setStatus("ready"),
      () => setStatus("error"),
    );
  }, []);

  useEffect(() => halt, [halt]);

  return { status, playing, step, play, stop, update, hit };
}
