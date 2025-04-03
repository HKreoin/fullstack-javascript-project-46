import fs from 'fs';
import path from 'path';
import parse from './parsers';
import getFormatter from './formatters';

const getFileContent = (filepath) => {
  const absolutePath = path.resolve(filepath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const ext = path.extname(filepath);
  return parse(content, ext);
};

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const buildDiff = (obj1, obj2) => {
  const allKeys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])].sort();

  const result = allKeys.map((key) => {
    if (!(key in obj1)) {
      return { key, type: 'added', value: obj2[key] };
    }
    if (!(key in obj2)) {
      return { key, type: 'deleted', value: obj1[key] };
    }
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return { key, type: 'nested', children: buildDiff(obj1[key], obj2[key]) };
    }
    if (obj1[key] !== obj2[key]) {
      return {
        key,
        type: 'changed',
        oldValue: obj1[key],
        newValue: obj2[key],
      };
    }
    return { key, type: 'unchanged', value: obj1[key] };
  });

  return result;
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = getFileContent(filepath1);
  const obj2 = getFileContent(filepath2);

  const diff = buildDiff(obj1, obj2);
  const formatter = getFormatter(format);
  return formatter(diff);
};

export default genDiff;
