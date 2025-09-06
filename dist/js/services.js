// ===== SERVICES COMPONENT JAVASCRIPT =====

// Services Component Class
class ServicesComponent {
    constructor(selector = '.services-section') {
        this.servicesSection = document.querySelector(selector);
        this.servicesGrid = this.servicesSection?.querySelector('.services-grid');
        this.serviceCards = this.servicesSection?.querySelectorAll('.service-card');
        this.serviceCTAs = this.servicesSection?.querySelectorAll('.service-cta');
        
        this.isLoading = false;
        this.animationQueue = [];
        this.servicesData = [];
        
        this.init();
    }
    
    init() {
        if (!this.servicesSection) return;
        
        this.loadServices();
        this.initAnimations();
        this.initEventListeners();
        this.initIntersectionObserver();
        this.initMouseTracking();
    }
    
    async loadServices() {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            
            this.servicesData = data.services || [];
            this.renderServices();
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }
    
    renderServices() {
        if (!this.servicesGrid) return;
        
        this.servicesGrid.innerHTML = '';
        
        this.servicesData.forEach((service, index) => {
            const serviceCard = this.createServiceCard(service, index);
            this.servicesGrid.appendChild(serviceCard);
        });
        
        // Re-initialize after rendering
        this.serviceCards = this.servicesSection?.querySelectorAll('.service-card');
        this.serviceCTAs = this.servicesSection?.querySelectorAll('.service-cta');
        this.initAnimations();
        this.initEventListeners();
    }
    
