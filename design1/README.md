# Design 1 - Original Artist Portfolio

## Overview
This is the original design of Somya's artist portfolio website with a purple-themed aesthetic and modular structure.

## Key Features

### Design Philosophy
- **Purple Theme**: Consistent purple color scheme throughout
- **Modular Structure**: HTML sections loaded dynamically
- **Artistic Focus**: Emphasis on showcasing artwork
- **Mobile Responsive**: Comprehensive mobile optimization

### Visual Elements
- **Typography**: Multiple Google Fonts (Brittany Signature, Dancing Script, Carlito, etc.)
- **Color Scheme**: 
  - Primary: Purple (#cdc6e4)
  - Secondary: Orange (#ee922f)
  - Background: Cream (#fff0c8)
- **Layout**: Section-based with modular loading
- **Images**: Artwork-focused with hover effects

### Sections
1. **Hero**: Logo and navigation integrated, background image
2. **Gallery Preview**: Featured artwork with series information
3. **About**: Artist description with image
4. **Background**: Education and experience with icons
5. **Project Gallery**: 3-column project showcase
6. **Testimonials**: Client testimonials
7. **Contact**: Form with contact information

### Technical Features
- Modular HTML loading system
- Mobile hamburger navigation
- EmailJS contact form integration
- Responsive design with multiple breakpoints
- CSS Grid and Flexbox layouts
- Image optimization and caching

## File Structure
```
design1/
├── index.html              # Main HTML file
├── portfolio.html          # Portfolio page
├── styles.css              # Main stylesheet
├── mobile-responsive.css   # Mobile-specific styles
├── mobile-fix.css          # Additional mobile fixes
├── js/
│   ├── include.js          # Modular loading system
│   └── contact-form.js     # Contact form handling
├── sections/               # Modular HTML sections
│   ├── hero.html
│   ├── about.html
│   ├── gallery-preview.html
│   ├── background.html
│   ├── project-gallery.html
│   ├── testimonials.html
│   ├── contact.html
│   └── footer.html
├── assets/                 # Images and media
└── README.md              # This file
```

## Usage
1. Open `index.html` in a web browser
2. For local development, use a local server (e.g., `python3 -m http.server 8000`)
3. Contact form requires EmailJS configuration

## Mobile Responsiveness
- Comprehensive mobile breakpoints (768px, 480px)
- Hamburger navigation menu
- Responsive grid layouts
- Optimized typography scaling
- Touch-friendly interactions

## Contact Form
- EmailJS integration
- Form validation
- Success/error messaging
- Mobile-optimized layout

## Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance
- Modular loading reduces initial load time
- Image optimization with cache-busting
- CSS and JS minification ready
- Responsive images