import { FormEvent, useEffect, useState } from 'react';
import { LogIn, LogOut, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import {
  adminLogin,
  adminLogout,
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  Product,
  ProductInput,
  updateAdminProduct,
} from '../services/api';

const emptyForm: ProductInput = {
  name: '',
  price: 0,
  stock: 0,
  category: '',
  description: '',
  weight: 0,
  image: '',
};

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadProducts() {
    const data = await getAdminProducts();
    setProducts(data);
  }

  useEffect(() => {
    getAdminProducts()
      .then(data => {
        setProducts(data);
        setAuthenticated(true);
      })
      .catch(() => undefined)
      .finally(() => setCheckingSession(false));
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await adminLogin(username, password);
      await loadProducts();
      setAuthenticated(true);
      setPassword('');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login gagal');
    } finally {
      setBusy(false);
    }
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      weight: product.weight,
      image: product.image || '',
    });
    setError('');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editingId) {
        await updateAdminProduct(editingId, form);
      } else {
        await createAdminProduct(form);
      }
      await loadProducts();
      startCreate();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Gagal menyimpan produk');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus produk ini?')) return;
    setBusy(true);
    setError('');
    try {
      await deleteAdminProduct(id);
      await loadProducts();
      if (editingId === id) startCreate();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus produk');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    await adminLogout();
    setAuthenticated(false);
    setProducts([]);
    startCreate();
  }

  if (checkingSession) {
    return <div className="min-h-screen pt-24 px-4 text-center text-[#888]">Memeriksa sesi admin...</div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-16 flex items-start justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#111] border border-[#292929] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#00d4aa] text-black flex items-center justify-center">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-xs text-[#777] mt-1">Akses terbatas untuk pengelola FlatStore</p>
            </div>
          </div>
          <label className="block text-xs text-[#aaa] mb-2">Username</label>
          <input
            value={username}
            onChange={event => setUsername(event.target.value)}
            autoComplete="username"
            className="w-full bg-[#0a0a0a] border border-[#333] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00d4aa] mb-4"
            required
          />
          <label className="block text-xs text-[#aaa] mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
            className="w-full bg-[#0a0a0a] border border-[#333] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00d4aa] mb-6"
            required
          />
          {error && <p className="text-xs text-red-400 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-[#00d4aa] text-black font-semibold text-sm px-4 py-3 disabled:opacity-50"
          >
            <LogIn size={16} />
            {busy ? 'Memproses...' : 'Masuk sebagai admin'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[#00d4aa] text-xs uppercase tracking-widest mb-2">Protected workspace</p>
            <h1 className="text-2xl font-semibold text-white">Product Dashboard</h1>
            <p className="text-sm text-[#777] mt-1">Kelola {products.length} produk yang digunakan storefront.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-[#aaa] hover:text-white border border-[#333] px-3 py-2 self-start">
            <LogOut size={14} /> Keluar
          </button>
        </div>

        {error && <div className="border border-red-900 bg-red-950/30 text-red-300 text-sm px-4 py-3 mb-6">{error}</div>}

        <div className="grid lg:grid-cols-[360px_1fr] gap-6 items-start">
          <form onSubmit={handleSubmit} className="bg-[#111] border border-[#292929] p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">{editingId ? 'Edit produk' : 'Tambah produk'}</h2>
              {editingId && <button type="button" onClick={startCreate} className="text-xs text-[#00d4aa]">Batal</button>}
            </div>
            <div className="space-y-4">
              <Field label="Nama produk" value={form.name} onChange={value => setForm({ ...form, name: value })} />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Harga" value={form.price} onChange={value => setForm({ ...form, price: value })} />
                <NumberField label="Stok" value={form.stock} onChange={value => setForm({ ...form, stock: value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kategori" value={form.category} onChange={value => setForm({ ...form, category: value })} />
                <NumberField label="Berat (gram)" value={form.weight} onChange={value => setForm({ ...form, weight: value })} />
              </div>
              <Field label="Image key (opsional)" value={form.image || ''} onChange={value => setForm({ ...form, image: value })} />
              <label className="block">
                <span className="block text-xs text-[#aaa] mb-2">Deskripsi</span>
                <textarea
                  value={form.description}
                  onChange={event => setForm({ ...form, description: event.target.value })}
                  rows={4}
                  required
                  className="w-full resize-y bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </label>
              <button type="submit" disabled={busy} className="w-full flex items-center justify-center gap-2 bg-[#00d4aa] text-black font-semibold text-sm px-4 py-3 disabled:opacity-50">
                <Plus size={16} /> {busy ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah produk'}
              </button>
            </div>
          </form>

          <section className="bg-[#111] border border-[#292929] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#292929] flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Daftar produk</h2>
              <span className="text-xs text-[#777]">Data tersimpan di Worker KV</span>
            </div>
            <div className="divide-y divide-[#242424]">
              {products.map(product => (
                <div key={product.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-white truncate">{product.name}</h3>
                      <span className="text-[10px] text-[#00d4aa] border border-[#185f52] px-1.5 py-0.5">{product.category}</span>
                    </div>
                    <p className="text-xs text-[#777]">Rp {product.price.toLocaleString('id-ID')} · Stok {product.stock} · {product.weight}g</p>
                    <p className="text-xs text-[#666] mt-2 line-clamp-2">{product.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => startEdit(product)} title="Edit produk" className="p-2 text-[#aaa] hover:text-[#00d4aa] border border-[#333]"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(product.id)} title="Hapus produk" className="p-2 text-[#aaa] hover:text-red-400 border border-[#333]"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs text-[#aaa] mb-2">{label}</span>
      <input value={value} onChange={event => onChange(event.target.value)} required={label !== 'Image key (opsional)'} className="w-full bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-[#00d4aa]" />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="block text-xs text-[#aaa] mb-2">{label}</span>
      <input type="number" min="0" value={value} onChange={event => onChange(Number(event.target.value))} required className="w-full bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white outline-none focus:border-[#00d4aa]" />
    </label>
  );
}
