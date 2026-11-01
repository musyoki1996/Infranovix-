import React, { useState } from 'react';
import { Article } from '../types/newspaper';
import { KENYA_COUNTIES } from '../data/counties';
import { MapPin, ChevronRight, Layers } from 'lucide-react';

interface CountiesSectionProps {
  articles: Article[];
  selectedCounty?: string;
  onSelectArticle: (slug: string) => void;
  onSelectCounty: (county: string) => void;
  onSelectCategory: (category: string) => void;
}

export const CountiesSection: React.FC<CountiesSectionProps> = ({
  articles,
  selectedCounty,
  onSelectArticle,
  onSelectCounty,
  onSelectCategory
}) => {
  const [activeRegion, setActiveRegion] = useState<string>('All');

  const regions = ['All', 'Nairobi', 'Coast', 'Central', 'Rift Valley', 'Eastern', 'Western', 'Nyanza', 'North Eastern'];

  // Filter counties by region
  const filteredCounties = activeRegion === 'All' 
    ? KENYA_COUNTIES 
    : KENYA_COUNTIES.filter(c => c.region === activeRegion);

  // Filter articles by county if selected, or category 'counties'
  const countyArticles = selectedCounty
    ? articles.filter(a => a.county?.toLowerCase() === selectedCounty.toLowerCase())
    : articles.filter(a => a.categoryId === 'counties' || Boolean(a.county));

  const displayArticles = countyArticles.slice(0, 6);

  return (
    <section className="w-full py-8 bg-stone-100/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-stone-900 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#00843D]"></span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-900 uppercase">
                47 Counties: Devolution In Action
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Frontline grassroots reporting from Kenya&apos;s county headquarters and rural wards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedCounty && (
              <button
                onClick={() => onSelectCounty('')}
                className="text-xs bg-stone-200 hover:bg-stone-300 px-2.5 py-1 text-stone-700 font-medium cursor-pointer"
              >
                Clear Filter ({selectedCounty}) &times;
              </button>
            )}
            <button
              onClick={() => onSelectCategory('counties')}
              className="text-xs font-bold text-stone-900 hover:text-[#00843D] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <span>County Index</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Regional Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mr-2 shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Region:
          </span>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-3 py-1 text-xs font-medium rounded-xs whitespace-nowrap transition-colors cursor-pointer ${
                activeRegion === r
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* 47 Counties Quick Pill/Bar Strip */}
        <div className="bg-white border border-stone-200 p-3 mb-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
              Select Any of Kenya&apos;s 47 Counties:
            </span>
            <span className="text-[11px] font-normal text-stone-400 lowercase font-mono">
              showing {filteredCounties.length} counties
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {filteredCounties.map(c => (
              <button
                key={c.code}
                onClick={() => onSelectCounty(c.name)}
                className={`text-xs px-2.5 py-1 transition-all rounded-xs border cursor-pointer ${
                  selectedCounty === c.name
                    ? 'bg-[#00843D] text-white border-[#00843D] font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <span className="font-mono text-[10px] opacity-60 mr-1">{c.code}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid for Counties */}
        {displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map(art => (
              <article key={art.id} className="group bg-white border border-stone-200 p-4 flex flex-col justify-between hover:border-stone-400 transition-colors shadow-xs">
                <div>
                  <div 
                    className="aspect-16/10 w-full overflow-hidden bg-stone-100 mb-3 cursor-pointer"
                    onClick={() => onSelectArticle(art.slug)}
                  >
                    <img
                      src={art.featuredImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                    <span className="text-[#00843D] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#00843D]" />
                      {art.county || 'County Dispatch'}
                    </span>
                    <span className="text-stone-400 font-normal">{art.readingTimeMinutes} min read</span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug mb-2">
                    <button
                      onClick={() => onSelectArticle(art.slug)}
                      className="text-left cursor-pointer focus:outline-none"
                    >
                      {art.title}
                    </button>
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-stone-700">By {art.authorName}</span>
                  <button
                    onClick={() => onSelectArticle(art.slug)}
                    className="font-bold text-[#00843D] hover:underline"
                  >
                    Read &rarr;
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white border border-dashed border-stone-300 text-center">
            <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-stone-800 mb-1">
              No recent dispatches for {selectedCounty}
            </h4>
            <p className="text-xs text-stone-500 mb-4 max-w-md mx-auto">
              Our county correspondents in {selectedCounty} are gathering verified field reports. Browse neighbouring regional counties or view all national stories.
            </p>
            <button
              onClick={() => onSelectCounty('')}
              className="text-xs font-bold px-4 py-2 bg-stone-900 text-white hover:bg-[#D71920] transition-colors cursor-pointer"
            >
              Show All 47 Counties
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
