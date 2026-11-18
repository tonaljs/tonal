"use client";

import { useCallback, useState } from "react";
import { type PlayOptions, playChords, playNotes } from "@/lib/piano";

export type PianoStatus = "idle" | "loading" | "ready" | "error";

/** Play notes with the piano, and know whether its samples are loading. */
export function usePiano() {
  const [status, setStatus] = useState<PianoStatus>("idle");

  const track = useCallback((playing: Promise<void>) => {
    setStatus((status) => (status === "ready" ? status : "loading"));
    playing.then(
      () => setStatus("ready"),
      () => setStatus("error"),
    );
  }, []);

  const play = useCallback(
    (notes: (string | number)[], options?: PlayOptions) => {
      if (notes.length) track(playNotes(notes, options));
    },
    [track],
  );

  const playSequence = useCallback(
    (chords: (string | number)[][], gap?: number) => {
      if (chords.length) track(playChords(chords, gap));
    },
    [track],
  );

  return { status, play, playSequence };
}
