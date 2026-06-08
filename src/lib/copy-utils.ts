/** Strip docx editor notes like [CTA Button: ...] and normalize placeholders */
export function cleanDocxCopy(text: string): string {
  return text
    .split("\n")[0]
    .replace(/\s*\[[^\]]+\]\s*/g, " ")
    .replace(/\[X\]/g, "2")
    .replace(/\s+/g, " ")
    .trim();
}
