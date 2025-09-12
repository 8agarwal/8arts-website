/**
 * Portfolio Series Management System
 * Handles dynamic loading of featured series content for portfolio page
 */

class PortfolioSeriesManager {
    constructor() {
        this.container = document.getElementById('portfolioSeriesContainer');
        this.projectContainer = document.getElementById('portfolioProjectContainer');
        console.log('PortfolioSeriesManager constructor - Container:', this.container);
        console.log('PortfolioSeriesManager constructor - Project Container:', this.projectContainer);
        this.apiEndpoint = 'data/featured-series.json';
        this.projectApiEndpoint = 'data/project-gallery.json';
        this.localStorageKey = 'featuredSeriesData';
        this.projectLocalStorageKey = 'projectGalleryData';
        this.lastUpdateKey = 'featuredSeriesLastUpdate';
        this.projectLastUpdateKey = 'projectGalleryLastUpdate';
        this.updateInterval = 30 * 1000; // 30 seconds
        
        if (this.container || this.projectContainer) {
            this.init();
        } else {
            console.error('Portfolio containers not found! Trying again in 1 second...');
            setTimeout(() => {
                this.container = document.getElementById('portfolioSeriesContainer');
                this.projectContainer = document.getElementById('portfolioProjectContainer');
                if (this.container || this.projectContainer) {
                    console.log('Containers found on retry, initializing...');
                    this.init();
                } else {
                    console.error('Containers still not found after retry');
                }
            }, 1000);
        }
    }

    init() {
        console.log('PortfolioSeriesManager initializing...');
        console.log('Container found:', this.container);
        console.log('Project Container found:', this.projectContainer);
        
        if (this.container) {
            this.loadSeriesData();
        }
        
        if (this.projectContainer) {
            this.loadProjectData();
        }
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
                console.log('Loading portfolio series from cache');
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
            console.error('Error loading portfolio series:', error);
            // Try to load from cache as fallback
            const cachedData = this.getCachedData();
            if (cachedData) {
                this.renderSeries(cachedData);
            }
        }
    }

    /**
     * Load project data from cache or API
     */
    async loadProjectData() {
        try {
            // Check if we have cached data and if it's recent
            const cachedData = this.getCachedProjectData();
            const lastUpdate = localStorage.getItem(this.projectLastUpdateKey);
            const now = Date.now();
            
            if (cachedData && lastUpdate && (now - parseInt(lastUpdate)) < this.updateInterval) {
                console.log('Loading portfolio projects from cache');
                this.renderProjects(cachedData);
                return;
            }

            // Try to fetch from API
            const apiData = await this.fetchProjectFromAPI();
            if (apiData) {
                this.cacheProjectData(apiData);
                this.renderProjects(apiData);
            } else if (cachedData) {
                // Fallback to cached data if API fails
                console.log('Project API failed, using cached data');
                this.renderProjects(cachedData);
            }
        } catch (error) {
            console.error('Error loading portfolio projects:', error);
            // Try to load from cache as fallback
            const cachedData = this.getCachedProjectData();
            if (cachedData) {
                this.renderProjects(cachedData);
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
     * Fetch project data from API
     */
    async fetchProjectFromAPI() {
        try {
            const response = await fetch(this.projectApiEndpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Project API fetch failed:', error);
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
     * Get cached project data from localStorage
     */
    getCachedProjectData() {
        try {
            const data = localStorage.getItem(this.projectLocalStorageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error parsing cached project data:', error);
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
     * Cache project data to localStorage
     */
    cacheProjectData(data) {
        try {
            localStorage.setItem(this.projectLocalStorageKey, JSON.stringify(data));
            localStorage.setItem(this.projectLastUpdateKey, Date.now().toString());
        } catch (error) {
            console.error('Error caching project data:', error);
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
            console.log('Creating portfolio series item:', item);
            const seriesItem = this.createSeriesItem(item, index);
            this.container.appendChild(seriesItem);
        });

        // Add loading indicator if needed
        if (items.length === 0) {
            this.container.innerHTML = '<p class="no-series">No featured series available at the moment.</p>';
        }
        
        console.log('Finished rendering portfolio series items');
    }

    /**
     * Render project items to the DOM
     */
    renderProjects(projectData) {
        console.log('renderProjects called with:', projectData);
        console.log('Project Container element:', this.projectContainer);
        
        if (!this.projectContainer || !projectData) {
            console.error('Invalid project data or container not found');
            return;
        }

        // Handle both array format and object with items property
        const items = Array.isArray(projectData) ? projectData : (projectData.items || []);
        console.log('Project items to render:', items);
        
        this.projectContainer.innerHTML = '';
        
        items.forEach((item, index) => {
            console.log('Creating portfolio project item:', item);
            const projectItem = this.createProjectItem(item, index);
            this.projectContainer.appendChild(projectItem);
        });

        // Add loading indicator if needed
        if (items.length === 0) {
            this.projectContainer.innerHTML = '<p class="no-projects">No project gallery items available at the moment.</p>';
        }
        
        console.log('Finished rendering portfolio project items');
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
     * Create a single project item element
     */
    createProjectItem(item, index) {
        const projectItem = document.createElement('div');
        projectItem.className = 'series-item';
        projectItem.setAttribute('data-project-id', item.id || index);

        projectItem.innerHTML = `
            <div class="series-image">
                <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
            </div>
            <div class="series-text">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                ${item.meta ? `<div class="series-meta">${item.meta}</div>` : ''}
            </div>
        `;

        return projectItem;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing PortfolioSeriesManager');
    console.log('Looking for portfolioSeriesContainer:', document.getElementById('portfolioSeriesContainer'));
    console.log('Looking for portfolioProjectContainer:', document.getElementById('portfolioProjectContainer'));
    window.portfolioSeriesManager = new PortfolioSeriesManager();
});

// Also try to initialize after a delay to ensure all content is loaded
setTimeout(() => {
    if (!window.portfolioSeriesManager) {
        console.log('Delayed initialization of PortfolioSeriesManager');
        window.portfolioSeriesManager = new PortfolioSeriesManager();
    }
}, 2000);

// Manual fallback - try to load content directly
setTimeout(() => {
    const container = document.getElementById('portfolioSeriesContainer');
    const projectContainer = document.getElementById('portfolioProjectContainer');
    
    if (container && container.innerHTML.trim() === '') {
        console.log('Manual fallback - loading portfolio series content directly');
        fetch('data/featured-series.json')
            .then(response => response.json())
            .then(data => {
                console.log('Manual portfolio series fetch successful:', data);
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
                console.error('Manual portfolio series fetch failed:', error);
            });
    }
    
    if (projectContainer && projectContainer.innerHTML.trim() === '') {
        console.log('Manual fallback - loading portfolio project content directly');
        fetch('data/project-gallery.json')
            .then(response => response.json())
            .then(data => {
                console.log('Manual portfolio project fetch successful:', data);
                projectContainer.innerHTML = '';
                data.forEach((item, index) => {
                    const projectItem = document.createElement('div');
                    projectItem.className = 'series-item';
                    projectItem.innerHTML = `
                        <div class="series-image">
                            <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
                        </div>
                        <div class="series-text">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            ${item.meta ? `<div class="series-meta">${item.meta}</div>` : ''}
                        </div>
                    `;
                    projectContainer.appendChild(projectItem);
                });
            })
            .catch(error => {
                console.error('Manual portfolio project fetch failed:', error);
            });
    }
}, 3000);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioSeriesManager;
}
