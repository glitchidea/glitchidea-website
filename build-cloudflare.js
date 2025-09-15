const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Cloudflare Pages...');

// Create dist directory if it doesn't exist
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

// Copy public to dist
copyRecursive('public', 'dist');

// Copy API files to dist/api
if (fs.existsSync('api')) {
  if (!fs.existsSync('dist/api')) {
    fs.mkdirSync('dist/api', { recursive: true });
  }
  copyRecursive('api', 'dist/api');
}

// Copy robots.txt and sitemap.xml to dist
if (fs.existsSync('robots.txt')) {
  fs.copyFileSync('robots.txt', 'dist/robots.txt');
}

if (fs.existsSync('sitemap.xml')) {
  fs.copyFileSync('sitemap.xml', 'dist/sitemap.xml');
}

// Copy index.html to dist
if (fs.existsSync('index.html')) {
  fs.copyFileSync('index.html', 'dist/index.html');
}

console.log('✅ Cloudflare Pages build completed!');
console.log('📁 Files ready in dist/ directory');
