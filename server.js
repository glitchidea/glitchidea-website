const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    title: 'GlitchIdea - Siber Güvenlik Uzmanı',
    description: 'Siber Güvenlik Uzmanı & Güvenlik Danışmanı. Python Güvenlik Geliştiricisi, Django & Flask Uzmanı, Penetrasyon Test Uzmanı.',
    keywords: 'siber güvenlik, penetrasyon test, güvenlik danışmanı, web geliştirme, django, flask, python güvenlik'
  });
});




// API routes for dynamic content
app.get('/api/projects', (req, res) => {
  try {
    // Load all projects from single JSON file
    const projectsData = require('./data/projects.json');
    res.json(projectsData);
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// API route for services
app.get('/api/services', (req, res) => {
  try {
    const servicesData = require('./data/services.json');
    res.json(servicesData);
  } catch (error) {
    console.error('Error loading services:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
});

// API route for blog posts
app.get('/api/blog', (req, res) => {
  try {
    const blogData = require('./data/blog.json');
    res.json(blogData);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    res.status(500).json({ error: 'Failed to load blog posts' });
  }
});

// API route for featured blog post
app.get('/api/blog/featured', (req, res) => {
  try {
    const blogData = require('./data/blog.json');
    const featuredPost = blogData.posts.find(post => post.featured === true);
    
    if (featuredPost) {
      res.json({ post: featuredPost });
    } else {
      // If no featured post, return the latest post
      const latestPost = blogData.posts[0];
      res.json({ post: latestPost });
    }
  } catch (error) {
    console.error('Error loading featured blog post:', error);
    res.status(500).json({ error: 'Failed to load featured blog post' });
  }
});

// API route for footer projects
app.get('/api/footer-projects', (req, res) => {
  try {
    // Load all projects from single JSON file
    const projectsData = require('./data/projects.json');
    
    // Filter projects that should appear in footer (first 3 projects)
    const footerProjects = projectsData.projects.slice(0, 3);
    
    res.json({ projects: footerProjects });
  } catch (error) {
    console.error('Error loading footer projects:', error);
    res.status(500).json({ error: 'Failed to load footer projects' });
  }
});

// API route for specific project categories
app.get('/api/projects/:category', (req, res) => {
  try {
    const category = req.params.category;
    const validCategories = ['linux', 'mobile', 'saas', 'security'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Load from single JSON file and filter by category
    const projectsData = require('./data/projects.json');
    const categoryProjects = projectsData.projects.filter(project => 
      project.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({ projects: categoryProjects });
  } catch (error) {
    console.error(`Error loading ${req.params.category} projects:`, error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

app.get('/api/all-projects', (req, res) => {
  try {
    const category = req.query.category;
    
    // Load from single JSON file
    const projectsData = require('./data/projects.json');
    
    if (category && category !== 'all') {
      // Filter by specific category
      const categoryProjects = projectsData.projects.filter(project => 
        project.category.toLowerCase() === category.toLowerCase()
      );
      res.json({ projects: categoryProjects });
    } else {
      // Return all projects
      res.json(projectsData);
    }
  } catch (error) {
    console.error('Error loading all projects:', error);
    res.status(500).json({ error: 'Failed to load all projects' });
  }
});

app.get('/api/services', (req, res) => {
  const services = require('./data/services.json');
  res.json(services);
});


app.get('/api/work', (req, res) => {
  try {
    // Load work experience (same as business for now)
    const workData = require('./data/work.json');
    res.json(workData);
  } catch (error) {
    console.error('Error loading work:', error);
    res.status(500).json({ error: 'Failed to load work data' });
  }
});

app.get('/api/all-work', (req, res) => {
  try {
    const category = req.query.category;
    const workData = require('./data/work.json');
    
    if (category && category !== 'all') {
      // Filter by category
      const filteredWork = {
        work_experience: workData.work_experience.filter(work => work.category === category)
      };
      res.json(filteredWork);
    } else {
      // Return all work, sorted by date (newest first)
      const sortedWork = {
        work_experience: workData.work_experience.sort((a, b) => {
          const yearA = parseInt(a.period.split(' - ')[0]);
          const yearB = parseInt(b.period.split(' - ')[0]);
          return yearB - yearA;
        })
      };
      res.json(sortedWork);
    }
  } catch (error) {
    console.error('Error loading all work:', error);
    res.status(500).json({ error: 'Failed to load all work' });
  }
});

app.get('/api/blog', (req, res) => {
  const blog = require('./data/blog.json');
  res.json(blog);
});



// Social links endpoint
app.get('/api/social', (req, res) => {
  try {
    const socialData = fs.readFileSync('./data/social.json', 'utf8');
    const social = JSON.parse(socialData);
    res.json(social);
  } catch (error) {
    console.error('Error loading social links:', error);
    res.status(500).json({ error: 'Sosyal medya linkleri yüklenemedi' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
    keywords: '404, page not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 - Server Error',
    description: 'Something went wrong on our end.',
    keywords: 'server error, 500'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});
