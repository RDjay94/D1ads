# d1ads — Public Push-Ads Dashboard

Live performance snapshot for the d1ads portfolio (BigTaka, Rajabaji, Kyasino88) across all push-ad traffic sources (Kadam, RichAds).

**View the dashboard:** [https://rdjay94.github.io/D1ads/](https://rdjay94.github.io/D1ads/)

## Reports

Three time windows are exported as a single page:

- **Daily** — yesterday's results vs day-before
- **Weekly** — current ISO week vs previous week
- **Monthly** — current calendar month vs previous month

Each tab has download buttons for **PDF** and **Excel** so you can take the report offline.

## What you'll see

- Portfolio-wide spend, revenue, ROAS, and deposits
- Per-brand breakdown
- Per-campaign table with full funnel metrics (impressions, clicks, CTR, regs, deposits, CPD, ROAS) and a **WIN / WATCH / FAIL** verdict for at-a-glance status
- "Top movers" — campaigns sorted by spend

## Update cadence

The dashboard is regenerated whenever the source machine runs its daily sync (at user login + 06:03 local). The local generator pulls fresh stats from Kadam, RichAds, and RedTrack, computes rollups, and pushes a new `index.html` to this repo.

_Generated locally — no server backend, just a static HTML snapshot._
