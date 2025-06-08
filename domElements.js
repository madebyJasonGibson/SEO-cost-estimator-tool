// DOM Elements
export const form = document.getElementById('seo-form');
export const resultsPanel = document.getElementById('results-panel');
export const analysisModal = document.getElementById('analysis-modal');
export const analyzeBtn = document.getElementById('analyze-btn');
export const websiteUrlInput = document.getElementById('website-url');
export const locationSelect = document.getElementById('location');
export const industrySelect = document.getElementById('industry');


// Slider elements
export const rankingsSlider = document.getElementById('rankings');
export const reviewsSlider = document.getElementById('reviews');
export const seoScoreSlider = document.getElementById('seo-score');

export const rankingsValue = document.getElementById('rankings-value');
export const reviewsValue = document.getElementById('reviews-value');
export const seoScoreValue = document.getElementById('seo-score-value');

// Cost display elements
export const monthlyCostSpan = document.getElementById('monthly-cost');
export const setupCostSpan = document.getElementById('setup-cost');
export const recommendationsListDiv = document.getElementById('recommendations-list');

// Modal specific elements
export const closeAnalysisModalBtn = analysisModal.querySelector('.close-modal');
export const analysisProgressBar = analysisModal.querySelector('.progress-fill');
export const analysisStatusText = document.getElementById('analysis-status');
export const analysisResultsDiv = document.getElementById('analysis-results');

// Reset button is defined in index.html now, but its ID is still needed here
export const resetBtn = document.querySelector('.reset-btn');