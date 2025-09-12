/**
 * Simple API endpoint simulation for featured series
 * In production, this would be a real API endpoint
 */

const fs = require('fs');
const path = require('path');

// Simulate API response
function getFeaturedSeries() {
    try {
        const dataPath = path.join(__dirname, '../data/featured-series.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading featured series data:', error);
        return {
            lastUpdated: new Date().toISOString(),
            version: "1.0",
            items: [],
            seriesInfo: {
                name: "No Series Available",
                description: "No featured series available at the moment.",
                totalPieces: 0
            }
        };
    }
}

// For Node.js/Express server
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getFeaturedSeries };
}

// For browser simulation (development only)
if (typeof window !== 'undefined') {
    // Simulate API endpoint
    window.mockAPI = {
        '/api/featured-series': () => {
            return new Promise((resolve) => {
                // Simulate network delay
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve(getFeaturedSeries())
                    });
                }, 100);
            });
        }
    };
}
