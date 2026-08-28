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
