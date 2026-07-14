'use strict';
/* Compatibility facade. Canonical values live in data/tax-years/2026.js. */
(function(root){
  const data=root.TaxYear2026;
  if(!data)throw new Error('2026 tax-year data did not load.');
  root.TaxConfig=Object.freeze({
    taxYear:data.taxYear,lastReviewed:data.lastReviewed,
    sourceReviewStatus:data.verificationStatus,
    annualReviewWarning:data.annualReviewWarning,
    values:data.values,mileagePeriods:data.mileagePeriods,
    estimatedTaxDates:data.estimatedTaxDates,education:data.education,
    federalIncomeTax:data.federalIncomeTax
  });
})(window);
