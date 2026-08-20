'use client';

import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizeChart = [
    { size: 'S', chest: '42 in (107 cm)', length: '28 in (71 cm)', shoulder: '21 in (53 cm)' },
    { size: 'M', chest: '44 in (112 cm)', length: '29 in (74 cm)', shoulder: '22 in (56 cm)' },
    { size: 'L', chest: '46 in (117 cm)', length: '30 in (76 cm)', shoulder: '23 in (58 cm)' },
    { size: 'XL', chest: '48 in (122 cm)', length: '31 in (79 cm)', shoulder: '24 in (61 cm)' },
    { size: 'XXL', chest: '50 in (127 cm)', length: '32 in (81 cm)', shoulder: '25 in (64 cm)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card border border-street-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-street-800">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-brand-neon" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Streetwear Fit & Size Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white hover:bg-street-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-zinc-400">
          <p className="bg-street-900/60 p-3 rounded-xl border border-street-800 text-zinc-300">
            💡 <strong className="text-white">Fit Advisory:</strong> Our garments are engineered with a relaxed, boxy drop-shoulder streetwear cut. For a true oversized silhouette, order your standard size. For a fitted standard look, consider sizing down one level.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-street-800 text-zinc-500 font-mono uppercase">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest (Circumference)</th>
                  <th className="py-2.5 px-3">Length</th>
                  <th className="py-2.5 px-3">Shoulder Drop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-street-800/60 font-mono">
                {sizeChart.map((row) => (
                  <tr key={row.size} className="hover:bg-street-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-brand-neon">{row.size}</td>
                    <td className="py-2.5 px-3 text-white">{row.chest}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{row.length}</td>
                    <td className="py-2.5 px-3 text-zinc-300">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500">
            * All measurements are taken with the garment laid flat. Slight +/- 0.5 inch handcrafting tolerances apply.
          </div>
        </div>
      </div>
    </div>
  );
}
