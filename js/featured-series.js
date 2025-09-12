/**
 * Featured Series Management System
 * Handles dynamic loading and management of featured series content
 */

class FeaturedSeriesManager {
    constructor() {
        this.container = document.getElementById('featuredSeriesContainer');
        console.log('FeaturedSeriesManager constructor - Container:', this.container);
        this.apiEndpoint = 'data/featured-series.json'; // Directly fetching the JSON file
        this.localStorageKey = 'featuredSeriesData';
        this.lastUpdateKey = 'featuredSeriesLastUpdate';
        this.updateInterval = 30 * 1000; // 30 seconds for testing
        
        if (this.container) {
            this.init();
        } else {
            console.error('FeaturedSeriesContainer not found! Trying again in 1 second...');
            setTimeout(() => {
                this.container = document.getElementById('featuredSeriesContainer');
                if (this.container) {
                    console.log('Container found on retry, initializing...');
                    this.init();
                } else {
                    console.error('Container still not found after retry');
                }
            }, 1000);
        }
    }

    init() {
        console.log('FeaturedSeriesManager initializing...');
        console.log('Container found:', this.container);
        this.loadSeriesData();
        this.setupAutoRefresh();
        this.setupWebhookListener();
    }

    /**
     * Load series data from cache or API
     */
    async loadSeriesData() {
        try {
            // Check if we have cached data and if it's recent
            const cachedData = this.getCachedData();
            const lastUpdate = localStorage.getItem(this.lastUpdateKey);
            const now = Date.now();
            
            if (cachedData && lastUpdate && (now - parseInt(lastUpdate)) < this.updateInterval) {
                console.log('Loading featured series from cache');
                this.renderSeries(cachedData);
                return;
            }

            // Try to fetch from API
            const apiData = await this.fetchFromAPI();
            if (apiData) {
                this.cacheData(apiData);
                this.renderSeries(apiData);
            } else if (cachedData) {
                // Fallback to cached data if API fails
                console.log('API failed, using cached data');
                this.renderSeries(cachedData);
            }
        } catch (error) {
            console.error('Error loading featured series:', error);
            // Try to load from cache as fallback
            const cachedData = this.getCachedData();
            if (cachedData) {
                this.renderSeries(cachedData);
            }
        }
    }

    /**
     * Fetch data from API
     */
    async fetchFromAPI() {
        try {
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API fetch failed:', error);
            return null;
        }
    }

    /**
     * Get cached data from localStorage
     */
    getCachedData() {
        try {
            const data = localStorage.getItem(this.localStorageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error parsing cached data:', error);
            return null;
        }
    }

    /**
     * Cache data to localStorage
     */
    cacheData(data) {
        try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(data));
            localStorage.setItem(this.lastUpdateKey, Date.now().toString());
        } catch (error) {
            console.error('Error caching data:', error);
        }
    }

    /**
     * Render series items to the DOM
     */
    renderSeries(seriesData) {
        console.log('renderSeries called with:', seriesData);
        console.log('Container element:', this.container);
        
        if (!this.container || !seriesData) {
            console.error('Invalid data or container not found');
            return;
        }

        // Handle both array format and object with items property
        const items = Array.isArray(seriesData) ? seriesData : (seriesData.items || []);
        console.log('Items to render:', items);
        
        this.container.innerHTML = '';
        
        items.forEach((item, index) => {
            console.log('Creating series item:', item);
            const seriesItem = this.createSeriesItem(item, index);
            this.container.appendChild(seriesItem);
        });

        // Add loading indicator if needed
        if (items.length === 0) {
            this.container.innerHTML = '<p class="no-series">No featured series available at the moment.</p>';
        }
        
        console.log('Finished rendering series items');
    }

    /**
     * Create a single series item element
     */
    createSeriesItem(item, index) {
        const seriesItem = document.createElement('div');
        seriesItem.className = 'series-item';
        seriesItem.setAttribute('data-series-id', item.id || index);

        seriesItem.innerHTML = `
            <div class="series-image">
                <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
            </div>
            <div class="series-text">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                ${item.meta ? `<div class="series-meta">${item.meta}</div>` : ''}
            </div>
        `;

        return seriesItem;
    }

    /**
     * Setup auto-refresh mechanism
     */
    setupAutoRefresh() {
        setInterval(() => {
            this.loadSeriesData();
        }, this.updateInterval);
    }

    /**
     * Setup webhook listener for real-time updates
     */
    setupWebhookListener() {
        // Listen for custom events that can be triggered by webhooks
        window.addEventListener('featuredSeriesUpdate', (event) => {
            console.log('Featured series update received:', event.detail);
            this.loadSeriesData();
        });

        // Listen for storage events (if updated from another tab)
        window.addEventListener('storage', (event) => {
            if (event.key === this.localStorageKey) {
                console.log('Featured series updated from another tab');
                this.loadSeriesData();
            }
        });
    }

    /**
     * Manually refresh series data
     */
    async refresh() {
        console.log('Manually refreshing featured series...');
        // Clear cache
        localStorage.removeItem(this.localStorageKey);
        localStorage.removeItem(this.lastUpdateKey);
        await this.loadSeriesData();
    }

    /**
     * Add a new series item (for admin use)
     */
    addSeriesItem(item) {
        const seriesItem = this.createSeriesItem(item, Date.now());
        this.container.appendChild(seriesItem);
        
        // Update cache
        const currentData = this.getCachedData() || { items: [] };
        currentData.items.push(item);
        this.cacheData(currentData);
    }

    /**
     * Remove a series item (for admin use)
     */
    removeSeriesItem(seriesId) {
        const item = this.container.querySelector(`[data-series-id="${seriesId}"]`);
        if (item) {
            item.remove();
            
            // Update cache
            const currentData = this.getCachedData();
            if (currentData && currentData.items) {
                currentData.items = currentData.items.filter(item => item.id !== seriesId);
                this.cacheData(currentData);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing FeaturedSeriesManager');
    window.featuredSeriesManager = new FeaturedSeriesManager();
});

// Also try to initialize after a delay to ensure all content is loaded
setTimeout(() => {
    if (!window.featuredSeriesManager) {
        console.log('Delayed initialization of FeaturedSeriesManager');
        window.featuredSeriesManager = new FeaturedSeriesManager();
    }
}, 2000);

// Manual fallback - try to load content directly
setTimeout(() => {
    const container = document.getElementById('featuredSeriesContainer');
    if (container && container.innerHTML.trim() === '') {
        console.log('Manual fallback - loading content directly');
        fetch('data/featured-series.json')
            .then(response => response.json())
            .then(data => {
                console.log('Manual fetch successful:', data);
                container.innerHTML = '';
                data.forEach((item, index) => {
                    const seriesItem = document.createElement('div');
                    seriesItem.className = 'series-item';
                    seriesItem.innerHTML = `
                        <div class="series-image">
                            <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
                        </div>
                        <div class="series-text">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            ${item.meta ? `<div class="series-meta">${item.meta}</div>` : ''}
                        </div>
                    `;
                    container.appendChild(seriesItem);
                });
            })
            .catch(error => {
                console.error('Manual fetch failed:', error);
            });
    }
}, 3000);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeaturedSeriesManager;
}
