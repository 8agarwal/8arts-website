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
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        const navToggle = document.getElementById('navToggle');
        const navDropdown = document.getElementById('navDropdown');
        
        console.log('Initializing navigation...', { navToggle, navDropdown });
        
        if (navToggle && navDropdown) {
            console.log('Navigation elements found, adding event listeners');
            
            // Remove any existing event listeners
            const newNavToggle = navToggle.cloneNode(true);
            navToggle.parentNode.replaceChild(newNavToggle, navToggle);
            
            newNavToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav toggle clicked');
                newNavToggle.classList.toggle('active');
                navDropdown.classList.toggle('show');
                console.log('Classes toggled:', {
                    active: newNavToggle.classList.contains('active'),
                    show: navDropdown.classList.contains('show')
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!newNavToggle.contains(event.target) && !navDropdown.contains(event.target)) {
                    newNavToggle.classList.remove('active');
                    navDropdown.classList.remove('show');
                }
            });
            
            // Close dropdown when clicking on a link
            const navLinks = navDropdown.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    newNavToggle.classList.remove('active');
                    navDropdown.classList.remove('show');
                });
            });
        } else {
            console.log('Navigation elements not found, retrying...');
            // Retry after a longer delay
            setTimeout(initNavigation, 1000);
        }
    }, 100);
}

// Load sections when DOM is ready
document.addEventListener('DOMContentLoaded', includeHTML);
