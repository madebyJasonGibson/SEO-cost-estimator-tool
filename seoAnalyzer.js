import { analysisStatusText, analysisResultsDiv, analysisProgressBar, rankingsSlider, reviewsSlider, seoScoreSlider } from "./domElements.js";
import { updateAnalysisProgress, displayAnalysisResults, autoPopulateFormFromAnalysis } from "./uiManager.js";


// API endpoints for real SEO analysis (using available free/basic ones)
const API_CONFIG = {
    // Google PageSpeed Insights API for performance (limited, requires no key)
    pageSpeed: 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
    // allorigins.win as a CORS proxy for basic scraping (unreliable but free)
    metaAnalysis: 'https://api.allorigins.win/get?url='
    // SSL Labs API is rate-limited and not suitable for public use without handling, so basic HTTPS check is used instead
};

// Helper to determine score status
function getScoreStatus(score) {
    if (score >= 80) return 'good';
    if (score >= 50) return 'medium';
    return 'poor';
}

// Note: Scraping via allorigins is unreliable and may fail frequently
async function fetchWithProxy(url) {
    try {
        const proxyUrl = `${API_CONFIG.metaAnalysis}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Proxy fetch failed: ${response.status}`);
        const data = await response.json();
        if (data.status && data.status.http_code && data.status.http_code !== 200) throw new Error(`Proxy returned HTTP ${data.status.http_code}`);
        if (!data.contents) throw new Error('Proxy returned no content');
        return data.contents;
    } catch (error) {
        console.error('Proxy fetch error:', error);
        throw error; // Rethrow to be caught by analysis function
    }
}

async function analyzePageSpeed(url) {
    try {
        const response = await fetch(
            `${API_CONFIG.pageSpeed}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`
        );
        const data = await response.json();

        if (data.lighthouseResult && data.lighthouseResult.categories && data.lighthouseResult.categories.performance) {
            const score = Math.round(data.lighthouseResult.categories.performance.score * 100);
            return {
                category: 'Page Speed (Mobile)',
                score: score,
                status: getScoreStatus(score),
                details: data.lighthouseResult.categories.performance.title || 'Performance Score'
            };
        } else {
             return {
                category: 'Page Speed (Mobile)',
                score: 50,
                status: 'medium',
                details: 'Could not retrieve performance score'
            };
        }
    } catch (error) {
        console.error('PageSpeed API error:', error);
        return {
            category: 'Page Speed (Mobile)',
            score: 40,
            status: 'poor',
            details: 'Failed to get score from API'
        };
    }
}


