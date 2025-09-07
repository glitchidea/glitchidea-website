// ===== ABOUT JAVASCRIPT =====

// Initialize About Component
function initAbout() {
    initSkillsAnimation();
    initAboutHeroAnimation();
}

// Terminal animation moved to /js/terminal.js

// Skills Animation
function initSkillsAnimation() {
    const skillCategories = document.querySelectorAll('.skill-category');
    const skillItems = document.querySelectorAll('.skill-category li');
    
    // Animate skill categories on scroll
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate skill items within this category
                const items = entry.target.querySelectorAll('li');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                
                // Animate skill icon
                const skillIcon = entry.target.querySelector('.skill-icon');
                if (skillIcon) {
                    setTimeout(() => {
                        skillIcon.style.transform = 'scale(1.1) rotate(5deg)';
                        setTimeout(() => {
                            skillIcon.style.transform = 'scale(1) rotate(0deg)';
                        }, 300);
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    skillCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'all 0.6s ease';
        observer.observe(category);
        
        // Initialize skill items
        const items = category.querySelectorAll('li');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.4s ease';
        });
    });
    
    // Initialize skills progress
    initSkillsProgress();
}





// About Hero Animation
function initAboutHeroAnimation() {
    const aboutHero = document.querySelector('.about-hero');
    const avatarContainer = document.querySelector('.avatar-container');
    const aboutBadge = document.querySelector('.about-badge');
    
    if (!aboutHero) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate avatar image
                const avatarImage = document.querySelector('.avatar-image');
                if (avatarImage) {
                    avatarImage.style.animation = 'avatarFloat 2s ease-in-out infinite';
                }
                
                // Animate badge
                if (aboutBadge) {
                    aboutBadge.style.animation = 'fadeInUp 0.8s ease forwards';
                }
                
                observer.disconnect();
            }
        });
    }, observerOptions);
    
    observer.observe(aboutHero);
}

// Skills Progress Animation
function initSkillsProgress() {
    const skillItems = document.querySelectorAll('.skill-category li');
    
    skillItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.color = 'var(--text-primary)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.color = 'var(--accent-color)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = 'var(--text-secondary)';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.color = 'var(--accent-color)';
            }
        });
        
        // Add click effect
        item.addEventListener('click', function() {
            this.style.transform = 'translateX(5px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateX(5px) scale(1)';
            }, 150);
        });
    });
}

// About Text Animation
function initAboutTextAnimation() {
    const aboutTitle = document.querySelector('.about-title');
    const aboutDescriptions = document.querySelectorAll('.about-description');
    
    if (aboutTitle) {
        aboutTitle.style.opacity = '0';
        aboutTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            aboutTitle.style.transition = 'all 0.8s ease';
            aboutTitle.style.opacity = '1';
            aboutTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    aboutDescriptions.forEach((desc, index) => {
        desc.style.opacity = '0';
        desc.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            desc.style.transition = 'all 0.6s ease';
            desc.style.opacity = '1';
            desc.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });
}

// Terminal cursor moved to /js/terminal.js

// Initialize all about functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAbout();
    initSkillsProgress();
    initAboutTextAnimation();
});

// Export functions for external use
window.AboutComponent = {
    init: initAbout,
    initSkills: initSkillsAnimation,
    initProgress: initSkillsProgress,
    initText: initAboutTextAnimation
};
