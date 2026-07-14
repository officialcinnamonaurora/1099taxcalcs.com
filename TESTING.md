# Phase 4 Testing

## Automated Node checks

Run from the project root:

```text
node --check assets/js/tax-config.js
node --check assets/js/calculator-core.js
node --check assets/js/calculators.js
node --check assets/js/phase3-calculators.js
node --check build_phase4.mjs
node --check assets/js/calculators/expansion-core.js
node --check assets/js/calculators/federal-income-tax.js
node --check assets/js/calculators/schedule-c-profit.js
node --check assets/js/calculators/contractor-rate.js
node --check assets/js/calculators/business-expenses.js
node --check assets/js/calculators/tax-reserve.js
node --check assets/js/calculators/invoice-income.js
node scripts/validate-tax-config.mjs
node scripts/test-calculators.mjs
node scripts/validate-site.mjs
```

The calculator suite covers zero, decimal, negative-net clamping, very large values, the Social Security wage-base interaction, Additional Medicare Tax, 2026 mileage periods, payment dates, five filing-status bracket configurations, and progressive federal ordinary-income tax.

## Browser regression

Start `python -m http.server 8000`, then open `http://localhost:8000/tests/browser-regression.html`. The harness loads the homepage and all twelve calculators at a 360px iframe width and checks empty, zero, decimal, negative, very large, invalid-percentage, reset, copy, result, year-label, nested-navigation, overflow, and JavaScript-error behavior.

Browser profiles and generated output belong outside the published site or in ignored `.browser-profile/`, `.edge-smoke/`, `.edge-smoke2/`, `test-output/`, or `screenshots/` folders.

## Phase 3 run record

The completion report records only commands actually run. Browser results should be regenerated after any calculator markup, CSS, or controller change.
