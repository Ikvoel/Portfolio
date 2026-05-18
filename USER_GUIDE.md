# User Guide: Managing Featured Projects & Videos

This guide will help you easily add, edit, and manage featured projects and video content on your filmography website.

---

## 📽️ Managing Featured Projects

### Location
Featured projects are managed in: `/src/app/components/FeaturedProject.tsx`

### Adding/Editing a Featured Project

1. **Open the file**: `/src/app/components/FeaturedProject.tsx`

2. **Find the `featuredProject` object** (around line 12):

```typescript
const featuredProject = {
  title: 'My Hand, Her Signature',
  subtitle: 'Featured Work',
  description: 'A young painter is in danger of losing...',
  image: 'https://i.ibb.co.com/xqZk5hdm/Still-2026-05-07-172137-1-53-2.jpg',
  category: 'Short Film',
  year: '2026',
  status: 'On Going',
  videoUrl: 'https://drive.google.com/file/d/1ZyzkPKSyEyvtr7JRHftPhSDk6jhsnL0w/preview',
};
```

3. **Edit the values**:
   - `title`: Your project title
   - `description`: Brief description (1-2 sentences)
   - `image`: Full URL to your still image (use imgbb.com to upload)
   - `category`: Type of project (e.g., "Short Film", "Music Video", "Documentary")
   - `year`: Production year
   - `status`: Current status ("On Going", "Completed", "Post-Production", etc.)
   - `videoUrl`: Google Drive preview link or YouTube embed URL

---

## 🎬 Adding Video Thumbnails

### For Google Drive Videos:

1. **Upload your video to Google Drive**
2. **Right-click** the video → **Share** → **Get link**
3. **Change permissions** to "Anyone with the link can view"
4. **Copy the file ID** from the URL:
   - URL format: `https://drive.google.com/file/d/FILE_ID_HERE/view`
   - Example: If URL is `https://drive.google.com/file/d/1ZyzkPKSyEyvtr7JRHftPhSDk6jhsnL0w/view`
   - File ID is: `1ZyzkPKSyEyvtr7JRHftPhSDk6jhsnL0w`
5. **Create preview URL**:
   ```
   https://drive.google.com/file/d/FILE_ID_HERE/preview
   ```
6. **Paste this URL** into the `videoUrl` field in your project object

### For YouTube Videos:

1. **Get the video ID** from YouTube URL:
   - URL format: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Video ID is: `dQw4w9WgXcQ`
2. **Create embed URL**:
   ```
   https://www.youtube.com/embed/VIDEO_ID
   ```
3. **Paste this URL** into the `videoUrl` field

---

## 🔁 Creating Multiple Ongoing Projects

### Option 1: Carousel Style (Single Header, Multiple Slides)

**Not currently implemented** - To add this feature, you would need to:
1. Convert `featuredProject` from a single object to an array
2. Add carousel/slider navigation buttons
3. Auto-rotate through projects every few seconds

### Option 2: Stacked/Vertical Style (Recommended for Non-Coders)

**EASY METHOD** - Just duplicate the entire Featured Project section:

1. **Open**: `/src/app/App.tsx`

2. **Find this line** (around line 24):
   ```jsx
   <FeaturedProject />
   ```

3. **Duplicate it** to show multiple featured projects:
   ```jsx
   <FeaturedProject />
   <FeaturedProject />
   ```

4. **Rename components** to differentiate them:
   - First, duplicate the `FeaturedProject.tsx` file and rename it to `FeaturedProject2.tsx`
   - Update the component name inside from `FeaturedProject` to `FeaturedProject2`
   - Change the featured project data inside
   - Import and use it in `App.tsx`:
   ```jsx
   import { FeaturedProject } from './components/FeaturedProject';
   import { FeaturedProject2 } from './components/FeaturedProject2';
   
   // Later in the file:
   <FeaturedProject />
   <FeaturedProject2 />
   ```

---

## 🎞️ Managing Filmography Videos

### Location
Video projects are managed in: `/src/app/components/Filmography.tsx`

