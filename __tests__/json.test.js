import fs from 'fs';
import path from 'path';
import genDiff from '../src/index';

const getFixturePath = (filename) => path.join('__fixtures__', filename);

describe('json format', () => {
  test('should compare files and return json', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const diff = genDiff(filepath1, filepath2, 'json');
    expect(() => JSON.parse(diff)).not.toThrow();
  });
});
