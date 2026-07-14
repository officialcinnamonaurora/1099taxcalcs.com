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
