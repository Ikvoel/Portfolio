# How to Add Your Theme Song

## Quick Answer: Video Thumbnails
**You DON'T need to convert videos to GIF!** 

The `image` property in your featured project is just a **still image** (a screenshot/frame from your video). This acts as the thumbnail that users see before clicking play.

### Steps for Video Thumbnails:
1. Take a screenshot of a beautiful frame from your video
2. Upload the image to **imgbb.com** (not Google Drive!)
3. Copy the "Direct link" URL
4. Paste it into the `image` field in `/src/app/components/FeaturedProjects.tsx`

---

## Adding Background Music

You have **3 options** for hosting your theme song:

### Option 1: Google Drive (Easiest)

1. **Upload your MP3** to Google Drive
2. **Right-click** the file → **Share** → **Get link**
3. **Change permissions** to "Anyone with the link can view"
4. **Copy the file ID** from the URL:
   ```
   https://drive.google.com/file/d/1ABC123xyz456/view
   ```
   File ID is: `1ABC123xyz456`

5. **Create the direct download URL**:
   ```
   https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
   ```
   Example:
   ```
   https://drive.google.com/uc?export=download&id=1ABC123xyz456
   ```

6. **Open** `/workspaces/default/code/src/app/App.tsx`

7. **Find this line** (around line 22):
   ```tsx
   <BackgroundMusic audioUrl="" />
   ```

8. **Add your URL**:
   ```tsx
   <BackgroundMusic audioUrl="https://drive.google.com/uc?export=download&id=1ABC123xyz456" />
   ```

### Option 2: SoundCloud

1. Upload your track to SoundCloud
2. Use a service like **soundcloud-mp3-download.com** to get the direct MP3 URL
3. Paste the URL in the `audioUrl` prop

### Option 3: Direct Hosting

If you have your own server or hosting:
1. Upload the MP3 file to your server
2. Use the direct link (e.g., `https://yoursite.com/theme.mp3`)
3. Paste it in the `audioUrl` prop

---

## How the Music Player Works

- **Floating button** appears in the bottom-right corner
- **Click to play/pause** the music
- **Loops automatically** when it reaches the end
- **Tooltip** shows when you hover over it
- **Ripple effect** animates when music is playing
- **Auto-hides controls** after a few seconds for a clean look

---

## Customizing Per Project

Each featured project can now have:

- **Different watermark logos** (`watermarkLogo` property)
- **Different status badge colors** (`statusColor` property)
  - Options: `'yellow'`, `'red'`, `'green'`, `'blue'`, `'purple'`, `'orange'`

Example in `/src/app/components/FeaturedProjects.tsx`:

```typescript
{
  title: 'My Hand, Her Signature',
  image: 'https://i.ibb.co.com/YOUR_STILL.jpg', // ← Video thumbnail
  watermarkLogo: 'https://i.ibb.co.com/YOUR_LOGO.png', // ← Custom watermark
  statusColor: 'orange', // ← Custom badge color
  status: 'Post-Production',
  // ... rest of properties
}
```

---

## Mobile Layout Fixed ✅

Your mobile layout now:
- Shows the **full image** (not cropped) in a contained box
- Displays **content BELOW the image** (not overlaid)
- Has **separate mobile and desktop layouts** for optimal viewing
- **Text is fully visible** and doesn't cover the stills

---

## Troubleshooting

### Music won't play
- Make sure the Google Drive link has public permissions
- Verify you're using the `uc?export=download&id=` format
- Try opening the URL directly in your browser to test it

### Image still cropping on mobile
- Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Make sure you're using imgbb.com links, not Google Drive for images
- Check that the image URL ends with `.jpg` or `.png`

### Can't see different watermarks
- Each project needs its own `watermarkLogo: 'URL'` property
- Upload logos to imgbb.com and use those URLs
- If you want no watermark, remove the property or set it to `undefined`

---

**Last Updated**: May 2026
