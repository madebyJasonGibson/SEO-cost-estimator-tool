// Cost calculation factors & multipliers (tuned for more "realism" based on impact)
const costFactors = {
    location: {
        'major-city': 1.8, // Higher competition, higher cost
        'mid-size-city': 1.4,
        'small-city': 1.0,
        'rural': 0.8
    },
    industry: {
        'healthcare': 2.0, // Highly competitive, regulated
        'legal': 2.2,     // Highly competitive, high value
        'real-estate': 1.5,
        'home-services': 1.3,
        'retail': 1.1,
        'restaurants': 1.0,
        'automotive': 1.4,
        'beauty': 1.0,
        'fitness': 1.1,
        'other': 1.0
    }
};

import { rankingsSlider, reviewsSlider, seoScoreSlider } from "./domElements.js";

export function calculateSEOCost(data) {
    const { location, industry, rankings, reviews, seoScore } = data;

    // Base costs (slightly adjusted)
    let baseMonthlyCost = 900;
    let baseSetupCost = 1800;

    // Apply location multiplier
    const locationMultiplier = costFactors.location[location] || 1.0;
    baseMonthlyCost *= locationMultiplier;
    baseSetupCost *= locationMultiplier;

    // Apply industry multiplier
    const industryMultiplier = costFactors.industry[industry] || 1.0;
    baseMonthlyCost *= industryMultiplier;
    baseSetupCost *= industryMultiplier;

    // Adjust based on current performance (more sophisticated factors)
    // Lower current performance means more work needed, thus higher cost

    // Rankings Factor: More keywords ranked high = less work needed for rankings
    // Max rankings 20 -> factor closer to 0 (less work needed for rankings)
    // Min rankings 0 -> factor closer to 1 (more work needed for rankings)
    const maxRankings = parseInt(rankingsSlider.max);
    const rankingsImprovementFactor = (maxRankings - rankings) / maxRankings; // Scales from 1 (0 ranked) to 0 (20 ranked)

    // Reviews Factor: More reviews = less initial focus on review generation
    // Max reviews 500 -> factor closer to 0
    // Min reviews 0 -> factor closer to 1
    const maxReviews = parseInt(reviewsSlider.max);
    const reviewsImprovementFactor = (maxReviews - Math.min(reviews, maxReviews)) / maxReviews; // Scales from 1 (0 reviews) to 0 (500+ reviews)

    // SEO Score Factor: Lower score = more technical & on-page work needed
    // Score 0 -> factor closer to 1
    // Score 100 -> factor closer to 0
    const maxScore = parseInt(seoScoreSlider.max);
    const seoImprovementFactor = (maxScore - seoScore) / maxScore; // Scales from 1 (0% score) to 0 (100% score)


    // Combine factors for monthly cost (ongoing effort)
    // Weigh factors: Rankings (most direct goal), SEO Score (foundational), Reviews (local/reputation)
    const monthlyAdjustmentFactor = (rankingsImprovementFactor * 0.4 + seoImprovementFactor * 0.4 + reviewsImprovementFactor * 0.2);
     // Add a base factor so cost doesn't drop too low even for good sites (maintenance)
    let adjustedMonthlyCost = baseMonthlyCost * (0.6 + monthlyAdjustmentFactor * 0.8); // Base 60% + up to 80% based on need


    // Combine factors for setup cost (initial fixes)
    // Weigh factors: SEO Score (technical fixes), Rankings (initial keyword targeting/on-page)
    const setupAdjustmentFactor = (seoImprovementFactor * 0.6 + rankingsImprovementFactor * 0.4);
    // Add a base factor for standard setup tasks
    let adjustedSetupCost = baseSetupCost * (0.5 + setupAdjustmentFactor * 1.0); // Base 50% + up to 100% based on need


    // Add fixed costs or minimums to make it more realistic
     const minMonthly = 500 * locationMultiplier;
     const minSetup = 1000 * locationMultiplier;

     adjustedMonthlyCost = Math.max(adjustedMonthlyCost, minMonthly);
     adjustedSetupCost = Math.max(adjustedSetupCost, minSetup);


    // Round to nearest 50
    const finalMonthlyCost = Math.round(adjustedMonthlyCost / 50) * 50;
    const finalSetupCost = Math.round(adjustedSetupCost / 50) * 50;

    return {
        monthly: finalMonthlyCost,
        setup: finalSetupCost
    };
}