import React from 'react';
import { Article } from '../types/newspaper';
import { TrendingUp, TrendingDown, ArrowRight, DollarSign } from 'lucide-react';

interface BusinessSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
}

export const BusinessSection: React.FC<BusinessSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const businessArticles = articles.filter(a => a.categoryId === 'business' && a.status === 'published');
  
  if (businessArticles.length === 0) return null;

  const leadBusiness = businessArticles[0];
  const otherBusiness = businessArticles.slice(1, 4);

  // Financial Market Indicators
  const marketIndicators = [
    { label: 'NSE 20 Share Index', value: '1,894.20', change: '+2.4%', up: true },
    { label: 'NASI (All Share)', value: '118.60', change: '+1.1%', up: true },
    { label: 'USD / KES', value: '128.40', change: '-0.3%', up: true },
    { label: 'GBP / KES', value: '166.85', change: '+0.2%', up: false },
    { label: 'CBK Base Rate', value: '12.00%', change: 'Unchanged', up: true },
    { label: 'Mombasa Tea Avg', value: '$2.34/kg', change: '+4.8%', up: true },
  ];

  return (
    <section className="w-full py-8 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-stone-900"></span>
            <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-900 uppercase">
              Business & Markets
            </h2>
            <span className="hidden sm:inline-block text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Nairobi Securities Exchange · Agribusiness · Banking
            </span>
          </div>

          <button
            onClick={() => onSelectCategory('business')}
            className="text-xs font-bold text-stone-900 hover:text-[#D71920] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <span>All Business</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Market Data Bar */}
        <div className="bg-stone-900 text-white p-2.5 mb-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6 min-w-max text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#00843D] flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Markets Wire:
            </span>
            {marketIndicators.map(m => (
              <div key={m.label} className="flex items-center gap-2 font-mono">
                <span className="text-stone-400 font-sans">{m.label}:</span>
                <span className="font-bold text-white">{m.value}</span>
                <span className={`flex items-center text-[10px] ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.up ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {m.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Layout: Feature + Headlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feature */}
          <div className="lg:col-span-7 group">
            <div 
              className="aspect-16/10 w-full overflow-hidden bg-stone-100 mb-3 cursor-pointer"
              onClick={() => onSelectArticle(leadBusiness.slug)}
            >
              <img
                src={leadBusiness.featuredImage}
                alt={leadBusiness.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D71920] mb-1.5">
              <span>Capital Markets</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-normal">Nairobi Financial Hub</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 leading-snug group-hover:text-[#D71920] transition-colors mb-2">
              <button
                onClick={() => onSelectArticle(leadBusiness.slug)}
                className="text-left cursor-pointer focus:outline-none"
              >
                {leadBusiness.title}
              </button>
            </h3>

            <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-3">
              {leadBusiness.excerpt}
            </p>

            <div className="text-xs text-stone-400 flex items-center gap-2">
              <span className="font-semibold text-stone-700">By {leadBusiness.authorName}</span>
              <span>·</span>
              <span>{leadBusiness.readingTimeMinutes} min read</span>
            </div>
          </div>

          {/* Secondary Business List */}
          <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-2">
                Corporate & Trade Dispatches
              </div>

              {otherBusiness.map(story => (
                <article key={story.id} className="group border-b border-stone-100 pb-4 last:border-b-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    {story.tags[0] || 'Enterprise'}
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug mb-1">
                    <button
                      onClick={() => onSelectArticle(story.slug)}
                      className="text-left cursor-pointer focus:outline-none"
                    >
                      {story.title}
                    </button>
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {story.excerpt}
                  </p>
                </article>
              ))}

              {/* Agribusiness & SME Highlight Box */}
              <div className="p-3 bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#00843D] block mb-1">
                  Agribusiness & SME Focus
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Direct tea and coffee farm-gate returns surge as new electronic auction safeguards take full statutory effect in Mombasa.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
