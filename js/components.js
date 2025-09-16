// ===== COMPONENTS JAVASCRIPT =====

// Load and display featured projects
async function loadFeaturedProjects() {
    try {
        const response = await fetch('./api/projects.json');
        const data = await response.json();
        
        const featuredGrid = document.getElementById('featured-projects-grid');
        if (featuredGrid) {
            featuredGrid.innerHTML = '';
            
            data.featured_projects.forEach(project => {
                const projectCard = createFeaturedProjectCard(project);
                featuredGrid.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error('Error loading featured projects:', error);
    }
}

// Create featured project card element (smaller)
function createFeaturedProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'featured-project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', '100');
    
    card.innerHTML = `
        <div class="card-header">
            <div class="project-image">
                <img src="${project.image || '/images/projects/default.jpg'}" alt="${project.title}" onerror="this.src='/images/projects/default.jpg'">
            </div>
            <div class="project-category">${project.category}</div>
        </div>
        <div class="card-body">
            <h3 class="card-title">${project.title}</h3>
            <p class="card-subtitle">${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.slice(0, 3).map(tech => `<span class="technology-tag">${tech}</span>`).join('')}
                ${project.technologies.length > 3 ? `<span class="technology-tag">+${project.technologies.length - 3}</span>` : ''}
            </div>
        </div>
        <div class="card-footer">
            ${project.demo_url ? `<a href="${project.demo_url}" class="project-link demo" target="_blank">Demo</a>` : ''}
            ${project.github_url ? `<a href="${project.github_url}" class="project-link github" target="_blank">GitHub</a>` : ''}
        </div>
    `;
    
    return card;
}

// Load and display all projects (for modal)
async function loadAllProjects() {
    try {
        const response = await fetch('./api/projects.json');
        const data = await response.json();
        
        const allProjectsGrid = document.getElementById('all-projects-grid');
        if (allProjectsGrid) {
            allProjectsGrid.innerHTML = '';
            
            data.projects.forEach(project => {
                const projectCard = createProjectCard(project);
                allProjectsGrid.appendChild(projectCard);
            });
        }
    } catch (error) {
        console.error('Error loading all projects:', error);
    }
}

// Create project card element (larger for modal)
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'card project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', '100');
    
    card.innerHTML = `
        <div class="card-header">
            <div class="project-image">
                <img src="${project.image || '/images/projects/default.jpg'}" alt="${project.title}" onerror="this.src='/images/projects/default.jpg'">
            </div>
            <div class="project-category">${project.category}</div>
        </div>
        <div class="card-body">
            <h3 class="card-title">${project.title}</h3>
            <p class="card-subtitle">${project.description}</p>
            <div class="project-technologies">
                ${project.technologies.map(tech => `<span class="technology-tag">${tech}</span>`).join('')}
            </div>
        </div>
        <div class="card-footer">
            ${project.demo_url ? `<a href="${project.demo_url}" class="project-link demo" target="_blank">Demo</a>` : ''}
            ${project.github_url ? `<a href="${project.github_url}" class="project-link github" target="_blank">GitHub</a>` : ''}
        </div>
    `;
    
    return card;
}

// Work functionality removed

// Work card function removed

// All work function removed

// Timeline item function removed

// Load and display blog posts
async function loadBlogPosts() {
    try {
        const response = await fetch('./api/blog.json');
        const data = await response.json();
        
        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = '';
            
            data.blog_posts.slice(0, 6).forEach(post => {
                const blogCard = createBlogCard(post);
                blogGrid.appendChild(blogCard);
            });
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
}

// Create blog card element
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'card blog-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', '100');
    
    card.innerHTML = `
        <div class="card-header">
            <div class="blog-image">
                <img src="${post.image || '/images/blog/default.jpg'}" alt="${post.title}" onerror="this.src='/images/blog/default.jpg'">
            </div>
            <div class="blog-category">${post.category}</div>
        </div>
        <div class="card-body">
            <div class="blog-meta">
                <span class="blog-date">${new Date(post.publish_date).toLocaleDateString()}</span>
                <span class="blog-read-time">${post.read_time}</span>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="blog-tags">
                ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="card-footer">
            <a href="${post.url}" class="btn btn-primary" target="_blank">Read More</a>
        </div>
    `;
    
    return card;
}

// Projects Modal functionality
function initProjectsModal() {
    const modal = document.getElementById('all-projects-modal');
    const openBtn = document.getElementById('view-all-projects-btn');
    const closeBtn = document.getElementById('close-modal');
    
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            modal.classList.add('show');
            loadAllProjects();
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }
}


// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const projectsModal = document.getElementById('all-projects-modal');
        
        if (projectsModal && projectsModal.classList.contains('show')) {
            projectsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});

// Project filter functionality (for modal)
function initModalProjectFilters() {
    const filterButtons = document.querySelectorAll('#all-projects-modal .filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Load filtered projects in modal
            loadFilteredProjectsInModal(filter);
        });
    });
}


