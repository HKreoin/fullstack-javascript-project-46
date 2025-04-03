import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

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

const getIndent = (depth) => ' '.repeat(depth * 4);

const stringify = (value, depth) => {
  if (!isObject(value)) {
    return String(value);
  }

  const indent = getIndent(depth);
  const bracketIndent = getIndent(depth - 1);
  const lines = Object.entries(value)
    .map(([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};

const formatDiff = (diff, depth = 1) => {
  const indent = getIndent(depth);
  const bracketIndent = getIndent(depth - 1);

  const lines = diff.map((node) => {
    switch (node.type) {
      case 'added':
        return `${indent.slice(2)}+ ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'deleted':
        return `${indent.slice(2)}- ${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'changed':
        return [
          `${indent.slice(2)}- ${node.key}: ${stringify(node.oldValue, depth + 1)}`,
          `${indent.slice(2)}+ ${node.key}: ${stringify(node.newValue, depth + 1)}`,
        ].join('\n');
      case 'unchanged':
        return `${indent}${node.key}: ${stringify(node.value, depth + 1)}`;
      case 'nested':
        return `${indent}${node.key}: {\n${formatDiff(node.children, depth + 1)}\n${indent}}`;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  return lines.join('\n');
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const obj1 = getFileContent(filepath1);
  const obj2 = getFileContent(filepath2);
  
  const diff = buildDiff(obj1, obj2);
  const formatter = getFormatter(format);
  return formatter(diff);
};

export default genDiff; 