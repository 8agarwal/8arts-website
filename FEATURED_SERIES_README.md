# Featured Series Management System

This system provides a framework for managing and automatically displaying featured series content on your artist portfolio website.

## Features

### 1. UI Framework
- **Photo-left, Text-right Layout**: Each series item displays with image on the left and descriptive text on the right
- **Mobile Responsive**: Automatically stacks vertically on mobile devices
- **Hover Effects**: Interactive animations for better user experience
- **Consistent Styling**: Matches your website's design language

### 2. Dynamic Content Management
- **Automatic Loading**: Content loads automatically when the page loads
- **Caching System**: Uses localStorage for fast loading and offline capability
- **Auto-refresh**: Checks for updates every 5 minutes
- **Real-time Updates**: Supports webhook-style updates for instant content changes

## File Structure

```
├── js/featured-series.js          # Main JavaScript manager
├── data/featured-series.json      # Data storage (JSON format)
├── api/featured-series.js         # API simulation (development)
├── admin/featured-series-admin.html # Admin interface
└── sections/gallery-preview.html  # Updated HTML structure
```

## How to Use

### For Content Updates

#### Method 1: Admin Interface (Recommended)
1. Open `admin/featured-series-admin.html` in your browser
2. Use the form to add new series items
3. Upload images and fill in details
4. Click "Add Series Item" to save
5. Changes appear immediately on your main site

#### Method 2: Direct JSON Editing
1. Edit `data/featured-series.json`
2. Add new items to the `items` array
3. Follow the existing structure:
```json
{
  "id": "unique-id",
  "title": "Artwork Title",
  "description": "Detailed description...",
  "image": "assets/your-image.jpg",
  "meta": "Medium • Size • Year",
  "order": 1,
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-09-12T10:00:00Z"
}
```

### For Automatic Updates

#### Option 1: Webhook Integration
Set up a webhook that triggers when you upload new content:

```javascript
// Trigger update from your CMS/upload system
window.dispatchEvent(new CustomEvent('featuredSeriesUpdate', {
    detail: newSeriesData
}));
```

#### Option 2: API Endpoint
1. Set up a real API endpoint at `/api/featured-series`
2. Update the `apiEndpoint` in `js/featured-series.js`
3. The system will automatically fetch updates

#### Option 3: File System Monitoring
Set up a file watcher that monitors your assets folder and updates the JSON when new images are added.

## Customization

### Styling
- Edit `.series-item`, `.series-image`, `.series-text` classes in `styles.css`
- Modify mobile responsive styles in `mobile-responsive.css`

### Data Structure
- Add new fields to the JSON structure
- Update the `createSeriesItem()` method in `js/featured-series.js`
- Modify the admin form in `admin/featured-series-admin.html`

### Auto-refresh Interval
Change the `updateInterval` in `js/featured-series.js`:
```javascript
this.updateInterval = 5 * 60 * 1000; // 5 minutes
```

## Integration with Your Workflow

### Option 1: Manual Upload
1. Upload images to `assets/` folder
2. Use admin interface to add content
3. Publish immediately

### Option 2: Automated Integration
1. Set up a script that monitors your image uploads
2. Automatically updates the JSON file
3. Triggers the update event

### Option 3: CMS Integration
1. Connect to your content management system
2. Set up webhooks for content changes
3. Real-time updates without manual intervention

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Offline capability with caching

## Performance
- Lazy loading for images
- Local caching for fast loading
- Minimal API calls
- Optimized for mobile devices

## Security Notes
- Admin interface is for development/testing only
- In production, implement proper authentication
- Validate all uploaded content
- Use HTTPS for API endpoints

## Troubleshooting

### Images Not Loading
- Check file paths in JSON
- Ensure images are in the correct `assets/` folder
- Verify file permissions

### Updates Not Appearing
- Clear browser cache
- Check browser console for errors
- Verify JSON syntax is valid

### Mobile Layout Issues
- Test on actual devices
- Check viewport meta tag
- Verify CSS media queries

## Future Enhancements
- Image optimization and resizing
- Multiple series support
- Advanced filtering and sorting
- Analytics integration
- Social media sharing
- Print-friendly layouts
