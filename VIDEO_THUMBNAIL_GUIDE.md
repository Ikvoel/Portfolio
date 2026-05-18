# Video Thumbnail Guide: 16:9 Standardization

## Why 16:9 Aspect Ratio?

All video and filmography thumbnails must use **16:9 widescreen aspect ratio** to:
- Eliminate black bars (letterboxing)
- Maintain visual consistency
- Match standard cinematic format
- Ensure professional presentation

---

## How to Create Perfect 16:9 Thumbnails

### Option 1: Crop Existing Images

If you already have still images from your projects:

1. **Open your image** in any photo editor (Photoshop, Canva, Figma, etc.)
2. **Create a crop box** with aspect ratio **16:9**
   - Common resolutions: 1920x1080, 1280x720, 854x480
3. **Position the crop** to capture the best composition
4. **Export** and upload to imgbb.com

### Option 2: Screenshot from Video

1. **Play your video** and pause at a cinematic frame
2. **Take a screenshot** (native aspect ratio will be 16:9)
3. **Upload** to imgbb.com
4. **Use the direct link** in your project data

### Option 3: Use Imgbb's Crop Tool

1. **Upload your image** to imgbb.com
2. **Click "Edit"** after upload
3. **Select "Crop"** tool
4. **Choose 16:9 ratio** from presets
5. **Save** and copy the direct link

---

## Implementing 16:9 in Code

### For Film Project Cards (`FilmProject.tsx`)

The component uses `aspect-video` which is Tailwind's built-in 16:9 class:

```tsx
<div className="aspect-video">
  <img 
    src={project.image} 
    alt={project.title}
    className="w-full h-full object-cover" // ← 'cover' crops to fit 16:9
  />
</div>
```

**Key property**: `object-cover` ensures the image fills the 16:9 container by cropping overflow.

### For Featured Projects (`FeaturedProject.tsx`)

Mobile and desktop views both enforce 16:9:

```tsx
{/* Mobile */}
<div className="aspect-video bg-black rounded-2xl overflow-hidden">
  <img 
    src={project.image}
    className="w-full h-full object-cover" // ← Crops to 16:9
  />
</div>

{/* Desktop */}
<img 
  src={project.image}
  className="w-full h-full object-cover" // ← Fills viewport at 16:9
/>
```

---

## Testing Your Thumbnails

1. **Upload your cropped 16:9 image** to imgbb.com
2. **Copy the "Direct link"** URL
3. **Paste into your project data**:
   ```typescript
   image: 'https://i.ibb.co.com/YOUR_16_9_IMAGE.jpg'
   ```
4. **Preview** on mobile and desktop
5. **Verify**: No black bars, image fills container

---

## Common Issues & Fixes

### Issue: Black bars on sides
**Fix**: Your source image isn't 16:9. Re-crop it properly.

### Issue: Important parts of image cut off
**Fix**: 
- Use `object-contain` instead of `object-cover` (but this may add black bars)
- Better: Re-crop source image with better composition

### Issue: Image looks stretched
**Fix**: Your source image was already distorted. Use a different frame/still.

---

## Recommended Image Sizes

For optimal quality and performance:

| Device | Resolution | File Size |
|--------|-----------|-----------|
| Mobile | 854x480 | 50-100KB |
| Desktop | 1920x1080 | 150-300KB |
| Retina/4K | 3840x2160 | 400-800KB |

**Best practice**: Use 1920x1080 for universal compatibility.

---

## Quick Checklist

- [ ] Image is cropped to exactly 16:9 aspect ratio
- [ ] Image is uploaded to imgbb.com (not Google Drive)
- [ ] Direct link URL is copied (ends with .jpg or .png)
- [ ] `object-cover` is used in the image className
- [ ] Tested on both mobile and desktop previews
- [ ] No black bars visible on any screen size

---

**Last Updated**: May 2026
