'use client';

import { useState } from 'react';
import { Upload, X, Star, Loader2, ArrowLeft, ArrowRight, Image as ImageIcon, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export default function MultiImageUploader({ images, onChange, disabled }: MultiImageUploaderProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');

    const newImageUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        try {
          // Attempt upload to Supabase Storage bucket 'product-images'
          const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
          const filePath = `products/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file, { upsert: false });

          if (!uploadError) {
            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
            if (data?.publicUrl) {
              newImageUrls.push(data.publicUrl);
              continue;
            }
          }
        } catch (e) {
          console.warn('Storage upload error, falling back to local image data:', e);
        }

        // Fallback: Convert PNG/JPG directly to Data URL (Base64)
        const dataUrl = await readFileAsDataUrl(file);
        newImageUrls.push(dataUrl);
      }

      if (newImageUrls.length > 0) {
        onChange([...images, ...newImageUrls]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to process selected image files.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const remaining = images.filter((_, i) => i !== index);
    onChange([selected, ...remaining]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <label
        className={`w-full border-2 border-dashed border-street-700 hover:border-brand-neon bg-street-950/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
          uploading || disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? (
          <div className="flex items-center gap-3 text-brand-neon font-bold text-sm">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Processing PNG / JPG Image Files...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-brand-neon/10 border border-brand-neon/30 rounded-2xl text-brand-neon">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <span className="text-white font-extrabold text-sm uppercase block">
                Select PNG or JPG Image Files
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Click or drag & drop image files (PNG, JPG, JPEG, WEBP). Multiple selection supported.
              </span>
            </div>
            <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-brand-neon uppercase font-bold">
              <Check className="w-3.5 h-3.5" /> Direct File Upload (No URLs Needed)
            </div>
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          multiple
          disabled={uploading || disabled}
          className="hidden"
          onChange={(e) => void handleFileUpload(e.target.files)}
        />
      </label>

      {error && (
        <div className="text-red-400 text-xs font-mono bg-red-500/10 p-3 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      {/* Image Gallery Grid */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-300 uppercase font-bold">
              Selected Image Gallery ({images.length} {images.length === 1 ? 'file' : 'files'})
            </span>
            <span className="text-[10px] font-mono text-brand-neon">★ First image = Main Product Cover</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((imgSrc, idx) => {
              const isCover = idx === 0;
              return (
                <div
                  key={`${idx}-${imgSrc.slice(0, 30)}`}
                  className={`group relative bg-street-950 border rounded-2xl overflow-hidden aspect-square flex flex-col justify-between transition-all ${
                    isCover
                      ? 'border-brand-neon ring-1 ring-brand-neon/50'
                      : 'border-street-800 hover:border-street-600'
                  }`}
                >
                  <img src={imgSrc} alt={`Product PNG/JPG ${idx + 1}`} className="w-full h-full object-cover" />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      {isCover ? (
                        <span className="bg-brand-neon text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 uppercase shadow">
                          <Star className="w-3 h-3 fill-black" /> Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className="bg-black/80 hover:bg-brand-neon hover:text-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1"
                          title="Set as Main Cover"
                        >
                          <Star className="w-3 h-3" /> Make Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-1 rounded-full shadow transition-transform hover:scale-110"
                        title="Delete Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'left')}
                            className="bg-black/80 text-white p-1 rounded hover:bg-zinc-800"
                            title="Move left"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'right')}
                            className="bg-black/80 text-white p-1 rounded hover:bg-zinc-800"
                            title="Move right"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-300 font-bold bg-black/60 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {isCover && (
                    <div className="absolute top-2 left-2 group-hover:opacity-0 transition-opacity">
                      <span className="bg-brand-neon text-black font-black text-[9px] px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-black" /> MAIN
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-street-950/40 border border-street-800/80 rounded-2xl flex items-center gap-3 text-zinc-500 text-xs">
          <ImageIcon className="w-5 h-5 text-zinc-600 shrink-0" />
          <span>No image files selected. Click above to select PNG or JPG photos from your device.</span>
        </div>
      )}
    </div>
  );
}
