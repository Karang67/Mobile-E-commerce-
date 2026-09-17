import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  Star,
  CheckCircle2,
  XCircle,
  Filter,
  Tags,
  Layers,
  X
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { deleteProductFromMongo } from '../utils/apiService';
import { addCustomCategory, deleteCustomCategory } from '../data/adminData';
import { Product, ProductCategory } from '../types';

type SortKey = 'name' | 'price' | 'discount' | 'rating';

export const AdminProductList: React.FC = () => {
  const navigate = useNavigate();
  const { products, categories, refresh } = useStoreData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'new' | 'preowned'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Category modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') {
      const cId = category.toLowerCase().trim();
      list = list.filter(p => {
        const pCat = (p.category || '').toLowerCase().trim();
        const pSlug = pCat.replace(/[^a-z0-9]+/g, '-');
        return pCat === cId || pSlug === cId;
      });
    }
    if (stockFilter === 'inStock') list = list.filter(p => p.inStock);
    if (stockFilter === 'outOfStock') list = list.filter(p => !p.inStock);
    if (conditionFilter === 'new') list = list.filter(p => !p.isSecondHand);
    if (conditionFilter === 'preowned') list = list.filter(p => p.isSecondHand);

    list.sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    return list;
  }, [products, search, category, stockFilter, conditionFilter, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(v => !v);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null;

  const confirmDelete = async (id: string) => {
    await deleteProductFromMongo(id);
    refresh();
    setDeleteTarget(null);
  };

  const bulkDelete = async () => {
    for (const id of Array.from(selected)) {
      await deleteProductFromMongo(id);
    }
    refresh();
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(p => n.delete(p.id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); filtered.forEach(p => n.add(p.id)); return n; });
    }
  };

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-white">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} total products</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            <Tags className="w-4 h-4 text-[#E30613]" />
            <span>Manage Categories</span>
          </button>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-[#E30613] hover:bg-[#c40510] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1B2430] rounded-2xl p-4 border border-gray-700/40 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, brand or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 text-sm rounded-xl pl-9 pr-4 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
            />
          </div>
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value as any)}
            className="bg-gray-800 text-gray-300 text-sm rounded-xl px-3 py-2.5 border border-gray-700 focus:outline-none"
          >
            <option value="all">All Stock</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {/* Condition Filter Segmented Control */}
        <div className="flex items-center gap-2 pb-2 border-b border-gray-700/50 flex-wrap">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">Condition:</span>
          {[
            { id: 'all', label: `All Products (${products.length})` },
            { id: 'new', label: `Brand New (${products.filter(p => !p.isSecondHand).length})` },
            { id: 'preowned', label: `Pre-Owned / 2nd Hand (${products.filter(p => p.isSecondHand).length})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setConditionFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                conditionFilter === f.id
                  ? (f.id === 'preowned' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Dynamic Category pills */}
        <div className="flex gap-1.5 flex-wrap items-center">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors capitalize ${
              category === 'all'
                ? 'bg-[#E30613] text-white shadow-xs'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map(c => {
            const isSel = category.toLowerCase() === c.id.toLowerCase() || category.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors capitalize flex items-center gap-1 ${
                  isSel
                    ? 'bg-[#E30613] text-white shadow-xs'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{c.name}</span>
                <span className="opacity-75 font-mono text-[10px]">({c.itemCount ?? 0})</span>
                {c.isCustom && <span className="text-[9px] text-amber-400 font-bold ml-0.5">★</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-2.5">
          <span className="text-sm text-red-300 font-semibold">{selected.size} selected</span>
          <button
            onClick={bulkDelete}
            className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Selected
          </button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-gray-400 hover:text-white">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700/60 bg-gray-800/40">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-semibold">Image</th>
                <th className="px-4 py-3 text-left cursor-pointer text-gray-400 font-semibold" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">Name <SortIcon k="name" /></span>
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-semibold">Category</th>
                <th className="px-4 py-3 text-right cursor-pointer text-gray-400 font-semibold" onClick={() => toggleSort('price')}>
                  <span className="flex items-center justify-end gap-1">Price <SortIcon k="price" /></span>
                </th>
                <th className="px-4 py-3 text-center cursor-pointer text-gray-400 font-semibold" onClick={() => toggleSort('discount')}>
                  <span className="flex items-center justify-center gap-1">Disc. <SortIcon k="discount" /></span>
                </th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold">Stock</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold">Flags</th>
                <th className="px-4 py-3 text-right text-gray-400 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                    No products found. <Link to="/admin/products/new" className="text-[#E30613] font-bold hover:underline">Add one?</Link>
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-700" />
                  </td>
                  <td className="px-4 py-3 max-w-52">
                    <div className="text-gray-200 font-semibold line-clamp-1 flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {p.isSecondHand && (
                        <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-600/50 text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0 shadow-xs">
                          2nd Hand • {p.condition || 'Like New'}
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 mt-0.5 flex items-center gap-2">
                      <span>{p.brand} · SKU: {p.sku}</span>
                      {p.isSecondHand && p.batteryHealth && (
                        <span className="text-emerald-400 text-[10px] font-bold">🔋 {p.batteryHealth}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded capitalize">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-200 font-bold">
                    ₹{p.price.toLocaleString('en-IN')}
                    {p.originalPrice > p.price && (
                      <div className="text-gray-500 line-through text-[10px]">₹{p.originalPrice.toLocaleString('en-IN')}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.discount > 0 ? (
                      <span className="text-green-400 font-bold">{p.discount}%</span>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.inStock
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {p.isFeatured && <span className="bg-yellow-900/50 text-yellow-400 px-1.5 py-0.5 rounded text-[9px] font-bold">FT</span>}
                      {p.isBestDeal && <span className="bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">BD</span>}
                      {p.isPopular && <span className="bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded text-[9px] font-bold">POP</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                        className="text-[#E30613] hover:text-white bg-red-900/20 hover:bg-[#E30613] p-1.5 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p.id)}
                        className="text-red-500 hover:text-white bg-red-900/20 hover:bg-red-700 p-1.5 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-700/40 text-xs text-gray-500">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1B2430] border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-white font-black text-center mb-1">Delete Product?</h3>
            <p className="text-gray-400 text-xs text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteTarget)}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#1B2430] border border-gray-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-gray-700/60 bg-gray-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E30613]/10 text-[#E30613] flex items-center justify-center font-bold">
                  <Tags className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-black text-base">Category Management</h3>
                  <p className="text-gray-400 text-xs">Add your own custom categories for products</p>
                </div>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Add New Category Form */}
              <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#E30613]" />
                  <span>Add New Custom Category</span>
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Category Name (e.g. Smart TV, Drones, Gaming, Cameras)..."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full bg-gray-900 text-gray-100 placeholder-gray-500 text-xs rounded-lg px-3 py-2.5 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  />
                  <input
                    type="text"
                    placeholder="Short Description (e.g. 4K Ultra HD TVs & Displays)..."
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    className="w-full bg-gray-900 text-gray-100 placeholder-gray-500 text-xs rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCatName.trim()) return;
                      addCustomCategory(newCatName.trim(), newCatDesc.trim());
                      setNewCatName('');
                      setNewCatDesc('');
                      refresh();
                    }}
                    className="w-full bg-[#E30613] hover:bg-[#c40510] text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save & Activate Category</span>
                  </button>
                </div>
              </div>

              {/* Existing Categories List */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  All Active Categories ({categories.length})
                </h4>
                <div className="space-y-2">
                  {categories.map(c => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-gray-600 transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-200">{c.name}</span>
                          {c.isCustom ? (
                            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                              Custom
                            </span>
                          ) : (
                            <span className="bg-blue-500/10 text-blue-400 text-[10px] font-medium px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          ID: <span className="font-mono text-gray-300">{c.id}</span> {c.desc ? `· ${c.desc}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded-lg font-mono font-bold">
                          {c.itemCount ?? 0} {c.itemCount === 1 ? 'item' : 'items'}
                        </span>
                        {c.isCustom && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete custom category "${c.name}"?`)) {
                                deleteCustomCategory(c.id);
                                refresh();
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                            title="Delete custom category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-900/60 border-t border-gray-700/60 text-right">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-5 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
