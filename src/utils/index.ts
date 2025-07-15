import { formatDistanceToNowStrict } from "date-fns";

export const maskedKey = (key: string) => {
  const visibleStart = 6;
  const visibleEnd = 4;

  if (key.length <= visibleStart + visibleEnd) return key;

  return (
    key.slice(0, visibleStart) +
    "*".repeat(key.length - visibleStart - visibleEnd) +
    key.slice(key.length - visibleEnd)
  );
};

export const maskedAddress = (key: string) => {
  const visibleStart = 5; // e.g. "0x1234"
  const visibleEnd = 3;

  if (key.length <= visibleStart + visibleEnd) return key;

  return `${key.slice(0, visibleStart)} ... ${key.slice(-visibleEnd)}`;
};

export const intToBuffer = (num: number | bigint): Buffer => {
  // Returns a buffer with big-endian encoding
  const hex = BigInt(num).toString(16);
  const paddedHex = hex.length % 2 === 0 ? hex : "0" + hex;
  return Buffer.from(paddedHex, "hex");
};

export function timeAgo(timestamp: number): string {
  return formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });
}
