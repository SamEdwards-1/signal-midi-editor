import * as Key from '@tonaljs/key';
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
  const keyInfo = Key.key(pitchClasses.join(' '));

  // Extract key names
  const keyNames = keyInfo.tonic ? [`${keyInfo.tonic} ${keyInfo.type}`] : [];

  return keyNames;
}


/**
 * Detects the scale(s) of a given set of notes.
 * @param notes - An array of note strings.
 * @returns An array of possible scales.
 */
export function detectScale(notes: string[]): string[] {
  // Convert notes to pitch classes
  const pitchClasses = notes
    .map(note => Note.pitchClass(note))
    .filter(pc => pc !== null) as string[];

  // Get all known scale names
  const allScales = Scale.names();

  const matchingScales: string[] = [];

  // Iterate over possible tonics
  Note.names().forEach(tonic => {
    allScales.forEach(scaleName => {
      const scale = Scale.get(`${tonic} ${scaleName}`);
      const scaleNotes = scale.notes.map(note => Note.pitchClass(note));

      // Check if all input notes are in the scale
      const isMatch = pitchClasses.every(pc => scaleNotes.includes(pc));

      if (isMatch) {
        matchingScales.push(`${tonic} ${scaleName}`);
      }
    });
  });

  return matchingScales;
}
