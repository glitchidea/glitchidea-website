// ===== BLOG COMPONENT JAVASCRIPT =====

// Blog Component Class
class BlogComponent {
    constructor(selector = '#blog') {
        this.blogSection = document.querySelector(selector);
        this.latestBlogCard = document.getElementById('latest-blog-card');
        this.blogData = [];
        
        this.init();
    }
    
    init() {
        if (!this.blogSection) return;
        
        this.loadLatestBlogPost();
        this.initAnimations();
        this.initEventListeners();
    }
    
    async loadLatestBlogPost() {
        try {
            // Load featured blog post from API
            const response = await fetch('./api/blog.json');
            const data = await response.json();
            
            // Find featured post or use first post
            const featuredPost = data.posts?.find(post => post.featured === true) || data.posts?.[0];
            if (featuredPost) {
                this.renderLatestBlogPost(featuredPost);
            } else {
                this.renderSampleBlogPost();
            }
        } catch (error) {
            console.error('Error loading blog post:', error);
            this.renderSampleBlogPost();
        }
    }
    
    renderLatestBlogPost(post) {
        if (!this.latestBlogCard) return;
        
        const categoryName = this.getCategoryName(post.category);
        const formattedDate = this.formatDate(post.date);
        
        this.latestBlogCard.innerHTML = `
            <div class="blog-content">
                <div class="blog-info">
                    <div class="blog-meta">
                        <span class="blog-category">${categoryName}</span>
                        <span class="blog-date">${formattedDate}</span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                </div>
                <a href="${post.url}" class="read-more" target="_blank">
                    Devamını Oku
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    }
    
    renderSampleBlogPost() {
        if (!this.latestBlogCard) return;
        
        // Sample blog post data
        const latestPost = {
            title: "OWASP Top 10: Web Uygulama Güvenlik Açıkları",
            excerpt: "Modern web uygulamalarında karşılaşılan en kritik güvenlik açıklarını ve korunma yöntemlerini inceliyoruz. Bu yazıda OWASP Top 10 listesindeki güvenlik açıklarını detaylı olarak ele alıyoruz.",
            category: "cybersecurity",
            date: "2024-01-15",
            url: "https://medium.com/@glitchidea/owasp-top-10-web-uygulama-guvenlik-aciklari"
        };
        
        this.renderLatestBlogPost(latestPost);
    }
    
    getCategoryName(category) {
        const categories = {
            'cybersecurity': 'Cybersecurity',
            'development': 'Development',
            'python': 'Python',
            'linux': 'Linux',
            'pentest': 'Penetration Testing'
        };
        return categories[category] || category;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('tr-TR', options);
    }
    
    initAnimations() {
        // Add entrance animations
        if (this.latestBlogCard) {
            this.latestBlogCard.style.opacity = '0';
            this.latestBlogCard.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                this.latestBlogCard.style.transition = 'all 0.6s ease';
                this.latestBlogCard.style.opacity = '1';
                this.latestBlogCard.style.transform = 'translateY(0)';
            }, 300);
        }
    }
    
    initEventListeners() {
        // Blog card hover effects
        if (this.latestBlogCard) {
            this.latestBlogCard.addEventListener('mouseenter', () => {
                this.latestBlogCard.style.transform = 'translateY(-5px)';
            });
            
            this.latestBlogCard.addEventListener('mouseleave', () => {
                this.latestBlogCard.style.transform = 'translateY(0)';
            });
        }
        
        // Read more link effects
        const readMoreLink = this.latestBlogCard?.querySelector('.read-more');
        if (readMoreLink) {
            readMoreLink.addEventListener('mouseenter', () => {
                const icon = readMoreLink.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(3px)';
                }
            });
            
            readMoreLink.addEventListener('mouseleave', () => {
                const icon = readMoreLink.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(0)';
                }
            });
        }
    }
    
    // Load multiple blog posts
    async loadBlogPosts() {
        try {
            const response = await fetch('./api/blog.json');
            const data = await response.json();
            
            this.blogData = data.posts || [];
            this.renderBlogGrid();
        } catch (error) {
            console.error('Error loading blog posts:', error);
        }
    }
    
    renderBlogGrid() {
        const blogGrid = this.blogSection?.querySelector('.blog-grid');
        if (!blogGrid) return;
        
        blogGrid.innerHTML = '';
        
        this.blogData.forEach(post => {
            const blogCard = this.createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
    }
    
    createBlogCard(post) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        
        const categoryName = this.getCategoryName(post.category);
        const formattedDate = this.formatDate(post.date);
        
        card.innerHTML = `
            <div class="blog-image">
                <i class="fas fa-newspaper"></i>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${categoryName}</span>
                    <span class="blog-date">${formattedDate}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-tags">
                    <span class="blog-tag">${post.category}</span>
                </div>
            </div>
        `;
        
        // Add click event to open blog post
        card.addEventListener('click', () => {
            window.open(post.url, '_blank');
        });
        
        return card;
    }
    
    // Refresh blog data
    refresh() {
        this.loadLatestBlogPost();
        this.loadBlogPosts();
    }
    
    // Get blog data
    getBlogData() {
        return this.blogData;
    }
}

// Initialize Blog Component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog component
    const blogComponent = new BlogComponent();
    
    // Make it globally accessible
    window.blogComponent = blogComponent;
});

// Export BlogComponent for external use
window.BlogComponent = BlogComponent;

// Global blog functions
window.Blog = {
    // Create new blog instance
    create: (selector) => new BlogComponent(selector),
    
    // Refresh blog
    refresh: () => {
        if (window.blogComponent) {
            window.blogComponent.refresh();
        }
    },
    
    // Get blog data
    getData: () => {
        if (window.blogComponent) {
            return window.blogComponent.getBlogData();
        }
        return [];
    }
};
