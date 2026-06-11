/**
 * PasturePal build script
 * Compiles the JSX in PasturePal.html to plain JS so no browser-side Babel is needed.
 */

const fs   = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'PasturePal.html');

if (!fs.existsSync(SRC)) {
  console.error('ERROR: PasturePal.html not found at', SRC);
  process.exit(1);
}

let html = fs.readFileSync(SRC, 'utf8');
console.log('Read PasturePal.html:', Math.round(html.length / 1024) + 'KB');

// ── Find <script type="text/babel"> block ─────────────────────────────────
const OPEN_TAG = '<script type="text/babel">';
const blockStart = html.indexOf(OPEN_TAG);

if (blockStart === -1) {
  console.log('No <script type="text/babel"> found — already compiled, skipping.');
  process.exit(0);
}

const contentStart = blockStart + OPEN_TAG.length;
const closeIdx = html.indexOf('</script>', contentStart);
if (closeIdx === -1) {
  console.error('ERROR: Could not find closing </script>');
  process.exit(1);
}

const jsxSource = html.slice(contentStart, closeIdx);
console.log('Found JSX block:', Math.round(jsxSource.length / 1024) + 'KB — compiling...');

// ── Compile with Babel ────────────────────────────────────────────────────
let babel;
try {
  babel = require('@babel/core');
} catch (e) {
  console.error('ERROR: @babel/core not found. Did npm install succeed?', e.message);
  process.exit(1);
}

let compiled;
try {
  // Only transform JSX syntax — modern iOS/Android support ES6+ natively
  const result = babel.transformSync(jsxSource, {
    presets: [['@babel/preset-react']]
  });
  compiled = result.code;
} catch (err) {
  console.error('ERROR: Babel compile failed:\n', err.message);
  process.exit(1);
}

console.log('Compiled to:', Math.round(compiled.length / 1024) + 'KB');

// ── Write compiled HTML ───────────────────────────────────────────────────
// Wrap in IIFE so top-level `const supabase` doesn't shadow window.supabase
// (strict-mode top-level const cannot shadow a non-configurable global property)
const blockEnd = closeIdx + '</script>'.length;
let output = html.slice(0, blockStart)
  + '<script>\n(function(){\n' + compiled + '\n})();\n</script>'
  + html.slice(blockEnd);

// Remove Babel standalone CDN tag — no longer needed after compilation
output = output.replace(
  /[ \t]*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"><\/script>\n?/,
  ''
);

fs.writeFileSync(SRC, output);
console.log('SUCCESS: PasturePal.html compiled and saved.');
