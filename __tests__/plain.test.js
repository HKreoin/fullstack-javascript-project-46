import fs from 'fs';
import path from 'path';
import genDiff from '../src/index.js';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filepath) => fs.readFileSync(filepath, 'utf-8');

describe('plain format', () => {
  test('should compare nested files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expected = readFile(getFixturePath('plain-nested.txt'));
    expect(genDiff(filepath1, filepath2, 'plain')).toBe(expected);
  });

  test('should compare yaml files', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');
    const expected = readFile(getFixturePath('plain-nested.txt'));
    expect(genDiff(filepath1, filepath2, 'plain')).toBe(expected);
  });
}); 