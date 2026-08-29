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

Second page: `treaty.html` — a seven-article treaty proposal (a one-billion cap, everything
above it committed to the planetary commons within ten years) followed by an impact list of
interventions priced in lives changed per million dollars.

Data lives in the `ITEMS` array in the inline script:

```js
{
  id: "01",
  kind: "direct",            // direct | policy | proof — drives the "Kind" filter
  status: "trial",           // trial | delivered | historic | policy | modelled
  title: "…",
  rate: 200,                 // lives changed per US$1M; null where no honest forward rate exists
  unit: "deaths averted",    // deaths averted | sight restored | children protected | people reached
  range: "≈$5,000 per death averted",   // the published figure the rate came from
  desc: "…",                 // what the intervention is, 2–3 sentences
  note: "…",                 // the mono footnote: the caveat, the counterfactual, the error bar
  src: [{ label: "…", url: "https://…" }],
  reach: 9, evidence: 9, durable: 5     // 0–10, AI-assigned, single pass
}
```

Only lines whose `unit` is `"deaths averted"` feed the median used by the fortune slider.
Set `rate: null` rather than guessing — historic programmes and unpriceable insurance render
a dash, and the slider skips them. Use literal `—` in `desc`/`note`, not `&mdash;`: those
strings are HTML-escaped before rendering.

Figures are cost-effectiveness estimates, not audited outcomes; keep the source link on every
line that carries a number.
