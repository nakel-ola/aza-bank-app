const algorithm = "aes-256-gcm";
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const tagPosition = saltLength + ivLength;
const encryptedPosition = tagPosition + tagLength;


/**
 * It takes a passphrase, creates a key from it, and then returns an object with two functions: encrypt
 * and decrypt
 * @param {string} passphrase - The passphrase to use to encrypt and decrypt.
 * @returns An object with two properties: encrypt and decrypt.
 */
async function cryptr(passphrase: string) {
  if (!passphrase || typeof passphrase !== "string") {
    throw new Error("passphrase must be a non-0-length string");
  }

  const crypto = await import("crypto");

  /**
   * It generates a key from a passphrase and a salt.
   * @param {Buffer} salt - A random buffer of 16 bytes.
   * @returns A key.
   */
  function getKey(salt: Buffer) {
    return crypto.pbkdf2Sync(passphrase, salt, 100000, 32, "sha512");
  }

  /**
   * Encrypt takes a string and returns a string
   * @param {string} value - The value to encrypt.
   * @returns The encrypted value.
   */
  const encrypt = (value: string) => {
    if (value == null) {
      throw new Error("value must not be null or undefined");
    }

    const iv = crypto.randomBytes(ivLength);
    const salt = crypto.randomBytes(saltLength);

    const key = getKey(salt);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(String(value), "utf8"),
      cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
  };


  /**
   * It takes a string, converts it to a buffer, slices it into pieces, creates a key, creates a
   * decipher, sets the tag, and then updates and finalizes the decipher
   * @param {string} value - The value to be decrypted.
   * @returns The decrypted value.
   */
  const decrypt = (value: string) => {
    if (value == null) {
      throw new Error("value must not be null or undefined");
    }

    const stringValue = Buffer.from(String(value), "hex");

    const salt = stringValue.slice(0, saltLength);
    const iv = stringValue.slice(saltLength, tagPosition);
    const tag = stringValue.slice(tagPosition, encryptedPosition);
    const encrypted = stringValue.slice(encryptedPosition);

    const key = getKey(salt);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    decipher.setAuthTag(tag);

    return decipher.update(encrypted) + decipher.final("utf8");
  };
  return {
    encrypt,
    decrypt,
  };
}

export default cryptr;
