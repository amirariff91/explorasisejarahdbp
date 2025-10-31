// Basic sanity tests for the Johor crossword puzzle definition.
// Uses Node's built-in test runner so we can avoid pulling extra test frameworks.

const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert');

const puzzleSourcePath = resolve(
  process.cwd(),
  'data/crosswords/johor-crossword.ts'
);

const source = readFileSync(puzzleSourcePath, 'utf8');

test('Johor crossword clues include MENEGAK entries', () => {
  assert.match(source, /MENEGAK/);
  assert.match(source, /Negeri bergabung dengan Sabah/);
  assert.match(source, /Undang-undang tertinggi negara/);
  assert.match(source, /Proses perbincangan antara dua pihak/);
});

test('Johor crossword clues include MENDATAR entries', () => {
  assert.match(source, /MENDATAR/);
  assert.match(source, /Negara yang ditubuhkan pada 16 September 1963/);
  assert.match(source, /Keluar daripada Malaysia pada tahun 1965/);
  assert.match(source, /Kebebasan sesebuah negara daripada kuasa asing/);
});

test('Johor crossword lists all required words', () => {
  ['KEMERDEKAAN', 'MALAYSIA', 'SINGAPURA', 'SARAWAK', 'PERLEMBAGAAN', 'RUNDINGAN'].forEach(
    (answer) => {
      assert.match(
        source,
        new RegExp(`answer:\\s*'${answer}'`),
        `Expected to find answer ${answer}`
      );
    }
  );
});

test('Johor crossword grid size provides at least 12 rows and 12 columns', () => {
  const gridSizeMatch = source.match(/gridSize:\s*\{\s*rows:\s*(\d+),\s*cols:\s*(\d+)/);
  assert.ok(gridSizeMatch, 'Expected gridSize declaration');

  const rows = Number(gridSizeMatch[1]);
  const cols = Number(gridSizeMatch[2]);

  assert.ok(rows >= 12, `Expected at least 12 rows but received ${rows}`);
  assert.ok(cols >= 12, `Expected at least 12 columns but received ${cols}`);
});

