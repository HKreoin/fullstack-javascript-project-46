import fs from 'fs';
import path from 'path';
import parse from './parsers.js';

const getFileContent = (filepath) => {
  const absolutePath = path.resolve(filepath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const ext = path.extname(filepath);
  return parse(content, ext);
};

const genDiff = (filepath1, filepath2) => {
  const obj1 = getFileContent(filepath1);
  const obj2 = getFileContent(filepath2);
  
  const allKeys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])].sort();
  
  const result = allKeys.map(key => {
    if (!(key in obj1)) {
      return `  + ${key}: ${obj2[key]}`;
    }
    if (!(key in obj2)) {
      return `  - ${key}: ${obj1[key]}`;
    }
    if (obj1[key] !== obj2[key]) {
      return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
    }
    return `    ${key}: ${obj1[key]}`;
  });
  
  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
