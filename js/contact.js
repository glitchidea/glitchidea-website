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

// Mail Modal Functions


let formData = {};
let contactEmail = '';

// Load contact email from social.json
function loadContactEmail() {
    fetch('./api/social.json')
        .then(response => response.json())
        .then(data => {
            const emailItem = data.social_links.find(item => item.type === 'contact');
            if (emailItem) {
                contactEmail = emailItem.url;
                document.getElementById('contact-email').textContent = contactEmail;
            }
        })
        .catch(error => {
            console.error('Error loading contact email:', error);
        });
}

function openMailService(service) {
    if (!contactEmail) {
        alert('E-posta adresi yüklenemedi. Lütfen sayfayı yenileyin.');
        return;
    }
    
    const email = contactEmail;
    const subject = `Proje Teklifi - ${formData.projectType || 'Genel'}`;
    
    // Create email body from form data
    let body = `Merhaba,\n\n`;
    body += `Adım: ${formData.name}\n`;
    body += `E-posta: ${formData.email}\n\n`;
    
    if (formData.projectType) {
        body += `Proje Türü: ${formData.projectType}\n`;
    }
    
    if (formData.budget) {
        body += `Bütçe: ${formData.budget}\n`;
    }
    
    if (formData.timeline) {
        body += `Zaman Çizelgesi: ${formData.timeline}\n`;
    }
    
    body += `\nProje Detayları:\n${formData.message}\n\n`;
    body += `Saygılarımla,\n${formData.name}`;
    
    let mailUrl;
    
    switch(service) {
        case 'gmail':
            mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            break;
        case 'outlook':
            mailUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            break;
        case 'yahoo':
            mailUrl = `https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            break;
        case 'default':
        default:
            mailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            break;
    }
    
    // Close service modal first
    closeServiceModal();
    
    // Open mail service
    window.open(mailUrl, '_blank');
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const serviceModal = document.getElementById('serviceModal');
    const closeServiceButton = document.getElementById('closeServiceModal');
    const projectForm = document.getElementById('projectForm');
    const serviceButtons = document.querySelectorAll('.mail-service-btn');
    const projectTypeSelect = document.getElementById('projectType');
    const otherProjectTypeGroup = document.getElementById('otherProjectTypeGroup');
    const otherProjectTypeInput = document.getElementById('otherProjectType');
    
    // Load contact email
    loadContactEmail();
    
    // Close service modal
    if (closeServiceButton) {
        closeServiceButton.addEventListener('click', closeServiceModal);
    }
    
    // Handle project type change
    if (projectTypeSelect) {
        projectTypeSelect.addEventListener('change', () => {
            if (projectTypeSelect.value === 'Diğer') {
                otherProjectTypeGroup.style.display = 'block';
                otherProjectTypeGroup.classList.add('show');
                otherProjectTypeInput.required = true;
            } else {
                otherProjectTypeGroup.classList.remove('show');
                setTimeout(() => {
                    otherProjectTypeGroup.style.display = 'none';
                }, 300);
                otherProjectTypeInput.required = false;
                otherProjectTypeInput.value = '';
            }
        });
    }
    
    // Handle form submission
    if (projectForm) {
        projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = projectForm.querySelector('#sendForm');
            const originalText = submitBtn.innerHTML;
            const status = document.getElementById('form-status');
            
            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            if (status) status.style.display = 'none';
            
            try {
                const formDataObj = new FormData(projectForm);
                
                const response = await fetch('https://your-worker.your-subdomain.workers.dev', {
                    method: 'POST',
                    body: formDataObj
                });
                
                if (response.ok) {
                    if (status) {
                        status.textContent = 'Mesajınız başarıyla gönderildi!';
                        status.className = 'form-status success';
                        status.style.display = 'block';
                    }
                    projectForm.reset();
                } else {
                    throw new Error('Failed to send message');
                }
                
            } catch (error) {
                if (status) {
                    status.textContent = 'Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.';
                    status.className = 'form-status error';
                    status.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // Service buttons
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const service = button.getAttribute('data-service');
            openMailService(service);
        });
    });
    
    // Close service modal when clicking outside
    if (serviceModal) {
        serviceModal.addEventListener('click', (e) => {
            if (e.target === serviceModal) {
                closeServiceModal();
            }
        });
    }
    
    // Close service modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (serviceModal && serviceModal.classList.contains('show')) {
                closeServiceModal();
            }
        }
    });
});
