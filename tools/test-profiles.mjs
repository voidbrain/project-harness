// Self-contained MCP/solution contract fixtures; no real consumers, accounts, network or desktop applications.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
const source = fileURLToPath(new URL('../core/tools/',import.meta.url));
const env = {...process.env,GIT_CONFIG_GLOBAL:'/dev/null',GIT_CONFIG_NOSYSTEM:'1',GIT_AUTHOR_NAME:'fixture',GIT_AUTHOR_EMAIL:'fixture@example.com',GIT_COMMITTER_NAME:'fixture',GIT_COMMITTER_EMAIL:'fixture@example.com'};
const write = (file,value) => {mkdirSync(dirname(file),{recursive:true});writeFileSync(file,typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');};
const temp = t => {const dir=mkdtempSync(join(tmpdir(),'harness profiles '));t.after(()=>rmSync(dir,{recursive:true,force:true}));return dir;};
const git = (dir,...args) => execFileSync('git',['-C',dir,...args],{env,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const commit = dir => {git(dir,'add','.');git(dir,'commit','-qm','fixture');return git(dir,'rev-parse','HEAD');};
const install = dir => {mkdirSync(join(dir,'tools'),{recursive:true});for(const f of ['mcp.mjs','mcp-catalog.json','solution.mjs'])cpSync(join(source,f),join(dir,'tools',f));};
const run = (dir,tool,args=[],preload) => {const r=spawnSync(process.execPath,[...(preload?['--import',preload]:[]),join(dir,'tools',tool),...args],{cwd:dir,env,encoding:'utf8'});return {code:r.status,out:r.stdout,err:r.stderr};};
const selection = (id,extra={}) => ({schemaVersion:1,recommendations:[{id,reason:'Needed for fixture workflow',lastChecked:'2026-10-31',required:false,...extra}]});
const record = (id,{status='Open',complete='~20%',links='',title='Fixture workflow',human='No'}={}) => `### ${id}\n\n**${title}**\n\n| Signal | Priority | Status | Effort | Complete |\n|---|---|---|---|---|\n| ${{Open:'🔴',Closed:'🔵',Implemented:'🟡'}[status]} | 🔶 P2 | ${status} | 🟡 Medium | ${complete} |\n\n${human==='Yes'?'🧑':'💻'} **→ Human action required: ${human}**<br />A fixture next step.\n\n| | |\n|---|---|\n| **Issue** | A fixture. |\n| **Reproduce** | Read fixture. |\n| **Check** | Observe fixture. |\n\n<details>\n<summary>History</summary>\n\n**Next action / closure evidence:** A scoped fixture action.\n\n**Estimates:** Fixture estimate, 2026-10-31.\n\n| Field | Value |\n|---|---|\n| PR / evidence | Fixture |\n| Opened | 2026-10-31 |\n| Verification | Pending |\n| Reviewed | 2026-10-31 |\n${links?`| Components | ${links} |\n`:''}\n</details>\n\n---\n`;
function solution(t,componentRecord=record('F-001')) {
 const parent=temp(t),home=join(parent,'coordination'),component=join(parent,'component');
 for(const [dir,name] of [[home,'coordination'],[component,'component']]){mkdirSync(dir);git(dir,'init','-qb','main');git(dir,'remote','add','origin',`https://github.com/fixture/${name}.git`);}
 install(home);
 const manifest={schemaVersion:1,name:'Fixture solution',repository:'fixture/coordination',ref:'main',repositories:[{id:'component',repository:'fixture/component',path:'../component',ref:'main',backlog:'docs/BACKLOG.md'}]};
 write(join(home,'.harness.json'),{stacks:['core','solution'],solution:{role:'coordinator',manifest:'.solution.json'}});
 write(join(home,'.solution.json'),manifest);write(join(home,'docs/BACKLOG.md'),'# Backlog\n\n'+record('F-001',{links:'component:F-001',complete:'~70%',human:'Yes'}));
 write(join(component,'docs/BACKLOG.md'),'# Backlog\n\n'+componentRecord);const sha=commit(component);commit(home);
 return {home,component,manifest,sha};
}
test('optional helpers leave an unconfigured single project unchanged',t=>{
 const d=temp(t);install(d);write(join(d,'.harness.json'),{});
 assert.equal(run(d,'mcp.mjs',['check']).code,0);assert.equal(run(d,'solution.mjs',['check']).code,0);
 assert.equal(run(d,'mcp.mjs',['recommend']).code,0);
});
test('MCP recommendations detect stack signals, retain reasons and never imply a live connection',t=>{
 const d=temp(t);install(d);write(join(d,'package.json'),{dependencies:{'@angular/core':'22.2.0'},devDependencies:{'@playwright/test':'1.64.1'}});
 const r=run(d,'mcp.mjs',['recommend','--offline']);assert.equal(r.code,0);assert.match(r.out,/angular: Angular workspace/);assert.match(r.out,/playwright:/);assert.match(r.out,/connection unverified/);assert.match(r.out,/cached guidance/);
});
test('MCP metadata rejects unknown IDs, missing reason/date, ranges and credential-bearing endpoints',t=>{
 const d=temp(t);install(d);
 for(const config of [selection('unknown'),selection('angular',{reason:''}),selection('angular',{lastChecked:'yesterday'}),selection('angular',{version:'latest'}),selection('github',{endpoint:'https://user:password@example.com/mcp'}),selection('github',{endpoint:'https://example.com/mcp?token=secret'}),selection('github',{endpoint:'http://example.com/mcp'}),selection('angular',{command:'untrusted'})]){
  write(join(d,'.harness.json'),{integrations:config});assert.notEqual(run(d,'mcp.mjs',['check']).code,0);
 }
 write(join(d,'.harness.json'),{integrations:selection('angular')});assert.equal(run(d,'mcp.mjs',['check']).code,0);
});
test('MCP config emits client-specific snippets and exact versions without changing files',t=>{
 const d=temp(t);install(d);write(join(d,'.harness.json'),{integrations:selection('github')});const before=readFileSync(join(d,'.harness.json'),'utf8');
 for(const client of ['claude-code','gemini','cline','vscode','codex']){
  const r=run(d,'mcp.mjs',['config','--server=github',`--client=${client}`]);assert.equal(r.code,0,r.err);assert.match(r.err,/Not installed or connected/);
  if(client==='codex')assert.match(r.out,/\[mcp_servers.github\]/);else {const entry=JSON.parse(r.out)[client==='vscode'?'servers':'mcpServers'].github;assert(entry);if(client==='gemini')assert.equal(entry.httpUrl,'https://api.githubcopilot.com/mcp/');else assert.equal(entry.url,'https://api.githubcopilot.com/mcp/');}
 }
 assert.equal(readFileSync(join(d,'.harness.json'),'utf8'),before);
 assert.notEqual(run(d,'mcp.mjs',['config','--server=github','--client=codex','--offline']).code,0);
 write(join(d,'.harness.json'),{integrations:selection('playwright')});assert.notEqual(run(d,'mcp.mjs',['config','--server=playwright','--client=cline']).code,0);
 write(join(d,'.harness.json'),{integrations:selection('playwright',{version:'1.2.3'})});const r=run(d,'mcp.mjs',['config','--server=playwright','--client=cline']);assert.match(r.out,/@playwright\/mcp@1.2.3/);assert.notEqual(run(d,'mcp.mjs',['config','--server=playwright','--client=cline','--offline']).code,0);
});
test('Angular snippets require locked workspace installation and support local-only mode',t=>{
 const d=temp(t);install(d);write(join(d,'.harness.json'),{integrations:selection('angular')});
 assert.notEqual(run(d,'mcp.mjs',['config','--server=angular','--client=vscode']).code,0);
 write(join(d,'node_modules/@angular/cli/bin/ng.js'),'// not executed');write(join(d,'node_modules/@angular/cli/package.json'),{version:'22.2.0'});
 const r=run(d,'mcp.mjs',['config','--server=angular','--client=vscode','--offline']);assert.equal(r.code,0,r.err);assert.match(r.out,/--read-only/);assert.match(r.out,/--local-only/);
});
test('explicit registry search uses current name-search metadata, never auto-selects it, and has offline fallback',t=>{
 const d=temp(t);install(d);const mock=join(d,'mock.mjs');write(mock,`globalThis.fetch=async url=>{if(!url.includes('version=latest&search=angular'))throw Error('wrong registry query');return new Response(JSON.stringify({servers:[{server:{name:'fixture/angular',version:'1.0.0',description:'fixture'}}],metadata:{nextCursor:'more'}}));};`);
 const r=run(d,'mcp.mjs',['search','--query=angular'],mock);assert.equal(r.code,0,r.err);assert.match(r.out,/Live registry snapshot/);assert.match(r.out,/fixture\/angular/);assert.match(r.out,/not an exhaustive catalogue/);
 assert.notEqual(run(d,'mcp.mjs',['search','--query=ab'],mock).code,0);assert.notEqual(run(d,'mcp.mjs',['search','--query=angular','--offline'],mock).code,0);
});
test('dashboard separates integration status from component status without averaging or modifying backlogs',t=>{
 const {home,component,sha}=solution(t);const before=readFileSync(join(component,'docs/BACKLOG.md'),'utf8');
 const r=run(home,'solution.mjs',['dashboard','--write']);assert.equal(r.code,0,r.err);
 const out=readFileSync(join(home,'docs/SOLUTION-DASHBOARD.md'),'utf8');assert.match(out,/Snapshot:/);assert.match(out,new RegExp(sha.slice(0,12)));assert.match(out,/solution:F-001/);assert.match(out,/component:F-001/);assert.match(out,/~70%/);assert.match(out,/~20%/);assert.match(out,/no combined completion percentage/);assert.equal(readFileSync(join(component,'docs/BACKLOG.md'),'utf8'),before);
});
test('missing, wrong-origin and mismatched-ref sources remain Unknown and fail visibly',t=>{
 const {home,component,manifest}=solution(t);
 manifest.repositories[0].path='../missing';write(join(home,'.solution.json'),manifest);let r=run(home,'solution.mjs',['dashboard','--write']);assert.notEqual(r.code,0);assert.match(readFileSync(join(home,'docs/SOLUTION-DASHBOARD.md'),'utf8'),/Unavailable — status unknown/);
 manifest.repositories[0].path='../component';write(join(home,'.solution.json'),manifest);git(component,'remote','set-url','origin','https://github.com/fixture/wrong.git');assert.notEqual(run(home,'solution.mjs',['check']).code,0);
 git(component,'remote','set-url','origin','https://github.com/fixture/component.git');manifest.repositories[0].ref='missing-ref';write(join(home,'.solution.json'),manifest);r=run(home,'solution.mjs',['check']);assert.notEqual(r.code,0);assert.match(r.err,/HEAD differs/);
});
test('qualified references reject unknown repositories, duplicate IDs and missing records',t=>{
 const {home}=solution(t);
 for(const refs of ['unknown:F-001','component:F-999','component:F-001, component:F-001']){write(join(home,'docs/BACKLOG.md'),record('F-001',{links:refs}));assert.notEqual(run(home,'solution.mjs',['check']).code,0);}
});
test('archives resolve closed links while a reopened active record takes precedence',t=>{
 const {home,component,manifest}=solution(t);
 manifest.repositories[0].archives=['docs/archive/closed.md'];write(join(home,'.solution.json'),manifest);
 write(join(component,'docs/archive/closed.md'),record('F-001',{status:'Closed',complete:'~100%'}));write(join(component,'docs/BACKLOG.md'),'# Empty\n');commit(component);
 let r=run(home,'solution.mjs',['dashboard']);assert.equal(r.code,0,r.err);assert.match(r.out,/component:F-001.*closed.md/);assert.match(r.out,/Closed/);
 write(join(component,'docs/BACKLOG.md'),record('F-001',{title:'Reopened workflow'}));commit(component);r=run(home,'solution.mjs',['dashboard']);assert.equal(r.code,0,r.err);assert.match(r.out,/Reopened workflow/);assert.doesNotMatch(r.out,/\| Closed \|/);
});
test('dashboard preserves older ID/Item summaries and rejects unsupported table-only ledgers',t=>{
 const legacy='### F-001\n\n| Signal | ID | Priority | Status | Item |\n|---|---|---|---|---|\n| 🔴 | F-001 | 🔶 P2 | Open | Older workflow |\n\n---\n';
 const {home,component}=solution(t,legacy);let r=run(home,'solution.mjs',['dashboard']);assert.equal(r.code,0,r.err);assert.match(r.out,/Older workflow/);assert.match(r.out,/Unknown/);
 write(join(component,'docs/BACKLOG.md'),'| Signal | ID | Item |\n|---|---|---|\n| 🔴 | F-001 | Unsupported |\n');commit(component);r=run(home,'solution.mjs',['check']);assert.notEqual(r.code,0);assert.match(r.err,/unsupported record headings|no supported record headings/);
});
test('dashboard refuses traversal, symlink escape, source overwrite and replacing hand-written files',t=>{
 const {home,manifest}=solution(t);
 for(const target of ['../escape.md','docs/BACKLOG.md','.solution.json']){manifest.dashboard=target;write(join(home,'.solution.json'),manifest);assert.notEqual(run(home,'solution.mjs',['dashboard','--write']).code,0);}
 manifest.dashboard='docs/manual.md';write(join(home,'.solution.json'),manifest);write(join(home,'docs/manual.md'),'Human notes');assert.notEqual(run(home,'solution.mjs',['dashboard','--write']).code,0);assert.equal(readFileSync(join(home,'docs/manual.md'),'utf8'),'Human notes');
 const outside=temp(t);symlinkSync(outside,join(home,'escape'));manifest.dashboard='escape/report.md';write(join(home,'.solution.json'),manifest);assert.notEqual(run(home,'solution.mjs',['dashboard','--write']).code,0);
});
test('remote component snapshots resolve the ref once then read exact SHA; authorization failures stay unknown',t=>{
 const {home,sha}=solution(t);const mock=join(home,'mock.mjs');const content=Buffer.from('# Backlog\n'+record('F-001')).toString('base64');
 write(mock,`globalThis.fetch=async url=>{if(url.endsWith('/commits/main'))return new Response(JSON.stringify({sha:'${sha}'}));if(url.includes('/contents/docs/BACKLOG.md?ref=${sha}'))return new Response(JSON.stringify({encoding:'base64',content:'${content}'}));throw Error('unpinned or unexpected request');};`);
 let r=run(home,'solution.mjs',['dashboard','--remote'],mock);assert.equal(r.code,0,r.err);assert.match(r.out,/; GitHub/);
 write(mock,"globalThis.fetch=async()=>new Response('{}',{status:403});");r=run(home,'solution.mjs',['dashboard','--remote'],mock);assert.notEqual(r.code,0);assert.match(r.out,/Unknown/);assert.match(r.err,/HTTP 403/);
});

test('solution MCP selections inherit with explicit project overrides and missing context stays usable',t=>{
 const d=temp(t);install(d);write(join(d,'.solution.json'),{integrations:selection('github')});write(join(d,'.harness.json'),{solution:{role:'component',manifest:'.solution.json'},integrations:selection('github',{disabled:true})});
 let r=run(d,'mcp.mjs',['recommend']);assert.equal(r.code,0,r.err);assert.match(r.out,/selected by project \(disabled\)/);assert.notEqual(run(d,'mcp.mjs',['config','--server=github','--client=codex']).code,0);
 write(join(d,'.harness.json'),{solution:{role:'component',manifest:'.solution.json'}});r=run(d,'mcp.mjs',['recommend']);assert.match(r.out,/selected by solution/);
 write(join(d,'.harness.json'),{solution:{role:'component',manifest:'missing.json'},integrations:selection('angular')});r=run(d,'mcp.mjs',['check']);assert.equal(r.code,0,r.err);assert.match(r.err,/Inherited recommendations are unknown/);
});
test('dirty snapshots use working-copy links and a component cannot write the solution dashboard',t=>{
 const {home,component}=solution(t);write(join(component,'docs/BACKLOG.md'),record('F-001',{title:'Uncommitted change'}));let r=run(home,'solution.mjs',['dashboard']);assert.equal(r.code,0,r.err);assert.match(r.out,/Local changes/);assert.match(r.out,/component:F-001\]\(.*component\/docs\/BACKLOG.md/);
 write(join(home,'.harness.json'),{solution:{role:'component',id:'component',manifest:'.solution.json'}});r=run(home,'solution.mjs',['dashboard','--write']);assert.notEqual(r.code,0);assert.match(r.err,/Only the coordinator/);
});

test('coordinator feature branches work, spoofed GitHub origins do not',t=>{
 const {home,component}=solution(t);git(home,'switch','-qc','feature/coordination');write(join(home,'docs/CONTRACT.md'),'New contract');commit(home);assert.equal(run(home,'solution.mjs',['check']).code,0);
 git(component,'remote','set-url','origin','https://evilgithub.com/fixture/component.git');const r=run(home,'solution.mjs',['check']);assert.notEqual(r.code,0);assert.match(r.err,/origin does not match/);
});
