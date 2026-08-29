# The Trumpisms Register

A running ledger of renamings, annexations and acquisitions, each scored on three axes.
Single self-contained page: `index.html` (data lives in the `ENTRIES` array in the inline script).

Published as a Claude artifact (maintainer access only):
https://claude.ai/code/artifact/e1339141-a94d-4146-9692-6f566b83206e

Discussion and re-scoring: https://t.me/planetarycouncil

## Adding an entry

```js
{
  id: "012",                 // file number, zero-padded
  date: "2026-09-01",        // ISO; drives the "Newest" sort
  status: "signed",          // signed | built | executed | stated | floated | observed | unverified
  title: "…",
  desc: "…",                 // what happened, 2–3 sentences
  note: "…",                 // the mono footnote: the catch, the precedent, the veto point
  src: [{ label: "…", url: "https://…" }],  // optional; renders as ↗ links under the note
  serious: 0,                // 0 = riff at a rally,        10 = signed, staffed, funded
  satire:  0,                // 0 = ordinary politics,      10 = indistinguishable from parody
  undo:    0                 // 0 = reversed by memo,       10 = irreversible
}
```

`signed`/`built`/`executed` group under the "Acted on" filter; `stated`/`floated` under
"Said aloud"; `observed`/`unverified` under "Just him".

Omit an axis entirely (rather than scoring it 0) when it has nothing to measure — it renders
as a dashed "—" meter and sorts to the bottom of that axis. A zero is a judgement, a dash is
an admission.

The three scores are AI-assigned, single-pass, and the page says so. Re-scoring happens in the
Telegram channel: https://t.me/planetarycouncil

Republish after editing by pointing the Artifact tool at `index.html` with the URL above.

## The Billionaire Non-Proliferation Treaty

Second page: `treaty.html`. Seven treaty articles (a one-billion cap per natural person,
everything above it committed to the planetary commons within ten years, holdings counted at
the beneficial owner, a public register, success reported in lives changed), then the
programme the surplus pays for: fifteen planetary undertakings costed at published financing
gaps, a dial for the share of the surplus committed, and a calendar of what ends by when.

The argument the page exists to make is arithmetic: the surplus is about $13T, the whole
programme costs about $12.3T, and it leaves change.

Data lives in the `WORKS` array in the inline script, **in funding order** — the dial funds
them top to bottom, so the order is an editorial claim about sequencing:

```js
{
  id: "I",
  cost: 0.12,                // US$ trillions, at published financing-gap scale
  term: "2027–2031",
  title: "…",
  desc: "…",                 // what the undertaking actually buys, 1–2 sentences
  ends: "…",                 // the mono line: what stops happening
  deaths: 600000,            // annual deaths averted at full deployment; null where the
                             // benefit is real but is not a mortality figure
  people: 240000000,         // people whose material conditions change
  unit: "people no longer living in transmission zones"
}
```

Invariants worth keeping when editing:

- **Deaths and people are credited only at completion.** A half-funded eradication campaign
  eradicates nothing, so the tallies count fully-funded undertakings only.
- **Populations are never summed** — the same child is in most of them. The people tally is
  `max()` across completed undertakings and says on the page that it is a lower bound.
- Keep `SURPLUS` (13.0) above the portfolio total; the "left over afterwards" figure on the
  cover is `SURPLUS − Σcost` and is the whole point of the page. Update the cover figures if
  costs change.
- Use literal `—` in `desc`/`ends`/`unit`, not `&mdash;`: those strings are HTML-escaped.
- Preset chips (`data-pct`) are cumulative thresholds — check them against the costs after
  reordering, or a preset will label the wrong boundary.

Figures are order-of-magnitude estimates from published financing gaps (WHO, UNESCO, the
World Bank, UNEP, IEA), rounded hard. The method section on the page says so; keep it honest
if you change the numbers.
