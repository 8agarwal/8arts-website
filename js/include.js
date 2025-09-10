// Simple function to include HTML sections
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    elements.forEach(element => {
        const file = element.getAttribute('data-include');
        if (file) {
            fetch(file)
                .then(response => response.text())
                .then(data => {
                    element.innerHTML = data;
                    // Initialize navigation after sections are loaded
                    initNavigation();
                })
                .catch(error => {
                    console.error('Error loading section:', error);
                });
        }
    });
}

// Initialize navigation dropdown functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navDropdown = document.getElementById('navDropdown');
    
    if (navToggle && navDropdown) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navDropdown.contains(event.target)) {
                navToggle.classList.remove('active');
                navDropdown.classList.remove('show');
            }
        });
        
        // Close dropdown when clicking on a link
        const navLinks = navDropdown.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navDropdown.classList.remove('show');
            });
        });
    }
}

// Load sections when DOM is ready
document.addEventListener('DOMContentLoaded', includeHTML);
