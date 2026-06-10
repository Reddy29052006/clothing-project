/**
 * Rule-Based Measurement Engine
 * Deterministic formulas — No AI
 * All measurements in centimeters
 */

const BODY_TYPE_ADJ = {
  slim: -2,
  regular: 0,
  heavy: 4,
};

const FIT_EASE_ADJ = {
  slim: -2,
  regular: 0,
  loose: 4,
};

/**
 * Calculate garment measurements from body inputs
 * @param {number} height - in cm
 * @param {number} weight - in kg
 * @param {string} bodyType - 'slim' | 'regular' | 'heavy'
 * @param {string} fitPreference - 'slim' | 'regular' | 'loose'
 * @returns {object} - garment measurements
 */
const calculateMeasurements = (height, weight, bodyType, fitPreference) => {
  const bAdj = BODY_TYPE_ADJ[bodyType] ?? 0;
  const fAdj = FIT_EASE_ADJ[fitPreference] ?? 0;

  // Base formulas
  const chest = parseFloat(((height * 0.51) + bAdj + fAdj).toFixed(1));
  const waist = parseFloat(((weight * 0.38) + bAdj + fAdj).toFixed(1));
  const shoulder = parseFloat(((height * 0.245) + (bAdj * 0.5)).toFixed(1));
  const hip = parseFloat((waist + 10 + bAdj).toFixed(1));
  const inseam = parseFloat((height * 0.47).toFixed(1));
  const sleeve = parseFloat((height * 0.33) + (bAdj * 0.3)).toFixed(1);
  const neck = parseFloat(((weight * 0.195) + (bAdj * 0.5)).toFixed(1));

  // Validate ranges
  return {
    chest: Math.max(72, Math.min(chest, 140)),
    waist: Math.max(58, Math.min(waist, 130)),
    shoulder: Math.max(36, Math.min(shoulder, 52)),
    hip: Math.max(75, Math.min(hip, 145)),
    inseam: Math.max(65, Math.min(inseam, 90)),
    sleeve: Math.max(55, Math.min(parseFloat(sleeve), 70)),
    neck: Math.max(34, Math.min(parseFloat(neck), 50)),
  };
};

/**
 * Apply feedback adjustments to future measurements
 * @param {object} measurements - current measurements
 * @param {string} fitRating - 'tight' | 'perfect' | 'loose'
 * @returns {object} - adjusted measurements
 */
const applyFeedbackAdjustment = (measurements, fitRating) => {
  if (fitRating === 'perfect') return measurements;

  const delta = fitRating === 'tight' ? 1.5 : -1.5;

  return {
    ...measurements,
    chest: parseFloat((measurements.chest + delta).toFixed(1)),
    waist: parseFloat((measurements.waist + delta).toFixed(1)),
    hip: parseFloat((measurements.hip + delta).toFixed(1)),
  };
};

module.exports = { calculateMeasurements, applyFeedbackAdjustment };
