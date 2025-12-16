/*
  publications.js
  - Loads publications.bib
  - Parses a practical subset of BibTeX (sufficient for common .bib exports)
  - Renders a reverse-chronological publications list

  Notes:
  - This is intentionally dependency-free (no server, no build step).
  - If your BibTeX uses unusual formatting, tweak parseBibTex() minimally.
*/

(async function initPublications() {
  const statusEl = document.getElementById('pub-status');
  const listEl = document.getElementById('pub-list');

  if (!statusEl || !listEl) return;

  try {
    const res = await fetch('publications.bib', { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`Failed to fetch publications.bib (${res.status})`);
    }
    const bibText = await res.text();

    const entries = parseBibTex(bibText)
      .map(normalizeEntry)
      .sort((a, b) => (b.yearNum - a.yearNum) || (a.title || '').localeCompare(b.title || ''));

    renderPublications(entries, listEl);

    statusEl.textContent = `Loaded ${entries.length} publication${entries.length === 1 ? '' : 's'} from publications.bib`;
  } catch (err) {
    statusEl.textContent = 'Could not load publications.bib - see console for details.';
    // eslint-disable-next-line no-console
    console.error(err);
  }
})();

function parseBibTex(input) {
  const text = (input || '').replace(/\r\n/g, '\n');
  const entries = [];

  // Remove comments (lines starting with %)
  const noComments = text
    .split('\n')
    .filter((line) => !/^\s*%/.test(line))
    .join('\n');

  // Find all @type{key, ...}
  let i = 0;
  while (i < noComments.length) {
    const at = noComments.indexOf('@', i);
    if (at === -1) break;

    // Read entry type
    const brace = noComments.indexOf('{', at);
    if (brace === -1) break;

    const type = noComments.slice(at + 1, brace).trim().toLowerCase();

    // Find matching closing brace for this entry
    const { block, endIndex } = readBalancedBraces(noComments, brace);
    if (!block) break;

    // block includes outer braces: {key, fields...}
    const inner = block.slice(1, -1).trim();
    const commaIdx = inner.indexOf(',');
    const key = (commaIdx === -1 ? inner : inner.slice(0, commaIdx)).trim();
    const fieldsText = commaIdx === -1 ? '' : inner.slice(commaIdx + 1);

    const fields = parseFields(fieldsText);

    entries.push({ type, key, fields });
    i = endIndex;
  }

  return entries;
}

function readBalancedBraces(text, openBraceIndex) {
  let depth = 0;
  for (let j = openBraceIndex; j < text.length; j++) {
    const ch = text[j];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;

    if (depth === 0) {
      return { block: text.slice(openBraceIndex, j + 1), endIndex: j + 1 };
    }
  }
  return { block: null, endIndex: text.length };
}

function parseFields(fieldsText) {
  const fields = {};
  let i = 0;

  while (i < fieldsText.length) {
    // Skip whitespace and commas
    while (i < fieldsText.length && /[\s,]/.test(fieldsText[i])) i++;
    if (i >= fieldsText.length) break;

    // Read field name
    const nameMatch = /^[A-Za-z][A-Za-z0-9_\-]*/.exec(fieldsText.slice(i));
    if (!nameMatch) break;
    const name = nameMatch[0].toLowerCase();
    i += nameMatch[0].length;

    // Skip whitespace and equals
    while (i < fieldsText.length && /\s/.test(fieldsText[i])) i++;
    if (fieldsText[i] !== '=') break;
    i++;
    while (i < fieldsText.length && /\s/.test(fieldsText[i])) i++;

    // Read value: { ... } or "..." or bareword
    const ch = fieldsText[i];
    let value = '';

    if (ch === '{') {
      const { block, endIndex } = readBalancedBraces(fieldsText, i);
      value = (block || '').slice(1, -1);
      i = endIndex;
    } else if (ch === '"') {
      i++; // skip opening quote
      const start = i;
      while (i < fieldsText.length && fieldsText[i] !== '"') i++;
      value = fieldsText.slice(start, i);
      i++; // skip closing quote
    } else {
      const start = i;
      while (i < fieldsText.length && !/[\s,]/.test(fieldsText[i])) i++;
      value = fieldsText.slice(start, i);
    }

    fields[name] = cleanupValue(value);
  }

  return fields;
}

function cleanupValue(v) {
  if (!v) return '';
  // Collapse whitespace, preserve basic punctuation.
  return v
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:])/g, '$1')
    .trim();
}

function normalizeEntry(e) {
  const f = e.fields || {};

  const yearRaw = f.year || '';
  const yearNum = Number(String(yearRaw).replace(/[^0-9]/g, '')) || 0;

  return {
    type: e.type,
    key: e.key,
    title: f.title || '',
    author: f.author || '',
    venue:
      f.journal ||
      f.booktitle ||
      f.school ||
      f.institution ||
      f.publisher ||
      '',
    year: yearRaw,
    yearNum,
    pages: f.pages || '',
    doi: f.doi || '',
    url: f.url || '',
    keywords: f.keywords || '',
  };
}

function formatAuthors(authorField) {
  if (!authorField) return '';
  const authors = authorField.split(/\s+and\s+/i).map((a) => a.trim()).filter(Boolean);

  // Convert "Last, First" to "First Last" when possible.
  const pretty = authors.map((a) => {
    const parts = a.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const last = parts[0];
      const first = parts.slice(1).join(' ');
      return `${first} ${last}`.trim();
    }
    return a;
  });

  return pretty.join(', ');
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderPublications(entries, listEl) {
  if (!entries.length) {
    listEl.innerHTML = '<p>No publications found in publications.bib.</p>';
    return;
  }

  const items = entries.map((p) => {
    const authors = escapeHtml(formatAuthors(p.author));
    const title = escapeHtml(p.title);
    const venue = escapeHtml(p.venue);
    const year = escapeHtml(p.year);

    const links = [];
    if (p.url) links.push(`<a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">Paper</a>`);
    if (p.doi) links.push(`<a href="https://doi.org/${escapeHtml(p.doi)}" target="_blank" rel="noopener">DOI</a>`);

    const linksHtml = links.length ? ` <span class="pub-links">[${links.join(' | ')}]</span>` : '';

    const detailBits = [];
    if (venue) detailBits.push(venue);
    if (year) detailBits.push(year);
    if (p.pages) detailBits.push(escapeHtml(p.pages));

    const details = detailBits.join(' - ');

    return `
      <li class="pub-item">
        <div class="pub-title"><strong>${title}</strong>${linksHtml}</div>
        <div class="pub-authors">${authors}</div>
        <div class="pub-venue">${details}</div>
      </li>
    `;
  });

  listEl.innerHTML = `<ol class="pub-ol">${items.join('')}</ol>`;
}
