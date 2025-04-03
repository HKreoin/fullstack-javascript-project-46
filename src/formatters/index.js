import stylish from './stylish';
import plain from './plain';
import json from './json';

const formatters = {
  stylish,
  plain,
  json,
};

export default (format) => {
  const formatter = formatters[format];
  if (!formatter) {
    throw new Error(`Unknown format: ${format}`);
  }
  return formatter;
};
