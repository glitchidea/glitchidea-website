// ===== CONTACT COMPONENT JAVASCRIPT =====

// Contact Component Class
class ContactComponent {
    constructor(selector = '#contact') {
        this.contactSection = document.querySelector(selector);
        
        this.init();
    }
    
    init() {
        if (!this.contactSection) return;
        
        this.loadSocialLinks();
        this.initAnimations();
    }
    
    async loadSocialLinks() {
        try {
            const response = await fetch('./api/social.json');
            const data = await response.json();
            
            const socialContainer = this.contactSection?.querySelector('#contact-social-links');
            const platformContainer = this.contactSection?.querySelector('#contact-platform-links');
            
            if (data.social_links && data.social_links.length > 0) {
                // Filter social media links
                const socialLinks = data.social_links.filter(link => link.type === 'social');
                const platformLinks = data.social_links.filter(link => link.type === 'platform');
                
                // Render social media links
                if (socialLinks.length > 0 && socialContainer) {
                    socialContainer.innerHTML = socialLinks
                        .map(link => {
                            if (link.url && link.url.trim() !== '') {
                                // Active social link with URL
                                return `
                                    <a href="${link.url}" target="_blank" class="social-link active" title="${link.name}">
                                        <i class="${link.icon}"></i>
                                        <span>${link.name}</span>
                                    </a>
                                `;
                            } else {
                                // Inactive social link without URL
                                return `
                                    <span class="social-link inactive" title="${link.name} - Şuanlık aktif değil">
                                        <i class="${link.icon}"></i>
                                        <span>${link.name}</span>
                                        <span class="inactive-badge">şuanlık aktif değil</span>
                                    </span>
                                `;
                            }
                        })
                        .join('');
                }
                
                // Render platform links
                if (platformLinks.length > 0 && platformContainer) {
                    platformContainer.innerHTML = platformLinks
                        .map(link => {
                            if (link.url && link.url.trim() !== '') {
                                // Active platform link with URL
                                return `
                                    <a href="${link.url}" target="_blank" class="platform-link active" title="${link.name}">
                                        <i class="${link.icon}"></i>
                                        <span>${link.name}</span>
                                    </a>
                                `;
                            } else {
                                // Inactive platform link without URL
                                return `
                                    <span class="platform-link inactive" title="${link.name} - Şuanlık aktif değil">
                                        <i class="${link.icon}"></i>
                                        <span>${link.name}</span>
                                        <span class="inactive-badge">şuanlık aktif değil</span>
                                    </span>
                                `;
                            }
                        })
                        .join('');
                }
            }
        } catch (error) {
            console.error('Error loading social links:', error);
        }
    }
    
    initAnimations() {
        // Add scroll animations for contact cards
        const contactCards = this.contactSection?.querySelectorAll('.contact-info-card');
        
        if (contactCards) {
            contactCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }
    }
    
    // Public methods for external use
    refresh() {
        this.loadSocialLinks();
    }
    
    getSocialLinks() {
        return this.contactSection?.querySelectorAll('.social-link, .platform-link');
    }
}

// Initialize Contact Component
document.addEventListener('DOMContentLoaded', () => {
    window.contactComponent = new ContactComponent();
});

// Export ContactComponent for external use
window.ContactComponent = ContactComponent;

// Global contact functions
window.Contact = {
    // Create new contact instance
    create: (selector) => new ContactComponent(selector),
    
    // Refresh contact form
    refresh: () => {
        if (window.contactComponent) {
            window.contactComponent.refresh();
        }
    },
    
    // Get social links
    getSocialLinks: () => {
        if (window.contactComponent) {
            return window.contactComponent.getSocialLinks();
        }
        return [];
    }
};

// Load contact email from social.json
function loadContactEmail() {
    fetch('./api/social.json')
        .then(response => response.json())
        .then(data => {
            const emailItem = data.social_links.find(item => item.type === 'contact');
            if (emailItem) {
                document.getElementById('contact-email').textContent = emailItem.url;
            }
        })
        .catch(error => {
            console.error('Error loading contact email:', error);
        });
}

// Email sending functionality
async function sendEmailMessage(subject, message, senderEmail) {
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                message: message,
                senderEmail: senderEmail
            })
        });

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message);
        }
        
        return data;
    } catch (error) {
        throw new Error(`Email gönderme hatası: ${error.message}`);
    }
}

// Show status message
function showEmailStatus(message, type = 'info') {
    const statusDiv = document.getElementById('emailStatus');
    if (!statusDiv) return;
    
    statusDiv.textContent = message;
    statusDiv.className = `email-status ${type}`;
    statusDiv.classList.add('show');
    
    // Auto hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }
}

// Initialize email contact form
function initEmailContactForm() {
    const emailForm = document.getElementById('emailContactForm');
    const sendBtn = document.getElementById('sendEmailBtn');
    
    if (!emailForm || !sendBtn) return;
    
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(emailForm);
        const subject = formData.get('subject')?.trim();
        const message = formData.get('message')?.trim();
        const senderEmail = formData.get('senderEmail')?.trim();
        
        // Validate required fields
        if (!subject || !message || !senderEmail) {
            showEmailStatus('Lütfen tüm alanları doldurun.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            showEmailStatus('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }
        
        // Show loading state
        sendBtn.classList.add('loading');
        sendBtn.disabled = true;
        const originalText = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Gönderiliyor...</span>';
        
        showEmailStatus('Mesajınız gönderiliyor...', 'loading');
        
        try {
            // Send email
            const result = await sendEmailMessage(subject, message, senderEmail);
            
            // Show success message
            showEmailStatus('✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.', 'success');
            
            // Reset form
            emailForm.reset();
            
        } catch (error) {
            console.error('Email sending error:', error);
            showEmailStatus(`❌ ${error.message}`, 'error');
        } finally {
            // Reset button state
            sendBtn.classList.remove('loading');
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalText;
        }
    });
}

// Initialize contact email loading when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load contact email
    loadContactEmail();
    
    // Initialize email contact form
    initEmailContactForm();
});
