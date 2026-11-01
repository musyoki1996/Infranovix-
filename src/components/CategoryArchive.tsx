import React from 'react';
import { Article } from '../types/newspaper';
import { CATEGORIES } from '../data/counties';
import { Clock, ArrowLeft, Filter } from 'lucide-react';

interface CategoryArchiveProps {
  categorySlug: string;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onBackToHome: () => void;
}

export const CategoryArchive: React.FC<CategoryArchiveProps> = ({
  categorySlug,
  articles,
  onSelectArticle,
  onBackToHome
}) => {
  const catInfo = CATEGORIES.find(c => c.slug === categorySlug) || {
    name: categorySlug.toUpperCase(),
    description: 'Archive of published newsroom reports and analyses.'
  };

  const filtered = articles.filter(a => a.categoryId.toLowerCase() === categorySlug.toLowerCase() && a.status === 'published');

  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6 pb-2 border-b border-stone-200">
          <button onClick={onBackToHome} className="hover:text-[#D71920] flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <span>/</span>
          <span className="font-bold text-stone-900 uppercase tracking-wider">{catInfo.name}</span>
        </div>

        {/* Category Masthead */}
        <div className="pb-6 border-b-2 border-stone-900 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920] mb-1">
            <span>The Kenyan Ledger Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-stone-950 uppercase tracking-tight mb-2">
            {catInfo.name} News
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl font-sans">
            {catInfo.description}
          </p>
        </div>

        {/* Lead Story for Category if Available */}
        {filtered.length > 0 ? (
          <div>
            {/* Top Featured In This Category */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 mb-8 border-b border-stone-200">
              <div 
                className="lg:col-span-8 aspect-16/9 bg-stone-100 overflow-hidden cursor-pointer group"
                onClick={() => onSelectArticle(filtered[0].slug)}
              >
                <img
                  src={filtered[0].featuredImage}
                  alt={filtered[0].title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-[#D71920] tracking-wider block mb-1">
                    Featured Dispatch
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 hover:text-[#D71920] transition-colors leading-snug mb-3">
                    <button
                      onClick={() => onSelectArticle(filtered[0].slug)}
                      className="text-left cursor-pointer"
                    >
                      {filtered[0].title}
                    </button>
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {filtered[0].excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
                  <span>By {filtered[0].authorName}</span>
                  <span className="font-mono">{filtered[0].readingTimeMinutes} min read</span>
                </div>
              </div>
            </div>

            {/* Remaining Stories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(1).map(art => (
                <article key={art.id} className="group bg-white border border-stone-200 p-4 flex flex-col justify-between hover:border-stone-400 transition-colors">
                  <div>
                    <div 
                      className="aspect-16/10 w-full overflow-hidden bg-stone-100 mb-3 cursor-pointer"
                      onClick={() => onSelectArticle(art.slug)}
                    >
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                      {art.county && <span className="text-[#00843D]">{art.county}</span>}
                      <span>·</span>
                      <span className="font-mono">{new Date(art.publishedAt).toLocaleDateString('en-GB')}</span>
                    </div>

                    <h3 className="text-base font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug mb-2">
                      <button
                        onClick={() => onSelectArticle(art.slug)}
                        className="text-left cursor-pointer"
                      >
                        {art.title}
                      </button>
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-between">
                    <span>{art.authorName}</span>
                    <span>{art.readingTimeMinutes} min read</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-stone-300 bg-stone-50">
            <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">
              No Published Reports in {catInfo.name}
            </h3>
            <p className="text-xs text-stone-600 mb-4 max-w-md mx-auto">
              Our newsroom is preparing new investigative pieces for this desk. You can view breaking stories or explore all 47 counties.
            </p>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase"
            >
              Back to Newspaper Homepage
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
