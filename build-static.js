const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building static site...');

// Create dist directory
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy public files to dist
console.log('📁 Copying public files...');
const copyRecursive = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Note: public files should be manually copied to dist/ before running this script
// or use: cp -r public/* dist/ (if public folder exists)

// Load data files from dist/api (these should be manually maintained)
console.log('📊 Loading data files...');
const socialData = JSON.parse(fs.readFileSync('./dist/api/social.json', 'utf8'));
const projectsData = JSON.parse(fs.readFileSync('./dist/api/projects.json', 'utf8'));
const servicesData = JSON.parse(fs.readFileSync('./dist/api/services.json', 'utf8'));
const blogData = JSON.parse(fs.readFileSync('./dist/api/blog.json', 'utf8'));
const workData = JSON.parse(fs.readFileSync('./dist/api/work.json', 'utf8'));

// Render main template
console.log('🎨 Rendering templates...');

// Read all partial files
const headerTemplate = fs.readFileSync('./views/partials/header.ejs', 'utf8');
const footerTemplate = fs.readFileSync('./views/partials/footer.ejs', 'utf8');

// Read all component files
const heroTemplate = fs.readFileSync('./views/components/hero.ejs', 'utf8');
const aboutTemplate = fs.readFileSync('./views/components/about.ejs', 'utf8');
const servicesTemplate = fs.readFileSync('./views/components/services.ejs', 'utf8');
const projectsTemplate = fs.readFileSync('./views/components/projects.ejs', 'utf8');
const blogTemplate = fs.readFileSync('./views/components/blog.ejs', 'utf8');
const contactTemplate = fs.readFileSync('./views/components/contact.ejs', 'utf8');

// Read layout template
const layoutTemplate = fs.readFileSync('./views/layouts/main.ejs', 'utf8');

// Render partials
const headerHtml = ejs.render(headerTemplate, { socialData, projectsData, servicesData, blogData, workData });
const footerHtml = ejs.render(footerTemplate, { socialData, projectsData, servicesData, blogData, workData });

// Render each component
const heroHtml = ejs.render(heroTemplate, { socialData, projectsData, servicesData, blogData, workData });
const aboutHtml = ejs.render(aboutTemplate, { socialData, projectsData, servicesData, blogData, workData });
const servicesHtml = ejs.render(servicesTemplate, { socialData, projectsData, servicesData, blogData, workData });
const projectsHtml = ejs.render(projectsTemplate, { socialData, projectsData, servicesData, blogData, workData });
const blogHtml = ejs.render(blogTemplate, { socialData, projectsData, servicesData, blogData, workData });
const contactHtml = ejs.render(contactTemplate, { socialData, projectsData, servicesData, blogData, workData });

// Combine all components
const bodyContent = heroHtml + aboutHtml + servicesHtml + projectsHtml + blogHtml + contactHtml;

// Replace include statements in layout template
let layoutHtml = layoutTemplate
  .replace('<%- include(\'../partials/header\') %>', headerHtml)
  .replace('<%- include(\'../partials/footer\') %>', footerHtml)
  .replace('<%- body %>', bodyContent);

// Render main layout with all parts
const html = ejs.render(layoutHtml, {
  title: 'GlitchIdea - Siber Güvenlik Uzmanı',
  description: 'Siber Güvenlik Uzmanı & Güvenlik Danışmanı. Python Güvenlik Geliştiricisi, Django & Flask Uzmanı, Penetrasyon Test Uzmanı.',
  keywords: 'siber güvenlik, penetrasyon test, güvenlik danışmanı, web geliştirme, django, flask, python güvenlik'
});

// Fix paths for GitHub Pages deployment
// Replace absolute paths with relative paths
const fixedHtml = html
  .replace(/href="\/css\//g, 'href="./css/')
  .replace(/href="\/js\//g, 'href="./js/')
  .replace(/href="\/images\//g, 'href="./images/')
  .replace(/href="\/fonts\//g, 'href="./fonts/')
  .replace(/src="\/css\//g, 'src="./css/')
  .replace(/src="\/js\//g, 'src="./js/')
  .replace(/src="\/images\//g, 'src="./images/')
  .replace(/src="\/fonts\//g, 'src="./fonts/')
  .replace(/url\(\/css\//g, 'url(./css/')
  .replace(/url\(\/images\//g, 'url(./images/')
  .replace(/url\(\/fonts\//g, 'url(./fonts/');

// Write index.html
fs.writeFileSync('./dist/index.html', fixedHtml);

// Create .nojekyll file for GitHub Pages
fs.writeFileSync('./dist/.nojekyll', '');

// Note: API data files are already in dist/api/ and should be manually maintained

console.log('✅ Static site build completed!');
console.log('📁 Files created in dist/ directory');
console.log('🌐 Ready for GitHub Pages deployment');
