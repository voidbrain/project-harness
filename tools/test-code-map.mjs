// F-077-T06: the code map lists each export with its line range; invented sources only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapFile } from '../core/tools/code-map.mjs';

const SOURCE = `import { a } from './a';

/** Adds two numbers. */
export function add(x: number, y: number) {
  return x + y;
}

// the next export's comment is not part of add
export const shelf = {
  books: 3,
};
export interface Book {
  title: string;
}
export type Id = string;
const hidden = 1;
export default class Library {
  shelves = [];
}
export const PROBE = \`first
second line at column 0
}\`;
export { hidden, a as alias };
export * from './more';
export async function* pages() {
  yield 1;
}
`;

test('code map: each export with its line range, comments and blanks left to their own declaration', () => {
  assert.deepEqual(mapFile(SOURCE), {
    lines: 27,
    entries: [
      { start: 4, end: 6, name: 'function add' },
      { start: 9, end: 11, name: 'const shelf' },
      { start: 12, end: 14, name: 'interface Book' },
      { start: 15, end: 15, name: 'type Id' },
      { start: 17, end: 19, name: 'class Library (default)' },
      { start: 20, end: 22, name: 'const PROBE' },
      { start: 23, end: 23, name: '{ hidden, a as alias }' },
      { start: 24, end: 24, name: '* from ./more' },
      { start: 25, end: 27, name: 'function pages' },
    ],
  });
});

test('code map: the CLI maps configured folders, skips dependencies and declaration files', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'code map '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const d of ['lib/inner', 'lib/node_modules/pkg']) mkdirSync(join(dir, d), { recursive: true });
  writeFileSync(join(dir, '.harness.json'), JSON.stringify({ codeMap: { folders: ['lib'] } }));
  writeFileSync(join(dir, 'lib/inner/shelf.ts'), 'export const size = 1;\n');
  writeFileSync(join(dir, 'lib/types.d.ts'), 'export type T = 1;\n');
  writeFileSync(join(dir, 'lib/node_modules/pkg/index.js'), 'export const dep = 1;\n');
  const tool = fileURLToPath(new URL('../core/tools/code-map.mjs', import.meta.url));
  const r = spawnSync(process.execPath, [tool], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, 'lib/inner/shelf.ts (1 lines)\n  1 const size\n');
  const none = spawnSync(process.execPath, [tool, 'missing'], { cwd: dir, encoding: 'utf8' });
  assert.equal(none.status, 1);
  assert.match(none.stderr, /No source files under missing/);
});

test('code map: decorators, const enums, wrapped export lists and a stray backtick (release review)', () => {
  const source = [
    "import { Component } from '@angular/core';",
    '',
    '@Component({',
    "  selector: 'app-shelf',",
    '})',
    'export class Shelf {',
    '  size = 1;',
    '}',
    'export const enum Mode {',
    '  A,',
    '}',
    'const fence = /`/;',
    'export function after() {',
    '  return 1;',
    '}',
    'export {',
    '  alpha,',
    '  beta,',
    "} from './more';",
    '',
  ].join('\n');
  assert.deepEqual(mapFile(source).entries, [
    { start: 3, end: 8, name: 'class Shelf' },
    { start: 9, end: 11, name: 'const enum Mode' },
    { start: 13, end: 15, name: 'function after' },
    { start: 16, end: 19, name: '{ alpha, beta } from ./more' },
  ]);
});
