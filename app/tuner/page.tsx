"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import TunerEngine from "./tunerEngine";

export default function Page() {
  const [note, setNote] = useState<string | null>(null);
  const [noteOctave, setNoteOctave] = useState<number | null>(null);
  const [detune, setDetune] = useState<number>(0);
  const tunerEngine = useRef<TunerEngine | null>(null);

  function updateDOMCallback(
    newNote: string,
    newNoteOctave: number,
    newDetune: number,
  ) {
    setNote(newNote);
    setDetune(newDetune);
    setNoteOctave(newNoteOctave);
  }

  useEffect(() => {
    tunerEngine.current = new TunerEngine(updateDOMCallback);
  }, []);

  // Handling Play/Stop
  const [isPlaying, setIsPlaying] = useState(false);
  function tunerPlayStopToggle(): void {
    if (tunerEngine !== null && tunerEngine.current !== null) {
      tunerEngine.current.startStop();
      setIsPlaying(tunerEngine.current.playing);
    }
  }

  return (
    <div className="h-screen flex flex-col items-center w-full justify-center">
      <h1 className="text-2xl py-8 text-primary">Tuner</h1>
      <div className="flex flex-col items-center justify-between w-2/4 h-2/4">
        <div
          id="tuner-note-section"
          className="flex flex-row items-center justify-center w-full"
        >
          <p className="mx-1 text-2xl">{note}</p>
          <p className="mx-1 text-lg self-end">{noteOctave}</p>
        </div>
        <Separator />
        <div
          id="tuner-graphic-section"
          className="flex flex-row items-center justify-between w-full"
        >
          <Slider value={[detune + 50]} disabled={true} />
        </div>
        <Separator />
        <Button onClick={tunerPlayStopToggle} className="my-8 text-xl">
          {isPlaying ? "Stop" : "Tune"}
        </Button>
      </div>
    </div>
  );
}
