const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const formatDiff = (diff, parentKey = '') => {
  const lines = diff.map((node) => {
    const key = parentKey ? `${parentKey}.${node.key}` : node.key;

    switch (node.type) {
      case 'added':
        return `Property '${key}' was added with value: ${formatValue(node.value)}`;
      case 'deleted':
        return `Property '${key}' was removed`;
      case 'changed':
        return `Property '${key}' was updated. From ${formatValue(node.oldValue)} to ${formatValue(node.newValue)}`;
      case 'nested':
        return formatDiff(node.children, key);
      default:
        return null;
    }
  });

  return lines.filter(Boolean).join('\n');
};

export default formatDiff; 