import { useState, useEffect, useRef } from 'react';

// Helper function to swap file extensions for modern image formats
function getAlternativeExtension(url: string, ext: string): string | undefined {
  if (!url || url.startsWith('data:') || !url.includes('.')) return undefined;
  const parts = url.split('.');
  parts[parts.length - 1] = ext;
  return parts.join('.');
}

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  priority?: boolean;
  placeholderSrc?: string; // A tiny 10px wide blurred base64 placeholder or tiny image URL
  avifSrc?: string;
  webpSrc?: string;
  avifSrcSet?: string;
  webpSrcSet?: string;
  aspectRatio?: string; // CSS aspect ratio (e.g., '16/9', '4/3', 'auto')
}

export function OptimizedImage({
  src,
  alt,
  priority = false,
  placeholderSrc,
  avifSrc,
  webpSrc,
  avifSrcSet,
  webpSrcSet,
  aspectRatio,
  className = '',
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const finalPlaceholder = placeholderSrc || src;

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-white/[0.02] ${className}`}
      style={{
        aspectRatio: aspectRatio || 'auto',
        ...style,
      }}
    >
      {/* Blurred Placeholder image (fades out once high-res loads) */}
      {finalPlaceholder && (
        <img
          src={finalPlaceholder}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 pointer-events-none transition-opacity duration-700 ease-in-out z-10 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Modern Format Wrapper */}
      <picture>
        {avifSrcSet && <source srcSet={avifSrcSet} type="image/avif" />}
        {avifSrc && <source srcSet={avifSrc} type="image/avif" />}

        {webpSrcSet && <source srcSet={webpSrcSet} type="image/webp" />}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}

        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          // @ts-ignore
          fetchPriority={priority ? 'high' : 'low'}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      </picture>
    </div>
  );
}
