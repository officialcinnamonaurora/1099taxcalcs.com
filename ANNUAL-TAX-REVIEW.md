# Annual Tax Review Checklist

Use official IRS.gov and SSA.gov material only. Do not publish a value that lacks an applicable year, effective dates, source URL, review note, verification status, and annual-review warning.

1. Create the next file under `data/tax-years/` by copying the prior year and changing the year before changing values.
2. Verify the Social Security wage base and employee/self-employed Social Security rates with SSA.
3. Verify Medicare and Additional Medicare rates and filing-status thresholds with the IRS.
4. Verify all five filing-status ordinary-income bracket arrays and standard deductions in IRS Publication 505 or superseding official guidance.
4. Verify the Schedule SE net-earnings percentage and deductible-portion methodology.
5. Verify every standard mileage period. If an IRS announcement changes a rate midyear, create contiguous records with no gaps or overlaps and exact effective dates.
6. Verify the simplified home-office rate and square-foot maximum.
7. Verify standard calendar-year estimated-tax dates in Form 1040-ES and review Publication 505 for exceptions and annualized-income guidance.
8. Update source titles, official URLs, review notes, verification statuses, and `lastReviewed`.
9. Update page labels, worked examples, methodology, and any year-specific explanatory text.
10. Update the browser script references if the canonical tax-year filename changes.
11. Run `node scripts/validate-tax-config.mjs`, `node scripts/test-calculators.mjs`, and `node scripts/validate-site.mjs`.
12. Run the local HTTP/browser regression procedure in `TESTING.md` at approximately 360px and desktop width.
13. Confirm sitemap dates if sitemap `<lastmod>` values are introduced; none are currently used.
14. Confirm `CNAME` is unchanged if present. Never generate, rename, or edit it as part of the annual update.
15. Review the final diff for remote scripts, APIs, tracking, secrets, temporary browser profiles, screenshots, and logs.

Values that remain user-entered—income-tax planning percentages, state/local rates, benefits, deductions, custom mileage rates, and safe-harbor education inputs—must not be silently converted into authoritative defaults.

## Phase 5 page review

- Review profession pages when work patterns, platform reporting, or linked official guidance materially changes.
- Review education pages for current forms, payment timing, Schedule SE methodology, mileage periods, home-office rules, and official links.
- Review deduction pages for limitations, capitalization, depreciation, reimbursement, inventory, retirement arrangements, and health-insurance treatment.
- Regenerate with `node build_phase5.mjs`, then confirm all 55 URLs remain in the sitemap and metadata remains unique.
- Mostly evergreen concepts still need source-link and correction-policy review; year-specific statements require annual verification before publication.
- For Phase 5B, review the `educationDetail` entries in `build_phase5.mjs`, verify each linked IRS or SSA page, regenerate, and run `node scripts/test-phase5b.mjs`.
- For Phase 5C, review every `deductionDetail` source and warning. Give extra attention to mileage periods, meal limitations, travel rules, home-office methods, depreciation and expensing guidance, retirement plan limits and deadlines, and Form 7206 health-insurance guidance. Regenerate and run `node scripts/test-phase5c.mjs` without changing `CNAME`.

## Phase 6 annual production review

## Phase 7 release review

- After tax-year or content regeneration, run `build_phase6.mjs` and `build_phase7.mjs` last.
- Verify planning-scope language, official-source links, Contact owner configuration, Privacy statements, and any proposed advertising change.
- Run Phase 7 validation plus every earlier tax/configuration/calculator suite and complete the human launch checklist.

- Run earlier generators only when their sources change, then run `node build_phase6.mjs` last so search, cross-links, trust pages, inventory, and link reporting remain synchronized.
- Review all search records for accurate titles, summaries, types, and keywords after adding or changing a public page.
- Run `validate-phase6.mjs` to catch sitemap drift, duplicate metadata, missing sources or review dates, broken links, and orphan pages.
- Review `CONTENT-QUALITY-CHECKLIST.md` across each page type and manually inspect search, filters, navigation, tables, calculators, source links, and long text at 360px through desktop width.
- Confirm privacy statements still match implementation and that no APIs, analytics, tracking, cookies, local storage, external scripts, or query persistence were introduced.
- Preserve `CNAME` exactly as `1099TaxCalcs.com` and exclude temporary profiles, screenshots, output, and logs from upload.
