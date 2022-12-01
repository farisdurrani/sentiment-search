export const MIN_SENTIMENT = -1;
export const MAX_SENTIMENT = 1;

export const API_URL = "http://127.0.0.1:8000";
export const DEFAULT_SEARCH_TERM = "Trump";

export const DEF_START_DATE = new Date("2015-01-01");
export const DEF_END_DATE = new Date("2022-11-15");

export const USE_LOCAL_FILE = false;

export const ALL_PLATFORMS = [
  "All",
  "CNN",
  "The Guardian",
  "Facebook",
  "Twitter",
  "Reddit",
  "The New York Times",
];

/**
 * Given a sentiment value of [-1, 1], return the color corresponding to that sentiment percentage. A -1 sentiment equals pure red (#ff0000), +1 returns pure blue (#0000ff), anything in between returns something in between.
 *
 * Examples
 *
 * Input -1: returns `rgb(255, 0, 0)`;
 * Input 0: returns `rgb(255, 0, 255)`;
 * Input 0.5: returns `rgb(0, 127.5, 127.5)`;
 * Input 1: returns `rgb(0, 0, 255)`
 *
 * @param {float} sentiment a sentiment value between -1 and 1 inclusive
 * @returns the corresponding RGB color, e.g., -1 returns `rgb(255, 0, 0)`, `null` for invalid input
 */
export const sentimentColor = (sentiment) => {
  if (!(sentiment >= MIN_SENTIMENT && sentiment <= MAX_SENTIMENT)) return null;

  const NEG_SENT_COLOR = [255, 0, 0]; // pure red
  const NEU_SENT_COLOR = [222, 222, 222]; // light gray
  const POS_SENT_COLOR = [0, 0, 255]; // pure blue

  const DOMAIN_RANGE = MAX_SENTIMENT - MIN_SENTIMENT;
  const mid_sentiment = MIN_SENTIMENT + DOMAIN_RANGE / 2;

  const getColorInBetween = (startColor, endColor, pct) => {
    const [sr, sg, sb] = startColor;
    const [er, eg, eb] = endColor;

    const [r, g, b] = [
      sr * (1 - pct) + er * pct,
      sg * (1 - pct) + eg * pct,
      sb * (1 - pct) + eb * pct,
    ];

    return [r, g, b];
  };

  const getPercentage = (start, end, value) => {
    if (!(start <= end && start <= value && end >= value)) return null;

    return (value - start) / (end - start);
  };

  const formatColor = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

  if (sentiment < mid_sentiment) {
    const pct = getPercentage(MIN_SENTIMENT, mid_sentiment, sentiment);
    const [r, g, b] = getColorInBetween(NEG_SENT_COLOR, NEU_SENT_COLOR, pct);
    return formatColor(r, g, b);
  } else {
    const pct = getPercentage(mid_sentiment, MAX_SENTIMENT, sentiment);
    const [r, g, b] = getColorInBetween(NEU_SENT_COLOR, POS_SENT_COLOR, pct);
    return formatColor(r, g, b);
  }
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Converts any date input to "YYYY-MM-DD"
 * @param {string} input_date
 * @returns
 */
export const convertDateToStandard = (input_date) => {
  const date = new Date(input_date);

  if (date.toString() === "Invalid Date") return null;

  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + date.getUTCDate()).slice(-2);

  return `${year}-${month}-${day}`;
};
