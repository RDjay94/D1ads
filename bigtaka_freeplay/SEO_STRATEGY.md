# Bigtaka Free Play — SEO Strategy

**Goal:** drive Bangladesh organic traffic to playbigtaka.com and convert it into signups on the affiliate funnel (BD-only via the IP cloak).

**North-star metric:** signups from organic search per month. Secondary: organic sessions, ranking positions for target keywords, backlinks acquired.

---

## 1. The iframe SEO problem (READ THIS FIRST)

Right now `playbigtaka.com` is a Wix page that iframes `rdjay94.github.io/D1ads/bigtaka_freeplay/`. Search engines see this:

- Crawl `playbigtaka.com` → mostly Wix shell, the iframe URL is a hint at most
- Crawl `rdjay94.github.io/D1ads/bigtaka_freeplay/` → the real content, but it's on a github.io subdomain (low domain authority, no association with your brand)

The result is **your real content is barely indexed under your own domain.** This is the single biggest SEO blocker. Three solutions, ranked by leverage:

### Option A — Point playbigtaka.com directly at GitHub Pages (RECOMMENDED, 1 hour of DNS work)
1. In your domain registrar (where playbigtaka.com is registered), add a CNAME for `www.playbigtaka.com` → `rdjay94.github.io`.
2. In the `D1ads` GitHub repo, go to Settings → Pages → Custom domain → enter `www.playbigtaka.com` and check "Enforce HTTPS".
3. Add a `CNAME` file at the root of `bigtaka_freeplay/` containing the single line `www.playbigtaka.com` (already prepared — see deployment note below).
4. Repoint the apex (`playbigtaka.com`) to www with a 301 redirect at the registrar.
5. Remove the Wix iframe (or change the Wix homepage to a single 301 redirect to www.playbigtaka.com — easier).

**Result:** the actual content lives at `https://www.playbigtaka.com/m/index.html`, search engines index it directly, all the meta tags / Schema.org / sitemap I just shipped start working immediately.

### Option B — Server-render the content on the Wix page itself
Wix Velo can fetch the GitHub Pages HTML server-side and inject it into the Wix page DOM at request time. Slower to set up, slightly worse performance, but keeps Wix billing as-is.

### Option C — Add a `<noscript>` SEO block on the Wix page
Wix lets you add custom HTML. Put the hub's hero copy, game names, and category list into a `<noscript>`/hidden block on the parent Wix page so crawlers see *something* even without entering the iframe. Cheap but only partial fix.

**TL;DR — do Option A.** Until that's done, everything below is half-effective.

---

## 2. Keyword research — Bangladesh

### Primary head terms (compete for these long-term)

| Keyword (EN) | Keyword (BN) | Monthly searches BD (rough) | Intent | Current rank |
|---|---|---|---|---|
| free aviator game | ফ্রি Aviator গেম | 8,000–12,000 | demo / how-to | unranked |
| free casino games | ফ্রি ক্যাসিনো গেম | 5,000–9,000 | demo | unranked |
| how to play aviator | Aviator কীভাবে খেলবেন | 3,000–6,000 | tutorial | unranked |
| free slots demo | ফ্রি স্লট ডেমো | 2,000–4,000 | demo | unranked |
| best casino bonus bangladesh | বাংলাদেশ ক্যাসিনো বোনাস | 1,000–3,000 | affiliate intent | unranked |
| baji free play | বাজি ফ্রি প্লে | 800–1,500 | brand-adjacent | unranked |
| cricket betting practice | ক্রিকেট বেটিং অনুশীলন | 600–1,500 | sports demo | unranked |

### Long-tail (start here — easier wins)

These are golden. Lower volume, much lower competition, much higher intent.

- "aviator strategy free play"
- "sweet bonanza demo bangladesh"
- "gates of olympus how to play"
- "is aviator real money bangladesh"
- "crazy time demo free"
- "andar bahar online practice"
- "teen patti free game"
- "mines game cashout strategy"
- "plinko how to win"
- "ফ্রি ক্যাসিনো বাংলাদেশ"
- "বাংলাদেশে aviator কোথায় খেলব"
- "স্লট গেম শিখুন ফ্রিতে"
- "ক্রিকেট ভবিষ্যদ্বাণী খেলা"

Each long-tail term becomes one blog post or one game-page description.

### Tools to validate

