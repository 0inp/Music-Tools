import { PitchDetector } from "pitchy";

const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export default class TunerEngine {
  public playing: boolean = false;
  private audioContext: AudioContext;
  private audioAnalyser: AnalyserNode;
  private audioBuffer: Float32Array;
  private intervalId?: number;
  private intervalPeriod: number = 50;
  private domUpdateCallback: (
    note: string,
    octave: number,
    detune: number,
  ) => void;

  constructor(
    domUpdateCallback: (note: string, octave: number, detune: number) => void,
  ) {
    this.audioContext = new window.AudioContext();
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.audioAnalyser.fftSize = 2048;
    this.audioBuffer = new Float32Array(this.audioAnalyser.fftSize);
    this.domUpdateCallback = domUpdateCallback;
  }

  // surface level method for use in the metronome react component
  public startStop() {
    if (this.playing) {
      this.stop();
    } else {
      this.start();
    }
  }

  private start() {
    if (this.audioContext === undefined) {
      this.audioContext = new AudioContext();
    }

    this.playing = true;
    this.audioContext.resume();

    const audioConstraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(audioConstraints)
      .then((stream: MediaStream): void => {
        this.audioContext
          .createMediaStreamSource(stream)
          .connect(this.audioAnalyser);
      })
      .catch((err) => {
        console.log("Error starting Tuner : ", err);
      });
    const detector = PitchDetector.forFloat32Array(this.audioAnalyser.fftSize);
    detector.minVolumeDecibels = -20;

    this.intervalId = window.setInterval(
      () => this.updatePitch(detector, this.audioContext.sampleRate),
      this.intervalPeriod,
    );
  }

  private stop() {
    clearInterval(this.intervalId);
    this.playing = false;
  }

  public updatePitch(detector: PitchDetector<any>, sampleRate: number) {
    this.audioAnalyser.getFloatTimeDomainData(this.audioBuffer);
    const [pitch, _] = detector.findPitch(this.audioBuffer, sampleRate);

    if (pitch != 0) {
      let note = this.noteFromPitch(pitch);
      let noteStr = noteStrings[note % 12];
      let noteOctave = Math.floor(note / 12) - 1;
      let detune = this.centsOffFromPitch(pitch, note);
      this.domUpdateCallback(noteStr, noteOctave, detune);
    }
  }

  private noteFromPitch(frequency: number) {
    var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  }

  private frequencyFromNoteNumber(note: number) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  private centsOffFromPitch(frequency: number, note: number) {
    return Math.floor(
      (1200 * Math.log(frequency / this.frequencyFromNoteNumber(note))) /
        Math.log(2),
    );
  }
}
