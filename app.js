import {
    form, analyzeBtn, resetBtn, analysisModal, closeAnalysisModalBtn,
    rankingsSlider, reviewsSlider, seoScoreSlider, websiteUrlInput,
    locationSelect, industrySelect
} from "./domElements.js";
import {
    updateSliderDisplays, showResults, hideResults,
    showAnalysisModal, hideAnalysisModal,
    updateAnalysisProgress, displayAnalysisResults, autoPopulateFormFromAnalysis
} from "./uiManager.js";
import { performRealAnalysis } from "./seoAnalyzer.js";
import { calculateSEOCost } from "./costEstimator.js";
import { generateRecommendations } from "./recommendationGenerator.js";

// Initialize slider updates on input
rankingsSlider.addEventListener('input', updateSliderDisplays);
reviewsSlider.addEventListener('input', updateSliderDisplays);
seoScoreSlider.addEventListener('input', updateSliderDisplays);

// Analyze website button handler
analyzeBtn.addEventListener('click', handleAnalyzeWebsite);

// Form submission handler
form.addEventListener('submit', handleFormSubmit);

// Reset button handler
resetBtn.addEventListener('click', resetForm);

// Modal close handlers
analysisModal.addEventListener('click', (e) => {
    // Close modal if click is outside the modal-content
    if (e.target === analysisModal) {
        hideAnalysisModal();
    }
});
closeAnalysisModalBtn.addEventListener('click', hideAnalysisModal);


async function handleAnalyzeWebsite() {
    const url = websiteUrlInput.value.trim();
    if (!url) {
        alert('Please enter a website URL first');
        return;
    }

    // Validate URL format and prepend https if missing
    try {
        const urlObj = new URL(url);
        if (!urlObj.protocol.startsWith('http')) {
             websiteUrlInput.value = 'https://' + url; // Update input field
        }
         // Re-validate after prepending
         new URL(websiteUrlInput.value.trim());

    } catch {
        alert('Please enter a valid URL (e.g., https://example.com)');
        return;
    }

    showAnalysisModal(); // Show the modal

    try {
        const analysisResults = await performRealAnalysis(websiteUrlInput.value.trim(), updateAnalysisProgress);
        displayAnalysisResults(analysisResults); // Display results in the modal
        autoPopulateFormFromAnalysis(analysisResults); // Update form fields based on analysis
        // Analysis is complete, results are shown in the modal.
        // Keep modal open until user closes it to review results.

    } catch (error) {
        console.error('Analysis error:', error);
        // This catch block might not be reached if performRealAnalysis catches its own errors.
        // However, if a critical error occurs, we should inform the user.
        updateAnalysisProgress(5, 5, 'Analysis failed.'); // Ensure progress bar completes
        // The displayAnalysisResults function already handles showing a message if results are empty/failed.
        // Keep the modal open for the user to see the failure message.
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const location = locationSelect.value;
    const industry = industrySelect.value;
    const rankings = parseInt(rankingsSlider.value);
    const reviews = parseInt(reviewsSlider.value);
    const seoScore = parseInt(seoScoreSlider.value);

     if (!location || !industry) {
        alert('Please select your location and industry.');
        return;
    }

    const { monthly, setup } = calculateSEOCost({
        location,
        industry,
        rankings,
        reviews,
        seoScore
    });

    const recommendations = generateRecommendations({
        location,
        industry,
        rankings,
        reviews,
        seoScore
    });

    showResults(monthly, setup, recommendations);
}

function resetForm() {
    form.reset();
    hideResults();

    // Reset sliders to initial values and update display
    rankingsSlider.value = 0;
    reviewsSlider.value = 0;
    seoScoreSlider.value = 50;
    updateSliderDisplays(); // Call without arguments to update all

     // Clear website URL input
     websiteUrlInput.value = '';


    // Scroll to the tool section, not necessarily the very top
    document.getElementById('tool-section').scrollIntoView({ behavior: 'smooth' });
}


// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial slider values display
    updateSliderDisplays();
});