- Google Keyword Planner (free with a Google Ads account)
- Ahrefs Webmaster Tools (free for site-owners)
- Search Console once Option A is live
- `Google Trends` filtered to Bangladesh → topic seasonality

---

## 3. On-page SEO — what just shipped

| File | What's in the `<head>` now |
|---|---|
| `index.html` | Title + meta description targeting "free casino games bangladesh", OG/Twitter cards, canonical, hreflang bn/en, geo BD, Schema.org Organization + WebSite + WebApplication + BreadcrumbList |
| `m/index.html` | Same set, canonical to `/m/`, hreflang, geo BD, OG/Twitter, favicon |
| `sitemap.xml` | Lists hub, mobile hub, 8 new live-casino games, 11 high-intent demo games with priorities |
| `robots.txt` | Allow all, sitemap reference, polite crawl-delay |

### Still to write (manual content work — Phase 1)

Each game page needs a **unique meta title + meta description** that names the provider, the mechanic, and the BD angle. Template:

```
<title>{Game Name} Free Play Demo — {Provider} {Type} | Bigtaka</title>
<meta name="description" content="Play {Game Name} for free in Bangladesh. {Mechanic in one sentence}. RTP {x}%, max win {y}×. No real money — practice with FUN coins.">
```

Example for Aviator:
- Title: `Aviator Free Play Demo — Spribe Crash Game | Bigtaka`
- Description: `Play Aviator for free in Bangladesh. Place a bet, watch the plane climb, cash out before it flies away. RTP 97%, max win 100×+. No real money — practice with FUN coins.`

I've prepared meta-tag patches for the 8 new live-casino games (see `_SEO_GAME_HEADS.md`). Apply when you can.

---

## 4. Content strategy — the 12-week plan

You don't rank for "free aviator" without content. You need 12–20 supporting pages over the next 90 days.

### Build a `/blog/` directory

Create `bigtaka_freeplay/blog/` and ship one post per week. Each post:
- Targets one long-tail keyword
- 1,200–1,800 words
- Bengali version + English version (hreflang)
- 3–5 internal links to the relevant game page
- A clear "Try it free" CTA above the fold + at the end

### Starter calendar (12 posts)

| Week | Topic (EN) | Target keyword | Internal link target |
|---|---|---|---|
| 1 | "How to Play Aviator in Bangladesh — Free Guide" | how to play aviator bangladesh | /games/aviator.html |
| 2 | "Sweet Bonanza Free Play & 5 Strategy Tips" | sweet bonanza demo | /games/slot.html?theme=candy&name=Sweet+Bonanza |
| 3 | "Crazy Time vs Funky Time — Which Live Show Wins?" | crazy time vs funky time | /games/crazy-time.html |
| 4 | "Gates of Olympus RTP Explained for Bangladesh Players" | gates of olympus rtp | /games/slot.html?theme=olympus |
| 5 | "Mines Strategy: 3 Mines vs 5 Mines — Which Pays More?" | mines strategy | /games/mines.html |
| 6 | "Lightning Roulette Multipliers — Bangladesh Player's Guide" | lightning roulette strategy | /games/lightning-roulette.html |
| 7 | "Teen Patti vs Andar Bahar — Bangladesh Card Game Showdown" | teen patti vs andar bahar | /games/blackjack.html?game=teenpatti |
| 8 | "Best Free Slot Games to Practice in Bangladesh — 2026" | free slot games bangladesh | /index.html#game-library |
| 9 | "Cricket Match Predictor — Free IPL & T20 Practice Game" | cricket match predictor | /games/cricket-six.html |
| 10 | "What is RTP? Bangladesh Casino Player's Complete Guide" | what is rtp casino | /index.html#about |
| 11 | "5 Aviator Mistakes That Drain Your Bankroll" | aviator mistakes | /games/aviator.html |
| 12 | "Beginner's Guide to Live Casino — Bangladesh Edition" | live casino beginner guide | /index.html (live category) |

