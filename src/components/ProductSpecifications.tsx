import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, FileText } from 'lucide-react';

interface ProductSpecificationsProps {
  specifications: Record<string, string>;
  highlights: string[];
}

export const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  specifications,
  highlights,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden my-6 shadow-xs">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-gray-50/70 hover:bg-gray-100/70 transition-colors border-b border-gray-200"
      >
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-[#E30613]" />
          <h3 className="font-black text-gray-900 text-sm sm:text-base uppercase tracking-tight">
            More Information & Specifications
          </h3>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 animate-fade-in space-y-6">
          {/* Quick Overview Highlights Bullet points */}
          {highlights && highlights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#0796D2]" />
                <span>Quick Overview</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                {highlights.map((point, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E30613] shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Specification Table (recreates reference screenshot rows) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Technical Specifications
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200 text-xs">
              {Object.entries(specifications).map(([key, value], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-12 px-4 py-3 items-center ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <span className="col-span-5 sm:col-span-4 font-bold text-gray-700">
                    {key}
                  </span>
                  <span className="col-span-7 sm:col-span-8 text-gray-900 font-medium break-words">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
