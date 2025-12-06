import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a single JSDOM window and DOMPurify instance to reuse
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export default function sanitizeHtml(html) {
  if (!html) return '';
  try {
    return DOMPurify.sanitize(String(html));
  } catch (e) {
    console.error('sanitizeHtml error:', e && e.message ? e.message : e);
    return String(html);
  }
}
