import { Key, Scale } from 'tonic'; // Adjust imports based on actual library exports

/**
 * Detects the key of a given set of notes.
 * @param notes - An array of note strings (e.g., ['C4', 'E4', 'G4']).
 * @returns The detected key as a string.
 */
export function detectKey(notes: string[]): string {
  // Implement key detection logic using tonic.ts
  // This is a placeholder for demonstration purposes
  const key = Key.detect(notes);
  return key.length > 0 ? key[0] : 'Unknown Key';
}

/**
 * Detects the scale of a given set of notes.
 * @param notes - An array of note strings.
 * @returns The detected scale as a string.
 */
export function detectScale(notes: string[]): string {
  // Implement scale detection logic using tonic.ts
  // This is a placeholder for demonstration purposes
  const scale = Scale.detect(notes);
  return scale.length > 0 ? scale[0] : 'Unknown Scale';
}