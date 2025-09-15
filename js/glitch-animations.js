// ===== GLITCHIDEA CUSTOM ANIMATIONS =====

class GlitchAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        // Setup scroll animations
        this.setupScrollAnimations();
        
        // Setup hover animations
        this.setupHoverAnimations();
        
        // Initial animation check
        this.checkAnimations();
    }

    setupScrollAnimations() {
        // Create intersection observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with glitch-animate class
        const animatedElements = document.querySelectorAll('.glitch-animate');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        // Observe elements with data-glitch attributes
        const glitchElements = document.querySelectorAll('[data-glitch]');
        glitchElements.forEach(element => {
            observer.observe(element);
        });
    }

    triggerAnimation(element) {
        // Add visible class to trigger animation
        element.classList.add('glitch-visible');
        
        // Remove observer after animation
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    }

    setupHoverAnimations() {
        // Add hover effects to elements with hover classes
        const hoverElements = document.querySelectorAll('.glitch-hover-scale, .glitch-hover-lift, .glitch-hover-glow');
        hoverElements.forEach(element => {
            element.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    }

    checkAnimations() {
        // Check if elements are already in viewport on load
        const animatedElements = document.querySelectorAll('.glitch-animate');
        animatedElements.forEach(element => {
            if (this.isInViewport(element)) {
                this.triggerAnimation(element);
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Utility method to add animation to element
    addAnimation(element, animationType, delay = 0) {
        element.classList.add('glitch-animate', `glitch-${animationType}`);
        if (delay > 0) {
            element.classList.add(`glitch-delay-${delay}`);
        }
    }

    // Utility method to remove animation from element
    removeAnimation(element) {
        element.classList.remove('glitch-animate', 'glitch-visible');
        const animationClasses = element.className.match(/glitch-\w+/g);
        if (animationClasses) {
            element.classList.remove(...animationClasses);
        }
    }
}

// ===== AOS COMPATIBILITY LAYER =====
// This allows existing AOS attributes to work with our custom animations

function convertAOSToGlitch() {
    const aosElements = document.querySelectorAll('[data-aos]');
    
    aosElements.forEach(element => {
        const aosType = element.getAttribute('data-aos');
        const aosDelay = element.getAttribute('data-aos-delay');
        
        // Convert AOS types to Glitch types
        const glitchType = convertAOSType(aosType);
        
        // Add Glitch animation classes
        element.classList.add('glitch-animate', `glitch-${glitchType}`);
        
        // Add delay if specified
        if (aosDelay) {
            const delay = Math.round(parseInt(aosDelay) / 100);
            element.classList.add(`glitch-delay-${delay}`);
        }
        
        // Remove AOS attributes
        element.removeAttribute('data-aos');
        element.removeAttribute('data-aos-delay');
        element.removeAttribute('data-aos-duration');
        element.removeAttribute('data-aos-easing');
    });
}

function convertAOSType(aosType) {
    const typeMap = {
        'fade': 'fade-in',
        'fade-up': 'fade-up',
        'fade-down': 'fade-down',
        'fade-left': 'fade-left',
        'fade-right': 'fade-right',
        'zoom-in': 'zoom-in',
        'zoom-out': 'scale-in',
        'flip-left': 'flip',
        'flip-right': 'flip',
        'slide-up': 'slide-up',
        'slide-down': 'slide-down',
        'slide-left': 'slide-left',
        'slide-right': 'slide-right'
    };
    
    return typeMap[aosType] || 'fade-in';
}

// ===== INITIALIZATION =====
// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Convert existing AOS attributes to Glitch animations
    convertAOSToGlitch();
    
    // Initialize Glitch animations
    new GlitchAnimations();
    
    console.log('🎬 GlitchIdea animations initialized!');
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlitchAnimations;
}
