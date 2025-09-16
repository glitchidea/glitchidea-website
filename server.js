const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 9000;

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
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8080', 
        'https://glitchidea.com',
        'https://*.glitchidea.com',
        ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
    ],
    credentials: true
}));

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
    keywords: 'siber güvenlik, penetrasyon test, güvenlik danışmanı, web geliştirme, django, flask, python güvenlik, cybersecurity, ethical hacking, vulnerability assessment'
  });
});




// API routes for dynamic content
app.get('/api/projects', (req, res) => {
  try {
    // Load all projects from single JSON file
    const projectsData = require('./dist/api/projects.json');
    res.json(projectsData);
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// API route for services
app.get('/api/services', (req, res) => {
  try {
    const servicesData = require('./dist/api/services.json');
    res.json(servicesData);
  } catch (error) {
    console.error('Error loading services:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
});

// API route for blog posts
app.get('/api/blog', (req, res) => {
  try {
    const blogData = require('./dist/api/blog.json');
    res.json(blogData);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    res.status(500).json({ error: 'Failed to load blog posts' });
  }
});

// API route for featured blog post
app.get('/api/blog/featured', (req, res) => {
  try {
    const blogData = require('./dist/api/blog.json');
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
    const projectsData = require('./dist/api/projects.json');
    
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
    const projectsData = require('./dist/api/projects.json');
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
    const projectsData = require('./dist/api/projects.json');
    
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



app.get('/api/blog', (req, res) => {
  const blog = require('./data/blog.json');
  res.json(blog);
});



// Social links endpoint
app.get('/api/social', (req, res) => {
  try {
    const socialData = fs.readFileSync('./dist/api/social.json', 'utf8');
    const social = JSON.parse(socialData);
    res.json(social);
  } catch (error) {
    console.error('Error loading social links:', error);
    res.status(500).json({ error: 'Sosyal medya linkleri yüklenemedi' });
  }
});

// ===== EMAIL FUNCTIONALITY =====

// SMTP Transporter oluştur
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false, // TLS için false
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Email içeriği oluştur
const createEmailContent = (subject, message, senderEmail) => {
    const currentDate = new Date().toLocaleString('tr-TR');
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f5f7fa;
            }
            .email-container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 12px; 
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 300; 
            }
            .content { 
                padding: 30px; 
            }
            .message-card { 
                background: #f8f9fa; 
                border-radius: 10px; 
                padding: 25px; 
                margin: 20px 0; 
                border-left: 5px solid #667eea;
            }
            .message-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e9ecef;
            }
            .sender-info {
                flex: 1;
            }
            .sender-name {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin: 0;
            }
            .sender-email {
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
                margin: 5px 0 0 0;
            }
            .message-date {
                color: #6c757d;
                font-size: 14px;
                text-align: right;
            }
            .message-subject {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin: 15px 0;
                padding: 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }
            .message-body { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                font-size: 16px;
                line-height: 1.7;
                color: #444;
            }
            .footer { 
                background: #f8f9fa; 
                padding: 25px; 
                text-align: center; 
                border-top: 1px solid #e9ecef;
            }
            .reply-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                display: inline-block;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                margin: 10px 0;
            }
            .reply-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }
            .footer-text {
                color: #6c757d;
                font-size: 14px;
                margin: 15px 0 0 0;
            }
            .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #e9ecef, transparent);
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>📧 Yeni Mesaj Aldınız</h1>
            </div>
            
            <div class="content">
                <div class="message-card">
                    <div class="message-header">
                        <div class="sender-info">
                            <h3 class="sender-name">${senderEmail.split('@')[0]}</h3>
                            <a href="mailto:${senderEmail}?subject=Re: ${subject}" class="sender-email">${senderEmail}</a>
                        </div>
                        <div class="message-date">${currentDate}</div>
                    </div>
                    
                    <div class="message-subject">${subject}</div>
                    
                    <div class="message-body">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <a href="mailto:${senderEmail}?subject=Re: ${subject}&body=%0A%0A%0A─────────────────────────────────────────────────────────────%0A📧%20YANIT%20VERİLEN%20MESAJ%0A─────────────────────────────────────────────────────────────%0A%0AGönderen:%20${senderEmail}%0ATarih:%20${currentDate}%0AKonu:%20${subject}%0A%0AMesaj:%0A${message.replace(/\n/g, '%0A')}%0A%0A─────────────────────────────────────────────────────────────%0A%0A" class="reply-button">
                    📧 Hızlı Yanıt Gönder
                </a>
                <div class="divider"></div>
                <p class="footer-text">
                    Bu mesaj ${process.env.SMTP_USERNAME || 'glitchidea65@gmail.com'} adresinden gönderilmiştir.<br>
                    Gönderim Tarihi: ${currentDate}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textContent = `
Konu: ${subject}
Gönderen: ${senderEmail}

Mesaj:
${message}

---
Bu mesaj ${process.env.SMTP_USERNAME || 'glitchidea65@gmail.com'} adresinden gönderilmiştir.
Gönderim Tarihi: ${currentDate}

💡 Hızlı Yanıt: ${senderEmail} adresine "Re: ${subject}" konusuyla yanıt verebilirsiniz.
    `;

    return { htmlContent, textContent };
};

// Email gönderme endpoint'i
app.post('/send-email', async (req, res) => {
    try {
        const { subject, message, senderEmail } = req.body;

        // Veri kontrolü
        if (!subject || !message || !senderEmail) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanlar doldurulmalıdır'
            });
        }

        // Email formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir email adresi giriniz'
            });
        }

        // Konuyu formatla
        const formattedSubject = `${subject} - gönderen(${senderEmail})`;

        // Email içeriği oluştur
        const { htmlContent, textContent } = createEmailContent(subject, message, senderEmail);

        // Transporter oluştur
        const transporter = createTransporter();

        // Email seçenekleri
        const mailOptions = {
            from: process.env.SMTP_USERNAME || process.env.FROM_EMAIL || 'glitchidea65@gmail.com',
            to: process.env.TO_EMAIL || 'info@glitchidea.com',
            subject: formattedSubject,
            text: textContent,
            html: htmlContent,
            replyTo: process.env.SMTP_USERNAME || process.env.FROM_EMAIL || 'glitchidea65@gmail.com'
        };

        // Email gönder
        const info = await transporter.sendMail(mailOptions);

        console.log('Email gönderildi:', info.messageId);

        res.json({
            success: true,
            message: 'Mesajınız başarıyla gönderildi!',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Email gönderme hatası:', error);
        res.status(500).json({
            success: false,
            message: `Email gönderme hatası: ${error.message}`
        });
    }
});

// Test email endpoint'i
app.post('/test-email', async (req, res) => {
    try {
        const testData = {
            subject: 'Test Email',
            message: 'Bu bir test emailidir.',
            senderEmail: 'test@example.com'
        };

        const formattedSubject = `${testData.subject} - gönderen(${testData.senderEmail})`;
        const { htmlContent, textContent } = createEmailContent(testData.subject, testData.message, testData.senderEmail);

        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.SMTP_USERNAME || process.env.FROM_EMAIL || 'glitchidea65@gmail.com',
            to: process.env.TO_EMAIL || 'info@glitchidea.com',
            subject: formattedSubject,
            text: textContent,
            html: htmlContent,
            replyTo: process.env.SMTP_USERNAME || process.env.FROM_EMAIL || 'glitchidea65@gmail.com'
        };

        const info = await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Test email başarıyla gönderildi!',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Test email hatası:', error);
        res.status(500).json({
            success: false,
            message: `Test email hatası: ${error.message}`
        });
    }
});

// Server durumu endpoint'i
app.get('/status', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Email Sender Backend çalışıyor',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        port: PORT
    });
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
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});
