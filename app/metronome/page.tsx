// TODO: Animation (use animationCallback in MetronomeEngine)
"use client";
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Select,
  Slider,
  Stack,
  Title,
} from "@mantine/core";
import { LuMinus, LuPlus } from "react-icons/lu";
import MetronomeEngine, { meterOptions } from "./metronomeEngine";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  // tempo
  const [tempo, setTempo] = useState(70);

  // Rythm
  const meterOptionsLabels: string[] = meterOptions.map((opt) => opt.label);
  const [meter, setMeter] = useState("4/4");

  // First beat accent
  const [firstBeat, setFirstBeat] = useState(true);

  // Handlers
  function minusOneTempoHandler(): void {
    const newTempo: number = tempo == 0 ? 0 : tempo - 1;
    tempoChangeHandler(newTempo);
  }
  function plusOneTempoHandler(): void {
    const newTempo: number = tempo == 250 ? 250 : tempo + 1;
    tempoChangeHandler(newTempo);
  }
  function meterChangeHandler(newMeter: string): void {
    metronomeEngine.current.meter = newMeter;
    setMeter(newMeter);
  }
  function tempoChangeHandler(newTempo: number): void {
    metronomeEngine.current.tempo = newTempo;
    setTempo(newTempo);
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
  const metronomeEngine = useRef(new MetronomeEngine(tempo, firstBeat, meter));
  useEffect(() => {
    // Cleanup function to stop the metronome and remove the audio context
    return () => {
      metronomeEngine.current.cleanup();
    };
  }, []);

  return (
    <Stack align="center" justify="center" h="100%" w="100%">
      <Title order={1} py="8">
        Metronome
      </Title>
      <Stack align="center" justify="space-between" h="50%" w="50%">
        <Stack
          id="metronome-tempo-section"
          align="center"
          justify="space-between"
          w="100%"
        >
          <Group justify="space-evenly" w="80%" py="2">
            <ActionIcon
              onClick={minusOneTempoHandler}
              variant="subtle"
              size="lg"
            >
              <LuMinus />
            </ActionIcon>
            <Title order={2}>{tempo}</Title>
            <ActionIcon
              onClick={plusOneTempoHandler}
              variant="subtle"
              size="lg"
            >
              <LuPlus />
            </ActionIcon>
          </Group>
          <Slider
            value={tempo}
            onChange={(newTempo: number): void => tempoChangeHandler(newTempo)}
            min={10}
            max={250}
            step={1}
            color="orange"
            showLabelOnHover={false}
            w="80%"
            py="2"
          />
        </Stack>
        <Group id="metronome-options-section" justify="space-evenly" w="100%">
          <Select
            checkIconPosition="right"
            data={meterOptionsLabels}
            defaultValue={meter}
            onChange={(newMeter, _) =>
              meterChangeHandler(newMeter ? newMeter : "4/4")
            }
          ></Select>
          <Checkbox
            checked={firstBeat}
            onChange={(event) =>
              firstBeatChangeHandler(event.currentTarget.checked)
            }
            label="Accent first beat"
            color="orange"
            variant="outline"
          />
        </Group>
        {/* <Divider c="orange" /> */}
        <Group id="metronome-play-section" justify="center" w="100%">
          <Button
            variant="filled"
            color="orange"
            size="md"
            onClick={metronomePlayStopToggle}
          >
            {isPlaying ? "Stop" : "Play"}
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}
