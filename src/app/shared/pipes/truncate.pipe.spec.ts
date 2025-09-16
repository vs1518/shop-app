import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('should truncate long text', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('abc def ghi', 5)).toBe('abc…');
  });
  it('should return original if short', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('short', 10)).toBe('short');
  });
});
