import {test} from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,cpSync,readFileSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync,spawnSync} from 'node:child_process';
import {archiveRecap,closureRecords,stripArchiveRecap,run} from '../core/tools/archive-recap.mjs';
const record=(id,date)=>`### ${id}\n\n**Preserved historical text**\n\n**Resolution:** Closed ${date}.\n\n---\n`;
test('Monday–Sunday closure counts, cross-year weeks, stable section anchors and idempotence',()=>{
 const text='# Archive\n\nHistory.\n\n## Closed 2026-11-01\n\n'+record('F-001','2026-11-01')+'\n## Closed 2026-11-02\n\n'+record('B-001','2026-11-02')+'\n## Closed 2027-01-01\n\n'+record('F-002','2027-01-01');
 const out=archiveRecap(text);assert.equal(archiveRecap(out),out);assert.ok(out.includes('[2026-10-26 – 2026-11-01](#archive-week-2026-10-26) | 1 | 0'));
 assert.ok(out.includes('[2026-11-02 – 2026-11-08](#archive-week-2026-11-02) | 0 | 1'));assert.ok(out.includes('2026-12-28 – 2027-01-03'));
 assert.ok(out.includes('<a id="archive-week-2026-11-02"></a>\n## Closed 2026-11-02'));assert.equal(closureRecords(out).length,3);
 for(const line of text.split('\n'))if(line.trim())assert.ok(out.includes(line));
 assert.throws(()=>stripArchiveRecap(out.replace('| 1 | 0','| 9 | 0')),/stale/);
 assert.throws(()=>stripArchiveRecap(out.replace('## Weekly closure recaps','### F-999\nsecret history')),/stale/);
 assert.throws(()=>archiveRecap(record('F-001','2026-02-30')),/Invalid/);
});
test('preflight rejects unsafe outputs and malformed flags without partial writes',t=>{
 const dir=mkdtempSync(join(tmpdir(),'archive recap '));t.after(()=>rmSync(dir,{recursive:true,force:true}));mkdirSync(join(dir,'docs/archive'),{recursive:true});
 const path=join(dir,'docs/archive/backlog-2026.md');const text='# Archive\n\n'+record('F-001','2026-11-02');writeFileSync(path,text);
 assert.throws(()=>run(dir,['--unknown']),/Use/);assert.throws(()=>run(dir,['--check','--check']),/Use/);
 const external=join(dir,'other.md');writeFileSync(external,text);symlinkSync(external,join(dir,'docs/archive/backlog-2027.md'));
 assert.throws(()=>run(dir,[]),/symlink/);assert.equal(readFileSync(path,'utf8'),text);
});
test('check-backlog permits recomputed indices but rejects stale summaries and changed historical records',t=>{
 const dir=mkdtempSync(join(tmpdir(),'archive history '));t.after(()=>rmSync(dir,{recursive:true,force:true}));mkdirSync(join(dir,'docs/archive'),{recursive:true});mkdirSync(join(dir,'tools'));
 for(const tool of ['check-backlog.mjs','archive-recap.mjs'])cpSync(new URL('../core/tools/'+tool,import.meta.url),join(dir,'tools',tool));
 const env={...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1',GIT_AUTHOR_NAME:'test',GIT_AUTHOR_EMAIL:'test@example.com',GIT_COMMITTER_NAME:'test',GIT_COMMITTER_EMAIL:'test@example.com'};delete env.GITHUB_REF;delete env.PR_NUMBER;
 const git=(...args)=>execFileSync('git',args,{cwd:dir,env,stdio:'pipe'});git('init','-b','main');
 writeFileSync(join(dir,'docs/BACKLOG.md'),'# Backlog\n');const path=join(dir,'docs/archive/backlog-2026.md');writeFileSync(path,archiveRecap('# Archive\n\n'+record('F-001','2026-11-02')));
 git('add','.');git('commit','-m','baseline');git('update-ref','refs/remotes/origin/main','HEAD');git('symbolic-ref','refs/remotes/origin/HEAD','refs/remotes/origin/main');
 const check=()=>spawnSync(process.execPath,['tools/check-backlog.mjs'],{cwd:dir,env,encoding:'utf8'});
 writeFileSync(path,readFileSync(path,'utf8')+'\n'+record('B-001','2026-11-03'));assert.notEqual(check().status,0,'stale summary fails');run(dir,[]);assert.equal(check().status,0);
 writeFileSync(path,readFileSync(path,'utf8').replaceAll('Preserved historical text','Altered history'));run(dir,[]);assert.notEqual(check().status,0,'regenerating a correct summary never approves history edits');
});
