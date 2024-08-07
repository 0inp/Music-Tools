"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MetronomeEngine from "./metronomeEngine";
import { meterOptions } from "./metronomeEngine";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  // tempo
  const [tempo, setTempo] = useState([70]);

  // Rythm
  const meterOptionsLabels: string[] = meterOptions.map((opt) => opt.label);
  const [meter, setMeter] = useState("4/4");

  // First beat accent
  const [firstBeat, setFirstBeat] = useState(true);

  // Handlers
  function minusOneTempoHandler(): void {
    const newTempo: number = tempo[0] == 0 ? 0 : tempo[0] - 1;
    tempoChangeHandler(newTempo);
  }
  function plusOneTempoHandler(): void {
    const newTempo: number = tempo[0] == 250 ? 250 : tempo[0] + 1;
    tempoChangeHandler(newTempo);
  }
  function meterChangeHandler(newMeter: string): void {
    metronomeEngine.current.meter = newMeter;
    setMeter(newMeter);
  }
  function tempoChangeHandler(newTempo: number): void {
    metronomeEngine.current.tempo = newTempo;
    setTempo([newTempo]);
  }
  function firstBeatChangeHandler(firstBeatChecked: boolean): void {
    metronomeEngine.current.pitchFirstBeat = firstBeatChecked;
    setFirstBeat(firstBeatChecked);
  }

  // Handling Play/Stop
  const [isPlaying, setIsPlaying] = useState(false);
  function metronomePlayStopToggle(): void {
    metronomeEngine.current.startStop();
    setIsPlaying(metronomeEngine.current.playing);
  }
  // store instance of MetronomeEngine in a ref so that it persists between renders
  // the ref acts as the single source of truth for the metronome state
  const metronomeEngine = useRef(
    new MetronomeEngine(tempo[0], firstBeat, meter),
  );
  useEffect(() => {
    // Cleanup function to stop the metronome and remove the audio context
    return () => {
      metronomeEngine.current.cleanup();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col items-center w-full justify-center">
      <h1 className="text-2xl py-8">Metronome</h1>
      <div className="flex flex-col items-center justify-between w-2/4 h-2/4">
        <div
          id="metronome-tempo-section"
          className="flex flex-col items-center justify-evenly w-full"
        >
          <div className="flex flex-row justify-evenly items-center w-full py-2">
            <Button onClick={minusOneTempoHandler} variant="outline">
              -
            </Button>
            <div className="text-xl">{tempo}</div>
            <Button onClick={plusOneTempoHandler} variant="outline">
              +
            </Button>
          </div>
          <Slider
            defaultValue={[70]}
            min={10}
            max={250}
            step={1}
            value={tempo}
            onValueChange={(newTempo: number[]): void =>
              tempoChangeHandler(newTempo[0])
            }
            className="w-4/5 py-2"
          />
        </div>
        <Separator />
        <div
          id="metronome-options-section"
          className="flex flex-row justify-evenly items-center w-full"
        >
          <Select
            value={meter}
            onValueChange={(newMeter: string) => meterChangeHandler(newMeter)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>4/4</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {meterOptionsLabels.map((meterOption: string) => (
                <SelectItem key={meterOption} value={meterOption}>
                  {meterOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="first-beat-accent"
              checked={firstBeat}
              onCheckedChange={(checked: boolean) => {
                firstBeatChangeHandler(checked);
              }}
            />
            <label
              htmlFor="first-beat-accent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accent first beat
            </label>
          </div>
        </div>
        <Separator />
        <div
          id="metronome-play-section"
          className="flex flex-row justify-evenly items-center w-full"
        >
          <Button onClick={metronomePlayStopToggle} variant="outline">
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </div>
      </div>
    </div>
  );
}
