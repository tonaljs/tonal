"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MidiStatus = "unsupported" | "off" | "connecting" | "on" | "denied";

export type MidiHandlers = {
  noteOn: (midi: number) => void;
  noteOff: (midi: number) => void;
};

/**
 * Listen to the notes of every connected MIDI keyboard, with the Web MIDI API
 * (not in Safari). Nothing is asked to the browser until `connect` is called.
 */
export function useMidiInput(handlers: MidiHandlers) {
  const [status, setStatus] = useState<MidiStatus>("off");
  const [inputs, setInputs] = useState<string[]>([]);
  const access = useRef<MIDIAccess | null>(null);
  // the latest handlers, so the listeners don't need to be added again
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    if (!("requestMIDIAccess" in navigator)) setStatus("unsupported");
  }, []);

  const connect = useCallback(async () => {
    if (access.current) return;
    setStatus("connecting");
    try {
      const midi = await navigator.requestMIDIAccess();
      access.current = midi;
      const onMessage = (event: MIDIMessageEvent) => {
        if (!event.data) return;
        const [status, note, velocity] = event.data;
        const command = status & 0xf0;
        // a note on with velocity 0 is a note off
        if (command === 0x90 && velocity > 0) latest.current.noteOn(note);
        else if (command === 0x80 || command === 0x90)
          latest.current.noteOff(note);
      };
      // listen to every input, also the ones plugged in later
      const listen = () => {
        const names: string[] = [];
        midi.inputs.forEach((input) => {
          input.onmidimessage = onMessage;
          names.push(input.name ?? "MIDI input");
        });
        setInputs(names);
      };
      midi.onstatechange = listen;
      listen();
      setStatus("on");
    } catch {
      setStatus("denied");
    }
  }, []);

  // stop listening when the page is left
  useEffect(
    () => () => {
      const midi = access.current;
      if (!midi) return;
      midi.onstatechange = null;
      midi.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
    },
    [],
  );

  return { status, inputs, connect };
}
