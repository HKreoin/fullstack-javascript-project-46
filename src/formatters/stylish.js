const getIndent = (depth) => ' '.repeat(depth * 4);

const stringify = (value, depth) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
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

const stylish = (diff) => `{\n${formatDiff(diff)}\n}`;

export default stylish; 