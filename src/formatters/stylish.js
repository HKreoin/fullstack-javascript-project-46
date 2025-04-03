const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const getIndent = (depth) => ' '.repeat(depth * 4);

const stringify = (value, depth) => {
  if (!isObject(value)) {
    return String(value);
  }

  const indent = getIndent(depth);
  const lines = Object.entries(value)
    .map(([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${getIndent(depth - 1)}}`,
  ].join('\n');
};

const formatDiff = (diff, depth = 1) => {
  const indent = getIndent(depth);

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

export default formatDiff;
