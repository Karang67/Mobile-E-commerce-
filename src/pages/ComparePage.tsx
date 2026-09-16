import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const specKeys = [
    'Processor',
    'RAM',
    'Storage',
    'Display Size',
    'Display Resolution',
    'Battery',
    'Camera',
    'Operating System',
    'SIM',
    'Item Weight',
  ];

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-[#0796D2] flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          No Devices in Comparison
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2">
          Click the balance scale icon on any product card or details page to compare specifications side by side.
        </p>
        <Link
          to="/shop/smartphones"
          className="mt-6 inline-block bg-[#0796D2] hover:bg-[#067ea8] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
        >
          Browse Smartphones
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-[#E30613]">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">Compare Devices ({compareList.length})</span>
      </div>

      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Scale className="w-6 h-6 text-[#0796D2]" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            Device Comparison
          </h1>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-x-auto">
        <table className="w-full min-w-[650px] text-xs border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 text-left text-gray-500 font-bold w-48 uppercase tracking-wider">
                Feature
              </th>
              {compareList.map(product => (
                <th key={product.id} className="p-4 text-center w-64 align-top">
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute -top-1 -right-1 p-1 bg-gray-200 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-28 h-28 object-contain mx-auto mb-2"
                    />
                    <span className="text-[10px] font-bold uppercase text-[#0796D2] block">
                      {product.brand}
                    </span>
                    <Link
                      to={`/product/${product.slug}`}
                      className="font-bold text-gray-900 hover:text-[#E30613] line-clamp-2 mt-0.5"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 text-sm font-black text-[#E30613] font-mono">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <div className="mt-3">
                      {product.inStock ? (
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="w-full bg-[#E30613] hover:bg-[#c40510] text-white py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <span className="block py-1.5 bg-red-100 text-[#E30613] rounded text-[10px] font-bold uppercase">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Stock Status Row */}
            <tr className="hover:bg-gray-50/50">
              <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">Availability</td>
              {compareList.map(p => (
                <td key={p.id} className="p-3.5 text-center font-semibold">
                  {p.inStock ? (
                    <span className="text-emerald-700 font-bold">In Stock</span>
                  ) : (
                    <span className="text-red-600 font-bold">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Spec rows */}
            {specKeys.map(key => (
              <tr key={key} className="hover:bg-gray-50/50">
                <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">{key}</td>
                {compareList.map(p => (
                  <td key={p.id} className="p-3.5 text-center text-gray-800">
                    {p.specifications[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
