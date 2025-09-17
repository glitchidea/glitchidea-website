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
// Load contact form dynamically
async function loadContactForm() {
    try {
        const contactContainer = document.querySelector('#contact .contact-container');
        if (!contactContainer) return;
        
        // Contact form HTML template
        const contactFormHTML = `
            <!-- Email Contact Form - Right Side -->
            <div class="contact-cta-card contact-form-side" data-aos="fade-left" data-aos-delay="200">
                <div class="cta-content">
                    <h3>💌 İletişime Geç</h3>
                    <p>Hızlı iletişim için mesaj gönderin</p>
                    
                    <form id="emailContactForm" class="email-contact-form compact-form">
                        <div class="form-group">
                            <label for="emailSubject">Konu *</label>
                            <input type="text" id="emailSubject" name="subject" required placeholder="Mesaj konunuz...">
                        </div>
                        
                        <div class="form-group">
                            <label for="emailMessage">Mesajınız *</label>
                            <textarea id="emailMessage" name="message" rows="4" required placeholder="Mesajınızı buraya yazın..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="senderEmail">E-posta Adresiniz *</label>
                            <input type="email" id="senderEmail" name="senderEmail" required placeholder="ornek@email.com">
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary" id="sendEmailBtn">
                                <i class="fas fa-paper-plane"></i>
                                <span>Mesaj Gönder</span>
                            </button>
                        </div>
                        
                        <div id="emailStatus" class="email-status"></div>
                    </form>
                </div>
            </div>
        `;
        
        // Add form to contact container
        contactContainer.insertAdjacentHTML('beforeend', contactFormHTML);
        
        console.log('✅ Contact form loaded dynamically');
        
    } catch (error) {
        console.error('Error loading contact form:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content
    loadFeaturedProjects();
    loadBlogPosts();
    loadContactForm();
    
    // Initialize components
    initProjectsModal();
    initModalProjectFilters();
});
