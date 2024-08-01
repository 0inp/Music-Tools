"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

import useSound from "use-sound";
// import sound from "/sounds/tick.mp3";

export default function Page() {
  // tempo
  const [tempo, setTempo] = useState([70]);
  function minusOneTempo() {
    const newTempo = tempo[0] == 0 ? 0 : tempo[0] - 1;
    setTempo([newTempo]);
  }
  function plusOneTempo() {
    const newTempo = tempo[0] == 250 ? 250 : tempo[0] + 1;
    setTempo([newTempo]);
  }
  // Rythm
  const [rythm, setRythm] = useState("4/4");
  const rythmOptions = [
    { value: "1/4", label: "1/4" },
    { value: "2/4", label: "2/4" },
    { value: "3/4", label: "3/4" },
    { value: "4/4", label: "4/4" },
    { value: "6/8", label: "6/8" },
  ];
  // First beat accent
  const [firstBeat, setFirstBeat] = useState(true);
  // Handling Play/Stop
  const [metronomeIntervalID, setMetronomeIntervalID] = useState(null);
  const [playMetronome, setPlayMetronome] = useState(true);
  const [play] = useSound("/sounds/tick.mp3");
  function convertBpmToMs(bpm: number): number {
    const ms = Math.round((60 / bpm) * 1000);
    console.log("interval metronome : ", ms);
    return ms;
  }
  // useEffect(() => {
  //   if (!playMetronome) {
  //     metronomeIntervalID = setMetronomeIntervalID(
  //       setInterval(play, convertBpmToMs(tempo[0])),
  //     );
  //   } else {
  //     clearInterval(metronomeIntervalID);
  //   }
  // }, [tempo, rythm, playMetronome]);
  function metronomePlayStopToggle(): void {
    setPlayMetronome(!playMetronome);
    // const metronome = setInterval(play, convertBpmToMs(tempo[0]));
  }
  return (
    <div className="flex flex-col items-center w-full justify-evenly h-4/5">
      <h1 className="text-center text-2xl">Metronome</h1>
      <div className="flex flex-col items-center justify-between w-2/4 h-2/4">
        <div
          id="metronome-tempo-section"
          className="flex flex-col items-center justify-evenly w-2/4 h-2/4"
        >
          <div className="flex flex-row justify-between items-center w-full">
            <Button onClick={minusOneTempo} variant="outline">
              -
            </Button>
            <div className="text-xl">{tempo}</div>
            <Button onClick={plusOneTempo} variant="outline">
              +
            </Button>
          </div>
          <Slider
            defaultValue={[70]}
            min={10}
            max={250}
            step={1}
            value={tempo}
            onValueChange={(i) => setTempo(i)}
          />
        </div>
        <Separator />
        <div
          id="metronome-options-section"
          className="flex flex-row justify-evenly items center w-full"
        >
          <select
            value={rythm}
            onChange={(e) => setRythm(e.target.value)}
            className="text-sm"
          >
            {rythmOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            {/* <Checkbox */}
            {/*   id="first-beat-accent" */}
            {/*   checked={firstBeat} */}
            {/*   onCheckedChange={setFirstBeat} */}
            {/* /> */}
            <label
              htmlFor="first-beat-accent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accent first beat
            </label>
          </div>
        </div>
        <Separator />
        <Button onClick={metronomePlayStopToggle} variant="outline">
          {playMetronome ? "Play" : "Stop"}
        </Button>
      </div>
    </div>
  );
}
