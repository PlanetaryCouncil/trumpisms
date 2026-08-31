#!/usr/bin/env node
// Compile people.jsonl -> people.json (array) + print a coverage report.
// The JSON is the artifact a viewer or export reads; JSONL stays source of truth.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const rows = readFileSync(join(here,"people.jsonl"),"utf8")
  .split("\n").filter(l=>l.trim()).map(l=>JSON.parse(l));

rows.sort((a,b)=>(b.meta?.net_worth_usd_b||0)-(a.meta?.net_worth_usd_b||0));
writeFileSync(join(here,"people.json"), JSON.stringify(rows,null,2)+"\n");

const n = rows.length;
const has = f => rows.filter(f).length;
const scored = rows.filter(r=>Number.isInteger(r.climate?.score));
const avg = scored.length ? (scored.reduce((s,r)=>s+r.climate.score,0)/scored.length).toFixed(1) : "—";
const byStatus = {};
for (const r of rows) byStatus[r.outreach.status] = (byStatus[r.outreach.status]||0)+1;

console.log(`Built people.json — ${n} record(s)\n`);
console.log(`  climate scored     ${scored.length}/${n}   (avg ${avg}/10)`);
console.log(`  has email          ${has(r=>r.contacts?.email?.length)}/${n}`);
console.log(`  has any social     ${has(r=>r.contacts?.linkedin||r.contacts?.x||r.contacts?.insta||r.contacts?.fb)}/${n}`);
console.log(`  has ≥1 company     ${has(r=>r.companies?.length)}/${n}`);
console.log(`  has outreach angle ${has(r=>r.outreach?.angle)}/${n}`);
console.log(`\n  by status:`);
for (const [k,v] of Object.entries(byStatus).sort((a,b)=>b[1]-a[1])) console.log(`    ${k.padEnd(16)} ${v}`);
