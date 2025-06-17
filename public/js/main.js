// FitFlix Enhanced Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeForms();
    initializeAnimations();
    initializeBookingSummary();
    initializeCitySelection();
    initializeScrollEffects();
    initializeCounters();
    initializeAOS();
    initializeParticles();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar') && navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Enhanced city selection functionality
function initializeCitySelection() {
    // City modal functionality
    const cityModal = document.getElementById('cityModal');
    if (cityModal) {
        cityModal.addEventListener('show.bs.modal', function() {
            // Add entrance animation to city options
            const cityOptions = document.querySelectorAll('.city-option');
            cityOptions.forEach((option, index) => {
                option.style.animationDelay = `${index * 0.1}s`;
                option.classList.add('animate__animated', 'animate__fadeInUp');
            });
        });
    }
}

// Enhanced city selection from modal
function selectCityFromModal(cityName) {
    // Show loading state
    const cityOptions = document.querySelectorAll('.city-option');
    cityOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        option.style.opacity = '0.6';
    });
    
    // Find the selected city option and highlight it
    const selectedOption = Array.from(cityOptions).find(option => 
        option.querySelector('h6').textContent === cityName
    );
    
    if (selectedOption) {
        selectedOption.style.background = 'var(--primary-color)';
        selectedOption.style.color = 'white';
        selectedOption.style.transform = 'scale(1.05)';
    }
    
    // Send city selection to server
    fetch('/select-city', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `city=${encodeURIComponent(cityName)}`
    })
    .then(response => {
        if (response.ok) {
            // Update city name in navbar
            const cityNameElement = document.querySelector('.city-name');
            if (cityNameElement) {
                cityNameElement.textContent = cityName;
            }
            
            // Show success notification
            showNotification(`City changed to ${cityName}`, 'success');
            
            // Close modal with delay
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('cityModal'));
                modal.hide();
                
                // Reload page to update content
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error selecting city:', error);
        showNotification('Error selecting city. Please try again.', 'error');
        
        // Reset city options
        cityOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.style.opacity = '1';
        });
    });
}

// Form handling
function initializeForms() {
    // Bootstrap form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                handleFormSubmission(form);
            }
            form.classList.add('was-validated');
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
    
    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingForm();
        });
    }
}

// Handle form submissions with enhanced UX
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state with animation
    submitBtn.innerHTML = '<span class="spinner me-2"></span>Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call with realistic delay
    setTimeout(() => {
        showNotification('Success! Your request has been submitted.', 'success');
        form.reset();
        form.classList.remove('was-validated');
        
        // Reset button with animation
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Add success animation to form
        form.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            form.classList.remove('animate__animated', 'animate__pulse');
        }, 1000);
    }, 2000);
}

// Contact form handler
function handleContactForm() {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        newsletter: document.getElementById('newsletter').checked
    };
    
    // Send to server
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            document.getElementById('contactForm').reset();
        } else {
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    });
}

// Booking form handler
function handleBookingForm() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        goals: getSelectedGoals(),
        experience: document.getElementById('experience').value,
        medical: document.getElementById('medical').value,
        notes: document.getElementById('notes').value,
        emergencyName: document.getElementById('emergencyName').value,
        emergencyPhone: document.getElementById('emergencyPhone').value,
        emergencyRelation: document.getElementById('emergencyRelation').value
    };
    
    // Send to server
    fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Booking confirmed! You will receive a confirmation email shortly.', 'success');
            // Redirect to confirmation page or reset form
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            showNotification('Sorry, there was an error processing your booking. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Sorry, there was an error processing your booking. Please try again.', 'error');
    });
}

// Get selected fitness goals
function getSelectedGoals() {
    const goals = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.value && checkbox.value !== 'on') {
            goals.push(checkbox.value);
        }
    });
    return goals;
}

// Booking summary functionality
function initializeBookingSummary() {
    const serviceSelect = document.getElementById('service');
    const locationSelect = document.getElementById('location');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', updateBookingSummary);
    }
    if (locationSelect) {
        locationSelect.addEventListener('change', updateBookingSummary);
    }
    if (dateInput) {
        dateInput.addEventListener('change', updateBookingSummary);
    }
    if (timeSelect) {
        timeSelect.addEventListener('change', updateBookingSummary);
    }
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Update booking summary
function updateBookingSummary() {
    const service = document.getElementById('service')?.value || '';
    const location = document.getElementById('location')?.value || '';
    const date = document.getElementById('date')?.value || '';
    const time = document.getElementById('time')?.value || '';
    
    // Update summary display
    document.getElementById('summaryService').textContent = service || 'Not selected';
    document.getElementById('summaryLocation').textContent = location || 'Not selected';
    document.getElementById('summaryDate').textContent = date ? formatDate(date) : 'Not selected';
    document.getElementById('summaryTime').textContent = time ? formatTime(time) : 'Not selected';
    
    // Calculate price
    const price = calculatePrice(service);
    document.getElementById('summaryTotal').textContent = `₹${price}`;
}

// Calculate price based on service
function calculatePrice(service) {
    const prices = {
        'personal-training': 2500,
        'group-class': 800,
        'gym-access': 500,
        'nutrition': 1800,
        'yoga': 1200,
        'physiotherapy': 2000
    };
    
    return prices[service] || 0;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Enhanced animation initialization
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .gym-card-modern, .trainer-card-modern, .pricing-card-modern, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// Initialize particle effects
function initializeParticles() {
    // Create floating particles for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        createFloatingParticles(heroSection);
    }
}

// Create floating particles
function createFloatingParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        container.appendChild(particle);
    }
    
    // Add CSS for particle animation
    if (!document.getElementById('particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Animate counter with easing
function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Enhanced scroll effects
function initializeScrollEffects() {
    // Parallax effect for hero background
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background-animation');
        
        if (heroBackground && scrollTop < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrollTop * 0.5}px)`;
        }
        
        // Parallax for other elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, 16));
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.classList.add('animate__animated', 'animate__fadeOutRight');
        setTimeout(() => notification.remove(), 500);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show animate__animated animate__fadeInRight`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        box-shadow: var(--shadow-xl);
        border-radius: var(--border-radius);
        border: none;
    `;
    
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle';
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${icon} me-2"></i>
            <span>${message}</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('animate__animated', 'animate__fadeOutRight');
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Loading state management
function showLoading(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('animate__animated', 'animate__fadeIn');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    // You could send this to an error tracking service
});

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Export functions for global use
window.FitFlix = {
    selectCityFromModal,
    showNotification,
    showLoading,
    hideLoading,
    saveToLocalStorage,
    getFromLocalStorage
};

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);