import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {AUDIT_AREAS,auditStatus} from './check-audits.mjs';
const now=Date.UTC(2026,9,31,12),value=(result='checked')=>({result,evidence:'Reviewed actual source and tests',limits:'Not proof of no defects'});
function fixture(fn){const root=mkdtempSync(join(tmpdir(),'audit scope '));try{mkdirSync(join(root,'docs/audits'),{recursive:true});writeFileSync(join(root,'.harness.json'),'{}');return fn(root);}finally{rmSync(root,{recursive:true,force:true});}}
function report(root,name,kind,date,areas){const markdown=`docs/audits/${date.slice(0,10)}-${name}.md`;writeFileSync(join(root,markdown),'# Dated report\n');const row={schemaVersion:1,kind,reviewed:date,baseline:'a'.repeat(40),report:markdown,areas};writeFileSync(join(root,`docs/audits/${date.slice(0,10)}-${name}.audit.json`),JSON.stringify(row));return row;}
test('fresh scoped audit never refreshes stale full coverage or changes full-report identity',()=>fixture(root=>{
 const old=report(root,'full','full','2026-10-01T00:00:00.000Z',Object.fromEntries(AUDIT_AREAS.map(a=>[a,value()])));
 report(root,'harness','scoped','2026-10-31T00:00:00.000Z',{harness:value()});
 const result=auditStatus(root,now);assert.equal(result.areas.harness.status,'fresh');assert.equal(result.areas.code.status,'stale');assert.equal(result.lastFull.report,old.report);assert.equal(result.due.length,7);
}));
test('full audit requires every area, evidence and explicit exclusions',()=>fixture(root=>{
 report(root,'incomplete','full','2026-10-31T00:00:00.000Z',{code:value()});assert.throws(()=>auditStatus(root,now),/Incomplete/);
}));
test('blocked latest area overrides earlier freshness; not-applicable needs reason and full blocked is not complete',()=>fixture(root=>{
 report(root,'full','full','2026-10-30T00:00:00.000Z',Object.fromEntries(AUDIT_AREAS.map(a=>[a,value()])));
 report(root,'blocked','scoped','2026-10-31T00:00:00.000Z',{tests:{...value('blocked'),blocker:'Device unavailable'}});
 assert.equal(auditStatus(root,now).areas.tests.status,'blocked');
 report(root,'na','scoped','2026-10-31T01:00:00.000Z',{tests:{...value('not-applicable'),evidence:'No UI/browser in this repository; helper fixtures cover its domain'}});
 assert.equal(auditStatus(root,now).areas.tests.status,'fresh');
}));
test('new narrative-only audit is unclassified and cannot reset any area',()=>fixture(root=>{
 writeFileSync(join(root,'docs/audits/2026-10-31-scoped.md'),'# New narrow review');
 const result=auditStatus(root,now);assert.equal(result.lastFull,null);assert.equal(result.reports,0);assert.equal(result.due.length,8);
}));
test('invalid timestamps, future dates, unknown areas and report traversal fail',()=>fixture(root=>{
 const row=report(root,'bad','scoped','2026-10-31T00:00:00.000Z',{code:value()});
 const path=join(root,'docs/audits/2026-10-31-bad.audit.json');
 for(const change of [{reviewed:'2027-01-01T00:00:00.000Z'},{areas:{unknown:value()}},{report:'../outside.md'},{areas:{code:{result:'checked',evidence:'',limits:'unknown'}}}]){
  writeFileSync(path,JSON.stringify({...row,...change}));assert.throws(()=>auditStatus(root,now));
 }
}));
test('audit reports cannot escape through symlinks',()=>fixture(root=>{
 report(root,'link','scoped','2026-10-31T00:00:00.000Z',{code:value()});
 const file=join(root,'docs/audits/2026-10-31-link.md');rmSync(file);symlinkSync('/etc/hosts',file);assert.throws(()=>auditStatus(root,now),/escapes/);
}));
