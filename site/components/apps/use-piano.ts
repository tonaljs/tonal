"use client";

import { useCallback, useState } from "react";
import { type PlayOptions, playNotes } from "@/lib/piano";

export type PianoStatus = "idle" | "loading" | "ready" | "error";

/** Play notes with the piano, and know whether its samples are loading. */
export function usePiano() {
  const [status, setStatus] = useState<PianoStatus>("idle");

  const play = useCallback(
    (notes: (string | number)[], options?: PlayOptions) => {
      if (!notes.length) return;
      setStatus((status) => (status === "ready" ? status : "loading"));
      playNotes(notes, options).then(
        () => setStatus("ready"),
        () => setStatus("error"),
      );
    },
    [],
  );

  return { status, play };
}
