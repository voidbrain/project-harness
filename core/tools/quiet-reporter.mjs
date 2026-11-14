// A quiet reporter for `node --test`: each failure in full (name, location, error, and what its test file printed),
// then one line of totals. Passing tests print nothing. Pair it with the spec reporter writing the complete report to
// an ignored file, so nothing is lost:
//   node --test --test-reporter=./tools/quiet-reporter.mjs --test-reporter-destination=stdout \
//     --test-reporter=spec --test-reporter-destination=.test-report.txt
import { relative, resolve } from 'node:path';
import { inspect } from 'node:util';

// Events name a file absolute (test:fail) or relative to the working directory (test:stdout): print it relative.
const where = (file) => (file ? relative(process.cwd(), resolve(file)) || file : '');
// Stack frames inside Node itself say nothing about the failure.
const INTERNAL = /^\s+at .*(\(node:|\bnode:internal|<anonymous>\)$|^\s+at (new )?(Safe)?Promise|Array\.map)/;
const COUNTS = ['tests', 'suites', 'pass', 'fail', 'cancelled', 'skipped', 'todo', 'duration_ms'];

export default async function* quietReporter(source) {
  const output = new Map(); // file -> lines it printed (stdout and stderr), shown only when that file has a failure
  const failures = [];
  const totals = {};
  for await (const { type, data } of source) {
    if (type === 'test:stdout' || type === 'test:stderr') {
      const key = where(data.file);
      output.set(key, (output.get(key) ?? '') + data.message);
    } else if (type === 'test:fail') {
      const error = data.details?.error;
      // a suite or parent test fails because a subtest did: the subtest is reported on its own
      if (error?.failureType === 'subtestsFailed') continue;
      failures.push(data);
    } else if (type === 'test:diagnostic' && data.nesting === 0) {
      const [key, value] = data.message.split(' ');
      if (COUNTS.includes(key)) totals[key] = value;
    }
  }
  const files = new Set();
  for (const f of failures) {
    const error = f.details?.error;
    const file = where(f.file);
    const at = file ? ` (${file}${f.line ? `:${f.line}` : ''})` : '';
    const text = inspect(error?.cause ?? error, { depth: 4 })
      .split('\n')
      .filter((l) => !INTERNAL.test(l) && !/^\s+at node:/.test(l))
      .join('\n');
    yield `✖ ${f.name}${at}\n${indent(text)}\n\n`;
    if (file) files.add(file);
  }
  for (const file of files)
    if (output.get(file)?.trim()) yield `Output of ${file}:\n${indent(output.get(file).trimEnd())}\n\n`;
  if (failures.length && output.get('')?.trim()) yield `Other output:\n${indent(output.get('').trimEnd())}\n\n`;
  const line = COUNTS.filter((k) => totals[k] !== undefined && (totals[k] !== '0' || k === 'fail'))
    .map((k) => (k === 'duration_ms' ? `${Math.round(Number(totals[k]))} ms` : `${k} ${totals[k]}`))
    .join(', ');
  yield `${failures.length ? '✖' : '✔'} ${line || `fail ${failures.length}`}\n`;
}

const indent = (text) =>
  String(text)
    .split('\n')
    .map((l) => `  ${l}`)
    .join('\n');