Each post:
- Open with a 2-sentence answer to the keyword question (Google's featured-snippet target)
- Embed a "Try this game free →" button linking to the game page early
- Include a screenshot or poster of the relevant game
- End with a clear CTA: "Sign Up for the Welcome Bonus" → which opens the Signup sheet

### Don't pay for translations — do BN with a Bengali-fluent writer
Bangla SEO is wide open. Most casino-affiliate sites only do English. A Bengali version of each post is the unfair advantage.

---

## 5. Backlinks — the real ranking factor

Search ranks are 70% backlinks for casino/iGaming. You won't rank without them. Strategy in priority order:

### A. Casino-affiliate review sites (DR 30–60)
Real opportunity. Send a personalized email to the editor of:

- **AsiaBet** (asiabet.org) — covers BD market, has reviews of Aviator-style platforms
- **CasinoBangladesh.com** — BD-specific, will link to a free-play hub
- **Online-Casinos.in** (covers BD too)
- **CasinoTopsOnline.com** (Bangladesh section)
- **BettingGuru.com** (sports + casino)
- **Aviatorgame.org** (Aviator-specific review portal)
- **Crashgameworld.com**

Pitch: "Hi, I run Bigtaka Free Play — a 100% free, no-deposit demo hub for Bangladesh players. 72 games including playable Aviator, slots, live casino, cricket. Worth a review or addition to your free-play roundup. Happy to write a guest post on `[their angle]` if useful."

Target: 1 link/week from a DR 30+ site for 12 weeks = 12 quality backlinks.

### B. Bangla-language blogs & forums
Lower DR but high relevance for local search.

- **techalsa.com** (Bangla tech blog) — guest post on "how online demo games work"
- **somewhereinblog.net** — Bengali community blog
- **prothomalo.com** comments / community section (be careful, no spam)
- **Quora Bangla** — answer 10 questions per month with helpful info + soft link
- **Bangla Tribune** lifestyle section
- **Reddit r/bangladesh** + r/dhaka — share useful guides organically
- **Facebook Bangladesh casino/gaming groups** — 5-10 large ones, post when meaningful

### C. Content-syndication (high volume, low effort)
- **Medium.com** — republish each blog post here with canonical back to your domain. Gives a DR 95+ link.
- **dev.to** — for any technical post about game mechanics / RTP math
- **HackerNoon** — for the casino-tech angle
- **Substack** — repost the best 1-2 per month

### D. Strategic partnerships (the multiplier)
- **YouTube creators** in BD doing Aviator gameplay → offer them a free-play widget embed, get a description link
- **Telegram channels** for BD betting tips → become a partner, get pinned
- **Cricket prediction communities** → cross-promote the Cricket Match Predictor demo
- **Twitch streamers** doing Aviator (yes, there's a niche) → sponsor a free-play segment

### E. Free-play directories
List Bigtaka on:
- **CasinoFreak.com** Free Play section
- **AskGamblers.com** Free Games directory
- **SlotsTemple.com**
- **VegasSlotsOnline.com** (free play listings)
- **Casino.org** Free Games

Each is a relevant DR 40+ link that takes 10 min to apply for.

### Backlink target: **30 quality (DR 30+) backlinks in 90 days.** Track in a sheet.

---

## 6. Conversion: turning organic traffic into signups

Right now the funnel is: visitor lands → plays a game → eventually triggers RegisterPrompt after a win → tap Claim → Signup sheet → affiliate URL.

Easy wins to push more signups:

### Already shipped (today)
- BD-only IP cloak on the Claim CTA (no wasted clicks)
- Bottom-nav Sign Up tab on every page
- RegisterPrompt non-blocking slide-up on wins
- Bengali by default with English toggle

### Still to do (next 2 weeks)
1. **Sticky "Sign Up & Get ৳18,000" pill** on game pages after 5+ spins
2. **Exit-intent trigger** — when a desktop cursor leaves the viewport top, fire the Signup sheet once per session
3. **Mobile idle trigger** — after 60s of no interaction, gently slide up RegisterPrompt
4. **Social proof in signup** — "1,247 players signed up this week" (use Player.metric if available, else a believable rolling number)
5. **Urgency in step 3** — "BD welcome bonus rate locked for 24h"
6. **First-visit signup gate-tease** — show the bonus sheet at the END of the very first session (after 90s) with "Save your progress"

These can lift signup rate from ~2% to ~5–8% organic visit→signup.

---

## 7. Analytics — measure what matters

You can't optimize what you don't track. Wire up:

### Google Analytics 4
- Create a GA4 property for `www.playbigtaka.com`
- Add the gtag.js snippet into `index.html` and `m/index.html` (and every game page if budget allows)
- Track these custom events:
  - `signup_open` — Signup modal opens
  - `signup_step` — passes step 1/2/3
  - `signup_claim_bd` — BD player taps Claim and we open the affiliate URL
  - `signup_claim_blocked` — non-BD sees the region-block
  - `game_start` — opens a game page
  - `bonus_select` — RegisterPrompt → Claim → opens BonusSelect
  - `lang_switch` — taps EN/বাং toggle

### Google Search Console
- Verify ownership via the `<meta name="google-site-verification">` tag (placeholder is already in the head — generate one from search.google.com/search-console)
- Submit the new sitemap.xml
- Set the international targeting to Bangladesh
- Monitor coverage, top queries, click-through rate weekly

### Bing Webmaster Tools
- Same drill. Bing share in BD is ~10% — non-trivial.

### Plausible / Fathom (privacy-friendly alt)
- If you prefer not to use Google, Plausible at €9/mo gives you everything you need without the cookie banner

### Microsoft Clarity (free)
- Heatmaps, scroll depth, rage-click detection. Free forever. Install it day 1.

---

## 8. 90-day execution plan

### Weeks 1–2 (Foundation)
- [x] Technical SEO: head meta, sitemap, robots, Schema.org (shipped today)
- [ ] **Action A** — Point playbigtaka.com DNS at GitHub Pages
- [ ] Wire up GA4 + Search Console + Bing + Clarity
- [ ] Submit sitemap to Google + Bing + Yandex
- [ ] Create the `blog/` skeleton + first 2 posts (Aviator guide + Sweet Bonanza)

### Weeks 3–6 (Content velocity)
- [ ] 4 more blog posts (1/week)
- [ ] Unique meta titles + descriptions for the 19 game pages
- [ ] Backlink outreach round 1 — 20 emails to BD casino review sites
- [ ] Submit to 5 free-play directories
- [ ] Launch Telegram channel for daily picks
- [ ] First guest post on a BD blog

### Weeks 7–10 (Acceleration)
- [ ] 4 more blog posts
- [ ] Round 2 outreach: 30 emails, focus on Bangla blogs
- [ ] Launch Medium republishing
- [ ] Add sticky signup pill + exit-intent + idle-mobile trigger
- [ ] Run a "free play challenge" campaign — get 50 BD users to try and post about it

### Weeks 11–13 (Iterate)
- [ ] 3 final blog posts (round to 13 published)
- [ ] Round 3 outreach: 30 emails, this time pitching from "we already have organic traffic" angle
- [ ] Analyze GA4 — which game pages convert best? Double down with more content
- [ ] A/B test signup CTAs

### Success criteria at day 90
- 13 blog posts published (bn+en versions)
- 30+ backlinks acquired
- 5,000+ monthly organic sessions
- 150+ organic signups/month
- Top-10 ranking for 3 long-tail keywords

---

## 9. What NOT to do

- ❌ Don't buy backlinks from PBNs / Fiverr sellers. Casino niche gets penalized hard for this.
- ❌ Don't auto-translate Bengali content. Use a native Bengali writer.
- ❌ Don't put the affiliate URL on every page directly — it confuses Google about your site's purpose. Keep it gated behind the Sign Up sheet.
- ❌ Don't chase only the head terms ("free casino games"). The 50 long-tail rankings will outperform 1 head term.
- ❌ Don't use exact-match anchor text on every backlink — Google's penguin algorithm flags it. Mix branded ("Bigtaka"), generic ("free play hub"), and natural ("try Aviator here").
- ❌ Don't index thin pages. If a blog post is <800 words, don't ship it.
- ❌ Don't ignore mobile speed. PageSpeed score on `/m/` should be 85+ on mobile.

---

## 10. Open questions / risks

- **iframe → direct hosting migration** is on your end (Option A above). Until it happens, ceiling on organic growth is ~30% of what it could be.
- **affiliate URL** — if the BD-targeting on the affiliate side is strict and they reject some BD IPs, the IP cloak will mistakenly block real players. Worth monitoring `signup_claim_blocked` events.
- **iGaming SEO competition in BD** is rising as legalization debate heats up. Move fast in the next 6 months while head terms are still gettable.
- **Bengali script SEO** — Google handles it well but mixing scripts in URLs is messy. Keep URLs in English/Latin, content in Bengali.

---

*Document version: 2026-06-07 · Owner: RD Jay · Next review: 30 days after Option A migration*
