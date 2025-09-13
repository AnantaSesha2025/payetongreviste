import { useState, useEffect } from 'react';

/**
 * Hook for generating blur data URLs
 */
export function useBlurDataURL(width: number = 10, height: number = 10) {
  const [blurDataURL, setBlurDataURL] = useState<string>('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a simple gradient for the blur placeholder
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      setBlurDataURL(canvas.toDataURL());
    }
  }, [width, height]);

  return blurDataURL;
}
