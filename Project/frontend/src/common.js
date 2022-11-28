/**
 * Given a sentiment value of [-1, 1], return the color corresponding to that sentiment percentage. A -1 sentiment equals pure red (#ff0000), +1 returns pure blue (#0000ff), anything in between returns something in between.
 *
 * Examples
 *
 * Input -1: returns `rgb(255, 0, 0)`;
 * Input 0: returns `rgb(127.5, 0, 127.5)`;
 * Input 1: returns `rgb(0, 0, 255)`
 *
 * @param {float} sentiment a sentiment value between -1 and 1 inclusive
 * @returns the corresponding RGB color, e.g., -1 returns `rgb(255, 0, 0)`, `null` for invalid input
 */
export const sentimentColor = (sentiment) => {
  if (!(sentiment >= -1 && sentiment <= 1)) return null;

  const normalizedSentiment = sentiment + 1; // to get rid of negatives
  const r = ((2 - normalizedSentiment) / 2) * 255;
  const g = 0;
  const b = (normalizedSentiment / 2) * 255;
  return `rgb(${r}, ${g}, ${b})`;
};
