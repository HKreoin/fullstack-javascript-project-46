import path from 'path';
import fs from 'fs';
import genDiff from '../src/index';

const getFixturePath = (filename) => path.join('__fixtures__', filename);
const readFile = (filepath) => fs.readFileSync(filepath, 'utf-8');

describe('gendiff', () => {
  test('should compare json files', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expected = readFile(getFixturePath('stylish-nested.txt'));
    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });

  test('should compare yaml files', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');
    const expected = readFile(getFixturePath('stylish-nested.txt'));
    expect(genDiff(filepath1, filepath2)).toBe(expected);
  });
});
