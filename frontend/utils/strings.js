export const hasWhitespaceAtEdges = (str) => {
  const reg = /^\s+/;
  return reg.test(str);
};

export const hasWhitespace = (str) => {
  const reg = /\s/;
  return reg.test(str);
};
