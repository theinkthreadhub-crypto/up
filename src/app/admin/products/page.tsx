'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { initialProducts, initialCategories } from '@/lib/mock-data';
import { formatPrice, slugify } from '@/lib/utils';
import { Product } from '@/types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Add / Edit
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('Oversized T-Shirts');
  const [formType, setFormType] = useState('Oversized T-Shirt');
  const [formPrice, setFormPrice] = useState(999);
  const [formSalePrice, setFormSalePrice] = useState(699);
  const [formCostPrice, setFormCostPrice] = useState(300);
  const [formStock, setFormStock] = useState(50);
  const [formGsm, setFormGsm] = useState(240);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSizes, setFormSizes] = useState('S, M, L, XL, XXL');
  const [formColors, setFormColors] = useState('Obsidian Black, Chalk White');
  const [formImages, setFormImages] = useState('/images/plain_oversized_black.jpg');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormSku(`ITH-${Date.now().toString().slice(-6)}`);
    setFormCategory('Oversized T-Shirts');
    setFormType('Oversized T-Shirt');
    setFormPrice(1299);
    setFormSalePrice(899);
    setFormCostPrice(350);
    setFormStock(50);
    setFormGsm(240);
    setFormShortDesc('240 GSM heavyweight boxy oversized streetwear silhouette.');
    setFormDesc('Crafted with 100% super-combed cotton. Bio-washed, drop-shoulder cut.');
    setFormSizes('S, M, L, XL, XXL');
    setFormColors('Obsidian Black, Chalk White');
    setFormImages('/images/plain_oversized_black.jpg');
    setFormIsPublished(true);
    setFormIsFeatured(false);
    setFormIsNewArrival(true);
    setFormIsBestSeller(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormSku(product.sku);
    setFormCategory(product.category_name || 'Oversized T-Shirts');
    setFormType(product.product_type);
    setFormPrice(product.price);
    setFormSalePrice(product.sale_price || product.price);
    setFormCostPrice(product.cost_price || 300);
    setFormStock(product.stock_quantity);
    setFormGsm(product.fabric_gsm || 240);
    setFormShortDesc(product.short_description || '');
    setFormDesc(product.description);
    setFormSizes(product.sizes.join(', '));
    setFormColors(product.colors.join(', '));
    setFormImages(product.images.join(', '));
    setFormIsPublished(product.is_published);
    setFormIsFeatured(product.is_featured);
    setFormIsNewArrival(product.is_new_arrival);
    setFormIsBestSeller(product.is_best_seller);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSizes = formSizes.split(',').map((s) => s.trim()).filter(Boolean);
    const parsedColors = formColors.split(',').map((c) => c.trim()).filter(Boolean);
    const parsedImages = formImages.split(',').map((img) => img.trim()).filter(Boolean);

    if (editingProduct) {
      // Edit existing
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === editingProduct.id) {
            return {
              ...p,
              name: formName,
              slug: formSlug || slugify(formName),
              sku: formSku,
              category_name: formCategory,
              product_type: formType,
              price: Number(formPrice),
              sale_price: Number(formSalePrice),
              cost_price: Number(formCostPrice),
              stock_quantity: Number(formStock),
              fabric_gsm: Number(formGsm),
              short_description: formShortDesc,
              description: formDesc,
              sizes: parsedSizes,
              colors: parsedColors,
              thumbnail: parsedImages[0] || '/images/plain_oversized_black.jpg',
              images: parsedImages,
              is_published: formIsPublished,
              is_featured: formIsFeatured,
              is_new_arrival: formIsNewArrival,
              is_best_seller: formIsBestSeller,
              updated_at: new Date().toISOString(),
            };
          }
          return p;
        })
      );
    } else {
      // Add new
      const newProd: Product = {
        id: crypto.randomUUID(),
        name: formName,
        slug: formSlug || slugify(formName),
        sku: formSku,
        category_name: formCategory,
        product_type: formType,
        price: Number(formPrice),
        sale_price: Number(formSalePrice),
        cost_price: Number(formCostPrice),
        stock_quantity: Number(formStock),
        low_stock_threshold: 5,
        fabric_gsm: Number(formGsm),
        short_description: formShortDesc,
        description: formDesc,
        sizes: parsedSizes,
        colors: parsedColors,
        thumbnail: parsedImages[0] || '/images/plain_oversized_black.jpg',
        images: parsedImages,
        is_published: formIsPublished,
        is_featured: formIsFeatured,
        is_new_arrival: formIsNewArrival,
        is_best_seller: formIsBestSeller,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this product from the catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: crypto.randomUUID(),
      name: `${prod.name} (Copy)`,
      slug: `${prod.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${prod.sku}-COPY`,
      is_published: false,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const handleTogglePublish = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_published: !p.is_published } : p))
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category_name === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            PRODUCTS ({products.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-5 py-3 rounded-xl shadow-glow-neon flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> ADD NEW DROP
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-2xl border border-street-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or SKU..."
            className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neon"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-street-950 border border-street-800 text-zinc-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-neon cursor-pointer"
          >
            <option value="all">All Categories</option>
            {initialCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-card border border-street-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-street-800 bg-street-950 text-zinc-500 font-mono uppercase">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">SKU / Type</th>
                <th className="py-3.5 px-4">Price / Sale</th>
                <th className="py-3.5 px-4">Cost (Admin)</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-street-800/60 font-mono">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-street-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-street-950 rounded-lg overflow-hidden shrink-0 border border-street-800">
                        <Image
                          src={product.thumbnail || product.images[0] || '/images/plain_oversized_black.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-white font-sans text-sm line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-zinc-500">{product.category_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <div className="font-bold text-white">{product.sku}</div>
                    <div className="text-[10px] text-zinc-500">{product.product_type}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-brand-neon font-bold text-sm">
                      {formatPrice(product.sale_price || product.price)}
                    </div>
                    {product.sale_price && product.sale_price < product.price && (
                      <div className="text-[10px] text-zinc-500 line-through">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {product.cost_price ? formatPrice(product.cost_price) : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        product.stock_quantity <= 5
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-zinc-200'
                      }`}
                    >
                      {product.stock_quantity} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(product.id)}
                      className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase transition-colors ${
                        product.is_published
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {product.is_published ? (
                        <>
                          <Eye className="w-3 h-3" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-zinc-400 hover:text-brand-neon hover:bg-street-900 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(product)}
                        className="p-1.5 text-zinc-400 hover:text-brand-cyan hover:bg-street-900 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-street-900 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-card border border-street-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-street-800">
              <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider">
                {editingProduct ? 'Edit Streetwear Product' : 'Add New Streetwear Drop'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-zinc-400 font-mono">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingProduct) setFormSlug(slugify(e.target.value));
                    }}
                    placeholder="e.g. Acid Wash Heavyweight Hoodie"
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-neon"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  >
                    {initialCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Product Type</label>
                  <input
                    type="text"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    placeholder="e.g. Heavyweight Hoodie"
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Regular Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Sale / Drop Price (INR ₹)</label>
                  <input
                    type="number"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(Number(e.target.value))}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-brand-neon font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Cost Price (Admin Eyes Only)</label>
                  <input
                    type="number"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Fabric GSM (e.g. 240, 380)</label>
                  <input
                    type="number"
                    value={formGsm}
                    onChange={(e) => setFormGsm(Number(e.target.value))}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-mono">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-zinc-400 font-mono">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-zinc-400 font-mono">Image URLs / Paths (comma-separated)</label>
                  <input
                    type="text"
                    value={formImages}
                    onChange={(e) => setFormImages(e.target.value)}
                    placeholder="/images/hd_acidwash_hoodie.png, /images/sungod_luffy_acidwash_front.jpg"
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-zinc-400 font-mono">Short Description</label>
                  <input
                    type="text"
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-zinc-400 font-mono">Detailed Product Description</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full bg-street-950 border border-street-800 rounded-xl px-4 py-2.5 text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-street-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded bg-street-950 border-street-800 text-brand-neon"
                  />
                  <span>Published to Storefront</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded bg-street-950 border-street-800 text-brand-neon"
                  />
                  <span>Featured Drop</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNewArrival}
                    onChange={(e) => setFormIsNewArrival(e.target.checked)}
                    className="w-4 h-4 rounded bg-street-950 border-street-800 text-brand-neon"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-street-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-street-900 hover:bg-street-800 text-zinc-300 font-bold uppercase text-xs px-5 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-neon hover:bg-brand-neonHover text-black font-black uppercase text-xs px-6 py-2.5 rounded-xl shadow-glow-neon"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
