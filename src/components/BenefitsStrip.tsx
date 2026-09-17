import React from 'react';
import { Tag, Clock, CreditCard, ShieldCheck } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  const benefits = [
    {
      title: 'BEST DEALS',
      subtitle: 'On All Products',
      icon: Tag,
    },
    {
      title: 'STORE PICKUP',
      subtitle: 'Instant at Sumerpur Store',
      icon: Clock,
    },
    {
      title: 'NO COST EMI',
      subtitle: 'At Zero Down Payment',
      icon: CreditCard,
    },
    {
      title: '100% SECURED PAYMENT',
      subtitle: 'We value your security',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="bg-[#0796D2] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-3 md:p-4 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow border border-blue-100"
              >
                {/* White box with vibrant Red Icon graphic */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center shrink-0 border border-red-100/70">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.2} />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-tight leading-tight truncate">
                    {benefit.title}
                  </h4>
                  <p className="text-[11px] md:text-xs text-gray-600 font-medium leading-tight mt-0.5 truncate">
                    {benefit.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
