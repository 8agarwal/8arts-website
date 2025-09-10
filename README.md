# 8Arts - Artist Portfolio Website

A modern, modular artist portfolio website designed to showcase paintings and artistic work.

## 📋 Project Requirements

### Core Requirements
- **2 Pages**: Landing page (about) + Portfolio page
- **Landing Page**: About the artist with "Portfolio" button
- **Portfolio Page**: Scrollable gallery with one painting per view
- **Navigation**: Seamless navigation between pages
- **Styling**: Separate CSS file for all styling
- **JavaScript**: Minimal to no JavaScript usage
- **Hosting**: Ready for Netlify deployment

### Technical Requirements
- **Modular Structure**: Each section in separate files
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Code**: Well-organized, maintainable codebase
- **Performance**: Fast loading with minimal dependencies

## 🎨 What Was Implemented

### File Structure
```
8arts_website/
├── index.html                 # Landing page
├── portfolio.html            # Portfolio page
├── styles.css               # Complete styling
├── js/
│   └── include.js           # Minimal JavaScript for modular loading
└── sections/                # Modular section files
    ├── header-about.html    # Header for about page
    ├── header-portfolio.html # Header for portfolio page
    ├── hero.html            # Hero section
    ├── about.html           # About section
    ├── philosophy.html      # Philosophy section
    ├── portfolio-header.html # Portfolio header
    ├── gallery.html         # Gallery section
    └── footer.html          # Footer section
```

### Features Implemented

#### Landing Page (`index.html`)
- **Hero Section**: Welcome message with call-to-action button
- **About Section**: Artist biography and story
- **Philosophy Section**: Artistic approach and beliefs
- **Navigation**: Clean header with active state indicators

#### Portfolio Page (`portfolio.html`)
- **Scrollable Gallery**: 6 sample paintings with alternating layout
- **One Painting Per View**: Full-screen painting display
- **Painting Details**: Title, medium, year, and description for each piece
- **Responsive Design**: Adapts to different screen sizes

#### Styling (`styles.css`)
- **Modern Design**: Clean, professional aesthetic
- **Color Scheme**: Elegant gradients and professional colors
- **Typography**: Georgia serif font for artistic feel
- **Animations**: Smooth hover effects and transitions
- **Responsive**: Mobile-first design approach

#### Modular Architecture
- **Section Files**: Each page section in separate HTML files
- **Dynamic Loading**: JavaScript loads sections automatically
- **Easy Maintenance**: Edit individual sections without touching main files
- **Reusability**: Sections can be reused across different pages

## 🚀 Getting Started

### Local Development
1. **Clone/Download** the project files
2. **Start Local Server**:
   ```bash
   python3 -m http.server 8001
   ```
3. **Open Browser**: Navigate to `http://localhost:8001`

### Deployment to Netlify
1. **Zip Files**: Compress all project files
2. **Upload to Netlify**: Drag and drop the zip file
3. **Deploy**: Your site will be live instantly

## 🛠️ Customization

### Adding New Paintings
1. Edit `sections/gallery.html`
2. Add new painting div with placeholder structure
3. Update painting details (title, medium, year, description)

### Modifying Content
- **About Section**: Edit `sections/about.html`
- **Philosophy**: Edit `sections/philosophy.html`
- **Hero Section**: Edit `sections/hero.html`

### Styling Changes
- **Colors**: Modify CSS variables in `styles.css`
- **Fonts**: Update font-family declarations
- **Layout**: Adjust grid and flexbox properties

## 📱 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🎯 Next Steps
1. **Replace Placeholder Images**: Add actual painting photos
2. **Update Content**: Personalize with your information
3. **Add Artist Photo**: Include your photo in the about section
4. **Customize Colors**: Adjust color scheme to match your style
5. **Add More Paintings**: Expand the gallery with more artwork

## 📄 License
© 2024 8Arts. All rights reserved.

---

**Built with**: HTML5, CSS3, Vanilla JavaScript  
**Deployment**: Netlify Ready  
**Architecture**: Modular Component System
