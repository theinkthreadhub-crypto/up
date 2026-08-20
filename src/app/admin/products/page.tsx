'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, Eye, EyeOff, X, Upload, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, slugify } from '@/lib/utils';
import { Category, Product } from '@/types/database';

const emptyForm = {
  name: '', slug: '', sku: '', category_id: '', category_name: 'Oversized T-Shirts',
  product_type: 'Oversized T-Shirt', price: 1299, sale_price: 899, cost_price: 350,
  stock_quantity: 50, fabric_gsm: 240, short_description: '', description: '',
  sizes: 'S, M, L, XL, XXL', colors: 'Obsidian Black, Chalk White', images: '',
  is_published: true, is_featured: false, is_new_arrival: true, is_best_seller: false,
};

type ProductForm = typeof emptyForm;

export default function AdminProductsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>({ ...emptyForm });

  const loadData = async () => {
    setLoading(true);
    setError('');
    const [{ data: productRows, error: productError }, { data: categoryRows, error: categoryError }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
    ]);
    if (productError || categoryError) {
      setError(productError?.message || categoryError?.message || 'Could not load catalog');
    } else {
      setProducts((productRows || []) as Product[]);
      setCategories((categoryRows || []) as Category[]);
    }
    setLoading(false);
  };

  useEffect(() => { void loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openAddModal = () => {
    const firstCategory = categories[0];
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      sku: `ITH-${Date.now().toString().slice(-6)}`,
      category_id: firstCategory?.id || '',
      category_name: firstCategory?.name || 'Oversized T-Shirts',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category_id: p.category_id || '',
      category_name: p.category_name || '',
      product_type: p.product_type,
      price: Number(p.price),
      sale_price: Number(p.sale_price ?? p.price),
      cost_price: Number(p.cost_price ?? 0),
      stock_quantity: Number(p.stock_quantity),
      fabric_gsm: Number(p.fabric_gsm ?? 240),
      short_description: p.short_description || '',
      description: p.description || '',
      sizes: (p.sizes || []).join(', '),
      colors: (p.colors || []).join(', '),
      images: (p.images || []).join(', '),
      is_published: p.is_published,
      is_featured: p.is_featured,
      is_new_arrival: p.is_new_arrival,
      is_best_seller: p.is_best_seller,
    });
    setIsModalOpen(true);
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
        const path = `${Date.now()}-${crypto.randomUUID()}-${safe}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setForm((prev) => ({ ...prev, images: [prev.images, ...urls].filter(Boolean).join(', ') }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const parsedImages = form.images.split(',').map((v) => v.trim()).filter(Boolean);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      sku: form.sku.trim(),
      category_id: form.category_id || null,
      category_name: form.category_name || null,
      product_type: form.product_type,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      cost_price: form.cost_price ? Number(form.cost_price) : null,
      stock_quantity: Number(form.stock_quantity),
      fabric_gsm: Number(form.fabric_gsm),
      short_description: form.short_description,
      description: form.description,
      sizes: form.sizes.split(',').map((v) => v.trim()).filter(Boolean),
      colors: form.colors.split(',').map((v) => v.trim()).filter(Boolean),
      thumbnail: parsedImages[0] || null,
      images: parsedImages,
      is_published: form.is_published,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      is_best_seller: form.is_best_seller,
      updated_at: new Date().toISOString(),
    };

    const result = editingProduct
      ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
      : await supabase.from('products').insert(payload);

    if (result.error) setError(result.error.message);
    else { setIsModalOpen(false); await loadData(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this product?')) return;
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
    if (deleteError) setError(deleteError.message); else await loadData();
  };

  const handleDuplicate = async (p: Product) => {
    const { id, created_at, updated_at, variants, ...copy } = p;
    void id; void created_at; void updated_at; void variants;
    const { error: duplicateError } = await supabase.from('products').insert({
      ...copy,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-5)}`,
      sku: `${p.sku}-COPY-${Date.now().toString().slice(-4)}`,
      is_published: false,
    });
    if (duplicateError) setError(duplicateError.message); else await loadData();
  };

  const togglePublish = async (p: Product) => {
    const { error: toggleError } = await supabase.from('products').update({ is_published: !p.is_published, updated_at: new Date().toISOString() }).eq('id', p.id);
    if (toggleError) setError(toggleError.message); else await loadData();
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (selectedCat === 'all' || p.category_name === selectedCat);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-street-800 gap-4">
        <div><span className="text-xs font-mono font-bold text-brand-neon uppercase tracking-widest">LIVE CATALOG</span><h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase">PRODUCTS ({products.length})</h1></div>
        <button onClick={openAddModal} className="bg-brand-neon text-black font-black uppercase text-xs px-5 py-3 rounded-xl flex items-center gap-2"><Plus className="w-4 h-4"/> ADD NEW DROP</button>
      </div>

      {error && <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-xl p-3 text-xs">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-2xl border border-street-800">
        <div className="relative flex-1"><Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2"/><input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search title or SKU..." className="w-full bg-street-950 border border-street-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white"/></div>
        <select value={selectedCat} onChange={(e)=>setSelectedCat(e.target.value)} className="bg-street-950 border border-street-800 text-zinc-300 text-xs rounded-xl px-3 py-2.5"><option value="all">All Categories</option>{categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}</select>
      </div>

      <div className="bg-card border border-street-800 rounded-3xl overflow-hidden">
        {loading ? <div className="p-10 flex justify-center text-zinc-400"><Loader2 className="animate-spin"/></div> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-street-800 bg-street-950 text-zinc-500 uppercase"><th className="p-4">Item</th><th className="p-4">SKU / Type</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-street-800/60">
          {filteredProducts.map(p=><tr key={p.id} className="hover:bg-street-900/40"><td className="p-4"><div className="flex items-center gap-3">{p.thumbnail ? <img src={p.thumbnail} alt="" className="w-12 h-14 rounded-lg object-cover border border-street-800"/> : <div className="w-12 h-14 bg-street-900 rounded-lg"/>}<div><div className="text-white font-bold">{p.name}</div><div className="text-zinc-500">{p.category_name}</div></div></div></td><td className="p-4 text-zinc-300"><div className="text-white font-bold">{p.sku}</div><div className="text-zinc-500">{p.product_type}</div></td><td className="p-4 text-brand-neon font-bold">{formatPrice(p.sale_price || p.price)}</td><td className="p-4 text-zinc-200">{p.stock_quantity}</td><td className="p-4"><button onClick={()=>void togglePublish(p)} className={`px-2 py-1 rounded-full ${p.is_published?'text-emerald-400 bg-emerald-500/10':'text-zinc-500 bg-zinc-800'}`}>{p.is_published?<><Eye className="inline w-3 h-3 mr-1"/>Published</>:<><EyeOff className="inline w-3 h-3 mr-1"/>Draft</>}</button></td><td className="p-4"><div className="flex justify-end gap-2"><button onClick={()=>openEditModal(p)}><Edit2 className="w-4 h-4 text-zinc-300"/></button><button onClick={()=>void handleDuplicate(p)}><Copy className="w-4 h-4 text-brand-cyan"/></button><button onClick={()=>void handleDelete(p.id)}><Trash2 className="w-4 h-4 text-red-400"/></button></div></td></tr>)}
          {!filteredProducts.length && <tr><td colSpan={6} className="p-10 text-center text-zinc-500">No products found.</td></tr>}
        </tbody></table></div>)}
      </div>

      {isModalOpen && <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"><form onSubmit={handleSaveProduct} className="bg-card border border-street-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 space-y-5">
        <div className="flex justify-between items-center"><div><div className="text-brand-neon text-xs font-mono uppercase">REAL SUPABASE CATALOG</div><h2 className="text-white text-2xl font-black uppercase">{editingProduct?'Edit Product':'Add Product'}</h2></div><button type="button" onClick={()=>setIsModalOpen(false)}><X className="text-zinc-400"/></button></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Product Name"><input required value={form.name} onChange={e=>setField('name',e.target.value)} className="input"/></Field>
          <Field label="SKU"><input required value={form.sku} onChange={e=>setField('sku',e.target.value)} className="input"/></Field>
          <Field label="Slug"><input value={form.slug} onChange={e=>setField('slug',e.target.value)} placeholder="auto from product name" className="input"/></Field>
          <Field label="Category"><select value={form.category_id} onChange={e=>{const c=categories.find(x=>x.id===e.target.value); setField('category_id',e.target.value); setField('category_name',c?.name||'');}} className="input"><option value="">No category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Product Type"><input value={form.product_type} onChange={e=>setField('product_type',e.target.value)} className="input"/></Field>
          <Field label="Price"><input type="number" min="0" value={form.price} onChange={e=>setField('price',Number(e.target.value))} className="input"/></Field>
          <Field label="Sale Price"><input type="number" min="0" value={form.sale_price} onChange={e=>setField('sale_price',Number(e.target.value))} className="input"/></Field>
          <Field label="Cost Price"><input type="number" min="0" value={form.cost_price} onChange={e=>setField('cost_price',Number(e.target.value))} className="input"/></Field>
          <Field label="Stock"><input type="number" min="0" value={form.stock_quantity} onChange={e=>setField('stock_quantity',Number(e.target.value))} className="input"/></Field>
          <Field label="Fabric GSM"><input type="number" min="0" value={form.fabric_gsm} onChange={e=>setField('fabric_gsm',Number(e.target.value))} className="input"/></Field>
          <Field label="Sizes (comma separated)"><input value={form.sizes} onChange={e=>setField('sizes',e.target.value)} className="input"/></Field>
          <Field label="Colors (comma separated)"><input value={form.colors} onChange={e=>setField('colors',e.target.value)} className="input"/></Field>
        </div>
        <Field label="Short Description"><input value={form.short_description} onChange={e=>setField('short_description',e.target.value)} className="input"/></Field>
        <Field label="Description"><textarea required rows={4} value={form.description} onChange={e=>setField('description',e.target.value)} className="input"/></Field>
        <Field label="Product Images"><div className="space-y-2"><label className="inline-flex cursor-pointer items-center gap-2 bg-street-900 border border-street-700 text-white px-4 py-2 rounded-xl text-xs font-bold"><Upload className="w-4 h-4"/>{uploading?'Uploading...':'Upload Images'}<input disabled={uploading} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={e=>void uploadImages(e.target.files)}/></label><textarea rows={3} value={form.images} onChange={e=>setField('images',e.target.value)} placeholder="Uploaded URLs appear here; comma separated URLs also supported" className="input"/></div></Field>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">{([['is_published','Published'],['is_featured','Featured'],['is_new_arrival','New Arrival'],['is_best_seller','Best Seller']] as const).map(([key,label])=><label key={key} className="flex items-center gap-2 bg-street-950 p-3 rounded-xl border border-street-800 text-zinc-300"><input type="checkbox" checked={form[key]} onChange={e=>setField(key,e.target.checked)}/>{label}</label>)}</div>
        <button disabled={saving||uploading} className="w-full bg-brand-neon text-black font-black uppercase py-3 rounded-xl disabled:opacity-50">{saving?'SAVING TO DATABASE...':editingProduct?'UPDATE PRODUCT':'PUBLISH PRODUCT'}</button>
      </form><style jsx>{`.input{width:100%;background:#09090b;border:1px solid #27272a;border-radius:.75rem;padding:.7rem .85rem;color:white;font-size:.8rem;outline:none}.input:focus{border-color:#b8ff00}`}</style></div>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-[11px] text-zinc-400 font-mono uppercase">{label}</span>{children}</label>;
}
