// Audio Engine for playing notes and musical content

export class AudioEngine {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Play a single note
   * @param frequency - The frequency of the note in Hz
   * @param duration - Duration in seconds
   */
  async playNote(frequency: number, duration: number = 0.5): Promise<void> {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    return new Promise(resolve => setTimeout(resolve, duration * 1000));
  }

  /**
   * Convert note name to frequency
   * @param note - Note name (e.g., 'A4', 'C#5')
   * @returns Frequency in Hz
   */
  noteToFrequency(note: string): number {
    const noteMap: Record<string, number> = {
      'C': -9, 'C#': -8, 'Db': -8,
      'D': -7, 'D#': -6, 'Eb': -6,
      'E': -5,
      'F': -4, 'F#': -3, 'Gb': -3,
      'G': -2, 'G#': -1, 'Ab': -1,
      'A': 0, 'A#': 1, 'Bb': 1,
      'B': 2
    };

    const octave = parseInt(note.slice(-1));
    const noteName = note.slice(0, -1);
    const halfSteps = noteMap[noteName] + (octave - 4) * 12;

    return 440 * Math.pow(2, halfSteps / 12);
  }

  /**
   * Play a sequence of notes
   * @param notes - Array of note names
   * @param duration - Duration for each note
   */
  async playSequence(notes: string[], duration: number = 0.5): Promise<void> {
    for (const note of notes) {
      await this.playNote(this.noteToFrequency(note), duration);
    }
  }

  /**
   * Play multiple notes simultaneously (chord)
   * @param notes - Array of note names
   * @param duration - Duration for the chord
   */
  async playChord(notes: string[], duration: number = 1): Promise<void> {
    if (!this.audioContext) return;

    const oscillators = notes.map(note => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = this.noteToFrequency(note);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.2, this.audioContext!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);

      return oscillator;
    });

    oscillators.forEach(osc => {
      osc.start(this.audioContext!.currentTime);
      osc.stop(this.audioContext!.currentTime + duration);
    });

    return new Promise(resolve => setTimeout(resolve, duration * 1000));
  }
}

export const audioEngine = new AudioEngine();
