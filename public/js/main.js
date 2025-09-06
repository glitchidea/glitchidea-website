// ===== MAIN JAVASCRIPT =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupSmoothScrolling();
    setupProjectsTable();
}

// ===== NAVIGATION =====
function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(13, 17, 23, 0.98)';
            navbar.style.backdropFilter = 'blur(16px)';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Active link highlighting with tubelight effect
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // Click navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Smooth scroll to section
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}









// ===== MOBILE MENU =====
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (hamburger.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        }
    });
}

// ===== PROJECTS TABLE =====
function setupProjectsTable() {
    const categoryFilter = document.getElementById('category-filter');
    const techFilter = document.getElementById('tech-filter');
    const statusFilter = document.getElementById('status-filter');
    const viewToggle = document.getElementById('view-toggle');
    const viewMenu = document.getElementById('view-menu');
    const tableBody = document.getElementById('projects-table-body');
    const listBody = document.getElementById('projects-list-body');
    const tableContainer = document.querySelector('.projects-table-container');
    const listContainer = document.getElementById('projects-list-container');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreBtnList = document.getElementById('load-more-btn-list');
    const loadMoreContainer = document.getElementById('load-more-container');
    const loadMoreContainerList = document.getElementById('load-more-container-list');
    
    let projectsData = [];
    let filteredData = [];
    let currentView = 'table'; // 'table' or 'list'
    let displayedCount = 5; // Show only first 5 projects initially
    let allDataShown = false;
    
    // Load projects from API
    async function loadProjectsData() {
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                projectsData = data.projects || [];
                filteredData = [...projectsData];
                renderProjects();
            } else {
                throw new Error('Failed to load projects');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsData = [];
            filteredData = [];
            renderProjects();
        }
    }
    
    // Initialize table
    function renderTable() {
        tableBody.innerHTML = '';
        
        // Show only the first 'displayedCount' projects
        const projectsToShow = filteredData.slice(0, displayedCount);
        
        projectsToShow.forEach(project => {
            const row = document.createElement('tr');
            
            const projectCell = document.createElement('td');
            projectCell.className = 'column-project';
            projectCell.textContent = project.title;
            row.appendChild(projectCell);
            
            const repoCell = document.createElement('td');
            repoCell.className = 'column-repository';
            repoCell.textContent = project.repo.replace('https://', '');
            row.appendChild(repoCell);
            
            const techCell = document.createElement('td');
            techCell.className = 'column-tech';
            techCell.textContent = project.tech;
            row.appendChild(techCell);
            
            const categoryCell = document.createElement('td');
            categoryCell.className = 'column-category';
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `category-badge ${project.category.toLowerCase()}`;
            categoryBadge.textContent = project.category;
            categoryCell.appendChild(categoryBadge);
            row.appendChild(categoryCell);
            
            const statusCell = document.createElement('td');
            statusCell.className = 'column-status';
            const statusBadge = document.createElement('span');
            statusBadge.className = `status-badge ${project.status.toLowerCase().replace(' ', '-')}`;
            statusBadge.textContent = project.status;
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);
            
            tableBody.appendChild(row);
        });
        
        // Update load more button visibility
        updateLoadMoreButton();
    }
    
    // Initialize list
    function renderList() {
        listBody.innerHTML = '';
        
        // Show only the first 'displayedCount' projects
        const projectsToShow = filteredData.slice(0, displayedCount);
        
        projectsToShow.forEach(project => {
            const listItem = document.createElement('div');
            listItem.className = 'project-list-item';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'project-list-info';
            
            const titleDiv = document.createElement('div');
            titleDiv.className = 'project-list-title';
            titleDiv.textContent = project.title;
            infoDiv.appendChild(titleDiv);
            
            const repoDiv = document.createElement('div');
            repoDiv.className = 'project-list-repo';
            repoDiv.textContent = project.repo.replace('https://', '');
            infoDiv.appendChild(repoDiv);
            
            const techDiv = document.createElement('div');
            techDiv.className = 'project-list-tech';
            techDiv.textContent = project.tech;
            infoDiv.appendChild(techDiv);
            
            listItem.appendChild(infoDiv);
            
            const metaDiv = document.createElement('div');
            metaDiv.className = 'project-list-meta';
            
            const categoryBadge = document.createElement('span');
            categoryBadge.className = `category-badge ${project.category.toLowerCase()}`;
            categoryBadge.textContent = project.category;
            metaDiv.appendChild(categoryBadge);
            
            const statusBadge = document.createElement('span');
            statusBadge.className = `status-badge ${project.status.toLowerCase().replace(' ', '-')}`;
            statusBadge.textContent = project.status;
            metaDiv.appendChild(statusBadge);
            
            listItem.appendChild(metaDiv);
            listBody.appendChild(listItem);
        });
        
        // Update load more button visibility
        updateLoadMoreButton();
    }
    
    // Render based on current view
    function renderProjects() {
        if (currentView === 'table') {
            renderTable();
        } else {
            renderList();
        }
    }
    
    // Update load more button visibility
    function updateLoadMoreButton() {
        if (displayedCount >= filteredData.length) {
            loadMoreContainer.classList.add('hidden');
            loadMoreContainerList.classList.add('hidden');
            allDataShown = true;
        } else {
            loadMoreContainer.classList.remove('hidden');
            loadMoreContainerList.classList.remove('hidden');
            allDataShown = false;
        }
    }
    
    // Load more functionality
    function loadMore() {
        displayedCount = Math.min(displayedCount + 5, filteredData.length); // Load 5 more projects
        renderProjects();
    }
    
    // Filter functionality
    function filterData() {
        const categoryValue = categoryFilter.value;
        const techValue = techFilter.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        
        filteredData = projectsData.filter(project => {
            const categoryMatch = !categoryValue || project.category === categoryValue;
            const techMatch = !techValue || project.tech.toLowerCase().includes(techValue);
            const statusMatch = !statusValue || project.status.toLowerCase().includes(statusValue);
            return categoryMatch && techMatch && statusMatch;
        });
        
        // Reset displayed count when filtering
        displayedCount = Math.min(5, filteredData.length);
        renderProjects();
    }
    
    // View switching
    function switchView(view) {
        currentView = view;
        
        // Update view options
        document.querySelectorAll('.view-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Show/hide containers
        if (view === 'table') {
            tableContainer.classList.remove('hide');
            listContainer.classList.remove('show');
        } else {
            tableContainer.classList.add('hide');
            listContainer.classList.add('show');
        }
        
        renderProjects();
    }
    
    // Event listeners
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterData);
    }
    if (techFilter) {
        techFilter.addEventListener('input', filterData);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('input', filterData);
    }
    
    if (viewToggle) {
        viewToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            viewToggle.classList.toggle('active');
            viewMenu.classList.toggle('show');
        });
    }
    
    // Load more button event listeners
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMore);
    }
    if (loadMoreBtnList) {
        loadMoreBtnList.addEventListener('click', loadMore);
    }
    
    // View options
    document.querySelectorAll('.view-option').forEach(option => {
        option.addEventListener('click', () => {
            const view = option.dataset.view;
            switchView(view);
            viewToggle.classList.remove('active');
            viewMenu.classList.remove('show');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (viewToggle && viewMenu) {
            if (!viewToggle.contains(e.target) && !viewMenu.contains(e.target)) {
                viewToggle.classList.remove('active');
                viewMenu.classList.remove('show');
            }
        }
    });
    

    
    // Initial render
    loadProjectsData();
    
    // Set default view
    switchView('table');
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== BLOG FUNCTIONS =====
function loadLatestBlogPost() {
    const latestBlogCard = document.getElementById('latest-blog-card');
    if (!latestBlogCard) return;

    // Sample blog post data - you can update this with your latest Medium post
    const latestPost = {
        title: "OWASP Top 10: Web Uygulama Güvenlik Açıkları",
        excerpt: "Modern web uygulamalarında karşılaşılan en kritik güvenlik açıklarını ve korunma yöntemlerini inceliyoruz. Bu yazıda OWASP Top 10 listesindeki güvenlik açıklarını detaylı olarak ele alıyoruz.",
        category: "cybersecurity",
        date: "2024-01-15",
        url: "https://medium.com/@glitchidea/owasp-top-10-web-uygulama-guvenlik-aciklari" // Your Medium post URL
    };

    // Category name mapping
    function getCategoryName(category) {
        const categories = {
            'cybersecurity': 'Cybersecurity',
            'development': 'Development',
            'python': 'Python',
            'linux': 'Linux'
        };
        return categories[category] || category;
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('tr-TR', options);
    }

    // Render the latest blog post
    latestBlogCard.innerHTML = `
        <div class="blog-content">
            <div class="blog-info">
                <div class="blog-meta">
                    <span class="blog-category">${getCategoryName(latestPost.category)}</span>
                    <span class="blog-date">${formatDate(latestPost.date)}</span>
                </div>
                <h3 class="blog-title">${latestPost.title}</h3>
                <p class="blog-excerpt">${latestPost.excerpt}</p>
            </div>
            <a href="${latestPost.url}" class="read-more" target="_blank">
                Devamını Oku
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideIn 0.3s ease-out;
        border-left: 4px solid;
    `;
    
    // Set colors based on type
    switch (type) {
        case 'success':
            notification.style.background = '#00d4aa';
            notification.style.borderLeftColor = '#00b894';
            break;
        case 'error':
            notification.style.background = '#e74c3c';
            notification.style.borderLeftColor = '#c0392b';
            break;
        case 'warning':
            notification.style.background = '#f39c12';
            notification.style.borderLeftColor = '#e67e22';
            break;
        default:
            notification.style.background = '#3498db';
            notification.style.borderLeftColor = '#2980b9';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add slide in animation
    const slideInStyle = document.createElement('style');
    slideInStyle.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(slideInStyle);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
        if (notification.parentNode) {
                notification.remove();
        }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// ===== EXPORT FOR MODULAR USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        setupNavigation,
        setupMobileMenu,
        setupSmoothScrolling,
        showNotification
    };
}
