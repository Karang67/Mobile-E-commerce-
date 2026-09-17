import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export const WhatsAppButton: React.FC = () => {
  const { brandName } = useBrand();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const text = encodeURIComponent(`Hi ${brandName} (Sumerpur), I need assistance with smartphone deals and in-store availability!`);
    window.open(`https://wa.me/917841976969?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6 z-30 flex items-center gap-2">
      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400/40"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp with our store support"
      >
        {/* WhatsApp Vector Icon */}
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.974.543 1.967.864 3.149.864 3.182 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.768-5.77zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-1.127-.078-.266-.086-.612-.224-1.045-.415-1.841-.814-3.037-2.678-3.13-2.802-.092-.124-.753-.998-.753-1.905 0-.906.476-1.353.645-1.537.17-.184.37-.23.493-.23.123 0 .247.002.354.007.113.005.263-.043.41.313.153.37.523 1.277.569 1.37.046.092.077.2.015.323-.062.123-.092.2-.185.308-.092.107-.194.24-.277.323-.092.092-.189.192-.081.377.108.185.479.79 1.028 1.28.708.631 1.305.827 1.49.92.185.092.292.077.4-.046.108-.123.462-.538.585-.723.123-.185.246-.154.415-.092.17.062 1.077.508 1.262.6.185.092.308.138.354.215.046.077.046.446-.098.851z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.526 3.662 1.438 5.178L2 22l4.98-1.408A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.17 8.17 0 0 1-4.288-1.205l-.307-.182-2.955.836.852-2.88-.2-.319A8.17 8.17 0 1 1 12 20.2z" />
        </svg>
      </button>

      {/* Tooltip on Desktop */}
      <div className="hidden md:flex items-center bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg border border-gray-700 pointer-events-none">
        <span>Chat with Us!</span>
      </div>
    </div>
  );
};