// Load filtered projects in modal
async function loadFilteredProjectsInModal(category) {
    try {
        const url = category === 'all' ? '/api/all-projects' : `/api/all-projects?category=${category}`;
        const response = await fetch(url);
        const data = await response.json();
        
        const allProjectsGrid = document.getElementById('all-projects-grid');
        if (allProjectsGrid) {
            allProjectsGrid.innerHTML = '';
            
            const projects = data.projects || [];
            projects.forEach(project => {
                const projectCard = createProjectCard(project);
                allProjectsGrid.appendChild(projectCard);
            });
        }
        
        // Reinitialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    } catch (error) {
        console.error('Error loading filtered projects in modal:', error);
    }
}

// Contact form handling with SMTP
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const statusMessage = document.getElementById('status-message');
            
            // Get form data
            const name = formData.get('name');
            const email = formData.get('email');
            const projectType = formData.get('projectType');
            const timeline = formData.get('timeline');
            const projectDetail = formData.get('projectDetail');
            const message = formData.get('message');
            
            // Validation
            if (!name || !email || !projectType || !projectDetail || !message) {
                showStatusMessage('Lütfen tüm zorunlu alanları doldurun!', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showStatusMessage('Geçerli bir email adresi giriniz!', 'error');
                return;
            }
            
            // Set loading state
            setFormLoading(true, submitButton);
            hideStatusMessage();
            
            try {
                // Prepare email content
                const subject = `Proje İletişimi - ${projectType}`;
                const emailMessage = `Merhaba,

Yeni proje iletişimi:

📋 Proje Bilgileri:
• Ad Soyad: ${name}
• E-posta: ${email}
• Proje Türü: ${projectType}
• Proje Detayı: ${projectDetail}
• Zaman Çizelgesi: ${timeline || 'Belirtilmemiş'}

📝 Proje Açıklaması:
${message}

---
Bu mesaj https://glitchidea.com proje iletişim formu üzerinden gönderilmiştir.
Tarih: ${new Date().toLocaleString('tr-TR')}

İyi günler.`;
                
                // Send email via SMTP
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subject: subject,
                        message: emailMessage,
                        senderEmail: email
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showStatusMessage('✅ Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                    this.reset();
                } else {
                    showStatusMessage(`❌ Hata: ${result.message}`, 'error');
                }
                
            } catch (error) {
                console.error('Email gönderme hatası:', error);
                showStatusMessage('❌ Bağlantı hatası! Lütfen tekrar deneyin veya doğrudan info@glitchidea.com adresine yazın.', 'error');
            } finally {
                setFormLoading(false, submitButton);
            }
        });
    }
}

// Set form loading state
function setFormLoading(loading, submitButton) {
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    if (loading) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        if (btnText) btnText.style.display = 'none';
        if (btnLoading) btnLoading.style.display = 'flex';
    } else {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        if (btnText) btnText.style.display = 'flex';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}

// Show status message
function showStatusMessage(message, type) {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Auto hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideStatusMessage();
            }, 5000);
        }
    }
}

// Hide status message
function hideStatusMessage() {
    const statusMessage = document.getElementById('status-message');
    if (statusMessage) {
        statusMessage.style.display = 'none';
    }
}

// Email service modal functions
function openEmailService(service) {
    // This function can be used for fallback mailto functionality if needed
    closeEmailModal();
}

function closeEmailModal() {
    const modal = document.getElementById('email-service-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Load contact social links
async function loadContactSocialLinks() {
    try {
        const response = await fetch('./api/social.json');
        const data = await response.json();
        
        const socialLinksContainer = document.getElementById('contact-social-links');
        
        if (socialLinksContainer && data.social_links) {
            // Filter social media links
            const socialLinks = data.social_links.filter(link => link.type === 'social');
            
            if (socialLinks.length > 0) {
                socialLinksContainer.innerHTML = socialLinks
                    .map(link => {
                        if (link.url && link.url.trim() !== '') {
                            return `
                                <a href="${link.url}" target="_blank" class="social-icon" title="${link.name}">
                                    <i class="${link.icon}"></i>
                                </a>
                            `;
                        } else {
                            return `
                                <span class="social-icon inactive" title="${link.name} - Şuanlık aktif değil">
                                    <i class="${link.icon}"></i>
                                </span>
                            `;
                        }
                    })
                    .join('');
            } else {
                socialLinksContainer.innerHTML = '<p>Sosyal medya linkleri yükleniyor...</p>';
            }
        }
    } catch (error) {
        console.error('Error loading contact social links:', error);
        const socialLinksContainer = document.getElementById('contact-social-links');
        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = '<p>Sosyal medya linkleri yüklenemedi</p>';
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content
    loadFeaturedProjects();
    loadBlogPosts();
    loadContactSocialLinks();
    
    // Initialize components
    initProjectsModal();
    initModalProjectFilters();
    initContactForm();
});
