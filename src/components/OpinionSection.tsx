import React from 'react';
import { Article } from '../types/newspaper';
import { ArrowRight, Quote } from 'lucide-react';

interface OpinionSectionProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  onSelectCategory: (category: string) => void;
}

export const OpinionSection: React.FC<OpinionSectionProps> = ({
  articles,
  onSelectArticle,
  onSelectCategory
}) => {
  const opinionArticles = articles.filter(a => a.categoryId === 'opinion' && a.status === 'published');
  
  if (opinionArticles.length === 0) return null;

  return (
    <section className="w-full py-8 bg-[#FBF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-amber-800"></span>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-stone-900 uppercase">
                Opinion & The Ledger Editorial
              </h2>
              <span className="text-[11px] font-sans text-stone-500 uppercase tracking-widest block">
                Independent Voices · Curated Columnists · Thought Leadership
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectCategory('opinion')}
            className="text-xs font-bold text-stone-800 hover:text-[#D71920] flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <span>All Columns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Opinion Grid: High-contrast columnist cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opinionArticles.map(op => (
            <article 
              key={op.id} 
              className="bg-white border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors group"
            >
              <div>
                {/* Columnist Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                    <img
                      src={op.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(op.authorName)}&background=111111&color=ffffff&size=100`}
                      alt={op.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{op.authorName}</h4>
                    <p className="text-[11px] text-stone-500">{op.authorRole}</p>
                  </div>
                  <Quote className="w-6 h-6 text-stone-300 ml-auto opacity-60" />
                </div>

                {/* Badge: Opinion / Editorial */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 inline-block mb-2 border border-amber-200">
                  {op.tags.includes('Editorial') ? 'The Ledger Editorial' : 'Guest Column'}
                </span>

                {/* Headline */}
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-[#D71920] transition-colors leading-snug mb-2">
                  <button
                    onClick={() => onSelectArticle(op.slug)}
                    className="text-left cursor-pointer focus:outline-none"
                  >
                    {op.title}
                  </button>
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed mb-4 font-sans">
                  {op.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>{new Date(op.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                <button
                  onClick={() => onSelectArticle(op.slug)}
                  className="font-bold text-stone-800 group-hover:text-[#D71920] flex items-center gap-1"
                >
                  <span>Read Essay</span>
                  &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
