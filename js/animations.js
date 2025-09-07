// ===== ANIMATIONS JAVASCRIPT =====

// Typing Animation
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const texts = [
        'Modern Solutions for Customer Engagement',
        'Cybersecurity Expert & Ethical Hacker',
        'Full-Stack Developer & Pentester',
        'Building Secure Digital Solutions'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = isMobile() ? 80 : 100; // Faster on mobile

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = isMobile() ? 40 : 50;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = isMobile() ? 80 : 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end
            typingSpeed = isMobile() ? 1500 : 2000; // Shorter pause on mobile
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = isMobile() ? 300 : 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start typing animation after a delay
    setTimeout(typeText, isMobile() ? 500 : 1000); // Faster start on mobile
}

// Parallax Effect
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Fade In Animation
function initFadeInAnimation() {
    const observerOptions = {
        threshold: isMobile() ? 0.05 : 0.1, // Lower threshold for mobile
        rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-element');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const duration = parseInt(counter.dataset.duration) || 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Hover Effects
function initHoverEffects() {
    const cards = document.querySelectorAll('.card, .service-card, .project-card, .blog-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Mobile Hover Effects (Touch-friendly)
function initMobileHoverEffects() {
    const cards = document.querySelectorAll('.card, .service-card, .project-card, .blog-card');
    
    cards.forEach(card => {
        // Touch start effect
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        // Touch end effect
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'translateY(0)';
            }, 150);
        });
        
        // Also add click effect for better mobile experience
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                this.style.transform = 'translateY(0)';
            }, 200);
        });
    });
}

// Loading Animation
function initLoadingAnimation() {
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (loadingSpinner) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingSpinner.classList.add('hidden');
                setTimeout(() => {
                    loadingSpinner.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// Mobile detection
function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Always initialize these animations
    initTypingAnimation();
    initFadeInAnimation();
    initCounterAnimation();
    initLoadingAnimation();
    
    // Only initialize heavy animations on desktop
    if (!isMobile()) {
        initParallaxEffect();
        initHoverEffects();
    } else {
        // Mobile-specific hover effects
        initMobileHoverEffects();
    }
});

// Smooth reveal animation for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize reveal animation
document.addEventListener('DOMContentLoaded', revealOnScroll);
