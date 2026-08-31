#!/usr/bin/env node
// Print a personalised outreach brief for one person, assembled from their record.
// This does NOT send anything — it produces the brief a human (or a model) turns
// into a message, so the personalisation is grounded in stored, sourced facts.
//   node draft.mjs <id>
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const id = process.argv[2];
if (!id) { console.error("usage: node draft.mjs <id>"); process.exit(1); }

const rows = readFileSync(join(here,"people.jsonl"),"utf8").split("\n").filter(l=>l.trim()).map(l=>JSON.parse(l));
const p = rows.find(r=>r.id===id);
if (!p) { console.error(`no record with id "${id}"`); process.exit(1); }

const line = (k,v)=> v ? `  ${k.padEnd(12)} ${v}` : null;
const out = [
  `━━ ${p.name}  (${p.id}) ━━`,
  line("Net worth", p.meta?.net_worth_usd_b!=null ? `$${p.meta.net_worth_usd_b}B` : null),
  line("Wealth", p.meta?.source_of_wealth),
  line("Country", p.meta?.country),
  line("Climate", Number.isInteger(p.climate?.score) ? `${p.climate.score}/10 (${p.climate.confidence||"?"} confidence)` : "unscored"),
  p.climate?.rationale ? `  Why         ${p.climate.rationale}` : null,
  line("Status", p.outreach?.status),
  line("Channel", p.outreach?.channel),
  p.outreach?.angle ? `\n  ANGLE → ${p.outreach.angle}` : "\n  ANGLE → (none set — research before drafting)",
].filter(Boolean);

if (p.outreach?.status==="do_not_contact")
  out.push(`\n  ⚠ DO NOT CONTACT — ${p.outreach.do_not_contact_reason||""}`);

const surplus = p.meta?.net_worth_usd_b!=null ? Math.max(0, p.meta.net_worth_usd_b-1) : null;
if (surplus!=null) out.push(`\n  Surplus above the cap: $${surplus}B  (${(surplus/120).toFixed(1)}× the cost of eradicating malaria)`);

console.log(out.join("\n")+"\n");
