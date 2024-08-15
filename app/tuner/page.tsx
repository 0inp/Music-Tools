"use client";

import { Button, Slider, Stack, Text, Title } from "@mantine/core";
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
    <Stack align="center" justify="center" h="100%" w="100%">
      <Title order={1} py="8">
        Tuner
      </Title>
      <Stack align="center" justify="space-between" h="50%" w="50%">
        <Text>
          {note} {noteOctave}
        </Text>
        <Slider
          value={detune}
          disabled
          min={-50}
          max={50}
          step={1}
          marks={[
            { value: -50, label: "-50 cents off" },
            { value: 0, label: "In-Tune" },
            { value: 50, label: "+50 cents off" },
          ]}
          showLabelOnHover={false}
          w="80%"
          py={2}
          size="sm"
          styles={{
            bar: {
              backgroundColor: "orange",
            },
          }}
        />
        <Button
          onClick={tunerPlayStopToggle}
          variant="filled"
          color="orange"
          size="md"
          my="8"
        >
          {isPlaying ? "Stop" : "Tune"}
        </Button>
      </Stack>
    </Stack>
  );
}
