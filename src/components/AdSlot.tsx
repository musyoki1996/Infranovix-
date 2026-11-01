import React from 'react';
import { Advertisement, AdPlacement } from '../types/newspaper';

interface AdSlotProps {
  placement: AdPlacement;
  ads: Advertisement[];
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, ads, className = '' }) => {
  const ad = ads.find(a => a.placement === placement && a.active);

  if (!ad) {
    return null;
  }

  return (
    <div className={`w-full my-6 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] tracking-widest uppercase text-stone-400 font-sans mb-1 font-medium">
            Advertisement · {ad.clientName}
          </span>
          
          <a
            href={ad.destinationUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block bg-stone-100 hover:bg-stone-200/70 border border-stone-200/90 transition-colors p-4 text-center group cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
              <div className="text-left">
                <span className="inline-block text-[10px] font-bold text-white bg-[#D71920] px-2 py-0.5 uppercase tracking-wider mb-1">
                  Partner Feature
                </span>
                <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#D71920] transition-colors">
                  {ad.title}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Official services & regional offerings from {ad.clientName}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-stone-900 group-hover:text-[#D71920] flex items-center gap-1 border border-stone-300 px-3 py-1.5 bg-white shadow-xs">
                  Learn More &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
