# News Peda — Newspaper Website

A responsive newspaper website built with HTML, CSS, and JavaScript.

## Project Structure

- **Main.html** — Homepage with article grid and hero section
- **FirstArticle.html** — Article template for "City Council Approves New Transit Plan"
- **SecondArticle.html** — Article template for "Local Bakery Wins National Award"
- **ThirdArticle.html** — Article template for "Technology Conference Highlights AI Ethics"
- **Main.css** — Responsive styling (mobile-first)
- **Main.js** — Navigation toggle, search filter, and accessibility enhancements
- **articles.json** — JSON data file with article metadata (for future dynamic loading)

## Features

✅ **Responsive Design** — Works on mobile, tablet, and desktop  
✅ **Mobile Navigation** — Hamburger menu with smooth toggle  
✅ **Article Pages** — Each article has an image uploader for developers  
✅ **Search Filter** — Real-time client-side search  
✅ **Category Tags** — Organized content by category  
✅ **Accessibility** — Skip-to-content link, ARIA labels, semantic HTML  
✅ **SEO-Ready** — Structured data (JSON-LD), meta tags, Open Graph  

## How to View Locally

### Option 1: Double-click the HTML file
Simply double-click `Main.html` to open it in your default browser.

### Option 2: Use Windows Explorer context menu
Right-click `Main.html` → **Open With** → Select your browser (Chrome, Firefox, Edge, etc.)

### Option 3: Open from Command Prompt
```cmd
cd C:\Users\Bogdan\Desktop\New folder\PRokect\Main
Main.html
```

Or use a simple Python HTTP server:
```cmd
python -m http.server 8000
```
Then open http://localhost:8000 in your browser.

## Using Article Image Viewer

Each article page is now an **image viewer**. The image IS the article itself. Here's how to use it:

### Quick Setup

1. **Place your image file** in the project folder
   - Example: `transit-article.jpg`, `bakery-article.jpg`, `tech-article.jpg`

2. **Update the image path** in the article file's JavaScript
   
   **FirstArticle.html:**
   ```javascript
   const imageUrl = 'transit-article.jpg'; // Change this to your image
   ```

   **SecondArticle.html:**
   ```javascript
   const imageUrl = 'bakery-article.jpg'; // Change this to your image
   ```

   **ThirdArticle.html:**
   ```javascript
   const imageUrl = 'tech-article.jpg'; // Change this to your image
   ```

3. **Or use a URL** instead:
   ```javascript
   const imageUrl = 'https://example.com/my-article.jpg';
   ```

### File Structure
```
Main/
  Main.html
  Main.css
  Main.js
  FirstArticle.html    ← Image viewer (edit the imageUrl variable)
  SecondArticle.html   ← Image viewer (edit the imageUrl variable)
  ThirdArticle.html    ← Image viewer (edit the imageUrl variable)
  articles.json
  transit-article.jpg  ← Your article image
  bakery-article.jpg   ← Your article image
  tech-article.jpg     ← Your article image
```

### Example

To add an article image:

1. Save your image as `transit-article.jpg` in the project folder
2. Open `FirstArticle.html`
3. Find this line in the `<script>` section:
   ```javascript
   const imageUrl = 'transit-article.jpg';
   ```
4. Make sure it matches your filename
5. Save and refresh the page in your browser

That's it! The image will display as the full article.

## Customization

### Change Site Name
Replace "News Peda" with your publication name in:
- `Main.html` (title, logo, header, footer)
- `FirstArticle.html`, `SecondArticle.html`, `ThirdArticle.html`

### Add/Edit Articles
Update `articles.json` with new article metadata and link them in `Main.html`:
```json
{
  "id": 4,
  "title": "Your Article Title",
  "excerpt": "Short summary...",
  "date": "2025-11-XX",
  "author": "Author Name",
  "category": "Category",
  "url": "YourArticle.html",
  "image": "image-url-or-placeholder"
}
```

### Customize Colors
Edit CSS variables in `Main.css`:
```css
:root {
  --black-color: hsl(220, 24%, 12%);
  --body-color: hsl(220, 100%, 97%);
  /* ...more colors */
}
```

### Mobile Breakpoints
Adjust responsive breakpoints in `Main.css`:
- 340px — Small devices
- 700px — Medium devices (tablets)
- 1100px — Large devices (desktops)
- 1118px — Desktop navigation layout

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Mobile menu toggles on small screens
- [ ] All three "Read more" buttons navigate to article pages
- [ ] Search filter works (type in search bar)
- [ ] Article pages display correctly
- [ ] Image upload preview works on each article
- [ ] Back links return to homepage
- [ ] Responsive layout adapts to different screen sizes
- [ ] Skip-to-content link works (Tab key or screen readers)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Dynamic article loading from `articles.json`
- Backend API integration
- User comments and social sharing
- Newsletter subscription
- Dark mode toggle
- Full-text search (backend)
- Author pages
- Related articles section

---

**Created:** November 10, 2025  
**News Peda** — Independent news and reporting
