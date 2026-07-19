# Content Quality Checklist

Use this checklist for every calculator, profession guide, tax guide, deduction guide, and trust page before regeneration or upload.

## Purpose and clarity

- The page answers one clear visitor question and does not duplicate another page's purpose.
- The title, description, H1, introduction, headings, and example are accurate and distinct.
- Paragraphs are readable, specific, and free of filler, keyword stuffing, broken sentences, or unsupported claims.
- Hypothetical examples are labeled and are never presented as real taxpayer outcomes.

## Tax safety and trust

- Tax-specific claims link to a relevant official government source.
- Year-sensitive rates, limits, dates, and forms carry the correct year and annual-review status.
- Eligibility language is conditional; the page does not guarantee deductions, refunds, savings, payments, penalties, or classification.
- The disclaimer and last-reviewed date are visible where required.
- Privacy statements match the static implementation: no APIs, tracking, cookies, local storage, or financial-data transmission.

## Navigation and action

- Related calculators and guides are genuinely useful and use descriptive anchor text.
- The page receives at least one useful internal link and appears in the sitemap when public.
- Search-index title, description, type, URL, and keywords accurately represent the page.

## Accessibility and presentation

- Exactly one H1 is present and heading order is logical.
- Links, labels, filters, search, details, tables, errors, and results work with a keyboard and assistive technology.
- Focus indicators, contrast, tap targets, reduced motion, and skip navigation remain intact.
- Content, source URLs, cards, tables, ads, and controls remain readable at approximately 360px.
- UTF-8 encoding is valid without BOM, punctuation is correct, and no mojibake remains.

## Release checks

## Final production review

- The first screen states the page purpose without generic filler.
- Examples remain clearly hypothetical and distinct from taxpayer outcomes.
- Planning, filing, eligibility, state/local exclusions, changing rules, and official-source review are clear without burying useful content.
- Navigation, breadcrumbs, search, filters, related links, and calls to action are descriptive and keyboard usable.
- Advertisement placeholders are labeled, unobtrusive, non-sticky, and outside calculator workflows.
- Contact information is owner approved or clearly marked as pending configuration.
- Human QA covers 320px through desktop, keyboard focus, console output, and calculator actions.

- Regenerate from source, running `node build_phase6.mjs` last.
- Run all validation and calculator suites documented in `TESTING.md`.
- Confirm `CNAME` contains exactly `1099TaxCalcs.com` and review files excluded by `.gitignore` before upload.
