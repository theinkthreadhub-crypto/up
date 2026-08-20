import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export function isValidIndianPhone(phone: string): boolean {
  // Matches 10-digit Indian numbers with optional +91 or 0 prefix
  const cleaned = phone.replace(/[\s-]/g, '');
  const regex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  return regex.test(cleaned);
}

export function isValidIndianPincode(pincode: string): boolean {
  // Matches standard 6-digit Indian PIN codes
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode.trim());
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `ITH-${year}-${randomSuffix}`;
}