    createServiceCard(service, index) {
        const card = document.createElement('div');
        card.className = 'service-card modern';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${(index + 1) * 100}`);
        
        card.innerHTML = `
            <div class="service-card-header">
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
            </div>
            
            <div class="service-features-list">
                ${service.features.map(feature => `
                    <div class="service-feature">
                        <div class="feature-content">
                            <h4>${feature}</h4>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="service-card-footer">
                <a href="#contact" class="service-cta">
                    <span>İletişim</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        return card;
    }
    
    setupServices() {
        // Add loading state initially if needed
        if (this.servicesGrid) {
            this.servicesGrid.classList.add('loaded');
        }
        
        // Initialize service cards
        this.serviceCards.forEach((card, index) => {
            card.setAttribute('data-index', index);
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
    }
    
    initAnimations() {
        // Initialize service card animations
        this.serviceCards.forEach((card, index) => {
            // Add entrance animation
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 150);
            
            // Add hover animation listeners
            this.initCardHoverAnimations(card);
        });
        
        // Initialize feature animations
        this.initFeatureAnimations();
    }
    
    initCardHoverAnimations(card) {
        const features = card.querySelectorAll('.service-feature');
        const cta = card.querySelector('.service-cta');
        
        card.addEventListener('mouseenter', () => {
            // Animate features on card hover
            features.forEach((feature, index) => {
                setTimeout(() => {
                    feature.style.transform = 'translateX(5px)';
                }, index * 50);
            });
            
            // Animate CTA
            if (cta) {
                cta.style.transform = 'translateY(-2px)';
                cta.style.boxShadow = '0 8px 20px rgba(0, 255, 65, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset feature animations
            features.forEach((feature) => {
                feature.style.transform = '';
            });
            
            // Reset CTA
            if (cta) {
                cta.style.transform = '';
                cta.style.boxShadow = '';
            }
        });
    }
    
    initFeatureAnimations() {
        const features = this.servicesSection.querySelectorAll('.service-feature');
        
        features.forEach((feature) => {
            feature.addEventListener('mouseenter', () => {
                feature.style.borderColor = 'var(--accent-color)';
            });
            
            feature.addEventListener('mouseleave', () => {
                feature.style.borderColor = '';
            });
        });
    }
    
    initEventListeners() {
        // Service CTA click handlers
        this.serviceCTAs.forEach((cta) => {
            cta.addEventListener('click', (e) => {
                this.handleCTAClick(e, cta);
            });
        });
        
        // Service card click handlers
        this.serviceCards.forEach((card) => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.service-cta')) {
                    this.handleCardClick(e, card);
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest('.service-card')) {
                this.handleCardClick(e, e.target.closest('.service-card'));
            }
        });
    }
    
    initIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.animateServicesInView();
                    observer.disconnect();
                }
            });
        }, observerOptions);
        
        if (this.servicesSection) {
            observer.observe(this.servicesSection);
        }
    }
    
    initMouseTracking() {
        this.serviceCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--x', `${x}%`);
                card.style.setProperty('--y', `${y}%`);
            });
        });
    }
    
    animateServicesInView() {
        // Animate section header
        const header = this.servicesSection.querySelector('.section-header');
        if (header) {
            header.style.animation = 'fadeInUp 0.6s ease forwards';
        }
        
        // Animate service cards with staggered delay
        this.serviceCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('visible');
            }, index * 200);
        });
    }
    
    handleCTAClick(e, cta) {
        e.preventDefault();
        
        // Add click animation
        cta.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            cta.style.transform = '';
        }, 150);
        
        // Get target from href
        const href = cta.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                this.smoothScrollTo(target);
            }
        }
        
        // Add success animation to parent card
        const card = cta.closest('.service-card');
        if (card) {
            card.classList.add('success');
            setTimeout(() => {
                card.classList.remove('success');
            }, 600);
        }
    }
    
    handleCardClick(e, card) {
        // Expand card info (if implemented)
        this.toggleCardExpansion(card);
    }
    
    toggleCardExpansion(card) {
        const isExpanded = card.classList.contains('expanded');
        
        // Close all other expanded cards
        this.serviceCards.forEach((otherCard) => {
            if (otherCard !== card) {
                otherCard.classList.remove('expanded');
            }
        });
        
        // Toggle current card
        card.classList.toggle('expanded', !isExpanded);
        
        if (!isExpanded) {
            this.scrollToCard(card);
        }
    }
    
    scrollToCard(card) {
        const rect = card.getBoundingClientRect();
        const offset = window.pageYOffset + rect.top - 100;
        
        this.smoothScrollTo({ offsetTop: offset });
    }
    
    smoothScrollTo(target) {
        const targetOffset = typeof target === 'object' && target.offsetTop 
            ? target.offsetTop 
            : target;
            
        window.scrollTo({
            top: targetOffset - 80,
            behavior: 'smooth'
        });
    }
    
    // Add new service card dynamically
    addServiceCard(serviceData) {
        if (!this.servicesGrid) return;
        
        const cardHTML = this.createServiceCardHTML(serviceData);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML;
        const newCard = tempDiv.firstElementChild;
        
        // Add to grid
        this.servicesGrid.appendChild(newCard);
        
        // Initialize animations for new card
        this.initCardHoverAnimations(newCard);
        
        // Animate in
        setTimeout(() => {
            newCard.classList.add('animate-in');
        }, 100);
        
        return newCard;
    }
    
    createServiceCardHTML(data) {
        return `
            <div class="service-card modern" data-aos="fade-up">
                <div class="service-card-header">
                    <h3 class="service-title">${data.title}</h3>
                    <p class="service-description">${data.description}</p>
                </div>
                
                <div class="service-features-list">
                    ${data.features.map(feature => `
                        <div class="service-feature">
                            <div class="feature-content">
                                <h4>${feature}</h4>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="service-card-footer">
                    <a href="${data.ctaLink || '#contact'}" class="service-cta">
                        <span>${data.ctaText || 'İletişim'}</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }
    
    // Remove service card
    removeServiceCard(cardIndex) {
        const card = this.serviceCards[cardIndex];
        if (!card) return;
        
        card.style.animation = 'fadeOut 0.3s ease forwards';
        
        setTimeout(() => {
            card.remove();
        }, 300);
    }
    
    // Set loading state
    setLoading(loading) {
        this.isLoading = loading;
        
        if (this.servicesGrid) {
            this.servicesGrid.classList.toggle('loading', loading);
        }
    }
    
    // Refresh services
    refresh() {
        this.serviceCards = this.servicesSection?.querySelectorAll('.service-card');
        this.serviceCTAs = this.servicesSection?.querySelectorAll('.service-cta');
        
        this.loadServices();
    }
    
    // Get services data
    getServicesData() {
        return this.servicesData;
    }
}

// Initialize Services Component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize services component
    const servicesComponent = new ServicesComponent();
    
    // Make it globally accessible
    window.servicesComponent = servicesComponent;
});

// Export ServicesComponent for external use
window.ServicesComponent = ServicesComponent;

// Global services functions
window.Services = {
    // Create new services instance
    create: (selector) => new ServicesComponent(selector),
    
    // Add new service
    addService: (serviceData) => {
        if (window.servicesComponent) {
            return window.servicesComponent.addServiceCard(serviceData);
        }
    },
    
    // Remove service
    removeService: (index) => {
        if (window.servicesComponent) {
            window.servicesComponent.removeServiceCard(index);
        }
    },
    
    // Refresh services
    refresh: () => {
        if (window.servicesComponent) {
            window.servicesComponent.refresh();
        }
    },
    
    // Get services data
    getData: () => {
        if (window.servicesComponent) {
            return window.servicesComponent.getServicesData();
        }
        return [];
    }
};