### Adding a New Video Project

1. **Open**: `/src/app/components/Filmography.tsx`

2. **Find the `projects` array** (around line 6)

3. **Add a new project object** following this template:

```typescript
{
  id: 18, // Increment from the last ID
  title: 'Your Project Title',
  category: 'Short Movie', // Options: 'Short Movie', 'Commercial', 'Personal Projects', 'Music Video'
  year: '2024',
  description: 'Brief description of your project.',
  image: 'https://i.ibb.co.com/YOUR_IMAGE_URL.jpg', // Thumbnail image
  videoUrl: 'https://drive.google.com/file/d/YOUR_FILE_ID/preview', // Video URL
  roles: ['Director', 'Writer', 'Editor'], // Your roles in the project
  cinematicStills: [ // Optional: array of still images that cycle on hover
    'https://i.ibb.co.com/STILL1.jpg',
    'https://i.ibb.co.com/STILL2.jpg',
    'https://i.ibb.co.com/STILL3.jpg',
  ],
  clientLogos: [ // Optional: client/production company logos
    { 
      name: 'Client Name', 
      logo: 'https://i.ibb.co.com/LOGO.png', 
      hasGlassBadge: false // true = glass background, false = no background
    }
  ]
},
```

4. **Save the file** - your new project will appear automatically!

---

## 📸 Uploading Images (ImgBB Guide)

1. **Go to**: https://imgbb.com/
2. **Click "Start uploading"** or drag your image
3. **Wait for upload** to complete
4. **Copy the "Direct link"** URL
5. **Paste this URL** into the `image` field in your project

---

## 🎨 Managing Commercial Photography

### Location
Commercial photos are managed in: `/src/app/components/Photography.tsx`

### Adding Commercial Photos

1. **Open**: `/src/app/components/Photography.tsx`

2. **Find the `photoGallery` array** (around line 7)

3. **Add new photo objects** with `category: 'Commercial'`:

```typescript
{
  id: 9, // Increment ID
  title: 'Your Photo Title',
  category: 'Commercial',
  year: '2024',
  image: 'https://i.ibb.co.com/YOUR_IMAGE.jpg',
  description: 'Brief description of the shoot.',
},
```

The Commercial category uses a Pinterest-style masonry grid that:
- Shows 2 columns on mobile
- Shows 3-4 columns on desktop
- Displays images full without cropping

---

## 🖼️ Managing About Section Photos

### Location
About section photos are managed in: `/src/app/components/About.tsx`

### Changing BTS (Behind The Scenes) Photos

1. **Open**: `/src/app/components/About.tsx`

2. **Find the image tags** (around lines 39, 50, 59)

3. **Replace the `src` URLs** with your own image URLs:

```jsx
{/* Large photo */}
<img src="https://i.ibb.co.com/YOUR_NEW_IMAGE.jpg" ... />

{/* Small photo 1 */}
<img src="https://i.ibb.co.com/YOUR_NEW_IMAGE.jpg" ... />

{/* Small photo 2 */}
<img src="https://i.ibb.co.com/YOUR_NEW_IMAGE.jpg" ... />
```

The About section uses an asymmetric collage layout with:
- 1 large photo (top)
- 2 small square photos (bottom)

---

## ❓ Common Issues

### "Video won't play"
- Make sure the Google Drive link has public permissions
- Verify you're using the `/preview` URL format, not `/view`
- Some browsers block autoplay - this is normal

### "Image doesn't show"
- Check that the URL is accessible (paste it in a browser)
- Make sure the image is uploaded to a reliable host (imgbb.com recommended)
- Verify the URL starts with `https://`

### "Changes don't appear"
- Save the file after editing
- Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check the browser console for errors (F12 → Console tab)

---

## 🆘 Need Help?

If you're stuck or need to make more complex changes, consider:
1. Reading through the component files - they have helpful comments
2. Looking at existing examples in the code
3. Asking a developer for assistance with custom features

---

**Last Updated**: May 2026
**Version**: 1.0
