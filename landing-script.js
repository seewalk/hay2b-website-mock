// Hay2B Logistics - Landing Page JavaScript
// Professional interactions and form handling

// ========================================
// Navigation Functionality
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(7px, 7px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            span.style.transform = '';
            span.style.opacity = '';
        }
    });
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Form Handling
// ========================================

const quoteForm = document.getElementById('quoteForm');
const newsletterForm = document.getElementById('newsletterForm');
const successModal = document.getElementById('successModal');

// Quote form submission
quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/></svg> Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual API endpoint)
    try {
        await simulateApiCall(formData);
        
        // Show success modal
        successModal.classList.add('active');
        
        // Reset form
        quoteForm.reset();
        
        // Track conversion (Google Analytics, Facebook Pixel, etc.)
        trackConversion('quote_submitted', formData);
        
    } catch (error) {
        console.error('Form submission error:', error);
        alert('There was an error submitting your request. Please try again or call us directly.');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Newsletter form submission
newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/></svg>';
    submitBtn.disabled = true;
    
    try {
        await simulateApiCall({ email, type: 'newsletter' });
        
        // Show success message
        const input = newsletterForm.querySelector('input');
        input.value = '';
        input.placeholder = '✓ Subscribed successfully!';
        setTimeout(() => {
            input.placeholder = 'Your email';
        }, 3000);
        
        // Track conversion
        trackConversion('newsletter_signup', { email });
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert('There was an error. Please try again.');
    } finally {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }
});

// Close modal
function closeModal() {
    successModal.classList.remove('active');
}

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }
});

// ========================================
// Utility Functions
// ========================================

// Simulate API call (replace with actual backend)
function simulateApiCall(data) {
    return new Promise((resolve) => {
        console.log('Form submitted:', data);
        
        // In production, replace with actual API call:
        // fetch('/api/submit-quote', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        
        setTimeout(resolve, 1500);
    });
}

// Track conversions (integrate with analytics)
function trackConversion(eventName, data) {
    console.log('Conversion tracked:', eventName, data);
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'engagement',
            event_label: data.service || data.type,
            value: 1
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: eventName,
            content_category: data.service || data.type
        });
    }
    
    // LinkedIn Insight Tag
    if (typeof lintrk !== 'undefined') {
        lintrk('track', { conversion_id: 'YOUR_CONVERSION_ID' });
    }
}

// ========================================
// Scroll Animations
// ========================================

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ========================================
// Phone Number Formatting
// ========================================

const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    e.target.value = value;
});

// ========================================
// Dynamic Stats Counter
// ========================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Animate counters when in viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

// Set up stat counters
document.querySelectorAll('.stat-number, .big-number, .mini-number').forEach(stat => {
    const text = stat.textContent.trim();
    const match = text.match(/\d+/);
    if (match) {
        const number = parseInt(match[0]);
        stat.dataset.target = number;
        stat.textContent = '0';
        statsObserver.observe(stat);
    }
});

// ========================================
// Performance Optimization
// ========================================

// Lazy load images (if any are added)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// Service Worker Registration (PWA)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA functionality
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ========================================
// Add CSS animation for spinner
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ========================================
// Console Easter Egg (for developers)
// ========================================

console.log(`
%c🚚 HAY2B LOGISTICS 🚚
%cWe Always Deliver - Even Great Code!
%c
Interested in working with us or discussing our tech stack?
Email: tech@hay2blogistics.com

Built with ❤️ and modern web technologies.
`, 
'font-size: 24px; font-weight: bold; color: #FFD700;',
'font-size: 16px; color: #666;',
'font-size: 12px; color: #999;'
);

// ========================================
// Chatbot Integration Placeholder
// ========================================

// Initialize live chat when ready
function initLiveChat() {
    // Example: Intercom, Drift, Tawk.to integration
    // window.intercomSettings = {
    //     app_id: "YOUR_APP_ID",
    //     name: "Hay2B Support",
    //     custom_launcher_selector: '#chat-button'
    // };
}

// Call when document is ready
if (document.readyState === 'complete') {
    initLiveChat();
} else {
    window.addEventListener('load', initLiveChat);
}

// ========================================
// A/B Testing Framework (Optional)
// ========================================

function runABTest(testName, variants) {
    // Simple A/B testing logic
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    console.log(`A/B Test "${testName}": Variant ${variant}`);
    
    // Track with analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'ab_test', {
            test_name: testName,
            variant: variant
        });
    }
    
    return variant;
}

// Example: Test different CTA text
// const ctaVariant = runABTest('hero_cta', {
//     A: 'Get Free Quote',
//     B: 'Start Now - Free Quote'
// });

// ========================================
// Exit Intent Popup (Optional)
// ========================================

let exitIntentShown = false;

document.addEventListener('mouseout', (e) => {
    if (!exitIntentShown && e.clientY < 50) {
        // User is moving mouse towards browser top (likely to close tab)
        // Uncomment to show exit intent popup
        // showExitIntentPopup();
        exitIntentShown = true;
    }
});

function showExitIntentPopup() {
    // Show special offer or reminder
    console.log('Exit intent detected - show popup with special offer');
}

// ========================================
// Page Load Performance Monitoring
// ========================================

window.addEventListener('load', () => {
    // Monitor page load time
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log(`Page loaded in ${pageLoadTime}ms`);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: pageLoadTime,
                event_category: 'Page Performance'
            });
        }
    }
});

// ========================================
// Accessibility Improvements
// ========================================

// Focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#services';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #FFD700;
    color: #000;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

console.log('✅ Hay2B Logistics Landing Page - JavaScript Loaded Successfully!');
