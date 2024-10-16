import { detectKey, detectScale, getUniquePitchClasses } from './musicUtils';

describe('musicUtils', () => {
  describe('detectKey', () => {
    it('returns an array of possible key matches for C major', () => {
      const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
      const possibleKeys = detectKey(notes);
      expect(possibleKeys).toEqual(expect.arrayContaining(['C C major']));
    });

    it('returns an array of possible key matches for A minor', () => {
      const notes = ['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5'];
      const possibleKeys = detectKey(notes);
      expect(possibleKeys).toEqual(expect.arrayContaining(['A A minor']));
    });
  });

  describe('detectScale', () => {
    it('identifies C major scale from MIDI note events with tonic and match options', () => {
      const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C4, D4, E4, F4, G4, A4, B4
      const noteEvents = midiNotes.map(noteNumber => ({ noteNumber }));
      expect(detectScale(noteEvents, { tonic: 'C' })).toContain('C major');
    });

    it('identifies A minor scale from MIDI note events with default options', () => {
      const midiNotes = [69, 71, 72, 74, 76, 77, 79]; // A4, B4, C5, D5, E5, F5, G5
      const noteEvents = midiNotes.map(noteNumber => ({ noteNumber }));
      expect(detectScale(noteEvents)).toContain('A minor');
    });
  });

  describe('getUniquePitchClasses', () => {
    it('returns unique pitch classes', () => {
      const midiNotes = [60, 62, 64, 65, 67, 69, 71, 60]; // C4, D4, E4, F4, G4, A4, B4, C4
      const noteEvents = midiNotes.map(noteNumber => ({ noteNumber }));
      const uniquePitchClasses = getUniquePitchClasses(noteEvents);
      expect(uniquePitchClasses).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });
  });
});
