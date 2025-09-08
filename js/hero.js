// ===== HERO JAVASCRIPT =====

// Initialize Hero Component
function initHero() {
    initHeroAnimations();
    initScrollIndicator();
}

// Hero Animations
function initHeroAnimations() {
    // Typewriter animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        
        // Set initial text immediately (no delay)
        heroTitle.textContent = originalText;
        
        // Add cursor effect
        heroTitle.classList.add('typewriter-cursor');
        
        // Start the typewriter cycle after a short delay
        setTimeout(() => {
            startTypewriterCycle(heroTitle, originalText);
        }, 2000); // 2 seconds after page load
    }
    
    // Animate orbiting circles on scroll
    const orbitingCircles = document.querySelectorAll('.orbiting-circle');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        orbitingCircles.forEach((circle, index) => {
            circle.style.transform = `rotate(${rate + (index * 30)}deg)`;
        });
    });
}

// Typewriter Cycle Function
function startTypewriterCycle(element, text) {
    let isDeleting = false;
    let charIndex = text.length; // Start with full text
    
    const typewriter = () => {
        if (isDeleting) {
            // Deleting characters from right to left - 1 second total
            element.textContent = text.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                // Start typing immediately after deletion
                setTimeout(typewriter, 50);
                return;
            }
        } else {
            // Typing characters from left to right - 1 second total
            element.textContent = text.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === text.length) {
                // Wait 3 seconds before starting to delete
                setTimeout(() => {
                    isDeleting = true;
                    typewriter();
                }, 3000); // Show full text for 3 seconds
                return;
            }
        }
        
        // Calculate timing for 2 seconds deletion, 1 second typing
        const totalChars = text.length;
        const deleteSpeed = 3800 / totalChars; // 2 seconds / total characters
        const typeSpeed = 3800 / totalChars;   // 1 second / total characters
        
        // Continue the animation
        setTimeout(typewriter, isDeleting ? deleteSpeed : typeSpeed);
    };
    
    // Wait 3 seconds with full text, then start deleting
    setTimeout(() => {
        isDeleting = true;
        typewriter();
    }, 3000);
}

// Scroll Indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    // Hide scroll indicator when scrolled down
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
        }
    });
    
    // Smooth scroll when clicking on scroll indicator
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Hero CTA Button Interactions
function initHeroCTA() {
    const ctaButtons = document.querySelectorAll('.hero-cta .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
            this.style.boxShadow = '0 10px 25px rgba(0, 255, 65, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 255, 65, 0.2)';
        });
        
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Announcement Banner Animation
function initAnnouncementBanner() {
    const banner = document.querySelector('.announcement-banner');
    if (!banner) return;
    
    // Add hover effect
    banner.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(0, 255, 65, 0.2)';
    });
    
    banner.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    // Add click to dismiss functionality
    banner.addEventListener('click', function() {
        this.style.opacity = '0';
        this.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            this.style.display = 'none';
        }, 300);
    });
}

// Initialize all hero functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHero();
    initHeroCTA();
    initAnnouncementBanner();
});

// Export functions for external use
window.HeroComponent = {
    init: initHero,
    initAnimations: initHeroAnimations,
    initScrollIndicator: initScrollIndicator,
    initCTA: initHeroCTA,
    initBanner: initAnnouncementBanner
};
