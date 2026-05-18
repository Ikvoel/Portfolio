# 🏢 Client Logo System - Complete Guide

## Overview
The client logo system allows you to display collaboration partners directly on project cards with optional glassmorphism badges, adjustable sizing, and toggle controls.

---

## 📍 Adding Client Logos to Projects

### Basic Implementation

```tsx
// In /components/Filmography.tsx
{
  id: 1,
  title: 'Your Project',
  category: 'Short Movie',
  // ... other fields
  clientLogos: [
    { 
      name: 'Client Name',
      logo: 'https://your-logo-url.png',
      hasGlassBadge: true  // Enable glass background
    }
  ]
}
```

### Multiple Client Logos

```tsx
clientLogos: [
  { name: 'Client A', logo: 'url-a.png', hasGlassBadge: true },
  { name: 'Client B', logo: 'url-b.png', hasGlassBadge: false },
  { name: 'Client C', logo: 'url-c.png', hasGlassBadge: true },
]
```

---

## 🎨 Customization Options

### 1. Logo Container Position

**File:** `/components/FilmProject.tsx` (Line ~250)

```tsx
<div 
  className="absolute bottom-4 right-4 z-10 flex gap-2"
  style={{
    /* Adjust positioning:
     * bottom: '16px' = distance from bottom edge
     * right: '16px' = distance from right edge
     * Change to 'left' or 'top' for different placement
     */
  }}
>
```

**Positioning Examples:**
- Bottom-right: `bottom: '16px', right: '16px'`
- Bottom-left: `bottom: '16px', left: '16px'`
- Top-right: `top: '16px', right: '16px'`
- Top-left: `top: '16px', left: '16px'`

### 2. Individual Logo Size

**File:** `/components/FilmProject.tsx` (Line ~285)

```tsx
<div 
  className="relative p-2"
  style={{
    /* Adjust logo size:
     * Small: '48px'
     * Medium: '64px'
     * Large: '80px'
     * Extra Large: '96px'
     */
    width: '56px',
    height: '56px',
  }}
>
```

### 3. Glass Badge Toggle

**Per Logo Control:**
```tsx
{ 
  name: 'Client',
  logo: 'url.png',
  hasGlassBadge: true   // Show glass background
}

{ 
  name: 'Client',
  logo: 'url.png',
  hasGlassBadge: false  // No glass background
}
```

**Global Disable (all logos in a project):**
```tsx
clientLogos: undefined  // Don't show logos for this project
```

### 4. Glass Badge Styling

**File:** `/components/FilmProject.tsx` (Line ~273)

```tsx
{client.hasGlassBadge !== false && (
  <div 
    className="absolute inset-0 rounded-lg"
    style={{
      background: 'rgba(255, 255, 255, 0.1)',      // ← Opacity
      backdropFilter: 'blur(8px)',                 // ← Blur amount
      border: '1px solid rgba(255, 255, 255, 0.15)', // ← Border
    }}
  />
)}
```

**Customization:**
- Increase opacity: `rgba(255, 255, 255, 0.15)` for brighter badge
- More blur: `blur(12px)` for softer effect
- Thicker border: `2px solid` for more definition

### 5. Logo Gap Spacing

**File:** `/components/FilmProject.tsx` (Line ~250)

```tsx
<div className="absolute bottom-4 right-4 z-10 flex gap-2">
  {/* ↑ gap-2 = 8px spacing between logos */}
  {/* Change to gap-3 (12px) or gap-4 (16px) for more space */}
</div>
```

---

## 🖼️ Logo Image Requirements

### Recommended Formats:
- **SVG** - Best for logos (scalable, crisp)
- **PNG** - With transparent background
- **Avoid:** JPG (no transparency)

### Recommended Size:
- **Minimum:** 200x200px
- **Optimal:** 400x400px
- **Maximum:** 800x800px (larger = slower load)

### Image Hosting:
- ✅ ImgBB: `https://i.ibb.co/xxxxxxx/logo.png`
- ✅ Cloudinary
- ✅ Direct URLs
- ⚠️ Google Drive (requires special formatting)

---

## 💡 Advanced Examples

### Example 1: Single Large Client Logo (Top-Right)

```tsx
{
  id: 1,
  title: 'Commercial Project',
  category: 'Commercial',
  clientLogos: [
    { 
      name: 'Nike',
      logo: 'https://example.com/nike-logo.svg',
      hasGlassBadge: true
    }
  ]
}
```

