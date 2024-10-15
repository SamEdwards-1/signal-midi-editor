import { detectKey, detectScale } from './musicUtils';

describe('Music Utilities using Tonal', () => {
  test('detectKey identifies C major key', () => {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    expect(detectKey(notes)).toContain('C major');
  });

  test('detectScale identifies A minor scale', () => {
    const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    expect(detectScale(notes)).toContain('A natural minor');
  });
});