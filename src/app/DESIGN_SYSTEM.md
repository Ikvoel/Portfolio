# Cinematic Portfolio - Design System Documentation

## Overview
A complete filmography portfolio website with cinematic glassmorphism design, Glamour Absolute typography, animated gradients, and advanced micro-interactions.

---

## 🎨 Design System

### Typography Hierarchy

**Glamour Absolute Font (Italiana)** - Used EXCLUSIVELY for:
- Brand logo text
- Film titles (`.film-title`)
- Project titles
- Section headlines (`h1`, `h2`, `h3`)

**Inter Sans-Serif** - Used for:
- Body text (`.body-text`)
- Descriptions
- Metadata (`.metadata`)
- Navigation
- UI labels
- Buttons
- Form inputs

### Glassmorphism System

All components use consistent glass effects:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.glass-subtle {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## 🎬 Component Customization

### 1. Logo & Watermark Positioning

#### Hero Logo (Top Left)
```tsx
// File: /components/Hero.tsx
// Line: ~19

className="absolute top-4 left-4 md:top-8 md:left-8 z-20"
// Mobile: 16px from edges
// Desktop: 32px from edges

className="h-16 md:h-24 lg:h-32"
// Mobile: 64px | Tablet: 96px | Desktop: 128px
```

#### Project Card Watermarks
```tsx
// File: /components/FilmProject.tsx
// Line: ~119

style={{
  top: '12px',     /* ← VERTICAL: Increase = move DOWN */
  right: '12px',   /* ← HORIZONTAL: Increase = move LEFT */
}}

style={{ 
  height: '64px',  /* ← SIZE: Change to 48px, 80px, 100px */
}}
```

#### Featured Project Watermark
```tsx
// File: /components/FeaturedProject.tsx
// Line: ~42

className="absolute top-4 right-2 md:top-8 md:right-8"
className="h-20 md:h-32 lg:h-40"
```

### 2. Client Logo Configuration

```tsx
// File: /components/Clients.tsx
// Line: ~28

const clients = [
  {
    id: 1,
    name: 'Client Name',
    logo: 'https://your-logo-url.png',
    hasGlassBadge: true, // ← Toggle glass background ON/OFF
  },
];

// Logo margin adjustment (Line ~98):
style={{
  padding: '8px', /* ← MARGIN: Increase for more space around logo */
}}
```

### 3. Cinematic Preview for "Short Movie" Projects

Projects tagged with `category: 'Short Movie'` automatically enable hover-activated cinematic preview:

```tsx
// File: /components/Filmography.tsx
// Add cinematicStills array to any project:

{
  id: 1,
  title: 'Your Film',
  category: 'Short Movie', // ← Triggers cinematic preview
  cinematicStills: [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg', // 4-6 stills recommended
  ]
}
```

**Features:**
- Horizontal sequential transitions (1.5s intervals)
- Color-adaptive glows that match image tones
- Progress indicators showing current still
- Smooth cross-fade animations

---

## 🎭 Animation Features

### 1. Persistent Gradient Background
- **File:** `/components/AnimatedBackground.tsx`
- **Behavior:** Continuous slow-moving spectral gradients (35-45s loops)
- **Colors:** Purple, blue, orange, emerald, violet gradients
- **Effects:** Film grain texture, soft vignette, color blending layer
- **Performance:** Optimized with `will-change`, reduced on mobile

### 2. Cursor Parallax Effect
- **File:** `/components/CursorParallax.tsx`
- **Behavior:** Subtle spotlight and glow that follows cursor
- **Layers:** Primary spotlight (500px) + secondary glow (200px)
- **Performance:** Only active on desktop with mouse input

### 3. Card Hover Interactions
- **Subtle elevation:** `scale: 1.05, y: -5`
- **Color-adaptive glow:** Matches dominant image tones
- **Edge highlights:** `inset shadow` with white glow
- **Smooth transitions:** 0.3-0.5s easing

---

## 📱 Responsive Optimization

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** > 1024px

### Performance Adjustments
```typescript
// Mobile optimizations:
- Blur: 24px → 12px
- Animation duration: 100% → 70%
- Reduced particle count
- Simplified gradients

// Accessibility (prefers-reduced-motion):
- All animations: 0.01ms duration
- Static backgrounds
- Instant transitions
```

---

## 🎯 Color Adaptation System

Film project cards adapt their glow colors based on displayed images:

```tsx
// File: /components/FilmProject.tsx
// Line: ~77

const glowRgba = [
  'rgba(168, 85, 247, 0.6)', // purple
  'rgba(6, 182, 212, 0.6)',  // cyan
  'rgba(249, 115, 22, 0.6)', // orange
  'rgba(20, 184, 166, 0.6)', // teal
  // ... cycles through based on currentStillIndex
];
```

**Low opacity (0.3-0.6)** ensures subtle ambient light effect, not direct color matching.

---

## 🛠️ Customization Quick Reference

### Change Brand Logo
```tsx
// All logo instances use:
src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png"

// Replace with your logo URL in:
// - /components/Hero.tsx (Line 27)
// - /components/FilmProject.tsx (Line 122)
// - /components/FeaturedProject.tsx (Line 47)
```

### Adjust Glass Opacity
```css
/* File: /styles/globals.css */

:root {
  --glass-bg: rgba(255, 255, 255, 0.05); /* Default 5% */
  --glass-border: rgba(255, 255, 255, 0.1); /* Default 10% */
  --glass-blur: 20px; /* Desktop blur amount */
}
```

### Modify Gradient Colors
```tsx
// File: /components/AnimatedBackground.tsx
// Change color values in each orb's background:

background: 'radial-gradient(circle at center, 
  rgba(147, 51, 234, 0.25) 0%,  /* ← Primary color */
  rgba(236, 72, 153, 0.15) 40%, /* ← Secondary color */
  transparent 70%
)'
```

### Add New Projects
```tsx
// File: /components/Filmography.tsx
// Add to projects array:

{
  id: 11,
  title: 'Your New Film',
  category: 'Short Movie', // or 'Commercial', 'Personal Projects'
  year: '2025',
  description: 'Your description...',
  image: 'thumbnail-url.jpg',
  videoUrl: 'https://drive.google.com/file/.../preview', // Optional
  roles: ['Director', 'Editor'],
  cinematicStills: ['still1.jpg', 'still2.jpg'], // Optional, for Short Movies
}
```

---

## ✨ Special Features

### Glass Badge Toggle (Client Logos)
Each client logo can enable/disable glassmorphism background:
```tsx
hasGlassBadge: true  // Shows glass card background
hasGlassBadge: false // Logo only, no container
```

### Video Modal Integration
All projects with `videoUrl` automatically get:
- Play button overlay on hover
- Full-screen video modal on click
- Google Drive embed support

### Cinematic Preview Indicator
"Short Movie" projects show horizontal progress bars indicating which still is currently displayed (1.5s per image).

---

## 🎬 Best Practices

1. **Logo Size:** Maintain aspect ratio, recommended 200-400px height
2. **Cinematic Stills:** Use 4-6 high-quality stills per project
3. **Image URLs:** Use direct image links (ImgBB, Cloudinary) for best performance
4. **Video URLs:** Use Google Drive preview links for embedded playback
5. **Glass Effects:** Keep opacity low (2-8%) for subtle, elegant look
6. **Animations:** Slow and smooth (20-45s loops) for cinematic feel

---

## 🚀 Performance

- **Lazy Loading:** Images load on scroll
- **GPU Acceleration:** `will-change: transform` on animated elements
- **Reduced Motion:** Respects user accessibility preferences
- **Mobile Optimization:** Reduced blur and animation intensity
- **No Layout Shift:** Fixed aspect ratios prevent content jumps

---

## 📞 Support

For customization help or questions, refer to inline code comments marked with:
- `← LOGO MARGIN`
- `← VERTICAL POSITION`
- `← SIZE`
- `← Toggle glass background ON/OFF`

All adjustable values are documented directly in the code with clear instructions.
