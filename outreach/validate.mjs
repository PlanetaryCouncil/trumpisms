#!/usr/bin/env node
// Validate people.jsonl: JSON parse, required fields, id shape + uniqueness,
// climate range, and a light provenance check. No dependencies.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] || join(here, "people.jsonl");

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUS = new Set(["needs_research","researched","queued","contacted","responded","meeting","signed","declined","do_not_contact"]);

const lines = readFileSync(file, "utf8").split("\n").map((l,i)=>[i+1,l]).filter(([,l])=>l.trim());
const ids = new Map();
let errors = 0;
const err = (ln, msg) => { console.error(`  line ${ln}: ${msg}`); errors++; };

for (const [ln, raw] of lines) {
  let p;
  try { p = JSON.parse(raw); } catch (e) { err(ln, `invalid JSON — ${e.message}`); continue; }

  if (!p.id || !ID.test(p.id)) err(ln, `bad or missing id "${p.id ?? ""}" (want a lowercase slug)`);
  else if (ids.has(p.id)) err(ln, `duplicate id "${p.id}" (first seen line ${ids.get(p.id)})`);
  else ids.set(p.id, ln);

  if (!p.name) err(ln, "missing name");

  const c = p.climate;
  if (!c || typeof c !== "object") err(ln, "missing climate block");
  else {
    if (c.score !== null && c.score !== undefined && !(Number.isInteger(c.score) && c.score>=0 && c.score<=10))
      err(ln, `climate.score must be 0–10 or null (got ${JSON.stringify(c.score)})`);
    if (Number.isInteger(c.score) && (!c.rationale || !(c.sources||[]).length))
      err(ln, `climate.score ${c.score} without a rationale + at least one source (a score is a judgement — cite it)`);
  }

  if (!p.outreach || !STATUS.has(p.outreach.status))
    err(ln, `outreach.status must be one of ${[...STATUS].join(", ")}`);

  // provenance nudge: a claimed email must be sourced, never a bare string
  for (const e of p.contacts?.email || [])
    if (typeof e !== "object" || !e.value) err(ln, "contacts.email entries must be {value, source, as_of} objects");
}

const n = lines.length;
if (errors) { console.error(`\n✗ ${errors} problem(s) across ${n} record(s).`); process.exit(1); }
console.log(`✓ ${n} record(s) valid, ${ids.size} unique id(s).`);
