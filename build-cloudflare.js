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

// Copy public to dist (if exists)
if (fs.existsSync('public')) {
  copyRecursive('public', 'dist');
} else {
  console.log('⚠️  Public directory not found, creating basic structure...');
  // Create basic dist structure
  if (!fs.existsSync('dist/css')) {
    fs.mkdirSync('dist/css', { recursive: true });
  }
  if (!fs.existsSync('dist/js')) {
    fs.mkdirSync('dist/js', { recursive: true });
  }
  if (!fs.existsSync('dist/images')) {
    fs.mkdirSync('dist/images', { recursive: true });
  }
}

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

// Copy CSS files to dist/css
if (fs.existsSync('css')) {
  if (!fs.existsSync('dist/css')) {
    fs.mkdirSync('dist/css', { recursive: true });
  }
  copyRecursive('css', 'dist/css');
}

// Copy JS files to dist/js
if (fs.existsSync('js')) {
  if (!fs.existsSync('dist/js')) {
    fs.mkdirSync('dist/js', { recursive: true });
  }
  copyRecursive('js', 'dist/js');
}

// Copy images to dist/images
if (fs.existsSync('images')) {
  if (!fs.existsSync('dist/images')) {
    fs.mkdirSync('dist/images', { recursive: true });
  }
  copyRecursive('images', 'dist/images');
}

// Create a simple index.html in root for Cloudflare Pages
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'index.html');
  console.log('📄 Copied index.html to root directory');
}

console.log('✅ Cloudflare Pages build completed!');
console.log('📁 Files ready in dist/ directory');
console.log('📄 index.html copied to root for Cloudflare Pages');
