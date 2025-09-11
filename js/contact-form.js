// Contact Form Handler with EmailJS
console.log('Contact form script file loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact form script loaded');
    
    // Initialize EmailJS
    emailjs.init("-XMQGvE8Sdcal16-D"); // Your actual public key
    console.log('EmailJS initialized');
    
    // Wait for the form to be loaded dynamically
    setTimeout(function() {
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        console.log('Contact form element:', contactForm);
        console.log('Form message element:', formMessage);
        
        if (contactForm) {
        console.log('Contact form found, adding event listener');
        contactForm.addEventListener('submit', function(e) {
            console.log('Form submitted - preventing default');
            e.preventDefault();
            e.stopPropagation();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const query = formData.get('query');
            
            console.log('Form data:', { name, email, query });
            
            // Validate form
            if (!name || !email || !query) {
                showMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            sendEmail(name, email, query, submitBtn, originalText);
        });
        } else {
            console.log('Contact form not found after timeout');
        }
    }, 1000); // Wait 1 second for dynamic content to load
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    function sendEmail(name, email, query, submitBtn, originalText) {
        console.log('Attempting to send email...');
        
        // EmailJS template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: query,
            to_email: 'somya.8agarwal@gmail.com'
        };
        
        console.log('Template params:', templateParams);
        
        // Send email using EmailJS
        emailjs.send('service_8arts', 'template_447vdzq', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Reset form
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            }, function(error) {
                console.log('FAILED...', error);
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                showMessage('Sorry, there was an error sending your message. Please try again or contact me directly at somya.8agarwal@gmail.com', 'error');
            });
    }
});
