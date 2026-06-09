/**
 * Simple token estimation for text.
 * Based on average of 4 characters per token (rough approximation)
 * For production, use proper tokenizer (e.g., js-tiktoken)
 */
export const estimateTokens = (text: string): number => {
  const charCount = text.length;
  return Math.ceil(charCount / 4);
};

/**
 * Estimate tokens for a prompt (title + body)
 */
export const estimatePromptTokens = (title: string, body: string): number => {
  return estimateTokens(title) + estimateTokens(body);
};
