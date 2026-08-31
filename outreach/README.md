# Outreach — the working list behind the treaty

The [Billionaire Non-Proliferation Treaty](../treaty.html) is addressed to "the three
thousand." This directory is the apparatus for actually reaching them: a git-native dataset,
one record per person, with the provenance and CRM state a real campaign needs — and a hard
rule against inventing anyone's contact details.

## Why this shape

- **~2,800 people is small.** Nothing here is optimised for compute. It is optimised for
  *human editing, clean git diffs, provenance, dedup, and enrichment over time.*
- **Store: `people.jsonl`, one JSON object per line.** Append-friendly, merge-friendly,
  streamable. A spreadsheet loses the nested companies/socials and conflicts on every edit;
  a normalised SQL schema is overkill at this scale and diffs worse. If you later want SQL
  queries, load the JSONL into SQLite in one pass — but the *source of truth stays the text*.
- **`people.json` is built, not edited.** `build.mjs` compiles + sorts the JSONL into it for
  viewers/exports. Never hand-edit `people.json`.
- **Every judgement carries provenance.** `climate.score` is 0–10 and, like the register and
  treaty scores, it is an opinion — so the validator refuses a score without a `rationale`
  and at least one `source`. Same honesty rule as the rest of the site.

## The privacy line — read this

`contacts.email`, `contacts.fb`, `contacts.insta` and the rest seed as **`null`** with an
outreach status of `needs_research`. **Do not guess them, and do not scrape them.** A guessed
email is worse than an empty field: it fails silently, burns the first impression, and turns a
sourced dataset into a rumour mill. Fill contact fields only from legitimate routes — a public
foundation contact page, a warm introduction, an opt-in — and record where each came from in
the `source` of its `{value, source, as_of}` object. The seed records deliberately ship every
contact field empty for exactly this reason.

## The data model

Full contract in [`person.schema.json`](./person.schema.json). Shape:

```jsonc
{
  "id": "bill-gates",                    // stable lowercase slug — the dedup/merge key
  "name": "Bill Gates",
  "contacts": { "email": null, "linkedin": null, "x": null, /* … PII, null until sourced */ },
  "companies": [                          // embedded, each with the person's role + public channels
    { "name": "Breakthrough Energy", "role": "founder", "url": "https://…", "primary": false }
  ],
  "climate": {                            // 0 = obstructive · 5 = neutral · 10 = fortune fights the crisis
    "score": 8, "confidence": "high",
    "rationale": "why the number is what it is",
    "sources": [{ "label": "…", "url": "https://…" }], "as_of": "2026-08-31"
  },
  "meta":  { "net_worth_usd_b": 110, "source_of_wealth": "Microsoft", "country": "United States", "source": {…} },
  "outreach": {                           // the CRM layer that drives the personalised approach
    "status": "researched",
    "angle": "the specific hook for THIS person — a position, a foundation, a public regret",
    "channel": "best route in", "owner": null, "last_contact": null, "notes": []
  }
}
```

`outreach.status`: `needs_research → researched → queued → contacted → responded → meeting →
signed | declined | do_not_contact`.

## Workflow

```bash
node outreach/validate.mjs      # parse, id uniqueness, climate range, provenance checks
node outreach/build.mjs         # compile people.json + print a coverage report
node outreach/draft.mjs <id>    # a grounded brief for one person, ready to personalise
```

`draft.mjs` assembles a brief from the *stored, sourced* facts — the surplus above the cap,
the climate rationale, the outreach angle — so any message written from it is personalised on
real data, not invented flattery. It sends nothing.

## Enriching

Add or edit one line in `people.jsonl`, keep the `id` stable, set `updated`, then run
`validate` and `build`. To bulk-import a wealth list: generate `id` slugs from names, dedup
against existing ids (and `aka`), leave every contact field `null`, set `status:
needs_research`, and score climate `null` until someone can cite a rationale. Empty and honest
beats full and fabricated.

Re-scoring, as everywhere on this project, happens in the open: <https://t.me/planetarycouncil>.
