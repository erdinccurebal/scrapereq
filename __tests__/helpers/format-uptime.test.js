import { helperFormatUptime } from '../../src/helpers/format-uptime.js';

describe('helperFormatUptime', () => {
  it('should format seconds only', () => {
    expect(helperFormatUptime(45)).toBe('45s');
  });

  it('should format minutes and seconds', () => {
    expect(helperFormatUptime(125)).toBe('2m 5s');
  });

  it('should format hours, minutes and seconds', () => {
    expect(helperFormatUptime(3661)).toBe('1h 1m 1s');
  });

  it('should format days, hours, minutes and seconds', () => {
    expect(helperFormatUptime(90061)).toBe('1d 1h 1m 1s');
  });

  it('should return 0s for zero uptime', () => {
    expect(helperFormatUptime(0)).toBe('0s');
  });

  it('should handle exact day', () => {
    expect(helperFormatUptime(86400)).toBe('1d');
  });

  it('should handle exact hour', () => {
    expect(helperFormatUptime(3600)).toBe('1h');
  });

  it('should throw for non-number input', () => {
    expect(() => helperFormatUptime('100')).toThrow(TypeError);
  });

  it('should throw for NaN', () => {
    expect(() => helperFormatUptime(NaN)).toThrow(TypeError);
  });
});
