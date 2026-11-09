'use client';

import { useEffect } from 'react';

/**
 * Polyfill navigator.clipboard for non-secure contexts (e.g. http://coder.lan or http://IP:3000)
 * where navigator.clipboard is undefined, preventing Uncaught TypeError: Cannot read properties of undefined (reading 'writeText').
 */
export function ClipboardPolyfill() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!navigator.clipboard) {
      (navigator as unknown as { clipboard: unknown }).clipboard = {
        writeText: async (text: string) => {
          try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          } catch (err) {
            console.warn('Fallback clipboard copy failed:', err);
          }
        },
        readText: async () => '',
      };
    }
  }, []);

  return null;
}
