// Audio Engine - Core audio processing
import { PitchData, AudioEngineConfig, NoteInfo } from '../../shared/types';

// Note names
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4_FREQUENCY = 440;
const A4_NOTE_INDEX = 9; // A is the 9th note in the array

// Default config
const DEFAULT_CONFIG: AudioEngineConfig = {
  sampleRate: 44100,
  bufferSize: 2048,
  fftSize: 4096,
  minFrequency: 80,   // E2
  maxFrequency: 1000,  // B5
};

class PitchEngine {
  private config: AudioEngineConfig;
  private isRunning: boolean = false;
  private listeners: Set<(pitch: PitchData) => void> = new Set();

  constructor(config: Partial<AudioEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Convert frequency to note info
  frequencyToNote(frequency: number): NoteInfo {
    if (frequency <= 0) {
      return { name: '-', octave: 0, frequency: 0 };
    }

    // Calculate semitones from A4
    const semitones = 12 * Math.log2(frequency / A4_FREQUENCY);
    const noteIndex = Math.round(semitones) + A4_NOTE_INDEX;

    const octave = Math.floor(noteIndex / 12);
    const noteNameIndex = ((noteIndex % 12) + 12) % 12;

    return {
      name: NOTE_NAMES[noteNameIndex],
      octave,
      frequency,
    };
  }

  // Calculate cents deviation from target
  calculateCents(frequency: number, targetFrequency: number): number {
    if (frequency <= 0 || targetFrequency <= 0) return 0;
    return 1200 * Math.log2(frequency / targetFrequency);
  }

  // Create pitch data from frequency
  createPitchData(frequency: number, confidence: number = 1): PitchData {
    const noteInfo = this.frequencyToNote(frequency);
    const targetFrequency = this.noteToFrequency(noteInfo.name, noteInfo.octave);
    const cents = this.calculateCents(frequency, targetFrequency);

    return {
      frequency,
      note: noteInfo.name,
      octave: noteInfo.octave,
      cents,
      confidence,
      timestamp: Date.now(),
    };
  }

  // Convert note to frequency
  noteToFrequency(note: string, octave: number): number {
    const noteIndex = NOTE_NAMES.indexOf(note.replace('#', '#').toUpperCase());
    if (noteIndex === -1) return 0;

    const semitones = (octave - 4) * 12 + (noteIndex - A4_NOTE_INDEX);
    return A4_FREQUENCY * Math.pow(2, semitones / 12);
  }

  // Subscribe to pitch updates
  onPitchDetected(callback: (pitch: PitchData) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify listeners
  private notifyListeners(pitch: PitchData) {
    this.listeners.forEach(listener => listener(pitch));
  }

  // Start detection (simulated for MVP)
  async start(): Promise<void> {
    this.isRunning = true;
    this.startSimulation();
  }

  // Stop detection
  async stop(): Promise<void> {
    this.isRunning = false;
  }

  // Release resources
  release(): void {
    this.isRunning = false;
    this.listeners.clear();
  }

  // Simulation for demo purposes
  private startSimulation() {
    // This would be replaced with actual native module in production
    // For MVP, we simulate pitch detection
  }

  // Simulate a detected pitch (for testing)
  simulatePitch(frequency: number): void {
    if (!this.isRunning) return;

    const pitch = this.createPitchData(frequency, 0.95);
    this.notifyListeners(pitch);
  }

  getConfig(): AudioEngineConfig {
    return this.config;
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

// Singleton instance
export const pitchEngine = new PitchEngine();

export default pitchEngine;
