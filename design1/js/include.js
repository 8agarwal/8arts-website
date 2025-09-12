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
    
    console.log('Initializing navigation...', { navToggle, navDropdown });
    
    if (navToggle && navDropdown) {
        console.log('Navigation elements found, adding event listeners');
        
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Nav toggle clicked');
            navToggle.classList.toggle('active');
            navDropdown.classList.toggle('show');
            console.log('Classes toggled:', {
                active: navToggle.classList.contains('active'),
                show: navDropdown.classList.contains('show')
            });
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
    } else {
        console.log('Navigation elements not found');
    }
}

// Load sections when DOM is ready
document.addEventListener('DOMContentLoaded', includeHTML);
