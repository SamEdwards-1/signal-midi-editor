import { detectKey, detectScale, getUniquePitchClasses } from './musicUtils';
import { Note } from 'tonal';

describe('Music Utilities using Tonal', () => {
  test('detectKey identifies C major key from MIDI note events', () => {
    const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C4, D4, E4, F4, G4, A4, B4
    const uniquePitchClasses = getUniquePitchClasses(midiNotes.map(noteNumber => ({ noteNumber })));
    expect(detectKey(uniquePitchClasses)).toContain('C major');
  });

  test('detectScale identifies C major scale from MIDI note events with tonic and match options', () => {
    const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C4, D4, E4, F4, G4, A4, B4
    const uniquePitchClasses = getUniquePitchClasses(midiNotes.map(noteNumber => ({ noteNumber })));
    expect(detectScale(uniquePitchClasses, { tonic: 'C' })).toContain('C major');
  });

  test('detectScale identifies A minor scale from MIDI note events with default options', () => {
    const midiNotes = [69, 71, 72, 74, 76, 77, 79]; // A4, B4, C5, D5, E5, F5, G5
    const uniquePitchClasses = getUniquePitchClasses(midiNotes.map(noteNumber => ({ noteNumber })));
    expect(detectScale(uniquePitchClasses)).toContain('A natural minor');
  });

  test('getUniquePitchClasses returns unique pitch classes', () => {
    const midiNotes = [60, 62, 64, 65, 67, 69, 71, 60]; // C4, D4, E4, F4, G4, A4, B4, C4
    const noteEvents = midiNotes.map(noteNumber => ({ noteNumber }));
    const uniquePitchClasses = getUniquePitchClasses(noteEvents);
    expect(uniquePitchClasses).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });
});
