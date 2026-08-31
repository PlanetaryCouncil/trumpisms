#!/usr/bin/env node
// people.jsonl -> people.csv, flat columns matching the collection fields.
// Nested companies/socials are flattened with " | " so a Sheet stays legible.
// Lossy on purpose: the Sheet is the human surface; JSONL stays source of truth.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const rows = readFileSync(join(here,"people.jsonl"),"utf8").split("\n").filter(l=>l.trim()).map(l=>JSON.parse(l));

const COLS = ["id","name","email","fb","insta","linkedin","x",
  "company_primary","companies_all","company_links",
  "climate_score","climate_confidence","climate_rationale","climate_sources",
  "net_worth_usd_b","source_of_wealth","country",
  "status","angle","channel","owner","last_contact","notes","updated"];

const q = v => {
  const s = v==null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
};
const joinCo = (rows,f) => (rows.companies||[]).map(f).filter(Boolean).join(" | ");

const line = p => COLS.map(c => q(({
  id:p.id, name:p.name,
  email:(p.contacts?.email||[]).map(e=>e.value).join(" | "),
  fb:p.contacts?.fb, insta:p.contacts?.insta, linkedin:p.contacts?.linkedin, x:p.contacts?.x,
  company_primary:(p.companies||[]).find(c=>c.primary)?.name || (p.companies?.[0]?.name),
  companies_all:joinCo(p,c=>c.name),
  company_links:joinCo(p,c=>c.url),
  climate_score:p.climate?.score, climate_confidence:p.climate?.confidence,
  climate_rationale:p.climate?.rationale,
  climate_sources:(p.climate?.sources||[]).map(s=>s.url).join(" | "),
  net_worth_usd_b:p.meta?.net_worth_usd_b, source_of_wealth:p.meta?.source_of_wealth, country:p.meta?.country,
  status:p.outreach?.status, angle:p.outreach?.angle, channel:p.outreach?.channel,
  owner:p.outreach?.owner, last_contact:p.outreach?.last_contact,
  notes:(p.outreach?.notes||[]).join(" ; "), updated:p.updated,
})[c])).join(",");

const csv = [COLS.join(","), ...rows.map(line)].join("\n")+"\n";
writeFileSync(join(here,"people.csv"), csv);
console.log(`Wrote people.csv — ${rows.length} rows, ${COLS.length} columns.`);
