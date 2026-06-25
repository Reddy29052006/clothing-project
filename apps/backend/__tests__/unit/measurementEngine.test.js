const { calculateMeasurements, applyFeedbackAdjustment } = require('../../utils/measurementEngine');

describe('Measurement Engine Unit Tests', () => {
  describe('calculateMeasurements', () => {
    test('should calculate expected base measurements for a standard height/weight', () => {
      const height = 180;
      const weight = 80;
      const bodyType = 'regular';
      const fitPreference = 'regular';

      const results = calculateMeasurements(height, weight, bodyType, fitPreference);

      expect(results).toHaveProperty('chest');
      expect(results).toHaveProperty('waist');
      expect(results).toHaveProperty('shoulder');
      expect(results).toHaveProperty('hip');
      expect(results).toHaveProperty('inseam');
      expect(results).toHaveProperty('sleeve');
      expect(results).toHaveProperty('neck');

      // Verify deterministic base formulas
      // chest = (180 * 0.51) + 0 + 0 = 91.8
      expect(results.chest).toBeCloseTo(91.8, 1);
      // waist = (80 * 0.38) = 30.4, which clamps to 58
      expect(results.waist).toBe(58);
    });

    test('should apply body type adjustments correctly', () => {
      const height = 175;
      const weight = 160;
      const regularRes = calculateMeasurements(height, weight, 'regular', 'regular');
      const slimRes = calculateMeasurements(height, weight, 'slim', 'regular');
      const heavyRes = calculateMeasurements(height, weight, 'heavy', 'regular');

      // Slim body type should subtract ease (-2 body type adjustment)
      expect(slimRes.chest).toBe(regularRes.chest - 2);
      expect(slimRes.waist).toBe(regularRes.waist - 2);

      // Heavy body type should add ease (+4 body type adjustment)
      expect(heavyRes.chest).toBe(regularRes.chest + 4);
      expect(heavyRes.waist).toBe(regularRes.waist + 4);
    });

    test('should apply fit preference adjustments correctly', () => {
      const height = 175;
      const weight = 160;
      const regularRes = calculateMeasurements(height, weight, 'regular', 'regular');
      const slimRes = calculateMeasurements(height, weight, 'regular', 'slim');
      const looseRes = calculateMeasurements(height, weight, 'regular', 'loose');

      // Slim fit preference subtracts ease (-2)
      expect(slimRes.chest).toBe(regularRes.chest - 2);
      expect(slimRes.waist).toBe(regularRes.waist - 2);

      // Loose fit preference adds ease (+4)
      expect(looseRes.chest).toBe(regularRes.chest + 4);
      expect(looseRes.waist).toBe(regularRes.waist + 4);
    });

    test('should clamp measurements within defined minimum and maximum bounds', () => {
      // Extremely low inputs should clamp to minimum bounds
      const lowResults = calculateMeasurements(10, 10, 'slim', 'slim');
      expect(lowResults.chest).toBe(72);
      expect(lowResults.waist).toBe(58);
      expect(lowResults.shoulder).toBe(36);
      expect(lowResults.hip).toBe(75);
      expect(lowResults.inseam).toBe(65);
      expect(lowResults.sleeve).toBe(55);
      expect(lowResults.neck).toBe(34);

      // Extremely high inputs should clamp to maximum bounds
      const highResults = calculateMeasurements(500, 500, 'heavy', 'loose');
      expect(highResults.chest).toBe(140);
      expect(highResults.waist).toBe(130);
      expect(highResults.shoulder).toBe(52);
      expect(highResults.hip).toBe(145);
      expect(highResults.inseam).toBe(90);
      expect(highResults.sleeve).toBe(70);
      expect(highResults.neck).toBe(50);
    });
  });

  describe('applyFeedbackAdjustment', () => {
    const baseMeasurements = {
      chest: 90,
      waist: 80,
      shoulder: 44,
      hip: 95,
      inseam: 80,
      sleeve: 60,
      neck: 40,
    };

    test('should keep measurements identical if fit rating is perfect', () => {
      const adjusted = applyFeedbackAdjustment(baseMeasurements, 'perfect');
      expect(adjusted).toEqual(baseMeasurements);
    });

    test('should increase key measurements by 1.5 if fit rating is tight', () => {
      const adjusted = applyFeedbackAdjustment(baseMeasurements, 'tight');
      expect(adjusted.chest).toBe(91.5);
      expect(adjusted.waist).toBe(81.5);
      expect(adjusted.hip).toBe(96.5);
      
      // Other values should remain unaffected
      expect(adjusted.shoulder).toBe(44);
      expect(adjusted.inseam).toBe(80);
    });

    test('should decrease key measurements by 1.5 if fit rating is loose', () => {
      const adjusted = applyFeedbackAdjustment(baseMeasurements, 'loose');
      expect(adjusted.chest).toBe(88.5);
      expect(adjusted.waist).toBe(78.5);
      expect(adjusted.hip).toBe(93.5);

      expect(adjusted.shoulder).toBe(44);
      expect(adjusted.inseam).toBe(80);
    });
  });
});
