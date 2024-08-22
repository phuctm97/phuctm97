export function encodeEmailURL(email: string): string {
  return email.replaceAll("@", "_at_").replaceAll(".", "_dot_");
}
