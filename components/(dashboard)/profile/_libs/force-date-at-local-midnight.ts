export function forceDateAtLocalMidnight(date?: Date): Date | undefined {
  if (!date) return undefined;
  const fixed = new Date(date);
  fixed.setHours(0, 0, 0, 0);
  return fixed;
}
