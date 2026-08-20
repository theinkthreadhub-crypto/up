'use client';

import { useState } from 'react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-2 px-4 text-[11px] font-mono tracking-wider text-center border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        <span>🎁 PREPAID ORDERS: FLAT ₹50 SHIPPING (SAVE ₹49)</span>
        <span className="text-zinc-500">•</span>
        <span>🚚 COD AVAILABLE WITH ₹99 ADVANCE BOOKING</span>
        <span className="text-zinc-500">•</span>
        <span>💬 WHATSAPP ORDER DISPATCH: 6392995127</span>
      </div>
    </div>
  );
}
