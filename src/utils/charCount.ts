export const charCount = (text: string): number => {
  return text.length;
};

export const charCountWithoutSpaces = (text: string): number => {
  return text.replace(/\s/g, '').length;
};
