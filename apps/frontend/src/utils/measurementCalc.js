const BODY_TYPE_ADJ = { slim: -2, regular: 0, heavy: 4 };
const FIT_EASE_ADJ = { slim: -2, regular: 0, loose: 4 };

export const calculateMeasurements = (height, weight, bodyType, fitPreference) => {
  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || 0;
  const bAdj = BODY_TYPE_ADJ[bodyType] ?? 0;
  const fAdj = FIT_EASE_ADJ[fitPreference] ?? 0;

  if (!h || !w) return null;

  const chest = clamp(+(h * 0.51 + bAdj + fAdj).toFixed(1), 72, 140);
  const waist = clamp(+(w * 0.38 + bAdj + fAdj).toFixed(1), 58, 130);
  const shoulder = clamp(+(h * 0.245 + bAdj * 0.5).toFixed(1), 36, 52);
  const hip = clamp(+(waist + 10 + bAdj).toFixed(1), 75, 145);
  const inseam = clamp(+(h * 0.47).toFixed(1), 65, 90);
  const sleeve = clamp(+(h * 0.33 + bAdj * 0.3).toFixed(1), 55, 70);
  const neck = clamp(+(w * 0.195 + bAdj * 0.5).toFixed(1), 34, 50);

  return { chest, waist, shoulder, hip, inseam, sleeve, neck };
};

const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

export const MEASUREMENT_LABELS = {
  chest: { label: 'Chest', unit: 'cm', icon: '📐' },
  waist: { label: 'Waist', unit: 'cm', icon: '📏' },
  shoulder: { label: 'Shoulder', unit: 'cm', icon: '👔' },
  hip: { label: 'Hip', unit: 'cm', icon: '📐' },
  inseam: { label: 'Inseam', unit: 'cm', icon: '📏' },
  sleeve: { label: 'Sleeve', unit: 'cm', icon: '👔' },
  neck: { label: 'Neck', unit: 'cm', icon: '🎀' },
};