async function analyzeMobileFriendliness(url) {
    let content = '';
    try {
        content = await fetchWithProxy(url);

        let score = 0;
        // Check for viewport meta tag (essential for mobile responsiveness)
        if (/<meta[^>]*name=["']viewport["'][^>]*content=[^>]*>/i.test(content)) score += 60;
        // Check for common responsive CSS patterns (@media queries, framework classes)
        if (/@media\s*\(|bootstrap|foundation|tailwind|flexbox|grid/i.test(content)) score += 40;

        return {
            category: 'Mobile Friendly',
            score: Math.min(100, score),
            status: getScoreStatus(score),
            details: 'Checked for viewport meta tag and responsive CSS'
        };
    } catch (error) {
        console.error('Mobile analysis error (via proxy):', error);
        return {
            category: 'Mobile Friendly',
            score: 40,
            status: 'poor',
            details: 'Could not fetch content to check for mobile tags'
        };
    }
}

async function analyzeMetaTags(url) {
    let content = '';
     try {
        content = await fetchWithProxy(url);

        let score = 0;
        const checks = {
            title: { pass: /<title[^>]*>([^<]+)<\/title>/i.test(content), weight: 25 },
            metaDescription: { pass: /<meta[^>]*name=["']description["'][^>]*content=["'][^"']{50,160}["']/i.test(content), weight: 25 },
            h1Tag: { pass: /<h1[^>]*>([^<]+)<\/h1>/i.test(content), weight: 20 },
            openGraph: { pass: /<meta[^>]*property=["']og:[^"']["']/i.test(content), weight: 15 },
            canonicalTag: { pass: /<link[^>]*rel=["']canonical["']/i.test(content), weight: 15 }
        };

        let details = 'Checks: ';
        Object.entries(checks).forEach(([key, check]) => {
            if (check.pass) {
                score += check.weight;
                 details += `${key}: Pass, `;
            } else {
                details += `${key}: Fail, `;
            }
        });
        details = details.slice(0, -2);

        return {
            category: 'Meta Tags & On-Page SEO',
            score: Math.min(100, score),
            status: getScoreStatus(score),
            details: details
        };
    } catch (error) {
        console.error('Meta analysis error (via proxy):', error);
         return {
            category: 'Meta Tags & On-Page SEO',
            score: 30,
            status: 'poor',
             details: 'Could not fetch content for meta tag check'
        };
    }
}

async function analyzeSSL(url) {
    const hasSSL = url.trim().toLowerCase().startsWith('https://');
    return {
        category: 'SSL Certificate',
        score: hasSSL ? 100 : 0,
        status: hasSSL ? 'good' : 'poor',
        details: hasSSL ? 'Site uses HTTPS' : 'Site does NOT use HTTPS'
    };
}

async function analyzeTechnicalSEO(url) {
    let content = '';
    try {
        content = await fetchWithProxy(url);

        let score = 0;
        const checks = {
            structuredData: { pass: /application\/ld\+json|schema\.org/i.test(content), weight: 30 },
            sitemapReference: { pass: /sitemap\.xml/i.test(content), weight: 20 },
            robotsMeta: { pass: /<meta[^>]*name=["']robots["']/i.test(content), weight: 20 },
            altTags: { pass: checkAltTags(content), weight: 30 }
        };

        let details = 'Checks: ';
         Object.entries(checks).forEach(([key, check]) => {
            if (check.pass) {
                score += check.weight;
                 details += `${key}: Pass, `;
            } else {
                details += `${key}: Fail, `;
            }
        });
         details = details.slice(0, -2);


        return {
            category: 'Technical SEO',
            score: Math.min(100, score),
            status: getScoreStatus(score),
            details: details
        };
    } catch (error) {
        console.error('Technical SEO analysis error (via proxy):', error);
         return {
            category: 'Technical SEO',
            score: 20,
            status: 'poor',
             details: 'Could not fetch content for technical checks'
        };
    }
}

// Helper for Alt Tag check
function checkAltTags(content) {
    const imgTags = content.match(/<img[^>]*>/gi) || [];
    if (imgTags.length === 0) return true;
    const imgWithAlt = content.match(/<img[^>]*alt=["'][^"']*["']/gi) || [];
     const imagesWithContentAlt = imgWithAlt.filter(img => !/alt=["']\s*["']/i.test(img));
    return imagesWithContentAlt.length / imgTags.length >= 0.7;
}


export async function performRealAnalysis(url, progressCallback) {
    const results = [];
    const totalSteps = 5;
    let completedSteps = 0;

    const updateProgress = (status) => {
        completedSteps++;
        progressCallback(completedSteps, totalSteps, status);
    };

    try {
        updateProgress('Analyzing page speed (mobile)...');
        const speedResult = await analyzePageSpeed(url);
        results.push(speedResult);

        updateProgress('Checking mobile responsiveness...');
        const mobileResult = await analyzeMobileFriendliness(url);
        results.push(mobileResult);

        updateProgress('Reviewing meta tags and content...');
        const metaResult = await analyzeMetaTags(url);
        results.push(metaResult);

        updateProgress('Checking SSL certificate...');
        const sslResult = await analyzeSSL(url);
        results.push(sslResult);

        updateProgress('Performing technical SEO checks...');
        const techResult = await analyzeTechnicalSEO(url);
        results.push(techResult);

         // Ensure progress is 100% even if a step failed to report
         updateProgress('Finalizing...');


        return results;

    } catch (error) {
        console.error('Overall analysis error:', error);
        // The uiManager function displayAnalysisResults is better suited to show the final status message
        // upon receiving potentially incomplete results.
        // Just return the results collected so far.
        return results;
    }
}

// Expose getScoreStatus if needed elsewhere, otherwise keep private
// export { getScoreStatus };