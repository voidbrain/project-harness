import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,symlinkSync,copyFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {maintenance} from './maintenance.mjs';
import {friction} from './friction.mjs';
const temp=()=>mkdtempSync(join(tmpdir(),'harness enforcement '));
const put=(root,path,text)=>{mkdirSync(join(root,path,'..'),{recursive:true});writeFileSync(join(root,path),text);};
test('maintenance fails missing/stale/changed evidence and broken outcomes, reports improvement candidates',()=>{
 const root=temp();try{
  put(root,'.harness.json',JSON.stringify({maintenance:{enabled:true,reviewDays:7,requireMeasurement:true,inputs:['AGENTS.md']}}));
  put(root,'AGENTS.md','All rules apply');put(root,'docs/BACKLOG.md','### F-029\n');
  assert.throws(()=>maintenance(root,['check']));
  put(root,'.harness/outcomes.json',JSON.stringify([{kind:'none',disposition:'no-change',evidence:'No duplication found in reviewed rules.'}]));
  assert.throws(()=>maintenance(root,['review','--outcomes=.harness/outcomes.json']),/timed workflow/);
  friction(root,['record','--operation=reconciliation','--duration-ms=10','--conflicts=1']);
  maintenance(root,['review','--outcomes=.harness/outcomes.json']);
  assert.equal(maintenance(root,['check']).candidates[0].kind,'tool');
  put(root,'AGENTS.md','Changed rules');assert.throws(()=>maintenance(root,['check']),/inputs changed/);
  maintenance(root,['review','--outcomes=.harness/outcomes.json']);
  const receipt=join(root,'docs/agents/maintenance-review.json'),row=JSON.parse(readFileSync(receipt));
  row.reviewed='2000-01-01T00:00:00.000Z';writeFileSync(receipt,JSON.stringify(row));assert.throws(()=>maintenance(root,['check']),/stale/);
  put(root,'.harness/outcomes.json',JSON.stringify([{kind:'tool',disposition:'backlog',target:'F-999',evidence:'Missing tool'}]));assert.throws(()=>maintenance(root,['review','--outcomes=.harness/outcomes.json']),/owning active/);
  assert.throws(()=>maintenance(root,['check','--write']));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('maintenance rejects symlinked ancestors and does not overwrite another destination',()=>{
 const root=temp(),outside=temp();try{
  put(root,'.harness.json',JSON.stringify({maintenance:{enabled:true,reviewDays:7,inputs:['AGENTS.md']}}));put(root,'AGENTS.md','rules');
  mkdirSync(join(outside,'agents'));symlinkSync(outside,join(root,'docs'));
  assert.throws(()=>maintenance(root,['review','--outcomes=AGENTS.md']),/escapes/);
 }finally{rmSync(root,{recursive:true,force:true});rmSync(outside,{recursive:true,force:true});}
});
test('opt-in coverage enforcement uses main baseline rather than a lowered PR baseline and fails missing data',()=>{
 const root=temp();try{
  const git=(...args)=>execFileSync('git',['-C',root,...args],{stdio:'pipe'});
  git('init');mkdirSync(join(root,'tools'));copyFileSync(new URL('./coverage-table.mjs',import.meta.url),join(root,'tools/coverage-table.mjs'));
  const metrics=Object.fromEntries(['lines','statements','branches','functions'].map(key=>[key,90]));
  put(root,'docs/agents/coverage.json',JSON.stringify({'src/':metrics,all:metrics}));git('add','.');git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-m','baseline');git('update-ref','refs/remotes/origin/main','HEAD');
  const cfg={coverage:{enforce:true,drop:0,summary:'coverage/summary.json',folders:['src/']}};
  put(root,'.harness.json',JSON.stringify(cfg));
  const measured=Object.fromEntries(['lines','statements','branches','functions'].map(key=>[key,{total:10,covered:8}]));
  put(root,'coverage/summary.json',JSON.stringify({[join(root,'src/a.ts')]:measured}));
  put(root,'docs/agents/coverage.json',JSON.stringify({'src/':{...metrics,lines:0},all:{...metrics,lines:0}}));
  const run=()=>spawnSync(process.execPath,[join(root,'tools/coverage-table.mjs'),'--check'],{encoding:'utf8'});
  assert.equal(run().status,1);
  cfg.coverage.enforce=false;put(root,'.harness.json',JSON.stringify(cfg));assert.equal(run().status,0);
  cfg.coverage.enforce=true;put(root,'.harness.json',JSON.stringify(cfg));rmSync(join(root,'coverage/summary.json'));assert.equal(run().status,1);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('session freshness automatically enforces 3.0 maintenance without breaking legacy warning mode',()=>{
 const root=temp();try{
  mkdirSync(join(root,'tools'));
  for(const file of ['check-freshness.mjs','impact-map.mjs','maintenance.mjs','friction.mjs'])copyFileSync(new URL('./'+file,import.meta.url),join(root,'tools',file));
  put(root,'.harness.json',JSON.stringify({version:'3.0.0'}));
  const run=()=>spawnSync(process.execPath,[join(root,'tools/check-freshness.mjs')],{encoding:'utf8'});
  assert.equal(run().status,1);
  put(root,'.harness.json',JSON.stringify({version:'2.2.2'}));assert.equal(run().status,0);
 }finally{rmSync(root,{recursive:true,force:true});}
});
