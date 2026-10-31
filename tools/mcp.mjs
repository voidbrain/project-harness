// Optional recommendation/configuration helper. Never installs, launches servers, edits client files or claims a connection.
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const mode = args.shift() ?? 'recommend';
const option = name => args.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const offline = args.includes('--offline');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const catalog = read(new URL('./mcp-catalog.json', import.meta.url));
const stamp = existsSync(resolve(root, '.harness.json')) ? read(resolve(root, '.harness.json')) : {};
const fail = message => { throw new Error(message); };
const date = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(s).toISOString().startsWith(s);
let list = stamp.integrations?.recommendations ?? [];
const origins = new Map();
let contextNote;
try {
  if (!['check', 'recommend', 'config', 'search'].includes(mode)) fail('Usage: mcp.mjs check|recommend|config|search [--query=NAME] [--server=ID --client=CLIENT] [--offline]');
  if (!Array.isArray(list)) fail('integrations.recommendations must be an array');
  const own = list;
  if (stamp.solution?.manifest) {
    const path = resolve(root, stamp.solution.manifest);
    if (existsSync(path)) {
      const context = read(path).integrations;
      if (context && context.schemaVersion !== 1) fail('Unsupported solution integrations schemaVersion');
      const inherited = context?.recommendations ?? [];
      if (!Array.isArray(inherited)) fail('Solution integrations.recommendations must be an array');
      const merged = new Map();
      for (const r of inherited) {
        if (merged.has(r.id)) fail(`Duplicate solution integration: ${r.id}`);
        merged.set(r.id, r); origins.set(r.id, 'solution');
      }
      const ownSeen = new Set();
      for (const r of own) {
        if (ownSeen.has(r.id)) fail(`Duplicate project integration: ${r.id}`);
        ownSeen.add(r.id); merged.set(r.id, r); origins.set(r.id, 'project');
      }
      list = [...merged.values()];
    } else contextNote = 'Solution context unavailable; project recommendations still work. Inherited recommendations are unknown.';
  }
  for (const r of own) if (!origins.has(r.id)) origins.set(r.id,'project');
  if (stamp.integrations?.schemaVersion !== undefined && stamp.integrations.schemaVersion !== 1) fail('Unsupported integrations schemaVersion');
  const known = new Map(catalog.integrations.map(x => [x.id, x]));
  const seen = new Set();
  for (const r of list) {
    if (!r || !known.has(r.id) || seen.has(r.id)) fail(`Unknown/duplicate integration: ${r?.id}`);
    seen.add(r.id);
    if (typeof r.reason !== 'string' || !r.reason.trim()) fail(`${r.id}: project-specific reason required`);
    if (!date(r.lastChecked)) fail(`${r.id}: valid lastChecked date required`);
    if (new Date(r.lastChecked) > new Date()) fail(`${r.id}: lastChecked cannot be in the future`);
    if (r.disabled !== undefined && typeof r.disabled !== 'boolean') fail(`${r.id}: disabled must be boolean`);
    if (r.required && r.disabled) fail(`${r.id}: a required workflow recommendation cannot also be disabled`);
    if (r.required !== undefined && typeof r.required !== 'boolean') fail(`${r.id}: required must be boolean`);
    if (r.version !== undefined && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(r.version)) fail(`${r.id}: version must be exact, never latest or a range`);
    if (r.endpoint !== undefined) {
      const u = new URL(r.endpoint);
      if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password || u.search || u.hash) fail(`${r.id}: use an HTTP(S) endpoint without credentials, query or fragment`);
      if (u.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(u.hostname)) fail(`${r.id}: remote endpoints require HTTPS`);
    }
    if (Object.keys(r).some(k => /token|secret|password|headers|env|command|args/i.test(k))) fail(`${r.id}: credentials and executable overrides belong in local client configuration`);
  }
  if (contextNote) console.error(contextNote);
  if (mode === 'search') {
    if (offline) fail('Live registry search requires network; use recommend for cached guidance');
    const query = option('query')?.trim();
    if (!query || [...query].length < 3) fail('Use --query=NAME with at least three characters; registry search matches names, not semantic capabilities');
    const response = await fetch(`https://registry.modelcontextprotocol.io/v0.1/servers?version=latest&search=${encodeURIComponent(query)}`, {signal:AbortSignal.timeout(15000)});
    if (!response.ok) fail(`Registry returned HTTP ${response.status}; cached recommendations remain available`);
    const data = await response.json();
    if (!Array.isArray(data.servers)) fail('Unexpected registry response; no recommendation was changed');
    console.log(`Live registry snapshot ${new Date().toISOString()}; name search ${JSON.stringify(query)}. Listing is not endorsement, compatibility or security verification.`);
    for (const item of data.servers) {
      const server = item.server;
      if (!server?.name || !server.version) fail('Unexpected registry entry; no recommendation was changed');
      console.log(JSON.stringify({name:server.name,version:server.version,description:server.description,repository:server.repository?.url,packages:server.packages?.map(p=>({identifier:p.identifier,version:p.version})),remotes:server.remotes?.map(r=>({type:r.type,url:r.url}))}));
    }
    if (data.metadata?.nextCursor) console.log('More matches exist; narrow the query or consult the registry. This is not an exhaustive catalogue.');
  } else if (mode === 'check') {
    console.log(`${list.length} MCP recommendation(s) valid. No server was installed, started or connection verified.`);
  } else if (mode === 'recommend') {
    const pkg = existsSync(resolve(root, 'package.json')) ? read(resolve(root, 'package.json')) : {};
    const deps = {...pkg.dependencies, ...pkg.devDependencies};
    const candidates = new Map(list.map(r => [r.id, `selected by ${origins.get(r.id)}${r.disabled ? ' (disabled)' : ''}`]));
    if (deps['@angular/core'] || existsSync(resolve(root, 'angular.json'))) candidates.set('angular', candidates.get('angular') ?? 'Angular workspace detected');
    if (deps['@playwright/test'] || deps.playwright) candidates.set('playwright', candidates.get('playwright') ?? 'Playwright dependency detected; check existing browser access first');
    console.log(`Catalogue reviewed ${catalog.reviewed}; this is cached guidance, not a live registry search.`);
    for (const [id, why] of candidates) {
      const c = known.get(id), selected = list.find(r => r.id === id);
      const age = selected ? Math.floor((Date.now() - Date.parse(selected.lastChecked)) / 86400000) : null;
      console.log(`${id}: ${why}; ${c.runtime}/${c.transport}; ${offline && c.network ? 'requires network — unavailable offline' : 'connection unverified'}${age !== null ? `; checked ${selected.lastChecked}${age > 30 ? ' (review stale recommendation)' : ''}` : ''}\n  ${c.purpose}\n  Source: ${c.source}\n  Setup: ${c.setup}\n  Fallback: ${c.fallback}`);
    }
    if (!candidates.size) console.log('No stack candidates detected. Read the actual workflow before researching integrations; project names and file extensions alone are insufficient.');
    console.log(`Research missing capabilities via vendor docs and ${catalog.registry}; verify publisher, version and environment. Registry presence is not a security audit. Reuse existing capabilities; do not install automatically from search results.`);
  } else {
    const id = option('server'), client = option('client');
    const c = known.get(id), r = list.find(x => x.id === id);
    if (r?.disabled) fail(`${id}: recommendation disabled by project selection`);
    if (!c || !r) fail('Select a reviewed recommendation in .harness.json before generating config');
    if (!['claude-code', 'cline', 'gemini', 'vscode', 'codex'].includes(client)) fail('client must be claude-code, cline, gemini, vscode or codex');
    if (offline && c.network) fail(`${id} requires network; use its documented fallback`);
    let entry;
    if (c.transport === 'http') {
      const url = r.endpoint ?? c.url;
      if (!url) fail(`${id}: record the actual verified endpoint first; ${c.setup}`);
      entry = client === 'gemini' ? {httpUrl:url} : {type: client === 'cline' ? 'streamableHttp' : 'http', url};
    } else if (id === 'angular') {
      const ng = resolve(root, 'node_modules/@angular/cli/bin/ng.js');
      if (!existsSync(ng)) fail('Install the project’s locked Angular CLI dependencies first; no automatic download was attempted');
      const cliPackage = resolve(root, 'node_modules/@angular/cli/package.json');
      if (!existsSync(cliPackage) || !Number.isInteger(Number(read(cliPackage).version?.split('.')[0])) || Number(read(cliPackage).version?.split('.')[0]) < 20) fail('Angular MCP needs a compatible installed CLI (20+); verify its version-specific documentation');
      entry = {command: 'node', args: [ng, 'mcp', '--read-only', ...(offline ? ['--local-only'] : [])], ...(['vscode','gemini'].includes(client) ? {cwd:root} : {})};
    } else if (c.package) {
      if (!r.version) fail(`${id}: select a reviewed exact package version first`);
      if (offline) fail(`${id}: online package-runner config is unsuitable offline; configure a preinstalled server in the local client instead`);
      entry = {command: 'npx', args: ['--yes', `${c.package}@${r.version}`]};
    } else fail(`${id}: follow vendor setup; no portable launch command is assumed. ${c.setup}`);
    if (entry.command && ['vscode','claude-code'].includes(client)) entry = {type:'stdio', ...entry};
    // Printed snippets are deliberately separate from instruction files and host credentials.
    if (client === 'codex') {
      console.log(`[mcp_servers.${id}]`);
      for (const [key, value] of Object.entries(entry).filter(([k]) => k !== 'type')) console.log(`${key} = ${JSON.stringify(value)}`);
    } else console.log(JSON.stringify({[client === 'vscode' ? 'servers' : 'mcpServers']: {[id]: entry}}, null, 2));
    console.error('Snippet only. Launch from the intended workspace. Merge into the client’s correct local/project configuration without replacing existing entries. Review launch commands, authorize within the standing policy, restart/reload if required, discover tools and verify one harmless call. Not installed or connected.');
  }
} catch (e) { console.error(e.message); process.exitCode = 1; }
