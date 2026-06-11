/**
 * PasturePal build script
 * Compiles the JSX in PasturePal.html to plain JavaScript so mobile devices
 * don't need to run Babel in the browser.
 * Run: node build.js
 */

const fs   = require('fs');
const path = require('path');
const babel = require('@babel/core');

const SRC = path.join(__dirname, 'PasturePal.html');
let html = fs.readFileSync(SRC, 'utf8');

// ── Find the <script type="text/babel"> block ──────────────────────────────
const OPEN_TAG  = '<script type="text/babel">';
const CLOSE_TAG = '</script>';

const blockStart = html.indexOf(OPEN_TAG);
if (blockStart === -1) {
  console.log('ℹ️  No <script type="text/babel"> found — nothing to compile.');
  process.exit(0);
}

const contentStart = blockStart + OPEN_TAG.length;
const closeIdx     = html.indexOf(CLOSE_TAG, contentStart);
if (closeIdx === -1) {
  console.error('❌  Could not find closing </script> for text/babel block.');
  process.exit(1);
}
const blockEnd  = closeIdx + CLOSE_TAG.length;
const jsxSource = html.slice(contentStart, closeIdx);

console.log(`📦  Compiling ${Math.round(jsxSource.length / 1024)}KB of JSX…`);

// ── Compile JSX → ES5 ──────────────────────────────────────────────────────
let compiled;
try {
  const result = babel.transformSync(jsxSource, {
    presets: [
      ['@babel/preset-env', {
        targets: { browsers: ['> 0.5%', 'last 2 versions', 'iOS >= 13'] },
        modules: false
      }],
      ['@babel/preset-react', { runtime: 'classic' }]
    ],
    compact: false,
    comments: false
  });
  compiled = result.code;
} catch (err) {
  console.error('❌  Babel compile error:\n', err.message);
  process.exit(1);
}

console.log(`✅  Compiled to ${Math.round(compiled.length / 1024)}KB of plain JS`);

// ── Rebuild the HTML ───────────────────────────────────────────────────────
// Replace the text/babel block with a regular script block
let output = html.slice(0, blockStart)
  + '<script>\n'
  + compiled
  + '\n</script>'
  + html.slice(blockEnd);

// Remove the Babel standalone CDN tag — no longer needed
output = output.replace(
  /[ \t]*<script src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"><\/script>\n?/,
  ''
);

fs.writeFileSync(SRC, output);
console.log('🚀  PasturePal.html updated — Babel standalone removed, phone-ready!');
