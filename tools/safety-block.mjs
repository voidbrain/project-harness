// This repository's own AGENTS.md says its safety block is core/AGENTS.md's (B-128): every line of the core block,
// word for word and in order, and nothing else but lines marked <!-- project -->. check:template runs it.
import { START, END } from '../core/tools/check-rules.mjs';

const block = (text) => {
  const from = text.indexOf(START),
    to = text.indexOf(END);
  return from < 0 || to < from
    ? null
    : text
        .slice(from + START.length, to)
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
};

const cut = (line) => (line.length > 90 ? `${line.slice(0, 90)}…` : line);

export function safetyBlockDrift(own, core, ownPath = 'AGENTS.md') {
  const mine = block(own),
    theirs = block(core);
  if (!mine || !theirs) return [`${ownPath} or core/AGENTS.md has no safety block`];
  const problems = [];
  let at = 0;
  for (const line of theirs) {
    const found = mine.indexOf(line, at);
    if (found < 0) problems.push(`${ownPath}: the safety block lacks core/AGENTS.md's line "${cut(line)}"`);
    else at = found + 1;
  }
  for (const line of mine)
    if (!theirs.includes(line) && !line.endsWith('<!-- project -->'))
      problems.push(`${ownPath}: safety line not in core/AGENTS.md and not marked <!-- project -->: "${cut(line)}"`);
  return problems;
}
