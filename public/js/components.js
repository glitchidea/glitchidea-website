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

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Create mailto link
                const name = formData.get('name');
                const email = formData.get('email');
                const projectType = formData.get('projectType');
                const timeline = formData.get('timeline');
                const message = formData.get('message');
                
                const subject = `Proje İletişimi - ${projectType || 'Genel'}`;
                const body = `Merhaba,

Proje detayları:
- Ad Soyad: ${name}
- E-posta: ${email}
- Proje Türü: ${projectType || 'Belirtilmemiş'}
- Zaman Çizelgesi: ${timeline || 'Belirtilmemiş'}

Proje Detayları:
${message}

İyi günler.`;
                
                const mailtoLink = `mailto:glitchidea65@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Open mailto link
                window.location.href = mailtoLink;
                
                showNotification('E-posta uygulamanız açılıyor...', 'success');
                this.reset();
                
            } catch (error) {
                console.error('Error creating mailto link:', error);
                showNotification('E-posta oluşturulamadı. Lütfen manuel olarak glitchidea65@gmail.com adresine yazın.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
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
    
    // Initialize components
    initProjectsModal();
    initModalProjectFilters();
    initContactForm();
    initMobileMenu();
});

// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbarNav = document.getElementById('navbar-nav');
    
    if (mobileMenuToggle && navbarNav) {
        mobileMenuToggle.addEventListener('click', function() {
            // Toggle active class on hamburger button
            mobileMenuToggle.classList.toggle('active');
            
            // Toggle active class on navigation menu
            navbarNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on nav items
        const navItems = navbarNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navbarNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navbarNav.contains(event.target)) {
                mobileMenuToggle.classList.remove('active');
                navbarNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu on window resize if screen becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileMenuToggle.classList.remove('active');
                navbarNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}
