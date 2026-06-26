/**
 * severity.service.js
 * The "AI" severity scoring engine for CivicEye.
 * Pure function, deterministic, rule-based — easy to demo and explain to judges.
 */

const CATEGORY_BASE_SCORES = {
  sewage: 8.0,
  water_leak: 7.0,
  pothole: 6.0,
  garbage: 5.0,
  streetlight: 4.0,
  other: 3.0,
};

const HIGH_BOOST_KEYWORDS = [
  'accident',
  'dangerous',
  'urgent',
  'emergency',
  'injury',
  'child',
  'bleeding',
];

const MEDIUM_BOOST_KEYWORDS = [
  'broken',
  'flood',
  'dark',
  'smell',
  'overflow',
  'blocked',
];

const REDUCE_KEYWORDS = ['minor', 'small', 'slight'];

function mapScoreToSeverity(score) {
  if (score >= 9) return 'critical';
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

/**
 * @param {Object} issueData
 * @param {string} issueData.category
 * @param {string} issueData.title
 * @param {string} issueData.description
 * @param {number} [issueData.upvote_count]
 * @returns {{ score: number, severity: string, reasons: string[] }}
 */
function calculateSeverity(issueData) {
  const { category, title = '', description = '', upvote_count = 0 } = issueData;
  const reasons = [];

  // STEP 1 — Base score by category
  const baseScore = CATEGORY_BASE_SCORES[category] ?? CATEGORY_BASE_SCORES.other;
  let score = baseScore;
  reasons.push(`Category: ${category} (base ${baseScore.toFixed(1)})`);

  // STEP 2 — Keyword scan of title + description (lowercase)
  const text = `${title} ${description}`.toLowerCase();

  HIGH_BOOST_KEYWORDS.forEach((word) => {
    if (text.includes(word)) {
      score += 2.0;
      reasons.push(`Keyword detected: '${word}' (+2.0)`);
    }
  });

  MEDIUM_BOOST_KEYWORDS.forEach((word) => {
    if (text.includes(word)) {
      score += 1.0;
      reasons.push(`Keyword detected: '${word}' (+1.0)`);
    }
  });

  REDUCE_KEYWORDS.forEach((word) => {
    if (text.includes(word)) {
      score -= 0.5;
      reasons.push(`Keyword detected: '${word}' (-0.5)`);
    }
  });

  // STEP 3 — Upvote boost
  if (upvote_count > 0) {
    const upvoteBoost = Math.min(upvote_count * 0.3, 2.0);
    score += upvoteBoost;
    reasons.push(`${upvote_count} community upvotes (+${upvoteBoost.toFixed(1)})`);
  }

  // STEP 4 — Cap at 10.0 (and floor at 0)
  score = Math.max(0, Math.min(score, 10.0));
  score = Math.round(score * 10) / 10; // round to 1 decimal

  // STEP 5 — Map to severity label
  const severity = mapScoreToSeverity(score);

  return { score, severity, reasons };
}

module.exports = { calculateSeverity, CATEGORY_BASE_SCORES };
