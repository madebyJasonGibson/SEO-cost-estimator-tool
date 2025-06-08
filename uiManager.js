import {
    resultsPanel, analysisModal, rankingsSlider, reviewsSlider, seoScoreSlider,
    rankingsValue, reviewsValue, seoScoreValue, monthlyCostSpan, setupCostSpan,
    recommendationsListDiv, analysisProgressBar, analysisStatusText, analysisResultsDiv
} from "./domElements.js";

// Function to update slider value displays
export function updateSliderDisplays() {
    rankingsValue.textContent = rankingsSlider.value;
    reviewsValue.textContent = reviewsSlider.value;
    seoScoreValue.textContent = seoScoreSlider.value;
}

// Function to show results panel
export function showResults(monthly, setup, recommendations) {
    monthlyCostSpan.textContent = monthly.toLocaleString();
    setupCostSpan.textContent = setup.toLocaleString();

    // Render recommendations
    recommendationsListDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <i class="${rec.icon}"></i>
            <div class="content">
                <div class="title">${rec.title}</div>
                <div class="description">${rec.description}</div>
            </div>
            <div class="impact">${rec.impact}</div>
        </div>
    `).join('');


    resultsPanel.classList.remove('hidden');
    resultsPanel.scrollIntoView({ behavior: 'smooth' });
}

// Function to hide results panel
export function hideResults() {
    resultsPanel.classList.add('hidden');
}

// Function to show analysis modal
export function showAnalysisModal() {
    analysisModal.classList.remove('hidden');
    // Reset modal state
    analysisProgressBar.style.width = '0%';
    analysisStatusText.textContent = 'Starting analysis...'; // Updated initial text
    analysisResultsDiv.classList.add('hidden');
    analysisResultsDiv.innerHTML = ''; // Clear previous results
}

// Function to hide analysis modal
export function hideAnalysisModal() {
    analysisModal.classList.add('hidden');
    // Reset modal content when hidden
    analysisProgressBar.style.width = '0%';
    analysisStatusText.textContent = '';
    analysisResultsDiv.classList.add('hidden');
    analysisResultsDiv.innerHTML = '';
}

// Function to update analysis progress
export function updateAnalysisProgress(step, totalSteps, status) {
    const progress = (step / totalSteps) * 100;
    analysisProgressBar.style.width = progress + '%';
    analysisStatusText.textContent = status;
}

// Function to display analysis results in the modal
export function displayAnalysisResults(results) {
    if (results.length === 0 || results.every(res => res.score === undefined)) {
         analysisStatusText.textContent = 'Analysis failed or no data retrieved.'; // Final status on failure
         analysisResultsDiv.innerHTML = `<p style="color: var(--text-secondary);">No analysis data could be retrieved. Please check the URL or try again later.</p>`;
    } else {
        analysisStatusText.textContent = 'Analysis complete!'; // Final status on success
        analysisResultsDiv.innerHTML = `
            <h4 style="margin-bottom: 1rem; color: var(--text-primary);">SEO Analysis Results</h4>
            ${results.map(result => {
                // Ensure score and status are present before displaying
                 if (result.score === undefined || result.status === undefined) {
                     // Display item even if score is missing, maybe just with category and detail?
                     // Or skip, as currently implemented. Let's stick to skipping incomplete ones for clarity.
                     return '';
                 }
                 return `
                    <div class="analysis-item">
                        <div class="analysis-category">${result.category}</div>
                        <div class="analysis-detail">${result.details}</div>
                        <span class="analysis-score score-${result.status}">
                            ${result.score}%
                        </span>
                    </div>
                 `;
            }).join('')}
            <div style="margin-top: 1rem; padding: 1rem; background: var(--dark-bg); border-radius: 8px; font-size: 0.9rem; color: var(--text-secondary);">
                <strong>Note:</strong> This analysis provides basic SEO insights using publicly available methods. For comprehensive audits, consider professional SEO tools. Results may vary based on site structure and proxy reliability.
            </div>
        `;
    }

    analysisResultsDiv.classList.remove('hidden');
}

// Function to auto-populate form based on real analysis
export function autoPopulateFormFromAnalysis(results) {
    // Calculate weighted average SEO score from analysis results
    const weights = {
        'Page Speed (Mobile)': 0.25,
        'Mobile Friendly': 0.2,
        'Meta Tags & On-Page SEO': 0.25,
        'SSL Certificate': 0.1,
        'Technical SEO': 0.2
    };

    let weightedScoreSum = 0;
    let totalWeight = 0;
    let foundAnalysisData = false;

    results.forEach(result => {
         if (result.score !== undefined) {
            const weight = weights[result.category] || 0;
            weightedScoreSum += result.score * weight;
            totalWeight += weight;
            foundAnalysisData = true;
         }
    });

    let avgScore = 50; // Default if no data found or analysis failed
    if (foundAnalysisData && totalWeight > 0) {
        avgScore = Math.floor(weightedScoreSum / totalWeight);
    }

    // Clamp score to slider range
    avgScore = Math.max(0, Math.min(100, avgScore));

    // Update the slider value
    seoScoreSlider.value = avgScore;


    // Estimate rankings based on SEO score (very rough estimation)
    // More reliable rankings often correlate with better overall SEO.
    let estimatedRankings;
    if (avgScore >= 90) {
        estimatedRankings = Math.floor(Math.random() * 15) + 5; // 5-19
    } else if (avgScore >= 70) {
         estimatedRankings = Math.floor(Math.random() * 10) + 3; // 3-12
    } else if (avgScore >= 50) {
         estimatedRankings = Math.floor(Math.random() * 7) + 1; // 1-7
    } else {
        estimatedRankings = Math.floor(Math.random() * 3); // 0-2
    }
     estimatedRankings = Math.min(estimatedRankings, parseInt(rankingsSlider.max)); // Clamp to slider max

    // Update the slider value
    rankingsSlider.value = estimatedRankings;


    // Estimating reviews is not possible from technical analysis.
    // Keep the current value or set a reasonable default/random if resetting the form.
    // For auto-population *after* analysis, we don't change reviews as it's unrelated.


    // Update the displayed values for the sliders that were changed
    updateSliderDisplays(); // Updates all, which is fine
}