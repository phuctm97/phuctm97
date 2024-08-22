export function decodeEmailURL(encodedString: string): string {
  return encodedString.replaceAll("_at_", "@").replaceAll("_dot_", ".");
}
