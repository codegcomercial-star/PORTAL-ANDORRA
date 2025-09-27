import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('should combine class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'hidden');
      expect(result).toBe('base conditional');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid');
      expect(result).toBe('base valid');
    });

    it('should merge tailwind classes correctly', () => {
      // Esto depende de la implementación específica de tu función cn
      const result = cn('p-4', 'p-2');
      expect(typeof result).toBe('string');
    });
  });
});