**Customize size in FilmProject.tsx:**
```tsx
width: '80px',   // Larger for single logo
height: '80px',
```

### Example 2: Multiple Partners (No Glass Badges)

```tsx
{
  id: 2,
  title: 'Festival Film',
  category: 'Short Movie',
  clientLogos: [
    { name: 'Sundance', logo: 'url1.png', hasGlassBadge: false },
    { name: 'Tribeca', logo: 'url2.png', hasGlassBadge: false },
    { name: 'TIFF', logo: 'url3.png', hasGlassBadge: false },
  ]
}
```

### Example 3: Mixed Badge Styles

```tsx
{
  id: 3,
  title: 'Brand Campaign',
  category: 'Commercial',
  clientLogos: [
    { name: 'Main Brand', logo: 'url1.png', hasGlassBadge: true },    // With badge
    { name: 'Production', logo: 'url2.png', hasGlassBadge: false },   // No badge
    { name: 'Agency', logo: 'url3.png', hasGlassBadge: true },        // With badge
  ]
}
```

---

## 🎯 Visual Hierarchy Best Practices

### Logo Visibility:
1. **White logos on dark backgrounds** work best
2. Use `filter: brightness(0) invert(1)` to make any logo white
3. Add drop shadow for depth: `drop-shadow(0 2px 8px rgba(0,0,0,0.3))`

### Size Guidelines:
- **1 logo:** 64-80px (prominent display)
- **2-3 logos:** 56-64px (balanced)
- **4+ logos:** 48-56px (compact grid)

### Positioning Guidelines:
- **Bottom-right:** Standard placement (doesn't block main content)
- **Top-right:** Alternative for bottom-heavy designs
- **Bottom-left:** When watermark is top-right

---

## 🔧 Troubleshooting

### Issue: Logos not showing
**Solution:** Check that `clientLogos` array exists and has valid URLs

### Issue: Logos too small/large
**Solution:** Adjust `width` and `height` in FilmProject.tsx (Line ~285)

### Issue: Glass badge not visible
**Solution:** Ensure `hasGlassBadge: true` and check opacity values

### Issue: Logos overlapping content
**Solution:** Adjust `bottom` and `right` positioning values

### Issue: Logo image quality poor
**Solution:** Use higher resolution source images (400x400px minimum)

---

## 📱 Responsive Behavior

Logos automatically scale on mobile devices. To customize mobile sizing:

```tsx
<div 
  className="relative p-2 md:p-3"  // More padding on desktop
  style={{
    width: '48px',     // Mobile size
    height: '48px',
  }}
>
```

Add responsive sizing:
```tsx
style={{
  width: window.innerWidth < 768 ? '48px' : '64px',
  height: window.innerWidth < 768 ? '48px' : '64px',
}}
```

---

## ✅ Quick Checklist

Before adding client logos:
- [ ] Logo image is SVG or PNG with transparency
- [ ] Image hosted on reliable CDN
- [ ] Image size is 200-800px
- [ ] `clientLogos` array properly formatted
- [ ] `hasGlassBadge` set to true/false per logo
- [ ] Tested on mobile and desktop
- [ ] Logos don't overlap important content

---

## 🎬 Complete Working Example

```tsx
const projects = [
  {
    id: 1,
    title: 'Bounce Of Memories',
    category: 'Short Movie',
    year: '2025',
    description: '...',
    image: 'https://...',
    videoUrl: 'https://...',
    roles: ['Director', 'Editor'],
    cinematicStills: [...],
    clientLogos: [
      { 
        name: 'Nyala Creative Space',
        logo: 'https://i.ibb.co.com/4wTwGFXM/285585428-3228664694043171-7124190617216898503-n.jpg',
        hasGlassBadge: true
      },
      {
        name: 'Production Company',
        logo: 'https://example.com/prod-logo.svg',
        hasGlassBadge: false
      }
    ]
  },
];
```

---

## 🚀 Performance Tips

1. **Optimize images:** Use compressed PNG or SVG
2. **Limit logos:** Maximum 3-4 per project card
3. **Use CDN:** Fast image hosting (ImgBB, Cloudinary)
4. **Lazy loading:** Images load automatically as user scrolls
5. **Cache:** Browsers cache logo images for faster repeat loads

---

Your client logo system is now fully configured and ready to showcase collaborations! 🎬✨
