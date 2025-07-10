import crypto from "crypto";

const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100_000;

export function encryptPrivateKey(privateKeyHex: string, password: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    "sha256"
  );

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(privateKeyHex, "utf8"),
    cipher.final(),
  ]);

  return {
    encryptedData: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
  };
}
