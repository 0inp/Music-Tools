// Thanks to :
//https://github.com/devbyjonah/tempocontrol/blob/main/app/metronome/metronomeEngine.ts

// TODO: Add TapToTempo feature

interface meterType {
  beatsPerMeasure: number;
  beatDivision: number;
  label: string;
}

export const meterOptions: meterType[] = [
  { beatsPerMeasure: 1, beatDivision: 4, label: "1/4" },
  { beatsPerMeasure: 2, beatDivision: 4, label: "2/4" },
  { beatsPerMeasure: 3, beatDivision: 4, label: "3/4" },
  { beatsPerMeasure: 4, beatDivision: 4, label: "4/4" },
  { beatsPerMeasure: 5, beatDivision: 4, label: "5/4" },
  { beatsPerMeasure: 7, beatDivision: 4, label: "7/4" },
  { beatsPerMeasure: 5, beatDivision: 8, label: "5/8" },
  { beatsPerMeasure: 6, beatDivision: 8, label: "6/8" },
  { beatsPerMeasure: 7, beatDivision: 8, label: "7/8" },
  { beatsPerMeasure: 9, beatDivision: 8, label: "9/8" },
  { beatsPerMeasure: 12, beatDivision: 8, label: "12/8" },
];

export default class MetronomeEngine {
  public tempo: number;
  public pitchFirstBeat: boolean = true;
  public playing: boolean = false;
  private intervalId?: number;
  private audioContext?: AudioContext;
  private currentBeat: number = 0;
  private nextNoteTime: number = 0.0; // time next note should play
  private intervalPeriod: number = 25.0; // how often to call scheduling function (in ms)
  private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (sec). This is calculated from lookahead, and overlaps with next interval (in case the timer is late)
  private beatsPerMeasure: number = 4;
  private division: number = 4;
  private subdivision: number = 1;

  constructor(
    tempo: number = 70,
    pitchFirstBeat: boolean = true,
    meter: string = "4/4",
  ) {
    this.tempo = tempo;
    this.pitchFirstBeat = pitchFirstBeat;
    this.meter = meter;
  }

  public cleanup() {
    this.audioContext?.close();
    this.audioContext = undefined;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
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

    this.currentBeat = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.intervalId = window.setInterval(
      () => this.scheduler(),
      this.intervalPeriod,
    );
  }

  private stop() {
    this.playing = false;
    clearInterval(this.intervalId);
  }

  private scheduler() {
    // continue scheduling notes as long as we are within the schedule ahead range
    while (
      this.nextNoteTime <
      this.audioContext!!.currentTime + this.scheduleAheadTime
    ) {
      // find length of each subdivision
      let secondsPerBeat = 60.0 / this.tempo;
      // in a 4/4 meter, the denominator 4 is the quarter note, eq to 1 beat each secondsPerBeats.
      // in a 6/8 meter, the 8 is the eight note, eq to 2 beats per secondsPerBeats.
      // in a 3/2 meter, the 2 refers to the half note, that is we want 0.5 beats each secondsPerBeats (or one beat every 2 secondsPerBeats).
      let secondsPerSubdivision = secondsPerBeat / this.subdivision;
      // schedule a note for each subdivision of the beat
      for (let i = 0; i < this.subdivision; i++) {
        this.scheduleNote(
          this.currentBeat,
          this.nextNoteTime + secondsPerSubdivision * i,
          i === 0,
        );
      }
      // move on to next beat
      this.nextBeat();
    }
  }

  private scheduleNote(beatNumber: number, time: number, onBeat: boolean) {
    // create sound source (try switching to buffer ?)
    const osc = this.audioContext!!.createOscillator();
    const envelope = this.audioContext!!.createGain();
    const gainNode = new GainNode(this.audioContext!!);
    // this._volume is set from 0-100 for ease of use
    // gainNode.gain.value is set from -1.5 - 2.5
    gainNode.gain.value = 1.0;
    // assign higher frequency for downbeats only
    // let pitch = beatNumber === 0 ? this._pitch * 1.2 : this._pitch;
    let pitch = beatNumber === 0 && this.pitchFirstBeat ? 1500 * 1.4 : 1500;

    // osc.frequency.value = onBeat ? pitch : this._pitch * 0.8;
    osc.frequency.value = onBeat ? pitch : 1500 * 0.8;
    //beatNumber % this._beatsPerBar === 0 ? this._pitch : this._pitch * 0.8;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(envelope);
    envelope.connect(gainNode).connect(this.audioContext!!.destination);

    osc.start(time);
    osc.stop(time + 0.03);

    // if (onBeat && this._animationCallback) {
    //   this._animationCallback(beatNumber, 60.0 / this._tempo);
    // }
  }

  private nextBeat() {
    // move current note/time forward by a quarter note
    let secondsPerBeat = 60.0 / this.tempo;
    this.nextNoteTime += secondsPerBeat;
    // increment beat number, set to 0 if end of bar
    this.currentBeat++;
    if (this.currentBeat >= this.beatsPerMeasure / this.subdivision) {
      this.currentBeat = 0;
    }
  }

  public set meter(newMeter: string) {
    let meterOption = meterOptions.find((opt) => opt.label === newMeter);
    if (!meterOption) {
      return;
    }
    this.beatsPerMeasure = meterOption.beatsPerMeasure;
    this.division = meterOption.beatDivision;
    this.subdivision = this.division / 4;
  }
}
