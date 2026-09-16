import React, { useState } from 'react';
import { Bell, Tag, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface StockNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  mode: 'stock' | 'price';
}

export const StockNotifyModal: React.FC<StockNotifyModalProps> = ({
  isOpen,
  onClose,
  productName,
  mode,
}) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      showToast('Please enter either email or mobile number', 'error');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      showToast(
        mode === 'stock'
          ? `Alert set! We will notify you when ${productName} is back in stock.`
          : `Price alert set! We will notify you when the price drops.`,
        'success'
      );
      onClose();
      setSubmitted(false);
      setEmail('');
      setPhone('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 text-[#E30613] flex items-center justify-center shrink-0">
            {mode === 'stock' ? <Bell className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-black text-gray-900 leading-tight">
              {mode === 'stock' ? 'Back in Stock Notification' : 'Price Drop Alert'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{productName}</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <p className="font-bold text-gray-900 text-sm">Notification Registered!</p>
            <p className="text-xs text-gray-500">You will receive an instant SMS / Email alert as soon as inventory updates.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <p className="text-gray-600 leading-relaxed">
              {mode === 'stock'
                ? 'Enter your contact information below. We will send you an immediate alert as soon as stock is replenished.'
                : 'Enter your desired target price and contact details. We will notify you the moment the price falls.'}
            </p>

            {mode === 'price' && (
              <div>
                <label className="block text-gray-700 font-bold mb-1">Target Alert Price (₹)</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={e => setTargetPrice(e.target.value)}
                  placeholder="e.g. 19999"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-bold mb-1">Mobile Number (for SMS & WhatsApp)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E30613]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#E30613] hover:bg-[#c40510] text-white py-2.5 rounded-xl font-bold transition-colors shadow-md"
              >
                {mode === 'stock' ? 'Notify Me When in Stock' : 'Set Price Drop Alert'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
