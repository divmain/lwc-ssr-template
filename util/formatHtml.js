// Borrowed from https://github.com/salesforce/lwc/blob/5463f8f4404f5ee08712bda5cc82edb9d1fbb018/scripts/test-utils/format-html.ts

import { HTML_NAMESPACE, isVoidElement } from '@lwc/shared';

export function formatHTML(src) {
  let res = '';
  let pos = 0;
  let start = pos;

  let depth = 0;

  const getPadding = () => {
    return '  '.repeat(depth);
  };

  while (pos < src.length) {
    // Consume element tags and comments.
    if (src.charAt(pos) === '<') {
      const tagNameMatch = src.slice(pos).match(/([\w-]+)/);

      const posAfterTagName = pos + 1 + tagNameMatch[0].length; // +1 to account for '<'

      // Special handling for `<style>` tags – these are not encoded, so we may hit '<' or '>'
      // inside the text content. So we just serialize it as-is.
      if (tagNameMatch[0] === 'style') {
        const styleMatch = src.slice(pos).match(/<style([\s\S]*?)>([\s\S]*?)<\/style>/);
        if (styleMatch) {
          // opening tag
          const [wholeMatch, attrs, textContent] = styleMatch;
          res += getPadding() + `<style${attrs}>` + '\n';
          depth++;
          res += getPadding() + textContent + '\n';
          depth--;
          res += getPadding() + '</style>' + '\n';
          start = pos = pos + wholeMatch.length;
          continue;
        }
      }

      const isVoid = isVoidElement(tagNameMatch[0], HTML_NAMESPACE);
      const isClosing = src.charAt(pos + 1) === '/';
      const isComment =
        src.charAt(pos + 1) === '!' &&
        src.charAt(pos + 2) === '-' &&
        src.charAt(pos + 3) === '-';

      start = pos;
      while (src.charAt(pos++) !== '>') {
        // Keep advancing until consuming the closing tag.
      }

      const isSelfClosing = src.charAt(pos - 2) === '/';

      // Adjust current depth and print the element tag or comment.
      if (isClosing) {
        depth--;
      } else if (!isComment) {
        // Offsets to account for '>' or '/>'
        const endPos = isSelfClosing ? pos - 2 : pos - 1;
        // Trim to account for whitespace at the beginning
        const attributesRaw = src.slice(posAfterTagName, endPos).trim();
        const attributesReordered = attributesRaw
          ? ' ' + reorderAttributes(attributesRaw)
          : '';
        src = src.substring(0, posAfterTagName) + attributesReordered + src.substring(endPos);
      }

      res += getPadding() + src.slice(start, pos) + '\n';

      if (!isClosing && !isSelfClosing && !isVoid && !isComment) {
        depth++;
      }
    }

    // Consume text content.
    start = pos;
    while (src.charAt(pos) !== '<' && pos < src.length) {
      pos++;
    }

    if (start !== pos) {
      res += getPadding() + src.slice(start, pos) + '\n';
    }
  }

  return res.trim();
}

function reorderAttributes(attributesRaw) {
  const numQuotes = attributesRaw.match(/"/g)?.length || 0;
  if (numQuotes % 2 !== 0) return attributesRaw;

  const matches = [...attributesRaw.matchAll(/([:\w-]+)(="([^"]*)")?/gi)];

  const results = matches
    .map(([_whole, name, equalsQuotedValue, value]) => {
      if (name === 'class' && value) {
        value = value.split(' ').sort().join(' ');
      }
      return name + (equalsQuotedValue ? `="${value}"` : '');
    })
    .sort()
    .join(' ');

  if (results.length !== attributesRaw.length) {
    throw new Error('HTML auto-formatting failed due to unexpected whitespaces');
  }

  return results;
}
