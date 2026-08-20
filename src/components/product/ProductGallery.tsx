'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const allImages = images && images.length > 0 ? images : ['/images/plain_oversized_black.jpg'];
  const [activeImage, setActiveImage] = useState(allImages[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails list */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 shrink-0">
        {allImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-street-950 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
              activeImage === img
                ? 'border-brand-neon shadow-glow-neon ring-2 ring-brand-neon/20'
                : 'border-street-800 opacity-60 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${productName} view ${idx + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Active Image with Zoom Lens */}
      <div
        className="relative aspect-[4/5] flex-1 bg-street-950 rounded-2xl overflow-hidden border border-street-800 cursor-crosshair group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover object-center transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        {/* Hover hint */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-zinc-400 font-mono pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Hover to zoom 1.5x
        </div>
      </div>
    </div>
  );
}
