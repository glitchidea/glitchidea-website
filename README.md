# GlitchIdea Portfolio Website

🚀 **Live Site:** [https://glitchidea.github.io/glitchidea-website](https://glitchidea.github.io/glitchidea-website)

## 📋 About

Professional portfolio website for GlitchIdea - Cybersecurity Expert & Security Consultant. Built with modern web technologies and deployed on GitHub Pages.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Templates:** EJS (Embedded JavaScript)
- **Build Tool:** Custom Node.js build script
- **Deployment:** GitHub Pages + GitHub Actions
- **Styling:** Custom CSS with CSS Variables
- **Icons:** Font Awesome
- **Animations:** AOS (Animate On Scroll)

## 📁 Project Structure

```
├── public/                 # Static assets (CSS, JS, Images)
├── views/                  # EJS templates
│   ├── components/         # Page components
│   ├── layouts/           # Layout templates
│   └── partials/          # Reusable partials
├── dist/                  # Built static site (for GitHub Pages)
├── dist/api/              # JSON data files
├── build-static.js        # Build script
├── server.js              # Development server
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/glitchidea/glitchidea-website.git
cd glitchidea-website
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build static site:
```bash
npm run build:static
```

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Install dependencies and build static site
- `npm run build:static` - Build static site only
- `npm run deploy` - Deploy to GitHub Pages

## 🌐 Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions when changes are pushed to the `main` branch.

### Manual Deployment

```bash
npm run deploy
```

## 📊 Data Management

All content is managed through JSON files in `dist/api/`:

- `services.json` - Services offered
- `projects.json` - Portfolio projects
- `social.json` - Social media links
- `blog.json` - Blog posts
- `work.json` - Work experience

## 🎨 Features

- ✅ Responsive design
- ✅ Dark theme
- ✅ Smooth animations
- ✅ Contact form
- ✅ Project showcase
- ✅ Services section
- ✅ Blog integration
- ✅ Social media links
- ✅ SEO optimized
- ✅ Fast loading
- ✅ Mobile friendly

## 📱 Sections

1. **Hero** - Introduction and main CTA
2. **About** - Personal information and skills
3. **Services** - Offered services and expertise
4. **Projects** - Portfolio projects showcase
5. **Blog** - Latest blog posts
6. **Contact** - Contact form and social links

## 🔧 Customization

### Adding New Content

1. Edit JSON files in `dist/api/`
2. Update EJS templates in `views/components/`
3. Rebuild static site: `npm run build:static`

### Styling

- Main styles: `public/css/main.css`
- Component styles: `public/css/components.css`
- Responsive styles: `public/css/responsive.css`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**GlitchIdea**
- GitHub: [@glitchidea](https://github.com/glitchidea)
- Website: [https://glitchidea.github.io/glitchidea-website](https://glitchidea.github.io/glitchidea-website)


---

⭐ **Star this repository if you found it helpful!**
