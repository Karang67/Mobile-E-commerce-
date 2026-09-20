import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle2,
  Tag,
  Zap,
  ArrowRight,
  BarChart3,
  Layers,
  BadgePercent,
  ClipboardList,
  Phone,
  Clock
} from 'lucide-react';
import { useStoreData } from '../context/StoreDataContext';
import { getAdminNotifications, AdminInquiryNotification } from '../utils/notificationService';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-[#1B2430] rounded-2xl p-5 border border-gray-700/40 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-semibold text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
    </div>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { products } = useStoreData();
  const inquiries = useMemo(() => getAdminNotifications(), []);
  const unreadInquiriesCount = inquiries.filter(i => !i.read).length;

  const stats = useMemo(() => {
    const inStock = products.filter(p => p.inStock).length;
    const outOfStock = products.filter(p => !p.inStock).length;
    const featured = products.filter(p => p.isFeatured).length;
    const bestDeal = products.filter(p => p.isBestDeal).length;
    const popular = products.filter(p => p.isPopular).length;
    const avgDiscount = products.length
      ? Math.round(products.reduce((a, p) => a + (p.discount || 0), 0) / products.length)
      : 0;

    const byCategory: Record<string, number> = {};
    products.forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });

    const byBrand: Record<string, number> = {};
    products.forEach(p => {
      byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
    });

    return { inStock, outOfStock, featured, bestDeal, popular, avgDiscount, byCategory, byBrand, total: products.length };
  }, [products]);

  const categoryColors: Record<string, string> = {
    smartphones: 'bg-blue-500',
    tablets: 'bg-purple-500',
    laptops: 'bg-emerald-500',
    smartwatches: 'bg-yellow-500',
    earbuds: 'bg-pink-500',
    accessories: 'bg-orange-500',
    powerbanks: 'bg-teal-500',
    speakers: 'bg-indigo-500',
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-black text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Overview of your store's product catalog</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.total} color="bg-[#E30613]" />
        <StatCard icon={ClipboardList} label="Inquiries" value={inquiries.length} sub={unreadInquiriesCount > 0 ? `${unreadInquiriesCount} new notifications` : 'All caught up'} color="bg-blue-600" />
        <StatCard icon={CheckCircle2} label="In Stock" value={stats.inStock} sub={`${stats.outOfStock} out of stock`} color="bg-emerald-600" />
        <StatCard icon={Star} label="Featured" value={stats.featured} sub={`${stats.bestDeal} best deals`} color="bg-yellow-500" />
        <StatCard icon={BadgePercent} label="Avg. Discount" value={`${stats.avgDiscount}%`} sub="across all products" color="bg-purple-600" />
      </div>

      {/* Recent Customer Inquiries Banner if any exist */}
      {inquiries.length > 0 && (
        <div className="bg-[#1B2430] rounded-2xl p-5 border border-gray-700/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#E30613]" />
              <h3 className="text-sm font-bold text-white">Recent Customer Inquiries</h3>
              {unreadInquiriesCount > 0 && (
                <span className="bg-[#E30613] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadInquiriesCount} New
                </span>
              )}
            </div>
            <Link to="/admin/inquiries" className="text-xs font-bold text-[#0796D2] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {inquiries.slice(0, 3).map(inq => (
              <div key={inq.id} className="bg-gray-800/60 p-3.5 rounded-xl border border-gray-700/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{inq.customerName}</span>
                  <span className="font-mono text-[10px] text-yellow-400 bg-gray-900 px-1.5 py-0.5 rounded">
                    {inq.inquiryId}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300 text-[11px]">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <a href={`tel:${inq.customerPhone}`} className="hover:text-emerald-400 font-mono">
                    {inq.customerPhone}
                  </a>
                </div>
                <p className="text-gray-400 text-[11px] line-clamp-1">{inq.itemsSummary}</p>
                <div className="pt-1.5 border-t border-gray-700/50 flex justify-between items-center text-[11px]">
                  <span className="text-[#E30613] font-bold font-mono">₹{inq.total.toLocaleString('en-IN')}</span>
                  <span className="text-gray-500">{inq.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flag breakdown + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Flags */}
        <div className="bg-[#1B2430] rounded-2xl p-5 border border-gray-700/40">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#E30613]" /> Product Flags
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Featured', count: stats.featured, color: 'bg-yellow-500' },
              { label: 'Best Deal', count: stats.bestDeal, color: 'bg-emerald-500' },
              { label: 'Popular', count: stats.popular, color: 'bg-blue-500' },
              { label: 'Out of Stock', count: stats.outOfStock, color: 'bg-red-500' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${f.color} shrink-0`} />
                <div className="flex-1 text-xs text-gray-300">{f.label}</div>
                <div className="text-xs font-bold text-white">{f.count}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-1 max-w-20">
                  <div
                    className={`h-1 rounded-full ${f.color}`}
                    style={{ width: `${stats.total ? (f.count / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Category */}
        <div className="bg-[#1B2430] rounded-2xl p-5 border border-gray-700/40">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E30613]" /> By Category
          </h3>
          <div className="space-y-2.5">
            {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${categoryColors[cat] ?? 'bg-gray-500'} shrink-0`} />
                <div className="flex-1 text-xs text-gray-300 capitalize">{cat}</div>
                <div className="text-xs font-bold text-white">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* By Brand */}
        <div className="bg-[#1B2430] rounded-2xl p-5 border border-gray-700/40">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#E30613]" /> By Brand
          </h3>
          <div className="space-y-2.5">
            {Object.entries(stats.byBrand).sort((a, b) => b[1] - a[1]).map(([brand, count]) => (
              <div key={brand} className="flex items-center gap-2">
                <div className="flex-1 text-xs text-gray-300">{brand}</div>
                <div className="text-xs font-bold text-white bg-gray-700 px-2 py-0.5 rounded">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/admin/products/new', icon: Package, label: 'Add New Product', color: 'from-[#E30613] to-[#c40510]' },
            { to: '/admin/products', icon: TrendingUp, label: 'Manage Products', color: 'from-blue-700 to-blue-600' },
            { to: '/admin/offers', icon: Tag, label: 'Edit Offers', color: 'from-yellow-600 to-yellow-500' },
            { to: '/admin/store', icon: Zap, label: 'Update Store Info', color: 'from-emerald-700 to-emerald-600' },
          ].map(a => (
            <Link
              key={a.to}
              to={a.to}
              className={`flex items-center justify-between gap-2 bg-gradient-to-r ${a.color} rounded-xl px-4 py-3 text-white text-xs font-bold hover:opacity-90 transition-opacity`}
            >
              <div className="flex items-center gap-2">
                <a.icon className="w-4 h-4" />
                {a.label}
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent products */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Recent Products</h3>
          <Link to="/admin/products" className="text-xs text-[#E30613] hover:underline font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-[#1B2430] rounded-2xl border border-gray-700/40 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700/60">
                <th className="text-left text-gray-400 font-semibold px-4 py-3">Product</th>
                <th className="text-right text-gray-400 font-semibold px-4 py-3">Price</th>
                <th className="text-center text-gray-400 font-semibold px-4 py-3">Discount</th>
                <th className="text-center text-gray-400 font-semibold px-4 py-3">Stock</th>
                <th className="text-right text-gray-400 font-semibold px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map(p => (
                <tr key={p.id} className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-gray-700" />
                      <div>
                        <div className="text-gray-200 font-semibold line-clamp-1 max-w-48">{p.name}</div>
                        <div className="text-gray-500">{p.brand} · {p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-200 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center">
                    {p.discount > 0 && (
                      <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded font-bold">{p.discount}% OFF</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-bold ${p.inStock ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                      {p.inStock ? 'In Stock' : 'OOS'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-[#E30613] hover:underline font-bold">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
