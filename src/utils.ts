import { createHash } from "crypto";

/**
 * Generate a SHA256-encrypted string from the given value.
 *
 * @param {string} val The value to encrypt.
 * @return {string} The SHA256-encrypted string.
 */
export const encryptSha256 = (val: string): string => {
  const hash = createHash("sha256");
  hash.update(val);
  return hash.digest("hex");
};
