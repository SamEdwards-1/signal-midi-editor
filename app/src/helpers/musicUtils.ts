import * as Scale from '@tonaljs/scale';
import { Note } from 'tonal';


/**
 * Detects the key(s) of a given set of notes.
 * @param notes - An array of note strings (e.g., ['C4', 'E4', 'G4']).
 * @returns An array of possible keys.
 */
export function detectKey(notes: string[]): string[] {
  // Convert notes to pitch classes (e.g., 'C4' -> 'C')
  const pitchClasses = notes
    .map(note => Note.pitchClass(note))
    .filter(pc => pc !== null) as string[];

  // Get key candidates
  const pitchClasses = getUniquePitchClasses(noteEvents);
  const possibleKeys = Key.detect(notes);
  // Extract key names
  const keyNames = keyInfo.tonic ? [`${keyInfo.tonic} ${keyInfo.type}`] : [];

  return keyNames;
}

/**
 * Converts an array of assembled note events to an array of unique pitch classes.
 * Information is work preserving for purposes of collapsing the pianoroll (hide out-of-scale
 * notes)
 * @param notes - An array of assembled note events.
 * @returns An array of unique pitch classes.
 */
export function getUniquePitchClasses(notes: { noteNumber: number }[]): string[] {
  const pitchClasses = new Set<string>();

  notes.forEach(note => {
    const pitchClass = Note.pitchClass(Note.fromMidi(note.noteNumber));
    if (pitchClass) {
      pitchClasses.add(pitchClass);
    }
  });

  return Array.from(pitchClasses);
}


/**
 * Detects the scale(s) of a given set of MIDI note events.
 * @param noteEvents - An array of MIDI note events.
 * @param options - Optional settings for scale detection, including tonic and match type.
 * @returns An array of possible scales.
 */
export function detectScale(noteEvents: { noteNumber: number }[], options: { tonic?: string, match?: "exact" | "fit" } = { match: "exact" }): string[] {
  // Get unique pitch classes from note events
  const pitchClasses = getUniquePitchClasses(noteEvents);

  // Use Scale.detect to find matching scales
  return Scale.detect(pitchClasses, options);
}
