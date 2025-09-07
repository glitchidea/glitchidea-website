// ===== PROJECTS COMPONENT JAVASCRIPT =====

// Projects Component Class
class ProjectsComponent {
    constructor(selector = '#projects') {
        this.projectsSection = document.querySelector(selector);
        this.projectsTableBody = document.getElementById('projects-table-body');
        this.projectsListBody = document.getElementById('projects-list-body');
        this.categoryFilter = document.getElementById('category-filter');
        this.techFilter = document.getElementById('tech-filter');
        this.statusFilter = document.getElementById('status-filter');
        this.viewToggle = document.getElementById('view-toggle');
        this.viewMenu = document.getElementById('view-menu');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.loadMoreBtnList = document.getElementById('load-more-btn-list');
        
        this.currentView = 'table';
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.allProjects = [];
        this.filteredProjects = [];
        
        this.init();
    }
    
    init() {
        if (!this.projectsSection) return;
        
        this.loadProjects();
        this.initEventListeners();
        this.initViewToggle();
        this.initMobileOptimization();
        
        // Ensure view toggle is initialized after a short delay
        setTimeout(() => {
            this.initViewToggle();
        }, 100);
    }
    
    async loadProjects() {
        try {
            const response = await fetch('./api/projects.json');
            const data = await response.json();
            
            this.allProjects = data.projects || [];
            this.filteredProjects = [...this.allProjects];
            
            this.renderProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    initEventListeners() {
        // Filter event listeners
        if (this.categoryFilter) {
            this.categoryFilter.addEventListener('change', () => this.applyFilters());
        }
        
        if (this.techFilter) {
            this.techFilter.addEventListener('input', () => this.applyFilters());
        }
        
        if (this.statusFilter) {
            this.statusFilter.addEventListener('input', () => this.applyFilters());
        }
        
        // Load more buttons
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
        
        if (this.loadMoreBtnList) {
            this.loadMoreBtnList.addEventListener('click', () => this.loadMore());
        }
    }
    
    initViewToggle() {
        if (this.viewToggle) {
            this.viewToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.viewMenu.classList.toggle('show');
                this.viewToggle.classList.toggle('active');
            });
        }
        
        // View options
        const viewOptions = this.viewMenu ? this.viewMenu.querySelectorAll('.view-option') : null;
        if (viewOptions) {
            viewOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const view = option.getAttribute('data-view');
                    this.switchView(view);
                    
                    // Update active state
                    viewOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    // Close dropdown
                    this.viewMenu.classList.remove('show');
                    this.viewToggle.classList.remove('active');
                });
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.viewToggle && this.viewMenu && 
                !this.viewToggle.contains(e.target) && !this.viewMenu.contains(e.target)) {
                this.viewMenu.classList.remove('show');
                this.viewToggle.classList.remove('active');
            }
        });
    }
    
    applyFilters() {
        const categoryFilter = this.categoryFilter ? this.categoryFilter.value : '';
        const techFilter = this.techFilter ? this.techFilter.value.toLowerCase() : '';
        const statusFilter = this.statusFilter ? this.statusFilter.value.toLowerCase() : '';
        
        this.filteredProjects = this.allProjects.filter(project => {
            const matchesCategory = !categoryFilter || project.category === categoryFilter;
            const matchesTech = !techFilter || project.tech.toLowerCase().includes(techFilter);
            const matchesStatus = !statusFilter || project.status.toLowerCase().includes(statusFilter);
            
            return matchesCategory && matchesTech && matchesStatus;
        });
        
        this.currentPage = 1;
        this.renderProjects();
    }
    
    switchView(view) {
        this.currentView = view;
        this.currentPage = 1;
        
        const tableContainer = document.querySelector('.projects-table-container');
        const listContainer = document.querySelector('.projects-list-container');
        
        if (view === 'table') {
            if (tableContainer) {
                tableContainer.classList.remove('hide');
                tableContainer.style.display = 'block';
            }
            if (listContainer) {
                listContainer.classList.remove('show');
                listContainer.style.display = 'none';
            }
        } else {
            if (tableContainer) {
                tableContainer.classList.add('hide');
                tableContainer.style.display = 'none';
            }
            if (listContainer) {
                listContainer.classList.add('show');
                listContainer.style.display = 'block';
            }
        }
        
        this.renderProjects();
    }
    
    renderProjects() {
        const endIndex = this.currentPage * this.itemsPerPage;
        const projectsToShow = this.filteredProjects.slice(0, endIndex);
        
        if (this.currentView === 'table') {
            this.renderTableView(projectsToShow);
        } else {
            this.renderListView(projectsToShow);
        }
        
        this.updateLoadMoreButton();
    }
    
    renderTableView(projects) {
        if (!this.projectsTableBody) return;
        
        this.projectsTableBody.innerHTML = '';
        
        projects.forEach(project => {
            const row = this.createTableRow(project);
            this.projectsTableBody.appendChild(row);
        });
    }
    
    renderListView(projects) {
        if (!this.projectsListBody) return;
        
        this.projectsListBody.innerHTML = '';
        
        projects.forEach(project => {
            const item = this.createListItem(project);
            this.projectsListBody.appendChild(item);
        });
    }
    
    createTableRow(project) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="column-project">${project.title}</td>
            <td class="column-repository">
                <a href="${project.repo}" target="_blank" rel="noopener noreferrer" class="repo-link">
                    ${project.repo.replace('https://', '')}
                </a>
            </td>
            <td class="column-tech">${project.tech}</td>
            <td class="column-category">
                <span class="category-badge ${project.category.toLowerCase()}">${project.category}</span>
            </td>
            <td class="column-status">
                <span class="status-badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
            </td>
        `;
        
        return row;
    }
    
    createListItem(project) {
        const item = document.createElement('div');
        item.className = 'project-list-item';
        item.innerHTML = `
            <div class="project-list-info">
                <div class="project-list-title">${project.title}</div>
                <div class="project-list-repo">
                    <a href="${project.repo}" target="_blank" rel="noopener noreferrer" class="repo-link">
                        ${project.repo.replace('https://', '')}
                    </a>
                </div>
                <div class="project-list-tech">${project.tech}</div>
            </div>
            <div class="project-list-meta">
                <span class="category-badge ${project.category.toLowerCase()}">${project.category}</span>
                <span class="status-badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
            </div>
        `;
        
        return item;
    }
    
    loadMore() {
        this.currentPage++;
        this.renderProjects();
    }
    
    updateLoadMoreButton() {
        const hasMoreItems = this.currentPage * this.itemsPerPage < this.filteredProjects.length;
        
        if (this.loadMoreBtn) {
            this.loadMoreBtn.classList.toggle('hidden', !hasMoreItems);
        }
        
        if (this.loadMoreBtnList) {
            this.loadMoreBtnList.classList.toggle('hidden', !hasMoreItems);
        }
    }
    
    // Public methods for external use
    refresh() {
        this.loadProjects();
    }
    
    filterByCategory(category) {
        if (this.categoryFilter) {
            this.categoryFilter.value = category;
            this.applyFilters();
        }
    }
    
    searchByTech(tech) {
        if (this.techFilter) {
            this.techFilter.value = tech;
            this.applyFilters();
        }
    }
    
    getProjectsData() {
        return this.filteredProjects;
    }
    
    // Mobile optimization methods
    initMobileOptimization() {
        // Check if device is mobile and switch to list view
        this.checkMobileView();
        
        // Listen for window resize to handle orientation changes
        window.addEventListener('resize', () => {
            this.checkMobileView();
        });
    }
    
    checkMobileView() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024;
        
        if (isMobile && this.currentView === 'table') {
            // Switch to list view on mobile
            this.switchView('list');
            
            // Update active state in dropdown
            const viewOptions = this.viewMenu ? this.viewMenu.querySelectorAll('.view-option') : null;
            if (viewOptions) {
                viewOptions.forEach(opt => opt.classList.remove('active'));
                const listOption = Array.from(viewOptions).find(opt => opt.getAttribute('data-view') === 'list');
                if (listOption) {
                    listOption.classList.add('active');
                }
            }
        } else if (!isMobile && !isTablet && this.currentView === 'list') {
            // Switch back to table view on desktop
            this.switchView('table');
            
            // Update active state in dropdown
            const viewOptions = this.viewMenu ? this.viewMenu.querySelectorAll('.view-option') : null;
            if (viewOptions) {
                viewOptions.forEach(opt => opt.classList.remove('active'));
                const tableOption = Array.from(viewOptions).find(opt => opt.getAttribute('data-view') === 'table');
                if (tableOption) {
                    tableOption.classList.add('active');
                }
            }
        }
    }
    
    isMobileDevice() {
        return window.innerWidth <= 768;
    }
}

// Initialize Projects Component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize projects component
    const projectsComponent = new ProjectsComponent();
    
    // Make it globally accessible
    window.projectsComponent = projectsComponent;
});

// Export ProjectsComponent for external use
window.ProjectsComponent = ProjectsComponent;

// Global projects functions
window.Projects = {
    // Create new projects instance
    create: (selector) => new ProjectsComponent(selector),
    
    // Refresh projects
    refresh: () => {
        if (window.projectsComponent) {
            window.projectsComponent.refresh();
        }
    },
    
    // Filter by category
    filterByCategory: (category) => {
        if (window.projectsComponent) {
            window.projectsComponent.filterByCategory(category);
        }
    },
    
    // Search by technology
    searchByTech: (tech) => {
        if (window.projectsComponent) {
            window.projectsComponent.searchByTech(tech);
        }
    },
    
    // Get projects data
    getData: () => {
        if (window.projectsComponent) {
            return window.projectsComponent.getProjectsData();
        }
        return [];
    }
};
