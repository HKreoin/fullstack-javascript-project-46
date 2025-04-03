import yaml from 'js-yaml';

const parse = (content, ext) => {
  if (ext === '.yml' || ext === '.yaml') {
    return yaml.load(content);
  }
  return JSON.parse(content);
};

export default parse; 