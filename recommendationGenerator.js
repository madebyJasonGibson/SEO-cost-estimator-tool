export function generateRecommendations(data) {
    const recommendations = [];

    // More detailed recommendations based on scores/inputs
    if (data.seoScore < 60) {
        recommendations.push({
            icon: 'fas fa-tools',
            title: 'Technical SEO Optimization',
            description: `Your SEO score (${data.seoScore}%) indicates significant technical issues. Focus on site speed, mobile-friendliness, and core web vitals.`,
            impact: 'High Impact'
        });
    } else if (data.seoScore < 80) {
        recommendations.push({
            icon: 'fas fa-cogs',
            title: 'On-Page SEO & Site Structure',
            description: `With a score of ${data.seoScore}%, your on-page SEO needs refinement. Improve meta tags, headers, internal linking, and content quality.`,
            impact: 'Medium Impact'
        });
    }

    if (data.rankings < 5) {
        recommendations.push({
            icon: 'fas fa-search',
            title: 'Aggressive Keyword Strategy & Content Creation',
            description: `Currently ranking for only ${data.rankings} top-10 keywords. Significant effort needed in keyword research and creating high-quality, targetted content.`,
            impact: 'Very High Impact'
        });
    } else if (data.rankings < 15) {
         recommendations.push({
            icon: 'fas fa-pen-fancy',
            title: 'Expand Content Strategy',
            description: `You have a foundation with ${data.rankings} top-10 keywords. Focus on expanding content topics and targeting long-tail keywords.`,
            impact: 'High Impact'
        });
    }

    if (data.reviews < 50) {
        recommendations.push({
            icon: 'fas fa-star',
            title: 'Prioritize Review Generation',
            description: `With ${data.reviews} reviews, boosting your review count is crucial for local trust and visibility. Implement a review request system.`,
            impact: 'High Impact (Local)'
        });
    } else if (data.reviews < 150) {
         recommendations.push({
            icon: 'fas fa-thumbs-up',
            title: 'Maintain & Monitor Online Reputation',
            description: `With ${data.reviews} reviews, maintain a steady flow of new reviews and actively manage your online reputation.`,
            impact: 'Medium Impact (Local)'
        });
    }


    // Location-based recommendation
    if (data.location === 'major-city' || data.location === 'mid-size-city' || data.location === 'small-city') {
         recommendations.push({
            icon: 'fas fa-map-marker-alt',
            title: 'Robust Local SEO Focus',
            description: `Competing in your area requires strong local SEO: Google My Business optimization, local citations, and geo-targetted content.`,
            impact: 'Crucial for Local'
        });
    }

     // Industry-based recommendation (examples - can be expanded)
     if (data.industry === 'healthcare' || data.industry === 'legal') {
         recommendations.push({
             icon: 'fas fa-shield-alt',
             title: 'E-A-T (Expertise, Authority, Trust)',
             description: 'Crucial for YMYL (Your Money Your Life) industries. Build authoritativeness with expert content and strong backlinks.',
             impact: 'Crucial for Industry'
         });
     }
     if (data.industry === 'restaurants' || data.industry === 'retail') {
         recommendations.push({
             icon: 'fas fa-mobile-alt',
             title: 'Mobile & Local Discovery',
             description: 'Ensure your site is lightning fast and easily discoverable via local searches and mobile devices.',
             impact: 'Crucial for Industry'
         });
     }
      if (data.industry === 'real-estate') {
         recommendations.push({
             icon: 'fas fa-home',
             title: 'Local Listings & Property Schema',
             description: 'Optimize local directories and use structured data (schema markup) for property listings.',
             impact: 'Crucial for Industry'
         });
     }


     // General recommendations if fewer specific ones are added or based on overall need
     if (recommendations.length < 4) {
          recommendations.push({
              icon: 'fas fa-link',
              title: 'Backlink Acquisition',
              description: 'Building high-quality backlinks from authoritative sites is key to improving domain authority and rankings.',
              impact: 'High Impact'
          });
          recommendations.push({
            icon: 'fas fa-chart-line',
            title: 'Performance Monitoring & Reporting',
            description: 'Regularly track keyword rankings, traffic, and conversion metrics to measure ROI.',
            impact: 'Standard Practice'
        });
          recommendations.push({
              icon: 'fas fa-users',
              title: 'User Experience (UX)',
              description: 'A user-friendly site that is easy to navigate and provides value keeps visitors engaged, which search engines notice.',
              impact: 'Foundation'
          });
     }


    return recommendations;
}