// Add smooth scrolling and animations
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect - transparent to white
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.stat-card, .impact-card, .action-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                if (text.includes('+') || text.includes('M') || !isNaN(text.replace(/[^0-9]/g, ''))) {
                    counter.style.animation = 'counter 2s ease-out';
                }
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // EmailJS Configuration
    if (typeof emailjs !== 'undefined') {
        emailjs.init("MNYkT2_MiVg9CX7ti"); // Your EmailJS user ID
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS library not loaded');
    }
    
    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                organization: formData.get('organization') || 'Not specified',
                interest: formData.get('interest'),
                message: formData.get('message'),
                to_email: 'lancelot.carrau@gmail.com'
            };
            
            console.log('Sending email with params:', templateParams);
            
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                alert('EmailJS service is not available. Please try again later or email us directly at lancelot.carrau@gmail.com');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                return;
            }
            
            // Send email using your service ID
            emailjs.send('service_c0ssmu5', 'template_kc3rpzn', templateParams)
                .then(function(response) {
                    // Success
                    console.log('EmailJS Success:', response);
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                }, function(error) {
                    // Error
                    console.error('EmailJS error details:', error);
                    console.log('Template params sent:', templateParams);
                    
                    // If template not found, offer alternative
                    if (error.text && error.text.includes('template ID not found')) {
                        const fallbackMessage = `Subject: Contact from OIRA Website
                        
Name: ${templateParams.from_name}
Email: ${templateParams.from_email}
Organization: ${templateParams.organization}
Interest: ${templateParams.interest}

Message:
${templateParams.message}`;
                        
                        const mailtoLink = `mailto:lancelot.carrau@gmail.com?subject=Contact from OIRA Website - ${templateParams.from_name}&body=${encodeURIComponent(fallbackMessage)}`;
                        
                        if (confirm('Email service configuration issue. Would you like to open your email client to send the message?')) {
                            window.open(mailtoLink);
                        }
                    } else {
                        alert('Failed to send message. Error: ' + (error.text || error.message || 'Unknown error') + '. Please try again or email us directly at lancelot.carrau@gmail.com');
                    }
                })
                .finally(function() {
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                });
        });
    }
});
