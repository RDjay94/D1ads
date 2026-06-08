# How to publish 3 new articles every day

The Learning Hub is built so adding a new article takes ~5 minutes per piece. Three steps total.

---

## The system in 30 seconds

- `articles.json` is the source of truth — the hub reads it at runtime.
- Each article is a standalone HTML file in `articles/<slug>.html`.
- "Today's 3" on the hub is automatic — any article whose `published` field equals today's date appears in the featured slot.
- Sitemap (`../sitemap.xml`) needs the new URL added so Google finds it.

---

## Daily workflow (per article)

### 1. Pick a slug + topic

Open `articles.json`. Read the existing entries to avoid duplicating angles.

Slug format: kebab-case, descriptive, includes the keyword. Examples:
- `aviator-auto-cashout-deep-dive`
- `live-blackjack-rules-bangladesh`
- `eid-2026-deposit-bonus-traps`

### 2. Add a manifest entry

Add a new object to the `articles` array in `articles.json`:

```json
{
  "slug": "your-slug-here",
  "title": "Title exactly matching the H1 of the article",
  "excerpt": "140-160 char teaser — appears on hub card and Open Graph",
  "cat": "aviator | slots | live | strategy | cricket | bonus | basics",
  "tags": ["tag1", "tag2", "tag3"],
  "published": "YYYY-MM-DD",
  "readMin": 6,
  "demoLink": "../games/<demo>.html",
  "demoLabel": "Try X FREE"
}
```

Set `published` to today's date (YYYY-MM-DD). The hub will pick it up as "today's article" automatically.

### 3. Create the article HTML

Easiest: duplicate any existing article in `articles/` (`how-to-play-aviator-bangladesh.html` is the canonical reference). Then change:

- `<title>` and `<meta name="description">`
- `<link rel="canonical">` URL
- All Open Graph + Twitter meta tags
- JSON-LD: `headline`, `datePublished`, `dateModified`, `articleSection`, `keywords`
- `<body data-slug="..." data-cat="...">` (slug + category, matches articles.json)
- `<span class="article-cat">` text
- `<h1>` (matches title)
- `.article-meta` date + read-time
- `.article-lede` (2-3 sentence answer to the headline question — Google featured-snippet target)
- `.article-toc` H2 anchor list
- All body content
- Themed `<h3>` text inside `.article-signup` (e.g. "Real wins waiting. Welcome Rewards inside.")

### 4. Add to sitemap

Open `../sitemap.xml`. Inside the `<!-- LEARNING ARTICLES -->` block, add:

```xml
<url><loc>https://www.playbigtaka.com/learning/articles/your-slug-here.html</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
```

### 5. Push live

Commit. Push to the `D1ads` repo. GitHub Pages redeploys in ~60 seconds. The hub auto-loads the new entry — no rebuild needed.

---

## Content rules (so it actually converts)

Every article must include:

| Element | Why |
|---|---|
| Lede callout (`.article-lede`) with 2-3 sentence direct answer | Google featured-snippet target |
| TOC chip-set linking to H2 ids | Helps mobile readers + adds anchor-link CTR |
| Mid-article `.play-cta` linking to the relevant free demo | Pre-signup engagement — gets reader into the product flow |
| End-of-article `.article-signup` with gold "Claim Welcome Rewards" + ghost "Try FREE First" | The actual conversion event |
| Minimum 2 internal links to OTHER articles | Lifts time-on-site + SEO link equity |
| At least one `<table>` OR `<blockquote>` for visual variety | Breaks up text walls |
| ≥1100 words of body content | Below this, Google ranks it as thin |

---

## Voice rules (quick reference)

Pulled from `Marketing/_context/bigtaka_brand_voice_guide.md` — read it for the full spec.

- **Energy + confidence.** Short sentences. Action verbs. No "as we all know" or "many people wonder".
- **Bangladesh-first.** Mention FUN coins, BD players, Bangladesh by name. The reader feels seen when content speaks to their context.
- **Banglish in 1-2 spots.** Light, natural — "shob theke important", "ajker tip". Never forced.
- **Honest about variance.** No "you WILL win" claims. "You can put yourself in better position" is the right phrasing.
- **No emojis in body prose.** Article-cat span and play-cta buttons may use ▶ or 🔥. Body stays clean.

---

## Topic ideas for upcoming articles

Run out of ideas? Pick from this seed list. Each is a high-intent search term in BD.

**Aviator (still high volume)**
- Aviator auto-cashout strategy — the 1.30× vs 2× debate
- Provably fair RNG explained — how to verify Aviator results
- Aviator vs Spaceman — Spribe's two crash games compared
- Aviator stats panel — what the round history really tells you

**Slots**
- Big Bass Bonanza guide — Pragmatic's biggest BD hit explained
- Wolf Gold review — RTP, hit rate, when to chase
- Megaways slots explained — what 117,649 ways really means
- Slot bonus buy feature — worth it for BD bankrolls?

**Live Casino**
- Live blackjack rules — when to hit, stand, split (BD edition)
- Dragon Tiger guide — simplest live table for beginners
- Live baccarat — banker vs player edge math
- Live dealer etiquette — what NOT to do in chat

**Cricket / Sports**
- T20 World Cup 2026 predictor strategy
- Cricket prop bets explained — top batsman, over total, method
- Bangladesh Premier League predictor — local league focus
- Football vs cricket betting — which has tighter margins in BD?

**Strategy / Math**
- House edge vs RTP — why they're not the same thing
- Variance vs volatility — the precision matters
- Kelly criterion for casino — sizing bets to your edge
- Stop-loss vs stop-win — which discipline matters more?

**Bonus / News**
- Wagering requirements explained — the 35× trap
- Deposit bonus vs no-deposit bonus — math comparison
- Sticky bonus vs cashable bonus — what they're not telling you
- Bigtaka VIP tiers — how the loyalty system actually works

---

## Speed tip — batch 3 in one sitting

For the daily-3 cadence: pick all 3 topics on Monday morning. Write all 3 in a 90-minute block. Set `published` to today's date for one, tomorrow's for another, day-after's for the third. Push once. The hub will rotate them in automatically.

That's 90 min/week — not 30 min/day. Same output. Better focus.
