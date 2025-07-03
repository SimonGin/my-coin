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
