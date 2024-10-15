import { Note, Scale } from "tonal";

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