'use client';

import { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Database, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { Category } from '@/types/database';

interface BulkProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

interface ParsedProduct {
  name: string;
  sku: string;
  slug?: string;
  price: number;
  sale_price?: number;
  cost_price?: number;
  stock_quantity: number;
  category_name?: string;
  category_id?: string;
  product_type: string;
  fabric_gsm: number;
  sizes: string[];
  colors: string[];
  images: string[];
  thumbnail: string;
  short_description: string;
  description: string;
  isValid: boolean;
  validationError?: string;
}

export default function BulkProductUploadModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
}: BulkProductUploadModalProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [importSummary, setImportSummary] = useState<{ success: number; total: number } | null>(null);

  if (!isOpen) return null;

  // Helper to extract value from row object regardless of header name variations
  const extractField = (row: Record<string, any>, possibleKeys: string[]): string => {
    const rowKeys = Object.keys(row);
    for (const key of possibleKeys) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const matchedRowKey = rowKeys.find(
        (rk) => rk.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey
      );
      if (matchedRowKey && row[matchedRowKey] !== undefined && row[matchedRowKey] !== null) {
        return String(row[matchedRowKey]).trim();
      }
    }
    return '';
  };

  const processRawRows = (jsonRows: Record<string, any>[]) => {
    if (!jsonRows || jsonRows.length === 0) {
      setError('No product data rows found in spreadsheet.');
      setParsedProducts([]);
      return;
    }

    const items: ParsedProduct[] = jsonRows.map((row, idx) => {
      const rawName = extractField(row, ['name', 'product_name', 'title', 'product_title', 'item', 'product']);
      const rawSku = extractField(row, ['sku', 'item_code', 'code', 'product_code', 'id']) || `ITH-BULK-${Date.now().toString().slice(-4)}-${idx + 1}`;
      const priceStr = extractField(row, ['price', 'mrp', 'rate', 'amount', 'cost']);
      const rawPrice = Number(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const salePriceStr = extractField(row, ['sale_price', 'discounted_price', 'offer_price', 'saleprice']);
      const rawSalePrice = salePriceStr ? Number(salePriceStr.replace(/[^0-9.]/g, '')) : undefined;
      const costPriceStr = extractField(row, ['cost_price', 'cost']);
      const rawCostPrice = costPriceStr ? Number(costPriceStr.replace(/[^0-9.]/g, '')) : undefined;
      const stockStr = extractField(row, ['stock_quantity', 'stock', 'qty', 'quantity', 'inventory']);
      const rawStock = Number(stockStr.replace(/[^0-9]/g, '')) || 50;
      const rawCatName = extractField(row, ['category_name', 'category', 'collection', 'cat']);
      const rawType = extractField(row, ['product_type', 'type', 'item_type']) || 'Oversized T-Shirt';
      const gsmStr = extractField(row, ['fabric_gsm', 'gsm']);
      const rawGsm = Number(gsmStr.replace(/[^0-9]/g, '')) || 240;
      const rawSizesStr = extractField(row, ['sizes', 'size', 'available_sizes']) || 'S, M, L, XL';
      const rawSizes = rawSizesStr.split(/[,|]/).map((s) => s.trim()).filter(Boolean);
      const rawColorsStr = extractField(row, ['colors', 'color', 'available_colors']) || 'Obsidian Black';
      const rawColors = rawColorsStr.split(/[,|]/).map((c) => c.trim()).filter(Boolean);
      const rawImagesStr = extractField(row, ['images', 'image', 'image_url', 'photos', 'photo']);
      const rawImages = rawImagesStr.split(/[,|\n]/).map((img) => img.trim()).filter(Boolean);
      const rawShortDesc = extractField(row, ['short_description', 'short_desc', 'tagline']);
      const rawDesc = extractField(row, ['description', 'desc', 'details']) || rawName || 'Streetwear apparel item';

      // Match category_id from category_name
      const matchedCategory = categories.find(
        (c) => c.name.toLowerCase() === rawCatName.toLowerCase() || c.slug.toLowerCase() === rawCatName.toLowerCase()
      );

      const isValid = Boolean(rawName && rawPrice > 0);
      let validationError = '';
      if (!rawName) validationError = 'Missing product name';
      else if (rawPrice <= 0) validationError = 'Price must be greater than 0';

      return {
        name: rawName,
        sku: rawSku,
        slug: slugify(rawName || `product-${idx}`),
        price: rawPrice,
        sale_price: rawSalePrice,
        cost_price: rawCostPrice,
        stock_quantity: rawStock,
        category_name: matchedCategory ? matchedCategory.name : rawCatName || categories[0]?.name || 'Oversized T-Shirts',
        category_id: matchedCategory ? matchedCategory.id : categories[0]?.id || undefined,
        product_type: rawType,
        fabric_gsm: rawGsm,
        sizes: rawSizes.length > 0 ? rawSizes : ['S', 'M', 'L', 'XL'],
        colors: rawColors.length > 0 ? rawColors : ['Black'],
        images: rawImages,
        thumbnail: rawImages[0] || '/images/plain_oversized_black.jpg',
        short_description: rawShortDesc,
        description: rawDesc,
        isValid,
        validationError,
      };
    });

    setParsedProducts(items);
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'name',
      'sku',
      'price',
      'sale_price',
      'cost_price',
      'stock_quantity',
      'category_name',
      'product_type',
      'fabric_gsm',
      'sizes',
      'colors',
      'images',
      'short_description',
      'description',
    ];

    const sampleRow = [
      'Oversized Urban Graphic Hoodie',
      'ITH-HOOD-001',
      '1899',
      '1299',
      '600',
      '100',
      categories[0]?.name || 'Oversized T-Shirts',
      'Hoodie',
      '380',
      'S, M, L, XL',
      'Black, Acid Grey',
      '/images/plain_oversized_black.jpg',
      'Heavyweight 380 GSM fleece hoodie.',
      'Streetwear oversized hoodie with premium back graphic print and soft fleece inside.',
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), sampleRow.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'inkthread_bulk_products_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setError('');
    setImportSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
        processRawRows(jsonRows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error reading spreadsheet file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setError('Please paste CSV or tab-separated text first.');
      return;
    }
    setError('');
    setImportSummary(null);
    try {
      const workbook = XLSX.read(pastedText, { type: 'string' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
      processRawRows(jsonRows);
    } catch (e) {
      setError('Could not parse pasted CSV data.');
    }
  };

  const handleBulkImport = async () => {
    const validItems = parsedProducts.filter((p) => p.isValid);
    if (validItems.length === 0) {
      setError('No valid products to import.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const recordsToInsert = validItems.map((p) => ({
        name: p.name,
        slug: `${p.slug}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
        sku: p.sku,
        category_id: p.category_id || null,
        category_name: p.category_name || null,
        product_type: p.product_type,
        price: p.price,
        sale_price: p.sale_price || p.price,
        cost_price: p.cost_price || 0,
        stock_quantity: p.stock_quantity,
        fabric_gsm: p.fabric_gsm,
        short_description: p.short_description || null,
        description: p.description,
        sizes: p.sizes,
        colors: p.colors,
        thumbnail: p.thumbnail,
        images: p.images.length > 0 ? p.images : [p.thumbnail],
        is_published: true,
        is_featured: false,
        is_new_arrival: true,
        is_best_seller: false,
        updated_at: new Date().toISOString(),
      }));

      const { data, error: insertError } = await supabase
        .from('products')
        .insert(recordsToInsert)
        .select('id');

      if (insertError) {
        throw insertError;
      }

      setImportSummary({
        success: data ? data.length : recordsToInsert.length,
        total: parsedProducts.length,
      });

      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bulk import failed.');
    } finally {
      setUploading(false);
    }
  };

  const validCount = parsedProducts.filter((p) => p.isValid).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-street-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-street-800 flex items-center justify-between bg-street-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-neon/10 border border-brand-neon/30 rounded-2xl text-brand-neon">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-brand-neon uppercase font-bold tracking-wider">
                MASS CATALOG IMPORT ENGINE
              </span>
              <h2 className="text-white text-xl font-black uppercase">BULK PRODUCT UPLOAD</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Mode Switcher */}
          <div className="flex items-center justify-between border-b border-street-800 pb-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-2 ${
                  activeTab === 'file'
                    ? 'bg-brand-neon text-black'
                    : 'bg-street-900 text-zinc-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" /> Upload File (.CSV / .XLSX)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-2 ${
                  activeTab === 'paste'
                    ? 'bg-brand-neon text-black'
                    : 'bg-street-900 text-zinc-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" /> Copy & Paste CSV Text
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="bg-street-900 border border-street-700 hover:border-brand-neon text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors shrink-0"
            >
              <Download className="w-4 h-4 text-brand-neon" /> Sample CSV
            </button>
          </div>

          {/* Tab 1: File Upload */}
          {activeTab === 'file' && (
            <div className="bg-street-950 border border-street-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3">
              <Upload className="w-8 h-8 text-brand-neon" />
              <div className="text-center">
                <h4 className="text-white font-bold text-sm uppercase">
                  {fileName ? `File Selected: ${fileName}` : 'Select Product Spreadsheet File'}
                </h4>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Supports Excel (.xlsx, .xls) and CSV (.csv) files.
                </p>
              </div>
              <label className="bg-brand-neon text-black font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-brand-neonHover flex items-center gap-2 shadow-glow-neon">
                <Upload className="w-4 h-4" /> Choose File from Computer
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          )}

          {/* Tab 2: Paste CSV Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-zinc-400 uppercase">
                Paste CSV or Tab-separated Data from Excel / Google Sheets
              </label>
              <textarea
                rows={5}
                placeholder="name,sku,price,stock_quantity,category_name&#10;Hoodie Black,ITH-001,1499,50,Hoodies&#10;Tee White,ITH-002,799,100,T-Shirts"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-street-950 border border-street-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-brand-neon"
              />
              <button
                type="button"
                onClick={handleParsePastedText}
                className="bg-street-900 border border-street-700 hover:border-brand-neon text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Parse Pasted Text
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {importSummary && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Successfully imported {importSummary.success} of {importSummary.total} products into Supabase!</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-emerald-500 text-black font-extrabold px-3.5 py-1.5 rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          )}

          {/* Preview Table */}
          {parsedProducts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-300 uppercase font-bold">
                  Parsed Product Preview ({parsedProducts.length} rows detected, {validCount} ready)
                </span>
                {validCount > 0 && (
                  <span className="text-xs text-brand-neon font-mono font-bold">
                    ✓ Ready to import {validCount} products
                  </span>
                )}
              </div>

              <div className="border border-street-800 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-street-950 border-b border-street-800 text-zinc-400 uppercase font-mono text-[11px]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-street-800/60 bg-card">
                    {parsedProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-street-900/40">
                        <td className="p-3 text-zinc-500 font-mono">{idx + 1}</td>
                        <td className="p-3 font-bold text-white max-w-[200px] truncate">
                          {p.name || <span className="text-red-400 italic">Empty Name</span>}
                        </td>
                        <td className="p-3 text-zinc-300 font-mono">{p.sku}</td>
                        <td className="p-3 text-zinc-400">{p.category_name}</td>
                        <td className="p-3 text-brand-neon font-bold">₹{p.price}</td>
                        <td className="p-3 text-zinc-300">{p.stock_quantity}</td>
                        <td className="p-3">
                          {p.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                              <AlertCircle className="w-3 h-3" /> {p.validationError}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-street-800 bg-street-950 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-street-900 text-zinc-300 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleBulkImport()}
            disabled={uploading || validCount === 0}
            className="bg-brand-neon text-black font-black uppercase text-xs px-6 py-2.5 rounded-xl hover:bg-brand-neonHover disabled:opacity-50 flex items-center gap-2 shadow-glow-neon"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Importing to Database...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" /> Import {validCount} Products Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
