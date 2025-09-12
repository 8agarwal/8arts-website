/**
 * Project Gallery Management System
 * Handles dynamic loading and management of project gallery content
 */

class ProjectGalleryManager {
    constructor() {
        this.container = document.getElementById('projectGalleryContainer');
        console.log('ProjectGalleryManager constructor - Container:', this.container);
        console.log('Looking for element with ID: projectGalleryContainer');
        this.apiEndpoint = 'data/project-gallery.json'; // Directly fetching the JSON file
        this.localStorageKey = 'projectGalleryData';
        this.lastUpdateKey = 'projectGalleryLastUpdate';
        this.updateInterval = 5 * 1000; // 5 seconds for real-time updates
        
        if (this.container) {
            this.init();
        } else {
            console.error('ProjectGalleryContainer not found! Trying again in 1 second...');
            setTimeout(() => {
                this.container = document.getElementById('projectGalleryContainer');
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
        console.log('ProjectGalleryManager initializing...');
        console.log('Container found:', this.container);
        this.loadProjectData();
        this.setupAutoRefresh();
        this.setupWebhookListener();
    }

    /**
     * Load project data from cache or API
     */
    async loadProjectData() {
        try {
            // Always fetch fresh data for real-time updates
            console.log('Fetching fresh project gallery data...');
            const apiData = await this.fetchFromAPI();
            if (apiData) {
                this.cacheData(apiData);
                this.renderProjects(apiData);
            } else {
                // Fallback to cached data if API fails
                const cachedData = this.getCachedData();
                if (cachedData) {
                    console.log('API failed, using cached data');
                    this.renderProjects(cachedData);
                }
            }
        } catch (error) {
            console.error('Error loading project gallery:', error);
            // Try to load from cache as fallback
            const cachedData = this.getCachedData();
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
     * Render project items to the DOM
     */
    renderProjects(projectData) {
        console.log('renderProjects called with:', projectData);
        console.log('Container element:', this.container);
        
        if (!this.container || !projectData) {
            console.error('Invalid data or container not found');
            return;
        }

        // Handle both array format and object with items property
        const items = Array.isArray(projectData) ? projectData : (projectData.items || []);
        console.log('Items to render:', items);
        
        this.container.innerHTML = '';
        
        items.forEach((item, index) => {
            console.log('Creating project item:', item);
            const projectItem = this.createProjectItem(item, index);
            this.container.appendChild(projectItem);
        });

        // Add loading indicator if needed
        if (items.length === 0) {
            this.container.innerHTML = '<p class="no-projects">No project gallery items available at the moment.</p>';
        }
        
        console.log('Finished rendering project items');
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
                <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy" onclick="window.location.href='portfolio.html'">
            </div>
            <div class="series-text">
                <h4 onclick="window.location.href='portfolio.html'" style="cursor: pointer;">${item.title}</h4>
                <p>${item.description}</p>
                ${item.meta ? `<div class="series-meta">${item.meta}</div>` : ''}
            </div>
        `;

        return projectItem;
    }

    /**
     * Setup auto-refresh mechanism
     */
    setupAutoRefresh() {
        setInterval(() => {
            this.loadProjectData();
        }, this.updateInterval);
    }

    /**
     * Setup webhook listener for real-time updates
     */
    setupWebhookListener() {
        // Listen for custom events that can be triggered by webhooks
        window.addEventListener('projectGalleryUpdate', (event) => {
            console.log('Project gallery update received:', event.detail);
            this.loadProjectData();
        });

        // Listen for storage events (if updated from another tab)
        window.addEventListener('storage', (event) => {
            if (event.key === this.localStorageKey) {
                console.log('Project gallery updated from another tab');
                this.loadProjectData();
            }
        });
    }

    /**
     * Manually refresh project data
     */
    async refresh() {
        console.log('Manually refreshing project gallery...');
        // Clear cache
        localStorage.removeItem(this.localStorageKey);
        localStorage.removeItem(this.lastUpdateKey);
        await this.loadProjectData();
    }

    /**
     * Add a new project item (for admin use)
     */
    addProjectItem(item) {
        const projectItem = this.createProjectItem(item, Date.now());
        this.container.appendChild(projectItem);
        
        // Update cache
        const currentData = this.getCachedData() || { items: [] };
        currentData.items.push(item);
        this.cacheData(currentData);
    }

    /**
     * Remove a project item (for admin use)
     */
    removeProjectItem(projectId) {
        const item = this.container.querySelector(`[data-project-id="${projectId}"]`);
        if (item) {
            item.remove();
            
            // Update cache
            const currentData = this.getCachedData();
            if (currentData && currentData.items) {
                currentData.items = currentData.items.filter(item => item.id !== projectId);
                this.cacheData(currentData);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing ProjectGalleryManager');
    window.projectGalleryManager = new ProjectGalleryManager();
});

// Also try to initialize after a delay to ensure all content is loaded
setTimeout(() => {
    if (!window.projectGalleryManager) {
        console.log('Delayed initialization of ProjectGalleryManager');
        window.projectGalleryManager = new ProjectGalleryManager();
    }
}, 2000);

// Manual fallback - try to load content directly
setTimeout(() => {
    console.log('Manual fallback - checking for project gallery container...');
    const container = document.getElementById('projectGalleryContainer');
    console.log('Container found in fallback:', container);
    
    if (container) {
        console.log('Manual fallback - loading project content directly');
        fetch('data/project-gallery.json')
            .then(response => {
                console.log('Project gallery JSON response:', response);
                return response.json();
            })
            .then(data => {
                console.log('Manual fetch successful:', data);
                container.innerHTML = '';
                data.forEach((item, index) => {
                    console.log('Creating project item:', item);
                    const projectItem = document.createElement('div');
                    projectItem.className = 'series-item';
                    projectItem.innerHTML = `
                        <div class="series-image">
                            <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy" onclick="window.location.href='portfolio.html'">
                        </div>
                        <div class="series-text">
                            <h4 onclick="window.location.href='portfolio.html'" style="cursor: pointer;">${item.title}</h4>
                            <p>${item.description}</p>
                            ${item.meta ? `<div class="series-meta">${item.meta}</div>` : ''}
                        </div>
                    `;
                    container.appendChild(projectItem);
                });
            })
            .catch(error => {
                console.error('Manual fetch failed:', error);
            });
    } else {
        console.error('Project gallery container not found in fallback either!');
    }
}, 3000);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectGalleryManager;
}
