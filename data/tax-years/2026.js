'use strict';
/* Canonical annual tax data. Browser-safe UMD; Node validation loads this in a VM. */
(function(root){
  const annualWarning='Review every value against current IRS or SSA guidance before each tax year and after midyear announcements.';
  const source=(title,url)=>Object.freeze({title,url});
  const verified=(key,value,description,sourceInfo,effectiveStart,effectiveEnd=null,note='Verified for 2026; annual review required.')=>Object.freeze({key,value,description,source:sourceInfo,effectiveStart,effectiveEnd,verificationStatus:'verified-official',reviewNote:note,annualReviewWarning:annualWarning});
  const IRS_SE=source('IRS Topic No. 554, Self-employment tax','https://www.irs.gov/taxtopics/tc554');
  const IRS_MED=source('IRS Topic No. 560, Additional Medicare Tax','https://www.irs.gov/taxtopics/tc560');
  const SSA_BASE=source('SSA Contribution and Benefit Base','https://www.ssa.gov/oact/cola/cbb.html');
  const IRS_P15=source('IRS Publication 15 (2026), Employer’s Tax Guide','https://www.irs.gov/publications/p15');
  const IRS_ES=source('2026 Form 1040-ES, Estimated Tax for Individuals','https://www.irs.gov/pub/irs-pdf/f1040es.pdf');
  const IRS_505=source('IRS Publication 505 (2026), Tax Withholding and Estimated Tax','https://www.irs.gov/publications/p505');
  const IRS_MILE_1=source('IRS Notice 2026-10, 2026 Standard Mileage Rates','https://www.irs.gov/irb/2026-04_IRB');
  const IRS_MILE_2=source('IRS Announcement 2026-11, Revised Optional Standard Mileage Rates','https://www.irs.gov/irb/2026-29_irb');
  const IRS_HOME=source('IRS Simplified option for home office deduction','https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction');
  const data=Object.freeze({
    taxYear:2026,lastReviewed:'2026-07-13',verificationStatus:'verified-official-sources',annualReviewWarning:annualWarning,
    values:Object.freeze({
      netEarningsPercentage:verified('netEarningsPercentage',0.9235,'Share of net self-employment earnings generally subject to self-employment tax',IRS_SE,'2026-01-01','2026-12-31'),
      socialSecuritySeRate:verified('socialSecuritySeRate',0.124,'Self-employed Social Security tax rate',SSA_BASE,'2026-01-01','2026-12-31'),
      medicareSeRate:verified('medicareSeRate',0.029,'Self-employed Medicare tax rate',IRS_SE,'2026-01-01','2026-12-31'),
      socialSecurityWageBase:verified('socialSecurityWageBase',184500,'Maximum combined wages and net earnings subject to Social Security tax',SSA_BASE,'2026-01-01','2026-12-31'),
      additionalMedicareRate:verified('additionalMedicareRate',0.009,'Additional Medicare Tax rate',IRS_MED,'2026-01-01','2026-12-31'),
      additionalMedicareThresholds:verified('additionalMedicareThresholds',{single:200000,mfj:250000,mfs:125000,hoh:200000,qw:200000},'Additional Medicare Tax thresholds by filing status',IRS_MED,'2026-01-01','2026-12-31'),
      employeeSocialSecurityRate:verified('employeeSocialSecurityRate',0.062,'Employee-side Social Security tax rate',SSA_BASE,'2026-01-01','2026-12-31'),
      employeeMedicareRate:verified('employeeMedicareRate',0.0145,'Employee-side Medicare tax rate',IRS_P15,'2026-01-01','2026-12-31'),
      deductibleSeTaxMethod:verified('deductibleSeTaxMethod','one-half-regular-se-tax','Deduction methodology: one-half of regular Social Security and Medicare SE tax; Additional Medicare Tax is excluded',IRS_SE,'2026-01-01','2026-12-31','The deduction affects adjusted gross income; it does not reduce SE tax dollar-for-dollar or guarantee a refund.'),
      simplifiedHomeOfficeRate:verified('simplifiedHomeOfficeRate',5,'Simplified home-office rate per eligible square foot',IRS_HOME,'2026-01-01','2026-12-31'),
      simplifiedHomeOfficeLimit:verified('simplifiedHomeOfficeLimit',300,'Maximum square feet under the simplified home-office method',IRS_HOME,'2026-01-01','2026-12-31')
    }),
    federalIncomeTax:Object.freeze({
      source:source('IRS Publication 505 (2026), Tax Rate Schedules and Standard Deduction Worksheet','https://www.irs.gov/publications/p505'),
      effectiveStart:'2026-01-01',effectiveEnd:'2026-12-31',verificationStatus:'verified-official',reviewNote:'Ordinary-income planning brackets only; capital gains, qualified dividends, AMT, NIIT, additional deductions, and special computations are excluded.',annualReviewWarning:annualWarning,
      standardDeductions:Object.freeze({single:16100,mfs:16100,mfj:32200,qw:32200,hoh:24150}),
      brackets:Object.freeze({
        single:Object.freeze([[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[Infinity,.37]]),
        mfs:Object.freeze([[12400,.10],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[384350,.35],[Infinity,.37]]),
        mfj:Object.freeze([[24800,.10],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[Infinity,.37]]),
        qw:Object.freeze([[24800,.10],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[Infinity,.37]]),
        hoh:Object.freeze([[17700,.10],[67450,.12],[105700,.22],[201750,.24],[256200,.32],[640600,.35],[Infinity,.37]])
      })
    }),
    mileagePeriods:Object.freeze([
      verified('businessMileageJanJun',0.725,'Business standard mileage rate, January 1–June 30, 2026',IRS_MILE_1,'2026-01-01','2026-06-30'),
      verified('businessMileageJulDec',0.76,'Revised business standard mileage rate, July 1–December 31, 2026',IRS_MILE_2,'2026-07-01','2026-12-31','Announcement 2026-11 revised the rate for deductible transportation expenses paid or incurred on or after July 1, 2026.')
    ]),
    estimatedTaxDates:Object.freeze([
      verified('estimatedPayment1','2026-04-15','Standard calendar-year first estimated-tax payment date',IRS_ES,'2026-04-15','2026-04-15'),
      verified('estimatedPayment2','2026-06-15','Standard calendar-year second estimated-tax payment date',IRS_ES,'2026-06-15','2026-06-15'),
      verified('estimatedPayment3','2026-09-15','Standard calendar-year third estimated-tax payment date',IRS_ES,'2026-09-15','2026-09-15'),
      verified('estimatedPayment4','2027-01-15','Standard calendar-year fourth estimated-tax payment date',IRS_ES,'2027-01-15','2027-01-15','January-payment exceptions, weekends, holidays, and special taxpayer rules require review.')
    ]),
    education:Object.freeze({estimatedTax:IRS_ES,withholdingAndEstimatedTax:IRS_505})
  });
  root.TaxYear2026=data;
})(typeof window!=='undefined'?window:globalThis);
