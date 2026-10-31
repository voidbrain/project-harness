// Explicit local measurement only: no source text, prompts, identities, telemetry or network.
import {existsSync, lstatSync, mkdirSync, appendFileSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
export function friction(root, args) {
  const [command,...rest]=args, values={};
  if (!['record','report'].includes(command)) throw Error('Use record or report');
  const fields={'duration-ms':'durationMs', conflicts:'conflicts', 'unnecessary-prompts':'unnecessaryPrompts', 'repeated-context-loads':'repeatedContextLoads'};
  for (const arg of rest) {
    const match=arg.match(/^--([a-z-]+)=(.+)$/);
    if (!match || match[1] in values || !['operation',...Object.keys(fields)].includes(match[1]) || command==='report') throw Error(`Invalid or duplicate argument: ${arg}`);
    values[match[1]]=match[2];
  }
  const dir=resolve(root,'.harness'), file=resolve(dir,'friction.jsonl');
  for (const path of [dir,file]) { try {if (lstatSync(path).isSymbolicLink()) throw Error('Refusing symlink measurement destination');} catch(e) {if (e.code !== 'ENOENT') throw e;} }
  const read=()=>{
    const rows=existsSync(file)?readFileSync(file,'utf8').split('\n').filter(Boolean).map(line=>JSON.parse(line)):[];
    for (const row of rows) {
      if (!row || row.schemaVersion!==1 || !['adoption','reconciliation'].includes(row.operation) || typeof row.at!=='string' || !Number.isFinite(Date.parse(row.at)) || !Number.isSafeInteger(row.durationMs) || row.durationMs<0) throw Error('Invalid stored measurement');
      for (const key of Object.values(fields)) if (row[key]!==null && (!Number.isSafeInteger(row[key]) || row[key]<0)) throw Error('Invalid stored measurement');
    }
    return rows;
  };
  if (command==='record') {
    if (!['adoption','reconciliation'].includes(values.operation)) throw Error('Operation must be adoption or reconciliation');
    const row={schemaVersion:1, at:new Date().toISOString(), operation:values.operation};
    for (const [flag,key] of Object.entries(fields)) {
      if (values[flag]!==undefined && !/^\d+$/.test(values[flag])) throw Error(`Invalid count: ${flag}`);
      const number=values[flag]===undefined?null:Number(values[flag]);
      if (number!==null && !Number.isSafeInteger(number)) throw Error(`Invalid count: ${flag}`);
      row[key]=number;
    }
    if (row.durationMs===null) throw Error('Provide an observed --duration-ms');
    read(); // malformed existing data is an error, not silently discarded
    mkdirSync(dir,{recursive:true}); appendFileSync(file,JSON.stringify(row)+'\n');
    return row;
  }
  const rows=read(), report={samples:rows.length, operations:{}};
  for (const operation of ['adoption','reconciliation']) {
    const group=rows.filter(row=>row.operation===operation), summary={samples:group.length};
    for (const key of Object.values(fields)) {
      const numbers=group.map(row=>row[key]).filter(n=>Number.isSafeInteger(n)&&n>=0).sort((a,b)=>a-b);
      const middle=Math.floor(numbers.length/2);
      summary[key]={observed:numbers.length, missing:group.length-numbers.length, median:numbers.length?(numbers.length%2?numbers[middle]:(numbers[middle-1]+numbers[middle])/2):null};
    }
    report.operations[operation]=summary;
  }
  return report;
}
if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {console.log(JSON.stringify(friction(fileURLToPath(new URL('..',import.meta.url)),process.argv.slice(2)),null,2));}
  catch(e) {console.error(e.message); process.exitCode=1;}
}
